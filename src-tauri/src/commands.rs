use crate::{types, utils};
use tauri::{AppHandle, Emitter};

#[tauri::command]
pub fn my_custom_command() {
    println!("I was invoked from JavaScript!");
}

#[tauri::command]
pub fn figlet_transform(app: AppHandle, text: &str, font: Option<&str>) {
    let result = utils::shared::generate_with_font(text, font);

    match result {
        Ok(value) => {
            println!("Figlet transform success!");
            println!("{}", value);

            let response: types::BasicResponse<String> = types::BasicResponse {
                data: Some(value),
                error: None,
            };

            app.emit("figlet_transformed", serde_json::to_string(&response).unwrap()).unwrap();
        }
        Err(e) => {
            println!("Figlet transform failed: {}", e);

            let error_response: types::BasicResponse<()> = types::BasicResponse {
                data: None,
                error: Some(types::BasicError { message: e.to_string() }),
            };

            app.emit("figlet_transformed", serde_json::to_string(&error_response).unwrap())
                .unwrap();
        }
    }
}
