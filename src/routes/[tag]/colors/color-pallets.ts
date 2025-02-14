import { randNumber } from '@ngneat/falso';
import Color from 'color';


export enum ColorScheme {
  COMPLEMENTARY = "COMPLEMENTARY",
  ANALOGOUS = "ANALOGOUS",
  TRIADIC = "TRIADIC",
  TETRADIC = "TETRADIC",
  SPLIT_COMPLEMENTARY = "SPLIT_COMPLEMENTARY",
  MONOCHROMATIC = "MONOCHROMATIC"
}

/**
 * Generates a monochromatic color scheme by creating lighter shades of the base color.
 * 
 * Returns an array of colors including the base color and `shades` lighter variants.
 * The number of colors depends on the `shades` parameter.
 * 
 * @param baseColor - The base color in any CSS-compatible format.
 * @param shades - The number of lighter shades to generate (default is 5).
 * @returns An array of hex color strings.
 */
export const generateMonochromatic = (baseColor: string, shades: number = 5): Color[] => {
  const base = Color(baseColor);
  const palette: Color[] = [base];

  for (let i = 1; i <= shades; i++) {
    palette.push(base.lighten(0.1 * i));
  }

  return palette;
}

/**
 * Generates a complementary color scheme, which consists of two colors:
 * the base color and the color directly opposite it on the color wheel (180° apart).
 * 
 * Always returns exactly **2** colors.
 * 
 * @param baseColor - The base color in any CSS-compatible format.
 * @returns An array containing the base color and its complementary color.
 */
export const generateComplementary = (baseColor: string): [Color, Color] => {
  const base = Color(baseColor);
  return [base, base.rotate(180)];
}

/**
 * Generates a split-complementary color scheme, which includes the base color
 * and two colors adjacent to its complement.
 * 
 * Always returns exactly **3** colors.
 * 
 * @param baseColor - The base color in any CSS-compatible format.
 * @returns An array containing the base color and its split-complementary colors.
 */
export const generateSplitComplementary = (baseColor: string): [Color, Color, Color] => {
  const base = Color(baseColor);
  return [base, base.rotate(150), base.rotate(210)];
}

/**
 * Generates a triadic color scheme, consisting of three colors evenly spaced (120° apart).
 * 
 * Always returns exactly **3** colors.
 * 
 * @param baseColor - The base color in any CSS-compatible format.
 * @returns An array containing the base color and its two triadic counterparts.
 */
export const generateTriadic = (baseColor: string): [Color, Color, Color] => {
  const base = Color(baseColor);
  return [base, base.rotate(120), base.rotate(240)];
}

/**
 * Generates a tetradic color scheme, forming a rectangle on the color wheel with four colors.
 * 
 * Always returns exactly **4** colors.
 * 
 * @param baseColor - The base color in any CSS-compatible format.
 * @returns An array containing the base color and its three tetradic counterparts.
 */
export const generateTetradic = (baseColor: string): [Color, Color, Color, Color] => {
  const base = Color(baseColor);
  return [base, base.rotate(90), base.rotate(180), base.rotate(270)];
}

/**
 * Generates an analogous color scheme by selecting colors adjacent to the base color on the color wheel.
 * 
 * Typically returns **3-5** colors depending on the `count` parameter.
 * 
 * @param baseColor - The base color in any CSS-compatible format.
 * @param count - The number of analogous colors to generate (default is 3).
 * @returns An array containing the base color and its analogous colors.
 */
export const generateAnalogous = (baseColor: string, count: number = 3): Color[] => {
  if (count < 3 || count > 5) {
    throw new Error("Count must be between 3 and 5.");
  }

  const base = Color(baseColor);
  const angle = 30; // Degrees between analogous colors
  const palette: Color[] = [base];

  for (let i = 1; i < count; i++) {
    palette.push(base.rotate(angle * i));
  }

  return palette;
}

/**
 * Generates a square color scheme, with four colors evenly spaced around the color wheel (90° apart).
 * 
 * Always returns exactly **4** colors.
 * 
 * @param baseColor - The base color in any CSS-compatible format.
 * @returns An array containing the base color and its three square counterparts.
 */
export const generateSquare = (baseColor: string): [Color, Color, Color, Color] => {
  const base = Color(baseColor);
  return [base, base.rotate(90), base.rotate(180), base.rotate(270)];
}


export const generateRandomBalancedPalette = (count: number): Color[] => {
  if (count <= 0) return []; // Guard clause for invalid count

  // Generate random min/max ranges for saturation and lightness
  const MIN_SAT = randNumber({ min: 0, max: 50 });
  const MAX_SAT = randNumber({ min: MIN_SAT, max: 100 });

  const MIN_LIGHT = randNumber({ min: 0, max: 50 });
  const MAX_LIGHT = randNumber({ min: MIN_LIGHT, max: 100 });

  const palette: Color[] = [];

  for (let i = 0; i < count; i++) {
    const hue = Math.floor(Math.random() * 360);
    const saturation = MIN_SAT + Math.random() * (MAX_SAT - MIN_SAT);
    const lightness = MIN_LIGHT + Math.random() * (MAX_LIGHT - MIN_LIGHT);

    palette.push(Color.hsl(hue, saturation, lightness));
  }

  return palette;
};

export const generateShades = (baseColor: string, steps: number = 30): Color[] => {
  // Convert the base color to HSL so we can extract the hue and saturation.
  const baseHSL = Color(baseColor).hsl();
  const { h, s } = baseHSL.object();

  const colors: Color[] = [];

  // Generate shades from light (white) to dark (black)
  for (let i = 0; i < steps; i++) {
    // Compute lightness so that:
    // i = 0 gives 100% lightness (white) and
    // i = steps - 1 gives 0% lightness (black)
    const lightness = 100 - (i * 100) / (steps - 1);

    // Create a new color with the same hue and saturation but varying lightness
    const newColor = Color.hsl(h, s, lightness);
    colors.push(newColor);
  }

  return colors;
};


export const exampleColorPalettes = [
  ["#606C38", "#283618", "#FEFAE0", "#DDA15E", "#BC6C25"],
  ["#CCD5AE", "#E9EDC9", "#FEFAE0", "#FAEDCD", "#D4A373"],
  ["#780000", "#C1121F", "#FDF0D5", "#003049", "#669BBC"],
  ["#CDB4DB", "#FFC8DD", "#FFAFCC", "#BDE0FE", "#A2D2FF"],
  ["#DAD7CD", "#A3B18A", "#588157", "#3A5A40", "#344E41"],
  ["#8ECAE6", "#219EBC", "#023047", "#FFB703", "#FB8500"],
  ["#EDEDE9", "#D6CCC2", "#F5EBE0", "#E3D5CA", "#D5BDAF"],
  ["#D8E2DC", "#FFE5D9", "#FFCACA", "#F4ACB7", "#9D8189"],
  ["#0D1B2A", "#1B263B", "#415A77", "#778DA9", "#E0E1DD"],
  ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
  ["#03045E", "#023E8A", "#0077B6", "#0096C7", "#00B4D8"],
  ["#0081A7", "#00AFB9", "#FDFCDC", "#FED9B7", "#F07167"],
  ["#335C67", "#FFF3B0", "#E09F3E", "#9E2A2B", "#540B0E"],
  ["#FFBE0B", "#FB5607", "#FF006E", "#8338EC", "#3A86FF"],
  ["#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557"],
  ["#22223B", "#4A4E69", "#9A8C98", "#C9ADA7", "#F2E9E4"],
  ["#386641", "#6A994E", "#A7C957", "#F2E8CF", "#BC4749"],
  ["#CAD2C5", "#84A98C", "#52796F", "#354F52", "#2F3E46"],
  ["#390099", "#9E0059", "#FF0054", "#FF5400", "#FFBD00"],
  ["#000000", "#14213D", "#FCA311", "#E5E5E5", "#FFFFFF"],
  ["#6D597A", "#B56576", "#E56B6F", "#EAAC8B", "#FFEDD8"],
  ["#001219", "#005F73", "#0A9396", "#94D2BD", "#E9D8A6"],
  ["#2E4057", "#FF6F61", "#6B4226", "#D9BF77", "#FFF1E1"],
  ["#D00000", "#FFBA08", "#3F88C5", "#032B43", "#136F63"],
  ["#6B4226", "#A37560", "#C9B79C", "#D9D9D9", "#F5F5F5"],
  ["#8C1C13", "#BF4342", "#D98E04", "#EAD94C", "#F7F3E3"],
  ["#0F4C5C", "#C8D5B9", "#F4E285", "#F4A259", "#5B7553"],
  ["#541388", "#D90368", "#F1E9DA", "#2E294E", "#FFD400"],
  ["#124559", "#598392", "#AEC3B0", "#EFF6E0", "#F2E1AC"],
  ["#5E3023", "#895737", "#C08552", "#E3B448", "#F7DC6F"],
  ["#82204A", "#F190B7", "#F5B8B8", "#F9D6D3", "#FAE3E3"],
  ["#4B3F72", "#FF6363", "#FFAB76", "#FFFDA2", "#BAFFB4"],
  ["#2C363F", "#E75A7C", "#F092A5", "#FFC5D9", "#FFE6F0"],
  ["#1E2022", "#52616B", "#C9D6DF", "#F0F5F9", "#DDE6ED"],
  ["#6C5B7B", "#C06C84", "#F67280", "#F8B195", "#FAE3D9"],
  ["#011627", "#FDFFFC", "#2EC4B6", "#E71D36", "#FF9F1C"],
  ["#473144", "#A79AB2", "#D9DBF1", "#ADEFD1", "#F7CACA"],
  ["#2C2A4A", "#56445D", "#D72638", "#F0A202", "#F4E285"],
  ["#69306D", "#A5668B", "#FF7582", "#FFAA80", "#FFDF6C"],
  ["#262626", "#595959", "#A6A6A6", "#D9D9D9", "#F2F2F2"],
  ["#D72638", "#3F88C5", "#F49D37", "#140F2D", "#F22B29"],
  ["#0081A7", "#00AFB9", "#FDFCDC", "#FED9B7", "#F07167"],
  ["#313866", "#504099", "#974EC3", "#FE7BE5", "#FFABE1"],
  ["#FCDC4D", "#F8961E", "#F3722C", "#F94144", "#8ECAE6"],
  ["#D4A5A5", "#E0C1C1", "#F7EDE2", "#F2D3AB", "#DAA588"],
  ["#2A2D34", "#3E454C", "#00A7E1", "#F2F4F3", "#F79256"],
  ["#402B3A", "#724E59", "#C5A5A5", "#E8C1C5", "#F7EDE2"],
  ["#C9F9FF", "#C4E4FF", "#A6D4FF", "#82B0FF", "#5E7FFF"],
  ["#102542", "#F87060", "#C8C8C8", "#DED6D1", "#ECE2D0"],
  ["#084C61", "#DB504A", "#E3B505", "#4F6D7A", "#56A3A6"],
  ["#36413E", "#5D737E", "#7FC8A9", "#D6E3F8", "#DDBEA9"],
  ["#363945", "#7F92A3", "#CFD7D9", "#E5E5E5", "#F7F7F7"],
  ["#011627", "#B2DBBF", "#F3E9D2", "#F5CDA7", "#FF9F1C"],
  ["#001427", "#708D81", "#F4D35E", "#EE964B", "#F95738"],
  ["#A4C3B2", "#B7B7A4", "#D9D9D9", "#EDC9AF", "#FF9F1C"],
  ["#08415C", "#CC2936", "#6B4226", "#E0A458", "#F4D35E"],
  ["#1F2041", "#4B3F72", "#417B5A", "#F2E1AC", "#E7C24F"],
  ["#36213E", "#554971", "#63768D", "#8AC6D0", "#B8F3FF"],
  ["#2A1E5C", "#003C43", "#135D66", "#E0A458", "#F4D35E"],
  ["#8B5E83", "#D896FF", "#E9D8F9", "#BBA0CA", "#835C85"],
  ["#A1E44D", "#5CC98B", "#40A798", "#2A7F62", "#205D40"],
  ["#FFD700", "#FFAE42", "#FF731D", "#E72929", "#A60000"],
  ["#002F6C", "#00509D", "#0081CF", "#00B0FF", "#4C98FF"],
  ["#22223B", "#4A4E69", "#9A8C98", "#C9ADA7", "#F2E9E4"],
  ["#3D315B", "#444B6E", "#708B75", "#9AB87A", "#D7D9B1"],
  ["#004346", "#017374", "#A4A71E", "#FEC601", "#FE7F2D"],
  ["#1A535C", "#4ECDC4", "#FF6B6B", "#FFE66D", "#FFD166"],
  ["#081C15", "#1B4332", "#40916C", "#52B788", "#74C69D"],
  ["#34344A", "#585B56", "#8B8C89", "#BFB5AF", "#D9C5B2"],
  ["#26547C", "#EF476F", "#FFD166", "#06D6A0", "#FFFCF9"],
  ["#4F5D75", "#2D3142", "#BFC0C0", "#EF8354", "#FFFFFF"],
  ["#4E148C", "#9A348E", "#E76F51", "#F4A261", "#E9C46A"],
  ["#C5D86D", "#261C15", "#C5D86D", "#F9C846", "#F4A261"],
  ["#1A1423", "#3D314A", "#684756", "#B76D68", "#E5C3C6"],
  ["#053225", "#379392", "#A4A71E", "#FEC601", "#FE7F2D"],
  ["#484848", "#B0A8B9", "#EFE1D1", "#F4F3EE", "#F7F7F7"],
  ["#333333", "#5D5D5D", "#909090", "#D4D4D4", "#F5F5F5"],
  ["#6E0E0A", "#AE1B1F", "#E63946", "#FF6B6B", "#FFA69E"],
  ["#452F1D", "#6E633D", "#D9C5B2", "#F0E4D7", "#FFFFFF"],
  ["#0A2463", "#3E92CC", "#D8315B", "#FEBE10", "#F8E9A1"],
  ["#22223B", "#4A4E69", "#9A8C98", "#C9ADA7", "#F2E9E4"],
  ["#3D0814", "#8C0303", "#E63946", "#F1FAEE", "#A8DADC"],
  ["#04151F", "#183A37", "#037171", "#F2A541", "#F2BE22"],
  ["#001B2E", "#294C60", "#ADB6C4", "#FF9B42", "#FF6F59"],
  ["#1D3461", "#1F487E", "#376996", "#62A8AC", "#91C9BF"],
  ["#393D3F", "#6D7173", "#9A9DA0", "#D3D6DB", "#E5E9EC"],
  ["#04151F", "#183A37", "#037171", "#F2A541", "#F2BE22"],
  ["#2B4162", "#385F71", "#D7C9AA", "#EAD7D1", "#FFFAFF"],
  ["#1B1725", "#3E1F47", "#6E2F53", "#D1BFA7", "#F3E9DC"],
  ["#210124", "#750D37", "#C9184A", "#FF4D6D", "#FFA69E"],
  ["#D90429", "#EF233C", "#F77F00", "#FFBA08", "#EAEAEA"],
  ["#2F3E46", "#354F52", "#52796F", "#84A98C", "#CAD2C5"],
  ["#2E2C2F", "#46413E", "#6B6A69", "#968E85", "#BFBBB6"],
  ["#2C363F", "#3A506B", "#5BC0BE", "#6FFFE9", "#B2DBBF"],
  ["#0A1128", "#001F54", "#034078", "#1282A2", "#FAF0CA"],
  ["#172A3A", "#004346", "#09BC8A", "#67D5B5", "#B1EDE8"],
  ["#333333", "#5D5D5D", "#909090", "#D4D4D4", "#F5F5F5"],
  ["#240115", "#370617", "#6A040F", "#D00000", "#FFBA08"],
  ["#F0E68C", "#FFD700", "#FFB6C1", "#DB7093", "#C71585"],
  ["#212121", "#414141", "#616161", "#757575", "#BDBDBD"],
  ["#002F6C", "#00509D", "#0081CF", "#00B0FF", "#4C98FF"],
  ["#151515", "#303030", "#4A4A4A", "#606060", "#969696"],
  ["#14110F", "#3E1929", "#7B113A", "#E51A4C", "#FF6666"],
  ["#250902", "#38040E", "#640D14", "#800E13", "#AD2831"],
  ["#232931", "#393E46", "#4ECCA3", "#EEEEEE", "#32A287"],
  ["#210124", "#750D37", "#C9184A", "#FF4D6D", "#FFA69E"],
  ["#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C", "#D90429"],
  ["#0B132B", "#1C2541", "#3A506B", "#5BC0BE", "#6FFFE9"],
  ["#1B3C59", "#2D5B80", "#5B7B9A", "#A8DADC", "#F1FAEE"],
  ["#252627", "#3E444A", "#737373", "#A6A6A6", "#D9D9D9"],
  ["#263238", "#37474F", "#455A64", "#546E7A", "#607D8B"],
  ["#001219", "#005F73", "#0A9396", "#94D2BD", "#E9D8A6"],
  ["#1D3461", "#1F487E", "#376996", "#62A8AC", "#91C9BF"],
  ["#D72638", "#3F88C5", "#F49D37", "#140F2D", "#F22B29"],
  ["#16161D", "#303032", "#4A4A4A", "#606060", "#969696"],
  ["#17202A", "#2E4053", "#566573", "#808B96", "#D5DBDB"],
  ["#4A4E69", "#9A8C98", "#C9ADA7", "#E6BEAE", "#FAE1DF"],
  ["#001427", "#708D81", "#F4D35E", "#EE964B", "#F95738"],
  ["#08415C", "#CC2936", "#6B4226", "#E0A458", "#F4D35E"]
];
