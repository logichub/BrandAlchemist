import { DesignState } from '../types';

export const SAMPLE_PROJECTS: DesignState[] = [
  {
    projectName: 'Editorial Vogue (Default)',
    colors: [
      { id: '1', name: 'Burgundy', hex: '#7A1F3D' },
      { id: '2', name: 'Soft Peach', hex: '#FDF8F5' },
      { id: '3', name: 'Pure White', hex: '#FFFFFF' },
      { id: '4', name: 'Deep Black', hex: '#111111' },
      { id: '5', name: 'Muted Gold', hex: '#B89B5E' },
    ],
    roleColors: {
      cta: '1',
      heading: '4',
      bodyText: '4',
      background: '2',
      nav: '5',
      heroHeading: '1',
      mainGrid1Bg: '3',
      mainGrid2Bg: '3',
      mainGrid3Bg: '3',
    },
    buttonStyle: 'default',
    typography: {
      heading: {
        family: 'Playfair Display',
        weight: '600',
        style: 'normal',
        transform: 'uppercase',
        isCustom: false,
      },
      body: {
        family: 'Lora',
        weight: '400',
        style: 'normal',
        transform: 'none',
        isCustom: false,
      },
    },
    designFeel: ['Editorial', 'Feminine', 'Premium'],
    summary: "Elegant serif typography paired with rich accent colors. Designed for high-end fashion or lifestyle magazines.",
  },
  {
    projectName: 'Acme SaaS (Corporate)',
    colors: [
      { id: '1', name: 'Tech Blue', hex: '#2563EB' },
      { id: '2', name: 'Slate Gray', hex: '#64748B' },
      { id: '3', name: 'Light Gray', hex: '#F8FAFC' },
      { id: '4', name: 'Navy Text', hex: '#0F172A' },
      { id: '5', name: 'Pure White', hex: '#FFFFFF' },
    ],
    roleColors: {
      cta: '1',
      heading: '4',
      bodyText: '2',
      background: '3',
      nav: '2',
      mainGrid1IconBg: '1',
      mainGrid2IconBg: '1',
      mainGrid3IconBg: '1',
    },
    buttonStyle: 'pill',
    typography: {
      heading: {
        family: 'Inter',
        weight: '700',
        style: 'normal',
        transform: 'none',
        isCustom: false,
      },
      body: {
        family: 'Roboto',
        weight: '400',
        style: 'normal',
        transform: 'none',
        isCustom: false,
      },
    },
    designFeel: ['Corporate', 'Tech', 'Sharp', 'Minimal'],
    summary: "High contrast, sharp edges, and highly legible typography geared toward a B2B SaaS dashboard layout.",
  },
  {
    projectName: 'Neon Nights (Cyberpunk)',
    colors: [
      { id: '1', name: 'Neon Purple', hex: '#A855F7' },
      { id: '2', name: 'Cyber Cyan', hex: '#22D3EE' },
      { id: '3', name: 'Void Black', hex: '#09090B' },
      { id: '4', name: 'Light Text', hex: '#FAFAFA' },
      { id: '5', name: 'Dark Gray', hex: '#27272A' },
    ],
    roleColors: {
      cta: '2',
      heading: '4',
      bodyText: '4',
      background: '3',
      nav: '1',
      heroCta: '1',
      mainGrid1Bg: '5',
      mainGrid2Bg: '5',
      mainGrid3Bg: '5',
    },
    buttonStyle: 'outline',
    typography: {
      heading: {
        family: 'Outfit',
        weight: '700',
        style: 'normal',
        transform: 'uppercase',
        isCustom: false,
      },
      body: {
        family: 'JetBrains Mono',
        weight: '400',
        style: 'normal',
        transform: 'none',
        isCustom: false,
      },
    },
    designFeel: ['Bold', 'Cyberpunk', 'Dark', 'Sharp'],
    summary: "High-voltage neon accents on strict black backgrounds. Geared for gaming, crypto, or late-night dev tools.",
  },
  {
    projectName: "Blush & Bloom",
    colors: [
      { id: "1", name: "Deep Sage", hex: "#1E2E1A" },
      { id: "2", name: "Forest", hex: "#3D6B3A" },
      { id: "3", name: "Dusty Rose", hex: "#C4899A" },
      { id: "4", name: "Coral Cta", hex: "#E86A38" },
      { id: "5", name: "Soft White", hex: "#FBF7F2" }
    ],
    roleColors: {
      cta: "4",
      heading: "1",
      bodyText: "1",
      background: "5",
      nav: "1",
      heroSubheading: "3"
    },
    buttonStyle: "default",
    typography: {
      heading: {
        family: "Cormorant Garamond",
        weight: "500",
        style: "italic",
        transform: "none",
        isCustom: false
      },
      body: {
        family: "Plus Jakarta Sans",
        weight: "300",
        style: "normal",
        transform: "none",
        isCustom: false
      }
    },
    designFeel: ["Modern", "Organic", "Premium"],
    summary: "Focus on soft textures and legible type for a high-end wellness brand identity. Minimalist but warm."
  },
  {
    projectName: "Golden Hour",
    colors: [
      { id: "1", name: "Dark Earth", hex: "#2A1F0A" },
      { id: "2", name: "Forest", hex: "#3D6B3A" },
      { id: "3", name: "Amber Spice", hex: "#C4680A" },
      { id: "4", name: "Warm Gold", hex: "#DBA87A" },
      { id: "5", name: "Cream", hex: "#FAF4E8" },
      { id: "xkmq8irmw", name: "Body", hex: "#000000" }
    ],
    roleColors: {
      cta: "3",
      heading: "1",
      bodyText: "xkmq8irmw",
      background: "5",
      nav: "1",
      heroSubheading: "4"
    },
    buttonStyle: "default",
    typography: {
      heading: {
        family: "Playfair Display",
        weight: "400",
        style: "italic",
        transform: "none",
        isCustom: false
      },
      body: {
        family: "Nunito Sans",
        weight: "300",
        style: "normal",
        transform: "none",
        isCustom: false
      }
    },
    designFeel: ["Modern", "Organic", "Premium"],
    summary: "Focus on soft textures and legible type for a high-end wellness brand identity. Minimalist but warm."
  },
  {
    projectName: "Magnolia in Bloom",
    colors: [
      { id: "1", name: "Leaf Green", hex: "#3D6B3A" },
      { id: "2", name: "Magnolia Rose", hex: "#7A3B5E" },
      { id: "3", name: "Petal Blush", hex: "#C4899A" },
      { id: "4", name: "Coral Cta", hex: "#E86A38" },
      { id: "5", name: "Ivory", hex: "#F5EFE8" },
      { id: "poozwflf7", name: "Body", hex: "#000000" }
    ],
    roleColors: {
      cta: "4",
      heading: "2",
      background: "5",
      nav: "2",
      bodyText: "poozwflf7",
      heroSubheading: "3"
    },
    buttonStyle: "default",
    typography: {
      heading: {
        family: "Cormorant Garamond",
        weight: "500",
        style: "italic",
        transform: "none",
        isCustom: false
      },
      body: {
        family: "DM Sans",
        weight: "300",
        style: "normal",
        transform: "none",
        isCustom: false
      }
    },
    designFeel: [],
    summary: "Focus on soft textures and legible type for a high-end wellness brand identity. Minimalist but warm."
  }
];
