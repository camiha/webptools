// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use image;
use serde_json::json;
use std::fs;
use std::path::PathBuf;
use tauri::{State, Wry};
use tauri_plugin_store::{with_store, StoreCollection};
use webp;
use webp::Encoder;

const STORE_PATH: &str = ".settings.json";
struct WebPEncodeOption {
    quality: f32,
    lossless: bool,
}

static DEFAULT_WEBP_ENCODE_OPTION: WebPEncodeOption = WebPEncodeOption {
    quality: 75.0,
    lossless: false,
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

#[derive(serde::Deserialize, serde::Serialize)]
struct EncodeOption {
    quality: f32,
    lossless: bool,
}

#[tauri::command]
fn load_encode_option(
    stores: State<'_, StoreCollection<Wry>>,
    app_handle: tauri::AppHandle,
) -> EncodeOption {
    let path = PathBuf::from(STORE_PATH);

    let quality = with_store(app_handle.clone(), stores.clone(), path.clone(), |store| {
        Ok(store
            .get("quality")
            .map(|v| v.as_f64().unwrap_or(DEFAULT_WEBP_ENCODE_OPTION.quality.into()) as f32)
            .unwrap_or(DEFAULT_WEBP_ENCODE_OPTION.quality))
    })
    .unwrap_or_else(|_| {
        return DEFAULT_WEBP_ENCODE_OPTION.quality;
    });

    let lossless = with_store(app_handle.clone(), stores, path.clone(), |store| {
        Ok(store
            .get("lossless")
            .map(|v| v.as_bool().unwrap_or(DEFAULT_WEBP_ENCODE_OPTION.lossless))
            .unwrap_or(DEFAULT_WEBP_ENCODE_OPTION.lossless))
    }).unwrap_or_else(|_| {
        return DEFAULT_WEBP_ENCODE_OPTION.lossless;
    });

    return EncodeOption { quality, lossless };
}

#[tauri::command]
fn save_encode_option(
    encode_option: EncodeOption,
    stores: State<'_, StoreCollection<Wry>>,
    app_handle: tauri::AppHandle,
) -> Result<(), tauri_plugin_store::Error> {
    let path = PathBuf::from(STORE_PATH);

    with_store(app_handle.clone(), stores.clone(), path.clone(), |store| {
        store.insert("quality".into(), json!(encode_option.quality))
    })?;

    with_store(app_handle.clone(), stores.clone(), path.clone(), |store| {
        store.insert("lossless".into(), json!(encode_option.lossless))
    })?;

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

                    let input_size = fs::metadata(input_path)
                        .expect("Failed to get input file metadata")
                        .len();

                    let output_size = fs::metadata(&output_path)
                        .expect("Failed to get output file metadata")
                        .len();

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

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
 
        .invoke_handler(tauri::generate_handler![
            convert_webp,
            load_encode_option,
            save_encode_option
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
