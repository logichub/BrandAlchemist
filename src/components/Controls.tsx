import React, { useState } from 'react';
import { DesignState, Color } from '../types';
import { GOOGLE_FONTS } from '../lib/fonts';
import { SAMPLE_PROJECTS } from '../lib/sampleProjects';
import { ColorItem } from './ColorItem';
import { TagInput } from './TagInput';
import { Plus, RotateCcw, FolderOpen, Save, Trash2, Image as ImageIcon, ChevronDown, ChevronRight, Download, Upload, Pipette } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ControlsProps {
  state: DesignState;
  savedProjects: DesignState[];
  saveCurrentProject: () => void;
  loadProject: (name: string) => void;
  deleteProject: (name: string) => void;
  updateState: (updates: Partial<DesignState>) => void;
  updateColor: (id: string, updates: Partial<Color>) => void;
  addColor: (hex?: string) => void;
  removeColor: (id: string) => void;
  moveColor: (index: number, direction: 'up' | 'down') => void;
  resetToDefault: () => void;
}

export function Controls({ state, savedProjects, saveCurrentProject, loadProject, deleteProject, updateState, updateColor, addColor, removeColor, moveColor, resetToDefault }: ControlsProps) {
  const [selectedProjectName, setSelectedProjectName] = useState<string>('');
  const [isOverridesOpen, setIsOverridesOpen] = useState<boolean>(false);

  const handleExportImage = async () => {
    const previewContainer = document.getElementById('design-preview-container');
    if (!previewContainer) return;
    
    try {
      const dataUrl = await toPng(previewContainer, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: 'rgba(0,0,0,0)' // transparent
      });
      const link = document.createElement('a');
      link.download = `${state.projectName || 'design-system'}-preview.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image", err);
    }
  };

  const handlePickColor = async () => {
    if (!('EyeDropper' in window)) {
      alert("Your browser does not support the EyeDropper API");
      return;
    }
    try {
      // @ts-ignore
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      addColor(result.sRGBHex);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-y-auto custom-scrollbar">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] border-b border-[#E5E1D9]">
        <div className="p-6 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1A1A18]">BrandAlchemist</h1>
            <p className="text-xs text-[#8C8984] mt-1 uppercase tracking-widest font-semibold">v1.2.0 Stable Build</p>
          </div>
          <button 
            onClick={resetToDefault} 
            className="flex items-center gap-1 sm:gap-1.5 text-[10px] bg-white text-[#2D2D2A] border border-[#E5E1D9] px-2 py-1.5 rounded-md hover:border-[#5A5A40] transition-colors shadow-sm font-bold uppercase tracking-widest cursor-pointer"
            title="Reset to default"
          >
            <RotateCcw size={12} strokeWidth={2.5} />
            Reset All
          </button>
        </div>

        {/* Project Profile Section (Now Sticky) */}
        <section className="px-6 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1A1A18]">Project Profile</h2>
            
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <label className="flex items-center gap-1 sm:gap-1.5 text-[10px] bg-white text-[#2D2D2A] border border-[#E5E1D9] px-2 py-1.5 rounded-md hover:border-[#5A5A40] transition-colors shadow-sm font-bold uppercase tracking-widest cursor-pointer">
                <Upload size={12} strokeWidth={2.5} /> Import
                <input 
                  type="file" 
                  accept=".json"
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const importedState = JSON.parse(event.target?.result as string);
                        if (importedState && importedState.colors && importedState.projectName) {
                           updateState(importedState);
                        } else {
                           alert("Invalid project format");
                        }
                      } catch (err) {
                        alert("Error parsing JSON file");
                      }
                    };
                    reader.readAsText(file);
                    e.target.value = '';
                  }}
                />
              </label>
              
              <button 
                onClick={() => {
                  const exportState = {
                    ...state,
                    colors: state.colors.map(c => ({
                      ...c,
                      name: c.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
                      hex: c.hex.toUpperCase()
                    }))
                  };
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportState, null, 2));
                  const downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute("href",     dataStr);
                  downloadAnchorNode.setAttribute("download", `${state.projectName || 'design-system'}-config.json`);
                  document.body.appendChild(downloadAnchorNode);
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                }}
                className="flex items-center gap-1 sm:gap-1.5 text-[10px] bg-white text-[#2D2D2A] border border-[#E5E1D9] px-2 py-1.5 rounded-md hover:border-[#5A5A40] transition-colors shadow-sm font-bold uppercase tracking-widest cursor-pointer"
                title="Export JSON"
              >
                <Download size={12} strokeWidth={2.5} /> JSON
              </button>
              
              <button 
                onClick={handleExportImage}
                className="flex items-center gap-1 sm:gap-1.5 text-[10px] bg-white text-[#2D2D2A] border border-[#E5E1D9] px-2 py-1.5 rounded-md hover:border-[#5A5A40] transition-colors shadow-sm font-bold uppercase tracking-widest cursor-pointer"
                title="Export Image"
              >
                <ImageIcon size={12} strokeWidth={2.5} /> Image
              </button>

              <button 
                onClick={saveCurrentProject}
                className="flex items-center gap-1 sm:gap-1.5 text-[10px] bg-[#5A5A40] text-white px-2 py-1.5 rounded-md hover:bg-[#484833] transition-colors shadow-sm font-bold uppercase tracking-widest sm:ml-1 cursor-pointer"
                title="Save Project"
              >
                <Save size={12} strokeWidth={2.5} /> Save
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {/* Input & Selector Row */}
            <div className="flex gap-2 items-end">
              <label className="flex-1 block">
                <span className="text-[10px] font-bold uppercase text-[#8C8984] mb-1 block tracking-wider">Project Name</span>
                <input 
                  type="text"
                  value={state.projectName}
                  onChange={(e) => updateState({ projectName: e.target.value })}
                  className="w-full bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1.5 px-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                  placeholder="e.g. BRAND ALCHEMIST"
                />
              </label>
              
              {savedProjects.length > 0 && (
                <div className="flex-1 shrink-0 flex gap-1 items-end">
                  <label className="flex-1 block min-w-0">
                    <span className="text-[10px] font-bold uppercase text-[#8C8984] mb-1 flex items-center gap-1 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
                      <FolderOpen size={10} /> Saved Projects
                    </span>
                    <select 
                      className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1.5 px-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                      value={selectedProjectName}
                      onChange={(e) => setSelectedProjectName(e.target.value)}
                    >
                      <option value="" disabled>Select...</option>
                      {savedProjects.map(proj => (
                        <option key={proj.projectName} value={proj.projectName}>{proj.projectName}</option>
                      ))}
                    </select>
                  </label>
                  <button 
                    onClick={() => selectedProjectName && loadProject(selectedProjectName)} 
                    disabled={!selectedProjectName}
                    className="h-[28px] text-[10px] bg-white border border-[#E5E1D9] text-[#2D2D2A] px-2 rounded hover:border-[#5A5A40] font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
                  >
                    Load
                  </button>
                  <button 
                    onClick={() => {
                      if (selectedProjectName) {
                        deleteProject(selectedProjectName);
                        setSelectedProjectName('');
                      }
                    }} 
                    disabled={!selectedProjectName || SAMPLE_PROJECTS.some(p => p.projectName === selectedProjectName)}
                    title={SAMPLE_PROJECTS.some(p => p.projectName === selectedProjectName) ? "Cannot delete sample project" : "Delete project"}
                    className="h-[28px] w-[28px] bg-white border border-[#E5E1D9] text-red-600 rounded hover:border-red-600 font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center flex-shrink-0"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="flex-1 p-6 pt-6 -mt-2">
        
        {/* Colors Section */}
        <section className="border-b border-[#E5E1D9] pb-4 mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider mb-2.5 text-[#1A1A18]">Color Palette</h2>
          <div className="grid grid-cols-2 gap-1.5 mb-2.5">
            {state.colors.map((color, idx) => (
              <ColorItem 
                key={color.id} 
                color={color} 
                index={idx}
                totalColors={state.colors.length}
                onChange={updateColor}
                onRemove={removeColor}
                onMove={moveColor}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => addColor()}
              className="flex-1 py-1.5 border-2 border-dashed border-[#E5E1D9] rounded-lg text-xs font-semibold text-[#8C8984] hover:border-[#5A5A40] hover:text-[#5A5A40] transition-colors"
            >
              + Add Color
            </button>
            <button 
              onClick={handlePickColor}
              className="flex items-center justify-center w-8 border-2 border-dashed border-[#E5E1D9] rounded-lg text-[#8C8984] hover:border-[#5A5A40] hover:text-[#5A5A40] transition-colors"
              title="Pick color from screen"
            >
              <Pipette size={14} />
            </button>
          </div>
        </section>

        {/* Role Colors Section */}
        <section className="border-b border-[#E5E1D9] pb-4 mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider mb-2.5 text-[#1A1A18]">Global Color Roles</h2>
          <div className="grid grid-cols-2 gap-2">
            {(['background', 'heading', 'bodyText', 'cta', 'nav'] as const).map(role => {
              const selectedColor = state.colors.find(c => c.id === state.roleColors[role]);
              
              return (
                <label key={role} className="block">
                  <span className="text-[9px] font-bold uppercase text-[#8C8984] mb-0.5 block">
                    {role === 'cta' ? 'CTA Button' : role === 'nav' ? 'Navigation' : role === 'bodyText' ? 'Body Text' : role === 'background' ? 'Background' : role === 'heading' ? 'Heading' : role}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div 
                      className="w-6 h-6 rounded-md border border-[rgba(0,0,0,0.05)] flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: selectedColor?.hex || '#eee' }}
                    />
                    <select
                      value={state.roleColors[role] || ''}
                      onChange={(e) => updateState({ roleColors: { ...state.roleColors, [role]: e.target.value } })}
                      className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1 px-1.5 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    >
                      {!selectedColor && <option value="" disabled>Select a color...</option>}
                      {state.colors.map(c => {
                        const titleCaseName = c.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                        return (
                          <option key={c.id} value={c.id}>{titleCaseName}</option>
                        );
                      })}
                    </select>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {/* Typography Section */}
        <section className="border-b border-[#E5E1D9] pb-4 mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider mb-2 text-[#1A1A18]">Typography</h2>
          
          <div className="flex flex-col gap-3">
            <div className="space-y-2 pt-2 border-t border-[#E5E1D9]/50">
              <label className="block">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold uppercase text-[#8C8984] block">Heading Font</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={state.typography.heading.isCustom || false}
                      onChange={(e) => updateState({ typography: { ...state.typography, heading: { ...state.typography.heading, isCustom: e.target.checked } } })}
                      className="w-2.5 h-2.5 text-[#5A5A40] focus:ring-[#5A5A40] border-gray-300 rounded"
                    />
                    <span className="text-[8px] font-bold uppercase text-[#8C8984]">Custom Name</span>
                  </label>
                </div>
                <div className="relative">
                  {state.typography.heading.isCustom ? (
                    <input 
                      type="text"
                      value={state.typography.heading.family}
                      onChange={(e) => updateState({ typography: { ...state.typography, heading: { ...state.typography.heading, family: e.target.value } } })}
                      placeholder="e.g. Geist or Jersey 25"
                      className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1.5 px-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    />
                  ) : (
                    <select 
                      value={state.typography.heading.family}
                      onChange={(e) => updateState({ typography: { ...state.typography, heading: { ...state.typography.heading, family: e.target.value } } })}
                      className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1.5 px-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    >
                      {GOOGLE_FONTS.map(font => <option key={font} value={font}>{font}</option>)}
                    </select>
                  )}
                </div>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <select 
                  value={state.typography.heading.weight}
                  onChange={(e) => updateState({ typography: { ...state.typography, heading: { ...state.typography.heading, weight: e.target.value } } })}
                  className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1 px-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                >
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                </select>
                <select 
                  value={state.typography.heading.style}
                  onChange={(e) => updateState({ typography: { ...state.typography, heading: { ...state.typography.heading, style: e.target.value } } })}
                  className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1 px-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
                <select 
                  value={state.typography.heading.transform}
                  onChange={(e) => updateState({ typography: { ...state.typography, heading: { ...state.typography.heading, transform: e.target.value } } })}
                  className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1 px-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                >
                  <option value="none">None</option>
                  <option value="uppercase">Upper</option>
                  <option value="lowercase">Lower</option>
                  <option value="capitalize">Cap</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E5E1D9]/50">
              <label className="block">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold uppercase text-[#8C8984] block">Body Font</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={state.typography.body.isCustom || false}
                      onChange={(e) => updateState({ typography: { ...state.typography, body: { ...state.typography.body, isCustom: e.target.checked } } })}
                      className="w-2.5 h-2.5 text-[#5A5A40] focus:ring-[#5A5A40] border-gray-300 rounded"
                    />
                    <span className="text-[8px] font-bold uppercase text-[#8C8984]">Custom Name</span>
                  </label>
                </div>
                <div className="relative">
                  {state.typography.body.isCustom ? (
                    <input 
                      type="text"
                      value={state.typography.body.family}
                      onChange={(e) => updateState({ typography: { ...state.typography, body: { ...state.typography.body, family: e.target.value } } })}
                      placeholder="e.g. Geist or Jersey 25"
                      className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1.5 px-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    />
                  ) : (
                    <select 
                      value={state.typography.body.family}
                      onChange={(e) => updateState({ typography: { ...state.typography, body: { ...state.typography.body, family: e.target.value } } })}
                      className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1.5 px-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    >
                      {GOOGLE_FONTS.map(font => <option key={font} value={font}>{font}</option>)}
                    </select>
                  )}
                </div>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <select 
                  value={state.typography.body.weight}
                  onChange={(e) => updateState({ typography: { ...state.typography, body: { ...state.typography.body, weight: e.target.value } } })}
                  className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1 px-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                >
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                </select>
                <select 
                  value={state.typography.body.style}
                  onChange={(e) => updateState({ typography: { ...state.typography, body: { ...state.typography.body, style: e.target.value } } })}
                  className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1 px-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                </select>
                <select 
                  value={state.typography.body.transform}
                  onChange={(e) => updateState({ typography: { ...state.typography, body: { ...state.typography.body, transform: e.target.value } } })}
                  className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1 px-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                >
                  <option value="none">None</option>
                  <option value="uppercase">Upper</option>
                  <option value="lowercase">Lower</option>
                  <option value="capitalize">Cap</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Section Overrides */}
        <section className="border-b border-[#E5E1D9] pb-4 mb-4">
          <button 
            onClick={() => setIsOverridesOpen(!isOverridesOpen)}
            className="w-full flex items-center justify-between text-left group border-b border-[#E5E1D9] pb-1.5 mb-2.5"
          >
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A18] group-hover:text-[#5A5A40] transition-colors">UI Component Overrides</h2>
            {isOverridesOpen ? <ChevronDown size={14} className="text-[#8C8984]" /> : <ChevronRight size={14} className="text-[#8C8984]" />}
          </button>
          
          {isOverridesOpen && (
            <div className="pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-[#5A5A40]">CTA / Buttons</h3>
              <div className="space-y-3 mb-5">
                <label className="block">
                  <span className="text-[9px] font-bold uppercase text-[#8C8984] mb-0.5 block">Button Shape Style</span>
                  <div className="relative">
                    <select 
                      value={state.buttonStyle || 'default'}
                      onChange={(e) => updateState({ buttonStyle: e.target.value as any })}
                      className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1 px-1.5 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                    >
                      <option value="default">Default</option>
                      <option value="pill">Pill</option>
                      <option value="outline">Outline</option>
                    </select>
                  </div>
                </label>
                
                <div className="grid grid-cols-2 gap-2">
                  {(['buttonBgOverride', 'buttonTextOverride'] as const).map(role => {
                    const selectedColor = state.colors.find(c => c.id === state.roleColors[role]);
                    const roleDisplayMap = {
                      buttonBgOverride: 'Background Color',
                      buttonTextOverride: 'Foreground Text',
                    };
                    return (
                      <label key={role} className="block">
                        <span className="text-[9px] font-bold uppercase text-[#8C8984] mb-0.5 block">
                          {roleDisplayMap[role]}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-6 h-6 rounded-md border border-[rgba(0,0,0,0.05)] flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: selectedColor?.hex || 'transparent' }}
                          />
                          <select
                            value={state.roleColors[role] || ''}
                            onChange={(e) => updateState({ roleColors: { ...state.roleColors, [role]: e.target.value } })}
                            className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1 px-1.5 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                          >
                            <option value="">(Inherit Global)</option>
                            {state.colors.map(c => {
                              const titleCaseName = c.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                              return (
                                <option key={c.id} value={c.id}>{titleCaseName}</option>
                              );
                            })}
                          </select>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-[#5A5A40]">Hero Section</h3>
              <div className="grid grid-cols-2 gap-2">
                {(['heroBg', 'heroHeading', 'heroSubheading', 'heroText', 'heroCta'] as const).map(role => {
                  const selectedColor = state.colors.find(c => c.id === state.roleColors[role]);
                  
                  const roleDisplayMap = {
                    heroBg: 'Background',
                    heroHeading: 'Main Heading',
                    heroSubheading: 'Sub-heading',
                    heroText: 'Paragraph',
                    heroCta: 'CTA Button'
                  };

                  return (
                    <label key={role} className="block">
                      <span className="text-[9px] font-bold uppercase text-[#8C8984] mb-0.5 block">
                        {roleDisplayMap[role]}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-6 h-6 rounded-md border border-[rgba(0,0,0,0.05)] flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: selectedColor?.hex || 'transparent' }}
                        />
                        <select
                          value={state.roleColors[role] || ''}
                          onChange={(e) => updateState({ roleColors: { ...state.roleColors, [role]: e.target.value } })}
                          className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1 px-1.5 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
                        >
                          <option value="">(Inherit Global)</option>
                          {state.colors.map(c => {
                            const titleCaseName = c.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                            return (
                              <option key={c.id} value={c.id}>{titleCaseName}</option>
                            );
                          })}
                        </select>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="pt-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-[#5A5A40]">Card 1 (Discovery)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['mainGrid1Bg', 'mainGrid1Heading', 'mainGrid1Text', 'mainGrid1IconBg'] as const).map(role => {
                    const selectedColor = state.colors.find(c => c.id === state.roleColors[role]);
                    const roleDisplayMap = { mainGrid1Bg: 'Background', mainGrid1Heading: 'Heading', mainGrid1Text: 'Paragraph', mainGrid1IconBg: 'Icon Background' };
                    return (
                      <label key={role} className="block">
                        <span className="text-[9px] font-bold uppercase text-[#8C8984] mb-0.5 block">{roleDisplayMap[role]}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-md border border-[rgba(0,0,0,0.05)] flex-shrink-0 shadow-sm" style={{ backgroundColor: selectedColor?.hex || 'transparent' }} />
                          <select value={state.roleColors[role] || ''} onChange={(e) => updateState({ roleColors: { ...state.roleColors, [role]: e.target.value } })} className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1 px-1.5 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-[#5A5A40]">
                            <option value="">(Inherit Global)</option>
                            {state.colors.map(c => <option key={c.id} value={c.id}>{c.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}</option>)}
                          </select>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-[#5A5A40]">Card 2 (Strategy)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['mainGrid2Bg', 'mainGrid2Heading', 'mainGrid2Text', 'mainGrid2IconBg'] as const).map(role => {
                    const selectedColor = state.colors.find(c => c.id === state.roleColors[role]);
                    const roleDisplayMap = { mainGrid2Bg: 'Background', mainGrid2Heading: 'Heading', mainGrid2Text: 'Paragraph', mainGrid2IconBg: 'Icon Background' };
                    return (
                      <label key={role} className="block">
                        <span className="text-[9px] font-bold uppercase text-[#8C8984] mb-0.5 block">{roleDisplayMap[role]}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-md border border-[rgba(0,0,0,0.05)] flex-shrink-0 shadow-sm" style={{ backgroundColor: selectedColor?.hex || 'transparent' }} />
                          <select value={state.roleColors[role] || ''} onChange={(e) => updateState({ roleColors: { ...state.roleColors, [role]: e.target.value } })} className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1 px-1.5 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-[#5A5A40]">
                            <option value="">(Inherit Global)</option>
                            {state.colors.map(c => <option key={c.id} value={c.id}>{c.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}</option>)}
                          </select>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-[#5A5A40]">Card 3 (Execution)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['mainGrid3Bg', 'mainGrid3Heading', 'mainGrid3Text', 'mainGrid3IconBg'] as const).map(role => {
                    const selectedColor = state.colors.find(c => c.id === state.roleColors[role]);
                    const roleDisplayMap = { mainGrid3Bg: 'Background', mainGrid3Heading: 'Heading', mainGrid3Text: 'Paragraph', mainGrid3IconBg: 'Icon Background' };
                    return (
                      <label key={role} className="block">
                        <span className="text-[9px] font-bold uppercase text-[#8C8984] mb-0.5 block">{roleDisplayMap[role]}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-md border border-[rgba(0,0,0,0.05)] flex-shrink-0 shadow-sm" style={{ backgroundColor: selectedColor?.hex || 'transparent' }} />
                          <select value={state.roleColors[role] || ''} onChange={(e) => updateState({ roleColors: { ...state.roleColors, [role]: e.target.value } })} className="w-full appearance-none bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-1 px-1.5 text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-[#5A5A40]">
                            <option value="">(Inherit Global)</option>
                            {state.colors.map(c => <option key={c.id} value={c.id}>{c.name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())}</option>)}
                          </select>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Design Feel Section */}
        <section className="border-b border-[#E5E1D9] pb-4 mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider mb-2.5 text-[#1A1A18]">Design Feel Tags</h2>
          <TagInput 
            tags={state.designFeel} 
            onChange={(tags) => updateState({ designFeel: tags })} 
            placeholder="Add feel (brutalist, airy)..."
          />
        </section>

        {/* Summary Section */}
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-wider mb-2.5 text-[#1A1A18]">Design Intent</h2>
          <textarea
            value={state.summary}
            onChange={(e) => updateState({ summary: e.target.value })}
            placeholder="Describe the tone or context..."
            className="w-full bg-[#F7F5F2] border border-[#E5E1D9] rounded-md py-2 px-2.5 text-[11px] h-20 resize-none focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
          />
        </section>

      </div>
    </div>
  );
}
