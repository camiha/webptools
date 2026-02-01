// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use image;
use serde_json::json;
use std::fs;
use std::path::{Path, PathBuf};
use tauri_plugin_store::StoreExt;
use webp;
use webp::Encoder;

const STORE_PATH: &str = ".settings.json";

#[derive(serde::Deserialize, serde::Serialize)]
struct EncodeOption {
    quality: f32,
    lossless: bool,
    delete_original: bool,
}

static DEFAULT_WEBP_ENCODE_OPTION: EncodeOption = EncodeOption {
    quality: 75.0,
    lossless: false,
    delete_original: false,
};

#[derive(Debug, serde::Deserialize)]
struct ImageInputInfo {
    input_path: String,
    output_path: String,
}

#[derive(Debug, serde::Serialize)]
struct ImageInfo {
    input_size: u64,
    output_size: u64,
    message: String,
}

#[tauri::command]
fn load_encode_option(app_handle: tauri::AppHandle) -> EncodeOption {
    let store = app_handle.store(PathBuf::from(STORE_PATH)).unwrap();

    let quality = store
        .get("quality")
        .and_then(|v| v.as_f64())
        .map(|v| v as f32)
        .unwrap_or(DEFAULT_WEBP_ENCODE_OPTION.quality);

    let lossless = store
        .get("lossless")
        .and_then(|v| v.as_bool())
        .unwrap_or(DEFAULT_WEBP_ENCODE_OPTION.lossless);

    let delete_original = store
        .get("delete_original")
        .and_then(|v| v.as_bool())
        .unwrap_or(DEFAULT_WEBP_ENCODE_OPTION.delete_original);

    EncodeOption {
        quality,
        lossless,
        delete_original,
    }
}

#[tauri::command]
fn save_encode_option(
    encode_option: EncodeOption,
    app_handle: tauri::AppHandle,
) -> Result<(), String> {
    let store = app_handle
        .store(PathBuf::from(STORE_PATH))
        .map_err(|e| e.to_string())?;

    store.set("quality", json!(encode_option.quality));
    store.set("lossless", json!(encode_option.lossless));
    store.set("delete_original", json!(encode_option.delete_original));
    store.save().map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn convert_webp(image_input_info: ImageInputInfo, encode_option: EncodeOption) -> ImageInfo {
    let quality = encode_option.quality;
    let lossless = encode_option.lossless;

    let input_path = image_input_info.input_path;
    let output_path = image_input_info.output_path;

    if let Ok(img) = image::open(&input_path) {
        if let Ok(encoder) = Encoder::from_image(&img) {
            match encoder.encode_simple(lossless, quality) {
                Ok(webp_output) => {
                    let output_path_slice: &[u8] = &webp_output;
                    fs::write(&output_path, output_path_slice)
                        .expect("Failed to write WebP data to file");

                    let input_size = fs::metadata(&input_path)
                        .expect("Failed to get input file metadata")
                        .len();

                    let output_size = fs::metadata(&output_path)
                        .expect("Failed to get output file metadata")
                        .len();

                    if encode_option.delete_original {
                        match fs::remove_file(&input_path) {
                            Ok(()) => println!("File was successfully deleted."),
                            Err(e) => println!("Error deleting file: {}", e),
                        }
                    }

                    return ImageInfo {
                        input_size,
                        output_size,
                        message: "Image successfully encoded and saved as WebP.".to_string(),
                    };
                }
                Err(_) => {
                    return ImageInfo {
                        input_size: 0,
                        output_size: 0,
                        message: "Failed to encode image as WebP.".to_string(),
                    };
                }
            }
        } else {
            return ImageInfo {
                input_size: 0,
                output_size: 0,
                message: "Failed to create a WebP encoder.".to_string(),
            };
        }
    } else {
        return ImageInfo {
            input_size: 0,
            output_size: 0,
            message: "Failed to open the image.".to_string(),
        };
    }
}

const SUPPORTED_EXTENSIONS: &[&str] = &["png", "jpg", "jpeg"];

fn collect_image_files(dir: &Path, result: &mut Vec<String>) {
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                collect_image_files(&path, result);
            } else if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
                if SUPPORTED_EXTENSIONS.contains(&ext.to_lowercase().as_str()) {
                    if let Some(s) = path.to_str() {
                        result.push(s.to_string());
                    }
                }
            }
        }
    }
}

#[tauri::command]
fn expand_paths(paths: Vec<String>) -> Vec<String> {
    let mut result = Vec::new();
    for p in &paths {
        let path = Path::new(p);
        if path.is_dir() {
            collect_image_files(path, &mut result);
        } else {
            result.push(p.clone());
        }
    }
    result
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            convert_webp,
            load_encode_option,
            save_encode_option,
            expand_paths
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
