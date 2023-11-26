// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use image;
use std::fs;
use webp;
use webp::Encoder;

#[derive(Debug, serde::Deserialize)]
struct ImageInputInfo {
    input_path: String,
    output_path: String,
    lossless: bool,
    quality: f32,
}

#[derive(Debug, serde::Serialize)]
struct ImageInfo {
    input_size: u64,
    output_size: u64,
    message: String,
}

#[tauri::command]
async fn convert_webp(image_input_info: ImageInputInfo) -> ImageInfo {
    let input_path = image_input_info.input_path;
    let output_path = image_input_info.output_path;
    let lossless = image_input_info.lossless;
    let quality = image_input_info.quality;

    if let Ok(img) = image::open(&input_path) {
        if let Ok(encoder) = Encoder::from_image(&img) {
            match encoder.encode_simple(lossless, quality) {
                Ok(webp_output) => {
                    let output_path_slice: &[u8] = &webp_output;
                    fs::write(&output_path, output_path_slice).expect("Failed to write WebP data to file");

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
                },
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
        .invoke_handler(tauri::generate_handler![convert_webp])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
