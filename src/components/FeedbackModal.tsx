/*
LEEWAY HEADER — DO NOT REMOVE

REGION: PRODUCT.BEAST.COMPONENT
TAG: UI.BEAST.COMPONENT.FEEDBACKMODAL

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=component

5WH:
WHAT = BEAST AI Component: FeedbackModal.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/components/FeedbackModal.tsx
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
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button } from './UI';
import { MessageSquare, Star, X, Loader2, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useApp } from '../AppContext';
import { workshopResponse } from '../services/ai';

export const FeedbackModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const { addFeedback } = useApp();

    const handleSubmit = async () => {
        if (!rating || !comment) return;
        setLoading(true);
        
        try {
            const prompt = `Student feedback: "${comment}" (Rating: ${rating}/5). 
            Provide a short, tactical, and encouraging response as the BEAST Academy Command. 
            If the feedback is bad, address it professionally and promise improvement. 
            Keep it under 3 sentences. Stay in the BEAST Academy persona.`;
            
            const aiRes = await workshopResponse(prompt, "BEAST Command AI");
            setResponse(aiRes || "Uplink confirmed. Feedback logged. Keep training, Recruit.");
            addFeedback(rating, comment, aiRes || "");
        } catch (e) {
            setResponse("Tactical error in response generation. But your feedback is SEALED and LOGGED.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-sm"
            >
                <Card brutal className="bg-white p-6 space-y-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-black">
                        <X size={20} />
                    </button>

                    <div className="space-y-1">
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                            <MessageSquare size={24} className="text-emerald-500" />
                            COMMAND FEEDBACK
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Direct Uplink to BEAST Architects</p>
                    </div>

                    {!response ? (
                        <div className="space-y-6">
                            <div className="space-y-2 text-center">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-500">How is your mission going?</label>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button 
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`p-2 border-2 border-black transition-all ${rating >= star ? 'bg-yellow-400 scale-110' : 'bg-white'}`}
                                        >
                                            <Star size={20} className={rating >= star ? 'fill-black' : 'text-neutral-300'} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Detailed Intel (Good or Bad)</label>
                                <textarea 
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Report your status... Are the tools working? Is the theory sound?"
                                    className="w-full h-24 p-4 border-2 border-black bg-neutral-50 font-bold text-sm focus:outline-none focus:bg-white resize-none"
                                />
                            </div>

                            <Button 
                                className="w-full py-4 justify-center gap-2"
                                disabled={!rating || !comment || loading}
                                onClick={handleSubmit}
                            >
                                {loading ? <Loader2 size={20} className="animate-spin" /> : (
                                    <>
                                        <span className="font-black tracking-widest">SUBMIT UPLINK</span>
                                        <Send size={18} />
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 text-center"
                        >
                            <div className="p-4 bg-emerald-50 border-2 border-emerald-500 italic font-bold text-sm leading-relaxed text-emerald-900">
                                "{response}"
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Intel Acknowledged. +5 XP Earned.</p>
                            <Button variant="primary" className="w-full" onClick={onClose}>
                                RETURN TO MISSION
                            </Button>
                        </motion.div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};
