export const GOOGLE_FONTS = [
  'Inter', 'DM Sans', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
  'Poppins', 'Space Grotesk', 'Outfit', 'Playfair Display', 
  'Cormorant Garamond', 'Merriweather', 'Lora', 'Syne', 
  'Work Sans', 'Rubik', 'Karla', 'Nunito Sans', 'Plus Jakarta Sans',
  'Oswald', 'Raleway', 'Ubuntu', 'PT Sans', 'Noto Sans', 
  'Mukta', 'Nunito', 'PT Serif', 'Quicksand', 'Fira Sans',
  'Barlow', 'Mulish', 'Heebo', 'Epilogue', 'IBM Plex Sans',
  'Zilla Slab', 'Josefin Sans', 'Manrope', 'Inconsolata', 'Lexend',
  'Bebas Neue', 'Anton', 'Dancing Script', 'Pacifico', 'Caveat',
  'Cinzel', 'EB Garamond', 'Libre Baskerville', 'Abril Fatface', 'Righteous'
].sort();

export function dynamicallyLoadFonts(headingFont: string, bodyFont: string) {
  const fontId = 'dynamic-google-fonts';
  let linkTarget = document.getElementById(fontId) as HTMLLinkElement | null;
  
  if (!linkTarget) {
    linkTarget = document.createElement('link');
    linkTarget.id = fontId;
    linkTarget.rel = 'stylesheet';
    linkTarget.crossOrigin = 'anonymous';
    document.head.appendChild(linkTarget);
    
    // Add preconnects for performance
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);
    
    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = '';
    document.head.appendChild(preconnect2);
  }

  const fontsToLoad = new Set([headingFont, bodyFont]);
  const fontFamilies = Array.from(fontsToLoad).map(font => 
    `family=${font.replace(/ /g, '+')}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400`
  );
  
  const href = `https://fonts.googleapis.com/css2?${fontFamilies.join('&')}&display=swap`;
  
  // Only update if changed
  if (linkTarget.href !== href) {
    linkTarget.href = href;
  }
}
