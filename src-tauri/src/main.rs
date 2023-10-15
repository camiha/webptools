// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn convert_webp() {
    // println!("Hello {}", message);
}

#[tauri::command]
fn command_with_message(message: String) -> String {
    format!("hello {}", message)
}


use std::fs;
use image;
use webp;
use webp::Encoder;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
    .setup(|app| {
        // front => back
        let id: tauri::EventHandler = app.listen_global("front-to-back", |event: tauri::Event| {
            let input_path = event.payload().unwrap().trim_matches('"');
            let output_path = input_path.replace(".png", ".webp");

            if let Ok(img) = image::open(input_path) {
                if let Ok(encoder) = Encoder::from_image(&img) {
                    let webp_output = encoder.encode_lossless();
                    let output_path_slice: &[u8] = &webp_output;
                    fs::write(output_path, output_path_slice).expect("Failed to write WebP data to file");
                    println!("Image successfully encoded and saved as WebP.");
                } else {
                    eprintln!("Failed to create a WebP encoder.");
                }
            } else {
                eprintln!("Failed to open the image.");
            }

            println!(
                "got front-to-back with payload {:?}",
                event.payload().unwrap()
            )
        });

        // back => front
        let app_handle = app.app_handle();
        std::thread::spawn(move || loop {
            app_handle
                .emit_all("back-to-front", "ping frontend".to_string())
                .unwrap();
            std::thread::sleep(std::time::Duration::from_secs(1))
        });
        Ok(())
    })
        .invoke_handler(tauri::generate_handler![convert_webp, command_with_message])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
