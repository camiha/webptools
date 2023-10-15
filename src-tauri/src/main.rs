// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
async fn convert_webp(input_path: String) -> String {
    let output_path = input_path.replace(".png", ".webp");

    if let Ok(img) = image::open(input_path) {
        if let Ok(encoder) = Encoder::from_image(&img) {
            let webp_output = encoder.encode_lossless();
            let output_path_slice: &[u8] = &webp_output;
            fs::write(output_path, output_path_slice)
                .expect("Failed to write WebP data to file");
            return "Image successfully encoded and saved as WebP.".to_string();
        } else {
            return "Failed to create a WebP encoder.".to_string();
        }
    } else {
        return "Failed to open the image.".to_string();
    }
}

use image;
use std::fs;
use webp;
use webp::Encoder;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![convert_webp])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
