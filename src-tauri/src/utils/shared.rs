use figlet_rs::FIGfont;

pub(crate) fn generate_with_font<'a>(
    text: &'a str,
    font: Option<&'a str>,
) -> Result<String, &'a str> {
    if font.is_none() {
        return generate_default(text);
    }

    let small_font = FIGfont::from_file(font.unwrap());

    if let Err(e) = small_font {
        println!("Error: {}", e);
        return Err("Failed to load font");
    }

    let fig_font = small_font.unwrap();

    // println!("Loaded: {}", fig_font.name());
    // println!("Loaded: {}", fig_font.comments);
    // println!("Loaded: {}", fig_font.fonts);
    // println!("Loaded: {}", fig_font.header_line);

    let figure = fig_font.convert(text);

    match figure {
        Some(value) => Ok(value.to_string()),
        None => Err("Failed to generate figure"),
    }
}

fn generate_default(text: &str) -> Result<std::string::String, &str> {
    let fig_font = FIGfont::standard().unwrap();
    let figure = fig_font.convert(text);

    return match figure {
        Some(value) => Ok(value.to_string()),
        None => Err("Failed to generate figure"),
    };
}
