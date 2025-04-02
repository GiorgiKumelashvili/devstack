use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct BasicResponse<T> {
    pub data: Option<T>,
    pub error: Option<BasicError>,
}

#[derive(Serialize, Deserialize)]
pub struct BasicError {
    pub message: String,
}
