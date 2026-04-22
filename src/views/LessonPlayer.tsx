/*
LEEWAY HEADER — DO NOT REMOVE

REGION: PRODUCT.BEAST.VIEW
TAG: UI.BEAST.VIEW.LESSONPLAYER

COLOR_ONION_HEX:
NEON=#39FF14
FLUO=#0DFF94
PASTEL=#E8F5E9

ICON_ASCII:
family=lucide
glyph=layout

5WH:
WHAT = BEAST AI Component: LessonPlayer.tsx
WHY = Part of the BEAST AI Leeway Standards alignment
WHO = Leeway Innovations (By Leonard Jerome Lee)
WHERE = src/views/LessonPlayer.tsx
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

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Button, ProgressBar } from '../components/UI';
import { X, ArrowRight, Zap, CheckCircle2, Bot, Printer, Volume2, VolumeX, Terminal, Loader2, LayoutGrid, ListOrdered, Copy, Check, ExternalLink, PlayCircle, GraduationCap } from 'lucide-react';
import { Lesson, StepType } from '../types';
import { useApp } from '../AppContext';
import { workshopResponse, generateSpeech } from '../services/ai';

export const LessonPlayerView: React.FC<{
  lesson: Lesson;
  onFinish: () => void;
  onBack: () => void;
}> = ({ lesson, onFinish, onBack }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [interactionAnswer, setInteractionAnswer] = useState<number | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [narrationEnabled, setNarrationEnabled] = useState(true);
  const [puzzleAnswer, setPuzzleAnswer] = useState<string[]>([]);
  const { completeLesson, progress } = useApp();
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentStep = lesson.steps[currentStepIndex];
  const progressPercent = ((currentStepIndex + 1) / lesson.steps.length) * 100;

  const speakStep = async (text: string) => {
    if (!narrationEnabled) return;
    
    // Stop any existing playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    setIsSynthesizing(true);
    const base64Audio = await generateSpeech(text);
    
    if (base64Audio) {
      const audioUrl = `data:audio/wav;base64,${base64Audio}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsSynthesizing(false);
      audio.onerror = () => setIsSynthesizing(false);
      await audio.play();
    } else {
        setIsSynthesizing(false);
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
  };

  // TTS Narrator
  useEffect(() => {
    if (narrationEnabled && currentStep) {
      const textToSpeak = currentStep.narration || `${currentStep.title}. ${currentStep.content}`;
      speakStep(textToSpeak);
    }
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        window.speechSynthesis.cancel();
    }
  }, [currentStepIndex, narrationEnabled]);

  const handleAnswerSelect = (idx: number) => {
    setInteractionAnswer(idx);
    
    // Proctoring logic: Agent Lee provides immediate feedback
    const isCorrect = currentStep.interaction?.correctIndex === idx;
    const proctorMsg = isCorrect 
        ? "LEE_PRIME: Excellent architectural choice. Transitioning to verification."
        : "LEE_PRIME: Integrity error detected in your logic. Review the munitions blueprint.";
    
    // We could emit this to EventBus or use it locally
    console.log(proctorMsg);
  };

  const handleNext = () => {
    if (currentStepIndex < lesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setInteractionAnswer(null);
      setPuzzleAnswer([]);
    } else {
      completeLesson(lesson.id, 10);
      onFinish();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!currentStep) return null;

  return (
    <div className="min-h-screen bg-white fixed inset-0 z-[100] flex flex-col print:relative print:min-h-auto">
      {/* Player Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-black print:hidden">
        <button onClick={onBack} className="p-2 hover:bg-neutral-100 transition-colors">
          <X size={24} />
        </button>
        <div className="flex-1 px-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">{lesson.title}</p>
          <ProgressBar progress={progressPercent} />
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setNarrationEnabled(!narrationEnabled)} className="p-2 text-black">
                {narrationEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button onClick={handlePrint} className="p-2 text-black">
                <Printer size={20} />
            </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 flex flex-col items-center p-6 bg-neutral-50 overflow-y-auto print:bg-white print:p-0">
        <div className="w-full max-w-sm space-y-8 flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
            <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
            >
                <div className="mb-6 flex justify-center">
                    <ProctorFeedback step={currentStep} answer={interactionAnswer} />
                </div>
                <StepRenderer 
                    step={currentStep} 
                    onAnswerSelect={handleAnswerSelect}
                    answer={interactionAnswer}
                    reflection={reflectionText}
                    onReflectionChange={setReflectionText}
                    puzzleAnswer={puzzleAnswer}
                    onPuzzleChange={setPuzzleAnswer}
                />
            </motion.div>
            </AnimatePresence>
        </div>

        {/* Printable Section (Hidden in Screen) */}
        <div className="hidden print:block w-full text-black space-y-6">
            <h1 className="text-4xl font-black">{lesson.title}</h1>
            <div className="h-1 bg-black w-32" />
            {lesson.steps.map((s, i) => (
                <div key={i} className="space-y-2 border-b border-neutral-200 pb-4">
                    <h3 className="font-bold text-xl uppercase tracking-tighter">{s.title}</h3>
                    <p className="text-neutral-700 leading-relaxed">{s.content}</p>
                </div>
            ))}
        </div>
      </main>

      {/* Footer CTA */}
      <footer className="p-6 border-t-2 border-black bg-white print:hidden">
        <Button 
          variant={currentStep.type === 'reward' ? 'secondary' : 'primary'}
          className="w-full justify-between py-5"
          onClick={handleNext}
          disabled={
            (currentStep.type === 'interaction' && currentStep.interaction?.type === 'multiple-choice' && interactionAnswer === null)
          }
        >
          <span className="font-black tracking-widest">{currentStepIndex === lesson.steps.length - 1 ? 'COMPLETE MISSION' : 'LINK NEXT LAYER'}</span>
          <ArrowRight size={20} />
        </Button>
      </footer>
    </div>
  );
};

const CodeBlock: React.FC<{ snippet: { language: string, code: string, description: string } }> = ({ snippet }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(snippet.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-2 mt-4 text-left">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-neutral-400">
                <span>Munitions Repository ({snippet.language})</span>
                <button onClick={handleCopy} className="flex items-center gap-1 hover:text-emerald-500 transition-colors">
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'COPIED' : 'COPY CODE'}
                </button>
            </div>
            <div className="p-4 bg-neutral-900 text-neutral-100 font-mono text-[11px] border-2 border-black overflow-x-auto relative group">
                <div className="absolute top-0 right-0 p-1 opacity-20 text-[8px] pointer-events-none uppercase">REUSABLE_ASSET</div>
                <pre>{snippet.code}</pre>
            </div>
            <p className="text-[10px] italic font-bold text-neutral-500 leading-tight">
                * {snippet.description}
            </p>
        </div>
    );
};

const VideoStep: React.FC<{ step: any }> = ({ step }) => {
    return (
        <div className="space-y-6">
            <header className="space-y-2">
                <div className="flex items-center gap-2 text-red-500">
                    <PlayCircle size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">PRO TRAINING: UPLINK</span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight">{step.title}</h2>
            </header>
            
            <div className="aspect-video w-full border-4 border-black bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${step.videoUrl}`} 
                    title="Professional Training" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                />
            </div>

            <Card className="p-4 bg-white border-2 border-black italic font-bold text-sm text-neutral-600">
                "{step.content}"
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 not-italic">
                    Training provided by verified partners via YouTube
                </p>
            </Card>
        </div>
    );
};

const ExternalLinkStep: React.FC<{ step: any }> = ({ step }) => {
    const isCert = step.type === 'cert';
    const Icon = isCert ? GraduationCap : ExternalLink;

    return (
        <div className="space-y-8 text-center">
            <div className={`mx-auto w-20 h-20 flex items-center justify-center border-4 border-black ${isCert ? 'bg-emerald-500 rotate-3' : 'bg-blue-400 -rotate-3'} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
                <Icon size={40} className="text-white" />
            </div>
            
            <div className="space-y-4">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">{step.title}</h2>
                <p className="text-neutral-600 font-bold leading-relaxed px-4">{step.content}</p>
            </div>

            <Button 
                variant="primary" 
                className="w-full max-w-xs mx-auto py-5 justify-center gap-3"
                onClick={() => window.open(step.externalUrl, '_blank')}
            >
                <span className="font-black tracking-widest">{isCert ? 'CLAIM CREDENTIALS' : 'OPEN OFFICIAL LAB'}</span>
                <ExternalLink size={20} />
            </Button>

            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 italic">
                This will open the official {isCert ? 'certification' : 'lab'} site in a new tab.
            </p>
        </div>
    );
};

const ProctorFeedback: React.FC<{ step: any; answer: number | null }> = ({ step, answer }) => {
  if (answer === null) return null;
  
  const isCorrect = step.interaction?.correctIndex === answer;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-3 border-2 border-black flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}
    >
      <Bot size={20} className={isCorrect ? 'animate-bounce' : 'animate-shake'} />
      <div className="flex-1">
        <p className="text-[8px] font-black uppercase tracking-widest leading-tight">Proctor Directive</p>
        <p className="text-[10px] font-bold italic">
          {isCorrect 
            ? "LEE_PRIME: Excellent architectural choice. Transitioning to verification."
            : "LEE_PRIME: Integrity error detected in your logic. Review the munitions blueprint."}
        </p>
      </div>
    </motion.div>
  );
};

const StepRenderer: React.FC<{ 
  step: any; 
  onAnswerSelect: (idx: number) => void;
  answer: number | null;
  reflection: string;
  onReflectionChange: (val: string) => void;
  puzzleAnswer: string[];
  onPuzzleChange: (val: string[]) => void;
}> = ({ step, onAnswerSelect, answer, reflection, onReflectionChange, puzzleAnswer, onPuzzleChange }) => {
  switch (step.type) {
    case 'video':
        return <VideoStep step={step} />;
    case 'cert':
        return <ExternalLinkStep step={step} />;
    case 'puzzle':
        return <PuzzleStep step={step} puzzleAnswer={puzzleAnswer} onPuzzleChange={onPuzzleChange} />;
    case 'sorting':
        return <SortingStep step={step} puzzleAnswer={puzzleAnswer} onPuzzleChange={onPuzzleChange} />;
    case 'hook':
      return (
        <div className="space-y-6 text-center">
          <div className="inline-block p-3 bg-yellow-400 border-2 border-black mb-2 animate-bounce">
            <Zap size={40} className="fill-black" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{step.title}</h2>
          <p className="text-xl font-bold text-neutral-800 leading-relaxed italic">"{step.content}"</p>
          {step.codeSnippet && <CodeBlock snippet={step.codeSnippet} />}
        </div>
      );
    case 'teach':
      return (
        <Card brutal className="p-0 overflow-hidden bg-white">
          {step.image && (
            <img src={step.image} className="w-full aspect-video object-cover border-b-4 border-black" referrerPolicy="no-referrer" />
          )}
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase tracking-tighter">{step.title}</h2>
                <div className="px-2 py-0.5 bg-black text-white text-[10px] font-black uppercase">CORE THEORY</div>
            </div>
            <p className="text-neutral-700 font-bold leading-relaxed">{step.content}</p>
            {step.codeSnippet && <CodeBlock snippet={step.codeSnippet} />}
          </div>
        </Card>
      );
    case 'workshop':
    case 'interaction':
      if (step.interaction?.type === 'workshop') {
          return <WorkshopStep step={step} />;
      }
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Target size={20} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">PRACTICAL TEST</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">{step.title}</h2>
          </div>
          <p className="text-lg font-bold italic leading-snug">"{step.content}"</p>
          
          {step.interaction?.type === 'multiple-choice' && (
            <div className="space-y-3">
              {step.interaction.options.map((opt: string, idx: number) => {
                const isSelected = answer === idx;
                const isCorrect = step.interaction.correctIndex === idx;
                const showFeedback = answer !== null;
                
                return (
                  <button
                    key={idx}
                    onClick={() => onAnswerSelect(idx)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 border-2 border-black font-bold flex justify-between items-center transition-all ${
                      showFeedback
                        ? isCorrect
                          ? 'bg-emerald-500 text-white'
                          : isSelected ? 'bg-red-500 text-white shadow-none' : 'bg-white opacity-40 shadow-none'
                        : isSelected ? 'translate-x-1 translate-y-1 bg-yellow-400 shadow-none' : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-[1.01]'
                    }`}
                  >
                    <span>{opt}</span>
                    {showFeedback && isCorrect && <CheckCircle2 size={20} />}
                  </button>
                );
              })}
            </div>
          )}

          {step.interaction?.type === 'reflection' && (
            <textarea
              className="w-full h-40 p-4 border-4 border-black bg-white font-bold focus:outline-none focus:bg-emerald-50 focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all resize-none"
              placeholder="Start drafting your agent architecture..."
              value={reflection}
              onChange={(e) => onReflectionChange(e.target.value)}
            />
          )}
        </div>
      );
    case 'reward':
      return (
        <div className="space-y-8 text-center">
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center -z-10"
            >
              <Zap size={250} className="text-emerald-500/10" />
            </motion.div>
            <div className="w-32 h-32 mx-auto bg-black border-4 border-emerald-500 flex items-center justify-center rotate-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <Zap size={64} className="fill-emerald-500 text-emerald-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic text-emerald-500">{step.title}</h2>
            <p className="text-black font-black uppercase tracking-widest text-xs">+25 XP EARNED • BATTLE HARDENED</p>
          </div>
          <p className="text-neutral-500 font-bold max-w-[250px] mx-auto italic">"{step.content}"</p>
        </div>
      );
    default:
      return null;
  }
};

const WorkshopStep: React.FC<{ step: any }> = ({ step }) => {
    const [input, setInput] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRunPrompt = async () => {
        if (!input) return;
        setLoading(true);
        try {
            const res = await workshopResponse(input, step.interaction.question || "A helpful AI Agent");
            setResponse(res || "");
        } catch (e) {
            setResponse("ERROR: CONNECTION TIMEOUT.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Terminal size={20} className="text-emerald-500" />
                    <h2 className="text-2xl font-black uppercase tracking-tighter">AGENT WORKSHOP</h2>
                </div>
            </div>

            <Card className="p-4 bg-neutral-900 text-emerald-500 font-mono text-[10px] space-y-2 border-2 border-black">
                <p>&gt; Initializing local environment...</p>
                <p>&gt; Uplink state: ACTIVE</p>
                <p>&gt; Waiting for manual prompt injection</p>
            </Card>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Input Stream</label>
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Configure your agent..."
                        className="w-full h-32 p-4 border-2 border-black bg-white font-bold text-sm focus:outline-none focus:bg-emerald-50 resize-none"
                    />
                </div>
                
                <Button className="w-full" size="sm" onClick={handleRunPrompt} disabled={loading}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : "EXECUTE PROMPT"}
                </Button>
            </div>

            <AnimatePresence>
                {response && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Agent Output</label>
                            <Card className="p-4 bg-emerald-50 border-2 border-emerald-500 text-xs font-bold leading-relaxed">
                                {response}
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SortingStep: React.FC<{ step: any; puzzleAnswer: string[]; onPuzzleChange: (val: string[]) => void }> = ({ step, puzzleAnswer, onPuzzleChange }) => {
    const items = step.interaction?.items || [];
    const isCorrect = JSON.stringify(puzzleAnswer) === JSON.stringify(step.interaction?.correctItems);

    const toggleItem = (item: string) => {
        if (puzzleAnswer.includes(item)) {
            onPuzzleChange(puzzleAnswer.filter(i => i !== item));
        } else {
            onPuzzleChange([...puzzleAnswer, item]);
        }
    };

    return (
        <div className="space-y-6">
            <header className="space-y-2">
                <div className="flex items-center gap-2">
                    <ListOrdered size={20} className="text-yellow-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Sequence Lab</span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight">{step.title}</h2>
            </header>
            <p className="font-bold text-sm text-neutral-600 italic">Select items in the correct architectural order:</p>
            
            <div className="grid grid-cols-1 gap-2">
                {items.map((item: string) => (
                    <button
                        key={item}
                        onClick={() => toggleItem(item)}
                        className={`p-4 border-2 border-black font-black text-xs text-left transition-all flex justify-between items-center ${
                            puzzleAnswer.includes(item) 
                                ? 'bg-yellow-400 translate-x-1 translate-y-1 shadow-none' 
                                : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        }`}
                    >
                        {item}
                        {puzzleAnswer.includes(item) && <span className="bg-black text-white px-1.5 py-0.5 text-[8px]">{puzzleAnswer.indexOf(item) + 1}</span>}
                    </button>
                ))}
            </div>

            {puzzleAnswer.length === items.length && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 font-black text-xs border-2 border-black ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {isCorrect ? "SYSTEM STABLE: Sequence Verified." : "SYSTEM ERROR: Invalid architectural sequence."}
                </motion.div>
            )}
        </div>
    );
};

const PuzzleStep: React.FC<{ step: any; puzzleAnswer: string[]; onPuzzleChange: (val: string[]) => void }> = ({ step, puzzleAnswer, onPuzzleChange }) => {
    // Simple drag/reorder simulation using clicks
    const items = step.interaction?.items || [];
    const isCorrect = JSON.stringify(puzzleAnswer) === JSON.stringify(step.interaction?.correctItems);

    const handleReset = () => onPuzzleChange([]);
    const handleAdd = (item: string) => {
        if (!puzzleAnswer.includes(item)) {
            onPuzzleChange([...puzzleAnswer, item]);
        }
    };

    return (
        <div className="space-y-6">
            <header className="space-y-2">
                <div className="flex items-center gap-2">
                    <LayoutGrid size={20} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Logic Puzzle</span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight">{step.title}</h2>
            </header>

            <div className="space-y-4">
                <div className="min-h-[100px] p-4 border-4 border-dashed border-neutral-300 bg-neutral-100 flex flex-wrap gap-2 items-center justify-center relative">
                    {puzzleAnswer.length === 0 && <span className="text-[10px] font-black text-neutral-400 opacity-50">CONSTRUCT HERE</span>}
                    {puzzleAnswer.map((item, idx) => (
                        <Card key={idx} className="p-3 border-2 border-black bg-white font-black text-xs shadow-none animate-in zoom-in-90">
                            {item}
                        </Card>
                    ))}
                    {puzzleAnswer.length > 0 && (
                        <button onClick={handleReset} className="absolute -top-3 -right-3 p-1 bg-black text-white border-2 border-black">
                            <X size={12} />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {items.map((item: string) => (
                        <button
                            key={item}
                            disabled={puzzleAnswer.includes(item)}
                            onClick={() => handleAdd(item)}
                            className={`p-3 border-2 border-black font-black text-[10px] uppercase tracking-tight transition-all ${
                                puzzleAnswer.includes(item) 
                                    ? 'bg-neutral-200 opacity-30 shadow-none grayscale' 
                                    : 'bg-blue-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-300'
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {puzzleAnswer.length === items.length && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 font-black text-xs border-2 border-black ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {isCorrect ? "MISSION SUCCESS: Agent logic compiled." : "BOOT FAILURE: Re-evaluate the logic flow."}
                </motion.div>
            )}
        </div>
    );
};

const Target = ({ size, className }: { size: number, className?: string }) => <Zap size={size} className={className} />;
