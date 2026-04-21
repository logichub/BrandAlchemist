import { useState, useEffect } from 'react';
import namer from 'color-namer';
import { DesignState, Color } from '../types';
import { dynamicallyLoadFonts } from '../lib/fonts';
import { SAMPLE_PROJECTS } from '../lib/sampleProjects';

function generateColorName(hex: string): string {
  try {
    const names = namer(hex);
    const bestMatch = names.ntc[0];
    return bestMatch ? bestMatch.name : 'New Color';
  } catch (e) {
    return 'New Color';
  }
}

const DEFAULT_STATE: DesignState = {
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
};

const STORAGE_KEY = 'design-system-playground-state';

export function useDesignState() {
  const [state, setState] = useState<DesignState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Simple sanity check to handle migration from older versions
        if (typeof parsed.typography.heading === 'string') {
          return DEFAULT_STATE; // Fallback if detecting old schema
        }
        if (parsed.roleColors && parsed.roleColors.cta && parsed.roleColors.cta.startsWith('#')) {
          return DEFAULT_STATE; // Fallback if detecting old hex-based role colors
        }
        return { ...DEFAULT_STATE, ...parsed }; // Merge to pick up new keys like projectName/roleColors if missing
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    return DEFAULT_STATE;
  });

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Dynamically load fonts
  useEffect(() => {
    dynamicallyLoadFonts(state.typography.heading.family, state.typography.body.family);
  }, [state.typography.heading.family, state.typography.body.family]);

  const SAVED_PROJECTS_KEY = 'design-system-saved-projects-list';
  const [savedProjects, setSavedProjects] = useState<DesignState[]>(() => {
    const saved = localStorage.getItem(SAVED_PROJECTS_KEY);
    const parsed: DesignState[] = saved ? JSON.parse(saved) : [];
    
    // Always include sample projects if they aren't already present
    const merged = [...SAMPLE_PROJECTS];
    parsed.forEach(p => {
      // Don't add if it matches a sample project's name
      if (!merged.find(m => m.projectName === p.projectName)) {
        merged.push(p);
      }
    });
    return merged;
  });

  useEffect(() => {
    localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(savedProjects));
  }, [savedProjects]);

  const saveCurrentProject = () => {
    setSavedProjects(prev => {
      const filtered = prev.filter(p => p.projectName !== state.projectName);
      return [...filtered, state];
    });
  };

  const loadProject = (name: string) => {
    const proj = savedProjects.find(p => p.projectName === name);
    if (proj) {
      setState(proj);
    }
  };

  const deleteProject = (name: string) => {
    setSavedProjects(prev => prev.filter(p => p.projectName !== name));
  };

  const updateState = (updates: Partial<DesignState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const updateColor = (id: string, updates: Partial<Color>) => {
    setState((prev) => ({
      ...prev,
      colors: prev.colors.map((c) => {
        if (c.id === id) {
          const updatedColor = { ...c, ...updates };
          // If the hex was changed and it is a complete valid hex, automatically update the name
          if (updates.hex && updates.hex !== c.hex) {
            const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(updates.hex);
            if (isValidHex) {
              updatedColor.name = generateColorName(updates.hex);
            }
          }
          return updatedColor;
        }
        return c;
      }),
    }));
  };

  const addColor = (initialHex?: string) => {
    const finalHex = initialHex || '#000000';
    const colorName = generateColorName(finalHex);
    setState((prev) => ({
      ...prev,
      colors: [...prev.colors, { id: Math.random().toString(36).substr(2, 9), name: colorName, hex: finalHex }],
    }));
  };

  const removeColor = (id: string) => {
    setState((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c.id !== id),
    }));
  };

  const moveColor = (index: number, direction: 'up' | 'down') => {
    setState((prev) => {
      const newColors = [...prev.colors];
      if (direction === 'up' && index > 0) {
        // Swap with previous
        [newColors[index], newColors[index - 1]] = [newColors[index - 1], newColors[index]];
      } else if (direction === 'down' && index < newColors.length - 1) {
        // Swap with next
        [newColors[index], newColors[index + 1]] = [newColors[index + 1], newColors[index]];
      }
      return { ...prev, colors: newColors };
    });
  };

  const resetToDefault = () => {
    setState(DEFAULT_STATE);
  };

  return {
    state,
    savedProjects,
    saveCurrentProject,
    loadProject,
    deleteProject,
    updateState,
    updateColor,
    addColor,
    removeColor,
    moveColor,
    resetToDefault,
  };
}
