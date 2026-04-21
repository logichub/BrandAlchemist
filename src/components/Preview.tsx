import React, { useMemo, useState } from 'react';
import { DesignState } from '../types';
import { Monitor, Smartphone } from 'lucide-react';

interface PreviewProps {
  state: DesignState;
}

export function Preview({ state }: PreviewProps) {
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'mobile'>('desktop');

  // Resolve role IDs to actual hex colors from the palette
  const resolveColor = (id: string, fallback: string) => {
    return state.colors.find(c => c.id === id)?.hex || fallback;
  };

  const ctaColor = resolveColor(state.roleColors.cta, '#5A5A40');
  const headingColor = resolveColor(state.roleColors.heading, '#2D2D2A');
  const bodyTextColor = resolveColor(state.roleColors.bodyText, '#2D2D2A');
  const backgroundColor = resolveColor(state.roleColors.background, '#F7F5F2');
  const navColor = resolveColor(state.roleColors.nav, '#8C8984');

  // Custom resolved values for Button Overrides
  const finalButtonBg = state.roleColors.buttonBgOverride ? resolveColor(state.roleColors.buttonBgOverride, ctaColor) : ctaColor;
  const finalButtonText = state.roleColors.buttonTextOverride 
    ? resolveColor(state.roleColors.buttonTextOverride, state.buttonStyle === 'outline' ? finalButtonBg : '#ffffff') 
    : (state.buttonStyle === 'outline' ? finalButtonBg : '#ffffff');

  // Hero explicitly resolves if set, otherwise inherits standard layout colors
  const heroBgColor = state.roleColors.heroBg ? resolveColor(state.roleColors.heroBg, 'transparent') : 'transparent';
  const heroHeadingColor = state.roleColors.heroHeading ? resolveColor(state.roleColors.heroHeading, headingColor) : headingColor;
  const heroSubheadingColor = state.roleColors.heroSubheading ? resolveColor(state.roleColors.heroSubheading, navColor) : navColor;
  const heroTextColor = state.roleColors.heroText ? resolveColor(state.roleColors.heroText, bodyTextColor) : bodyTextColor;
  const heroCtaColor = state.roleColors.heroCta ? resolveColor(state.roleColors.heroCta, ctaColor) : ctaColor;

  // Main Component Grid explicitly resolves if set
  const getGridColor = (cardNum: 1 | 2 | 3, role: 'Bg' | 'Heading' | 'Text' | 'IconBg', fallbackGlobal: string) => {
    const specificRole = `mainGrid${cardNum}${role}` as keyof typeof state.roleColors;
    return state.roleColors[specificRole] ? resolveColor(state.roleColors[specificRole]!, fallbackGlobal) : fallbackGlobal;
  };

  const mainGridBgColor = state.roleColors.mainGridBg ? resolveColor(state.roleColors.mainGridBg, 'rgba(255, 255, 255, 0.4)') : 'rgba(255, 255, 255, 0.4)';
  const mainGridHeadingColor = state.roleColors.mainGridHeading ? resolveColor(state.roleColors.mainGridHeading, headingColor) : headingColor;
  const mainGridTextColor = state.roleColors.mainGridText ? resolveColor(state.roleColors.mainGridText, bodyTextColor) : bodyTextColor;
  const mainGridIconBgColor = state.roleColors.mainGridIconBg ? resolveColor(state.roleColors.mainGridIconBg, ctaColor) : ctaColor;

  // Analyze tags for soft logic styling
  const tagsText = state.designFeel.join(' ').toLowerCase();
  
  const parsedStyles = useMemo(() => {
    let borderRadius = '0.5rem'; // standard rounded-lg
    let padding = '1.5rem';
    let contentMaxWidth = '64rem'; // max-w-5xl
    let shadow = '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'; // shadow-md
    
    if (tagsText.includes('botanical') || tagsText.includes('feminine') || tagsText.includes('warm') || tagsText.includes('organic')) {
      borderRadius = '2rem'; // rounded-2xl+
      padding = '2rem';
    }
    
    if (tagsText.includes('corporate') || tagsText.includes('tech') || tagsText.includes('sharp')) {
      borderRadius = '0px'; // square
      shadow = 'none';
      padding = '1.25rem';
    }
    
    if (tagsText.includes('minimal')) {
      shadow = 'none';
    }

    if (tagsText.includes('bold')) {
      shadow = '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'; // xl
    }

    return { borderRadius, padding, contentMaxWidth, shadow };
  }, [tagsText]);

  // Generate typography styles object
  const headingStyle: React.CSSProperties = {
    fontFamily: state.typography.heading.family,
    fontWeight: state.typography.heading.weight,
    fontStyle: state.typography.heading.style,
    textTransform: state.typography.heading.transform as any,
    color: headingColor
  };

  const bodyStyle: React.CSSProperties = {
    fontFamily: state.typography.body.family,
    fontWeight: state.typography.body.weight,
    fontStyle: state.typography.body.style,
    textTransform: state.typography.body.transform as any,
  };

  const ctaBtnStyle: React.CSSProperties = {
    backgroundColor: state.buttonStyle === 'outline' ? 'transparent' : finalButtonBg,
    color: finalButtonText,
    border: state.buttonStyle === 'outline' ? `2px solid ${finalButtonBg}` : 'none',
    borderRadius: state.buttonStyle === 'pill' ? '9999px' : '0.5rem',
    ...bodyStyle, // Inherit body details but override some
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontStyle: 'normal',
    padding: '0.75rem 1.5rem',
    fontSize: '0.75rem',
    letterSpacing: '0.1em'
  };

  const getFontImportUrl = (fontFamily: string) => {
    if (!fontFamily) return '';
    // Formats like 'Nunito Sans' need to be 'Nunito+Sans'
    const formattedName = fontFamily.trim().replace(/ /g, '+');
    // We import a few key weights/styles to ensure preview looks right
    return `https://fonts.googleapis.com/css2?family=${formattedName}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;
  };

  return (
    <>
      <div className="w-full h-full bg-[#F7F5F2] overflow-y-auto p-4 md:p-12 flex flex-col items-center relative">
        <style>
          {`
            @import url('${getFontImportUrl(state.typography.heading.family)}');
            @import url('${getFontImportUrl(state.typography.body.family)}');
          `}
        </style>

      {/* Mock Browser Window container */}
      <div className="flex justify-center items-start w-full flex-grow-0 flex-shrink-0">
        <div 
          id="design-preview-container"
          className={`bg-white rounded-2xl shadow-[0_20px_40px_-4px_rgba(90,90,64,0.15)] border border-[#E5E1D9] overflow-hidden flex flex-col transition-all duration-500 ease-in-out origin-top ${
            layoutMode === 'desktop' ? 'w-full max-w-4xl' : 'w-full max-w-[375px]'
          }`}
          style={{ minHeight: layoutMode === 'desktop' ? '620px' : '812px' }}
        >

          {/* Live Preview Content Area (Full Landing Page layout) */}
          <div 
            className="flex flex-col transition-colors duration-500 overflow-hidden p-6 md:p-12"
            style={{ 
              backgroundColor: backgroundColor, // explicitly set from roleColors
              color: bodyTextColor, 
              ...bodyStyle
            }}
          >
          {/* Header - 2 Column */}
          <header 
            className="flex justify-between items-center relative z-10 pb-5"
          >
            <div className="flex flex-1 items-center gap-3">
              <div className="w-8 h-8 rounded-full" style={{ backgroundColor: headingColor }}></div>
              <span className="font-bold tracking-tight" style={{ ...headingStyle, fontSize: '1.25rem' }}>
                {state.projectName || 'BRAND ALCHEMIST'}
              </span>
            </div>
            
            <div className={`items-center gap-8 text-sm font-medium ${layoutMode === 'desktop' ? 'hidden md:flex' : 'hidden'}`} style={{ color: navColor }}>
              <a href="#" className="hover:opacity-70 transition-opacity">About</a>
              <a href="#" className="hover:opacity-70 transition-opacity">Services</a>
              <a href="#" className="hover:opacity-70 transition-opacity">FAQs</a>
              
              <button 
                className="transform transition hover:scale-105 shadow-md hover:shadow-lg"
                style={ctaBtnStyle}
              >
                Book Now
              </button>
            </div>
          </header>

          {/* Hero Section - Left Align */}
          <section 
            className={`text-left mb-16 md:mb-24 max-w-none ${heroBgColor !== 'transparent' ? 'px-6 md:px-12 pt-10 pb-16 -mx-6 md:-mx-12 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)]' : 'pt-4 pb-8'}`}
            style={{ backgroundColor: heroBgColor }}
          >
            <div className="max-w-3xl">
              <h4 
                className="uppercase tracking-widest text-xs font-bold mb-6" 
                style={{ color: heroSubheadingColor }}
              >
                {state.designFeel.join(' • ') || 'BrandAlchemist'}
              </h4>
              
              <h1 
                className={`${layoutMode === 'desktop' ? 'text-5xl md:text-6xl lg:text-7xl' : 'text-4xl'} leading-[1.1] mb-8 transition-all`}
                style={{ ...headingStyle, color: heroHeadingColor }}
              >
                Breathe life into your digital presence.
              </h1>
              
              <p className={`mb-10 leading-relaxed opacity-80 max-w-lg ${layoutMode === 'desktop' ? 'text-lg' : 'text-base'}`} style={{ color: heroTextColor }}>
                {state.summary && state.summary.length > 20 
                  ? state.summary.split('. ')[0] + '.' 
                  : "We craft immersive digital identities that resonate with clarity, purpose, and natural elegance."}
              </p>
              
              <button 
                className={`px-8 py-4 text-xs shadow-xl transform transition hover:scale-105 ${layoutMode === 'mobile' ? 'w-full' : ''}`}
                style={{ 
                  backgroundColor: state.buttonStyle === 'outline' ? 'transparent' : (state.roleColors.heroCta ? heroCtaColor : finalButtonBg),
                  color: state.roleColors.heroCta 
                    ? (state.buttonStyle === 'outline' ? heroCtaColor : '#fff')
                    : finalButtonText,
                  border: state.buttonStyle === 'outline' 
                    ? `2px solid ${state.roleColors.heroCta ? heroCtaColor : finalButtonBg}` 
                    : 'none',
                  borderRadius: state.buttonStyle === 'pill' ? '9999px' : '0.5rem',
                  ...bodyStyle,
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontStyle: 'normal',
                  fontSize: '0.875rem'
                }}
              >
                Book a discovery
              </button>
            </div>
          </section>

          {/* Main Section - 3 Components */}
          <section className={`grid ${layoutMode === 'desktop' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'} gap-8 mb-24`}>
            {[
              { 
                id: 1, 
                label: 'Discovery', 
                bg: getGridColor(1, 'Bg', mainGridBgColor),
                heading: getGridColor(1, 'Heading', mainGridHeadingColor),
                text: getGridColor(1, 'Text', mainGridTextColor),
                iconBg: getGridColor(1, 'IconBg', mainGridIconBgColor)
              },
              { 
                id: 2, 
                label: 'Strategy', 
                bg: getGridColor(2, 'Bg', mainGridBgColor),
                heading: getGridColor(2, 'Heading', mainGridHeadingColor),
                text: getGridColor(2, 'Text', mainGridTextColor),
                iconBg: getGridColor(2, 'IconBg', mainGridIconBgColor)
              },
              { 
                id: 3, 
                label: 'Execution', 
                bg: getGridColor(3, 'Bg', mainGridBgColor),
                heading: getGridColor(3, 'Heading', mainGridHeadingColor),
                text: getGridColor(3, 'Text', mainGridTextColor),
                iconBg: getGridColor(3, 'IconBg', mainGridIconBgColor)
              }
            ].map((item) => (
              <div 
                key={item.id} 
                className="p-8 border border-black/5 transition-transform hover:-translate-y-1" 
                style={{ 
                  borderRadius: parsedStyles.borderRadius, 
                  backgroundColor: item.bg, 
                  boxShadow: parsedStyles.shadow 
                }}
              >
                <div 
                  className="w-12 h-12 mb-6 flex items-center justify-center opacity-80" 
                  style={{ backgroundColor: item.iconBg, borderRadius: parsedStyles.borderRadius === '0px' ? '0px' : '9999px' }}
                >
                  <div className="w-4 h-4 bg-white/80 rounded-sm"></div>
                </div>
                <h4 className="text-2xl mb-3 font-bold" style={{ ...headingStyle, color: item.heading }}>
                  {item.label}
                </h4>
                <p className="opacity-75 text-sm leading-relaxed" style={{ color: item.text }}>
                  Functionality describing the core benefits of this pillar, dynamically matched to your custom visual brand language.
                </p>
              </div>
            ))}
          </section>

          {/* Footer - Center Align */}
          <footer className="text-center mt-auto pt-12 border-t border-black/10">
            <div className="mb-4 flex justify-center gap-2">
              {state.colors.slice(0, 3).map((c) => (
                <div key={c.id} className="w-2 h-2 rounded-full border border-black/5" style={{ backgroundColor: c.hex }} />
              ))}
            </div>
            <p className="text-xs uppercase tracking-widest opacity-60 font-semibold">
              © {new Date().getFullYear()} {state.projectName || 'BrandAlchemist'}. All rights reserved.
            </p>
          </footer>

        </div>

        {/* Brand Specifications / Style Guide (Appended to be exported together) */}
        <div 
          className="p-6 md:p-12 lg:p-16 border-t-4 border-dashed relative overflow-hidden" 
          style={{ 
            borderColor: ctaColor,
            backgroundColor: 'rgba(0,0,0,0.03)',
            color: headingColor
          }}
        >
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className={`font-bold uppercase tracking-[0.2em] mb-12 flex items-center gap-4 ${layoutMode === 'desktop' ? 'text-2xl' : 'text-xl'}`}>
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 text-xs shadow-inner border border-black/10 flex-shrink-0">01</span>
              <span>Brand Specifications</span>
            </h2>

            <div className={`grid gap-16 ${layoutMode === 'desktop' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {/* Typography Spec */}
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold mb-6 border-b border-black/10 pb-4 opacity-60">Typography Selection</h3>
                
                <div className="space-y-8">
                  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-widest opacity-60">Heading Typeface</span>
                      <span className="text-[10px] font-mono opacity-50 text-right leading-tight">
                        Wght: {state.typography.heading.weight}<br/>
                        Style: {state.typography.heading.style}<br/>
                        Case: {state.typography.heading.transform}
                      </span>
                    </div>
                    <div className="text-4xl mb-2" style={{ ...headingStyle }}>Aa</div>
                    <div className="text-lg font-bold">{state.typography.heading.family}</div>
                  </div>

                  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-widest opacity-60">Body Typeface</span>
                      <span className="text-[10px] font-mono opacity-50 text-right leading-tight">
                        Wght: {state.typography.body.weight}<br/>
                        Style: {state.typography.body.style}<br/>
                        Case: {state.typography.body.transform}
                      </span>
                    </div>
                    <div className="text-4xl mb-2" style={{ ...bodyStyle }}>Aa</div>
                    <div className="text-lg font-bold">{state.typography.body.family}</div>
                  </div>
                </div>
              </div>

              {/* Color Palette Spec */}
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold mb-6 border-b border-black/10 pb-4 opacity-60">Color Palette</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {state.colors.map(color => (
                    <div key={color.id} className="flex flex-col gap-3 group">
                      <div className="relative w-full h-16 rounded-lg overflow-hidden group-hover:scale-[1.02] transition-transform shadow-sm">
                        {/* Checkered pattern background for light colors */}
                        <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZWVlIiAvPgo8cmVjdCB4PSI0IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZWVlIiAvPgo8L3N2Zz4=')]"></div>
                        
                        {/* Actual color overlay */}
                        <div 
                          className="absolute inset-0 z-10"
                          style={{ backgroundColor: color.hex }}
                        />
                        
                        {/* Inner stroke constraint */}
                        <div className="absolute inset-0 z-20 rounded-lg ring-1 ring-inset ring-black/10"></div>
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider truncate" title={color.name}>
                          {color.name}
                        </div>
                        <div className="text-[10px] font-mono opacity-60 uppercase tracking-widest">
                          {color.hex}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Subtle Blueprint Grid Pattern Overlay */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

      </div>
      </div>

      </div>

      {/* Floating Info Boxes */}
      <div className={`hidden xl:block absolute bottom-8 right-12 w-64 bg-[#2D2D2A] text-white p-6 rounded-xl shadow-2xl transition-opacity ${layoutMode === 'desktop' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#8C8984] mb-3">Intent Summary</h4>
        <p className="text-xs leading-relaxed italic">
          "{state.summary || 'Minimalist but warm. Focus on soft textures.'}"
        </p>
      </div>
      
      {/* Floating vertical Layout Switcher Toolbar on right */}
      <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex flex-col bg-white shadow-lg border border-[#E5E1D9] p-1.5 rounded-2xl z-50 transition-all gap-1">
        <button
          onClick={() => setLayoutMode('desktop')}
          className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl transition-colors ${layoutMode === 'desktop' ? 'bg-[#F7F5F2] text-[#2D2D2A] shadow-sm' : 'text-[#8C8984] hover:text-[#5A5A40] hover:bg-gray-50'}`}
          title="Desktop View"
        >
          <Monitor size={18} />
        </button>
        <button
          onClick={() => setLayoutMode('mobile')}
          className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl transition-colors ${layoutMode === 'mobile' ? 'bg-[#F7F5F2] text-[#2D2D2A] shadow-sm' : 'text-[#8C8984] hover:text-[#5A5A40] hover:bg-gray-50'}`}
          title="Mobile View"
        >
          <Smartphone size={18} />
        </button>
      </div>

      <div className="hidden xl:flex absolute top-12 right-12 flex-col gap-2">
        <div className="bg-white px-4 py-2 rounded-full border border-[#E5E1D9] text-[10px] font-bold uppercase tracking-tighter shadow-sm">
          {layoutMode === 'desktop' ? 'Desktop Preview Active' : 'Mobile Preview Active'}
        </div>
      </div>
    </>
  );
}
