export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface TypographySettings {
  family: string;
  weight: string;
  style: string;
  transform: string;
  isCustom?: boolean;
}

export interface RoleColors {
  cta: string;
  heading: string;
  bodyText: string;
  background: string;
  nav: string;
  heroBg?: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroText?: string;
  heroCta?: string;
  mainGridBg?: string;
  mainGridHeading?: string;
  mainGridText?: string;
  mainGridIconBg?: string;
  mainGrid1Bg?: string;
  mainGrid1Heading?: string;
  mainGrid1Text?: string;
  mainGrid1IconBg?: string;
  mainGrid2Bg?: string;
  mainGrid2Heading?: string;
  mainGrid2Text?: string;
  mainGrid2IconBg?: string;
  mainGrid3Bg?: string;
  mainGrid3Heading?: string;
  mainGrid3Text?: string;
  mainGrid3IconBg?: string;
  buttonBgOverride?: string;
  buttonTextOverride?: string;
}

export type ButtonStyle = 'default' | 'pill' | 'outline';

export interface Typography {
  heading: TypographySettings;
  body: TypographySettings;
}

export interface DesignState {
  projectName: string;
  colors: Color[];
  roleColors: RoleColors;
  typography: Typography;
  buttonStyle: ButtonStyle;
  designFeel: string[];
  summary: string;
}
