/*
LEEWAY HEADER — DO NOT REMOVE

DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

REGION: PRODUCT.BEAST.VIEW
TAG: UI.BEAST.VIEW.SETTINGS

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=layout

5WH:
WHAT = BEAST AI Component: Settings.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/Settings.tsx
WHEN = 2026-04-21
HOW = Autonomous Agent Engineering

AGENTS:
VECTOR
ARIA
WARD
GOVERNOR

LICENSE:
MIT
*/

import React, { useState } from 'react';
import { Card, Button } from '../components/UI';
import { User, Bell, Download, Trash2, ShieldCheck, Accessibility, Github, Cpu, MessageSquare } from 'lucide-react';
import { useApp } from '../AppContext';

export const SettingsView: React.FC = () => {
    const { progress, updateCredentials, updatePreferences } = useApp();
    const [creds, setCreds] = useState({
        github: progress.credentials?.githubUsername || '',
        hf: progress.credentials?.hfUsername || '',
        discord: progress.credentials?.discordUsername || ''
    });

    const handleSave = () => {
        updateCredentials({
            githubUsername: creds.github,
            hfUsername: creds.hf,
            discordUsername: creds.discord
        });
        alert("ARMORY_UPDATE: Credentials synchronized.");
    };

    return (
        <div className="space-y-6">
            <section>
                <h1 className="text-3xl font-black italic tracking-tighter uppercase">CONTROL CENTER.</h1>
                <p className="text-neutral-500 font-medium italic">Adjust your environment for peak focus.</p>
            </section>

            <div className="space-y-6">
                <section className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Developer Armory (Credentials)</h4>
                    <Card className="p-4 border-2 border-black bg-white space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neutral-100 border border-black flex items-center justify-center shrink-0">
                                    <Github size={20} />
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="text" 
                                        value={creds.github}
                                        onChange={(e) => setCreds(prev => ({ ...prev, github: e.target.value }))}
                                        placeholder="GitHub Username"
                                        className="w-full bg-transparent p-1 text-xs font-black uppercase tracking-tight focus:outline-none border-b border-neutral-200"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neutral-100 border border-black flex items-center justify-center shrink-0">
                                    <Cpu size={20} />
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="text" 
                                        value={creds.hf}
                                        onChange={(e) => setCreds(prev => ({ ...prev, hf: e.target.value }))}
                                        placeholder="HuggingFace ID"
                                        className="w-full bg-transparent p-1 text-xs font-black uppercase tracking-tight focus:outline-none border-b border-neutral-200"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neutral-100 border border-black flex items-center justify-center shrink-0">
                                    <MessageSquare size={20} />
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="text" 
                                        value={creds.discord}
                                        onChange={(e) => setCreds(prev => ({ ...prev, discord: e.target.value }))}
                                        placeholder="Discord Handle"
                                        className="w-full bg-transparent p-1 text-xs font-black uppercase tracking-tight focus:outline-none border-b border-neutral-200"
                                    />
                                </div>
                            </div>
                        </div>
                        <Button className="w-full bg-black text-white hover:bg-emerald-500 hover:text-black transition-colors" onClick={handleSave}>
                            SYNC CREDENTIALS
                        </Button>
                    </Card>
                </section>
                <section className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Preferences</h4>
                    <div className="space-y-2">
                        <SettingRow 
                            icon={Bell} 
                            title="System Notifications" 
                            toggle 
                        />
                        <SettingRow 
                            icon={Accessibility} 
                            title="Performance Mode (Lite)" 
                            toggle 
                            active={progress.preferences.performanceMode}
                            onClick={() => updatePreferences({ performanceMode: !progress.preferences.performanceMode })}
                            description="Disables heavy animations and tactical overlays for low-end devices."
                        />
                        <SettingRow icon={ShieldCheck} title="Privacy Lockdown" active />
                    </div>
                </section>

                <section className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">App Utilities</h4>
                    <div className="space-y-2">
                        <Card brutal className="p-4 flex items-center justify-between group cursor-pointer hover:bg-emerald-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <Download size={20} />
                                <span className="font-black text-xs uppercase tracking-tight">Install PWA (Offline)</span>
                            </div>
                            <Button size="sm" variant="primary">INSTALL</Button>
                        </Card>
                        <SettingRow icon={Trash2} title="Clear Learning Data" danger />
                    </div>
                </section>
            </div>
            
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-neutral-300 py-8">
                BEAST AI BUILD 1.0.4 (BETA)
            </p>
        </div>
    );
};

const SettingRow: React.FC<{ icon: any; title: string, toggle?: boolean, active?: boolean, danger?: boolean, onClick?: () => void, description?: string }> = ({ icon: Icon, title, toggle, active, danger, onClick, description }) => (
    <Card 
        className={`p-4 flex items-center justify-between border-2 border-black hover:bg-neutral-50 cursor-pointer ${danger ? 'text-red-600' : ''}`}
        onClick={onClick}
    >
        <div className="flex items-center gap-3">
            <Icon size={20} />
            <div className="flex flex-col">
                <span className="font-black text-xs uppercase tracking-tight">{title}</span>
                {description && <span className="text-[8px] font-medium text-neutral-500 uppercase tracking-wide">{description}</span>}
            </div>
        </div>
        {toggle && (
            <div className={`w-10 h-5 border-2 border-black relative transition-colors ${active ? 'bg-emerald-500' : 'bg-neutral-200'}`}>
                <div className={`absolute top-0 bottom-0 w-4 bg-black transition-all ${active ? 'right-0' : 'left-0'}`} />
            </div>
        )}
        {!toggle && active && <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5">ENABLED</span>}
    </Card>
);
