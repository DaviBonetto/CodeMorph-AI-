import React, { useState, useRef, useCallback, useEffect } from 'react';
// FIX: Import SummaryStat to correctly type stats from AI analysis.
import { Analysis, SampleCode, TransformationOption, SummaryStat } from '../types';
import { TRANSFORMATION_OPTIONS, SAMPLES } from '../constants';
import { transformCode, generateAnalysis } from '../services/geminiService';
import { CodeMorphFullLogo, Upload, Download, Copy, Check, Play, X } from './icons/LucideIcons';
import { TextShimmer } from './TextShimmer';
import CodeEditor from './CodeEditor';

// Because we can't add dependencies, this is a very basic language detection.
const detectLanguage = (code: string): string => {
  if (/\b(def|import|class|if __name__|print)\b/.test(code)) return 'python';
  if (/\b(package|func|import|defer)\b/.test(code)) return 'go';
  if (/\b(public|private|class|static void main)\b/.test(code)) return 'java';
  if (/\b(interface|type|namespace|enum)/.test(code)) return 'typescript';
  // Default to javascript
  return 'javascript';
};

// FIX: Add explicit props type for better type safety.
interface TransformationOptionsProps {
    selected: string[];
    onSelect: (id: string) => void;
    disabled: boolean;
}

const TransformationOptions: React.FC<TransformationOptionsProps> = ({ selected, onSelect, disabled }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {TRANSFORMATION_OPTIONS.map(opt => (
            <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                disabled={disabled}
                className={`relative p-4 text-center rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${selected.includes(opt.id) ? 'bg-primary/20 border-primary' : 'bg-background-card border-border hover:border-secondary'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {opt.badge && <span className="absolute -top-2.5 right-2 text-xs bg-accent text-white px-2 py-0.5 rounded-full">{opt.badge}</span>}
                <div className="text-primary">{opt.icon}</div>
                <div className="font-semibold text-sm text-text-primary">{opt.name}</div>
                <p className="text-xs text-text-secondary">{opt.subtitle}</p>
            </button>
        ))}
    </div>
);

// Fix: Add explicit props type to correctly type `analysis` prop and fix property access errors.
interface AnalysisPanelProps {
    analysis: Analysis | null;
    isLoading: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, isLoading }) => {
    if (isLoading) {
        return (
             <div className="w-full bg-background-card border border-border rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="h-16 bg-slate-700 rounded-lg"></div>
                    <div className="h-16 bg-slate-700 rounded-lg"></div>
                    <div className="h-16 bg-slate-700 rounded-lg"></div>
                    <div className="h-16 bg-slate-700 rounded-lg"></div>
                </div>
                 <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                 <div className="h-4 bg-slate-700 rounded w-5/6"></div>
             </div>
        )
    }

    if (!analysis) return null;

    const stats = Object.values(analysis.summaryStats);

    return (
        <div className="w-full bg-background-card/50 border border-border rounded-xl p-6 backdrop-blur-sm border-l-4 border-primary">
            <h3 className="text-2xl font-bold mb-4">AI Analysis & Insights</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* FIX: Explicitly type `stat` as `SummaryStat` to resolve property access errors. */}
                {stats.map((stat: SummaryStat) => (
                    <div key={stat.description} className="bg-slate-900/50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-accent">{stat.value}</div>
                        <div className="text-sm text-text-secondary">{stat.description}</div>
                    </div>
                ))}
            </div>
            <div>
                <h4 className="font-semibold mb-2">Detailed Changes:</h4>
                <ul className="space-y-2 mb-4 text-sm">
                    {analysis.detailedChanges.map((change, i) => (
                        <li key={i} className="flex items-start gap-2">
                           <span>{change.icon}</span> 
                           <span className="text-text-secondary">{change.description}</span>
                        </li>
                    ))}
                </ul>
                <h4 className="font-semibold mb-2">AI Explanation:</h4>
                <p className="text-text-secondary text-sm">{analysis.explanation}</p>
            </div>
        </div>
    );
};

interface RunOutputConsoleProps {
    output: string[];
    isError: boolean;
    onClear: () => void;
}

const RunOutputConsole: React.FC<RunOutputConsoleProps> = ({ output, isError, onClear }) => {
    if (output.length === 0) return null;

    return (
        <div className="bg-background-card border border-border rounded-xl shadow-lg flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-border">
                <h3 className="text-sm font-semibold">Execution Output</h3>
                <button onClick={onClear} title="Clear Output" className="p-1.5 text-text-secondary hover:text-error rounded-md transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <pre className={`p-4 font-mono text-xs text-text-secondary overflow-y-auto max-h-40 ${isError ? 'text-error' : ''}`}>
                {output.join('\n')}
            </pre>
        </div>
    );
};


interface DemoPageProps {
  onGoHome: () => void;
}

const DemoPage: React.FC<DemoPageProps> = ({ onGoHome }) => {
    const [inputCode, setInputCode] = useState('');
    const [outputCode, setOutputCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [selectedTransformations, setSelectedTransformations] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
    
    // State for Input Code Console
    const [runInputOutput, setRunInputOutput] = useState<string[]>([]);
    const [isRunInputError, setIsRunInputError] = useState(false);
    
    // State for Output Code Console
    const [runOutputOutput, setRunOutputOutput] = useState<string[]>([]);
    const [isRunOutputError, setIsRunOutputError] = useState(false);

    useEffect(() => {
        if (inputCode) {
            const detectedLang = detectLanguage(inputCode);
            setLanguage(detectedLang);
        }
    }, [inputCode]);

    const handleSelectTransformation = (id: string) => {
        setSelectedTransformations(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleTransform = async () => {
        if (!inputCode || selectedTransformations.length === 0) {
            setError("Please provide code and select at least one transformation.");
            return;
        }
        setError(null);
        setIsLoading(true);
        setOutputCode('');
        setAnalysis(null);

        try {
            const transformed = await transformCode(inputCode, selectedTransformations, language);
            setOutputCode(transformed);
            const analysisResult = await generateAnalysis(inputCode, transformed, language);
            setAnalysis(analysisResult);
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred.");
            setOutputCode(`// Error: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setInputCode(ev.target?.result as string);
            };
            reader.readAsText(file);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([outputCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const extension = language === 'python' ? 'py' : language === 'typescript' ? 'ts' : 'js';
        a.download = `codemorph-ai-output.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const loadSample = () => {
        const sample = SAMPLES[currentSampleIndex];
        setInputCode(sample.code);
        setLanguage(sample.language);
        setCurrentSampleIndex((prev) => (prev + 1) % SAMPLES.length);
    }
    
    const createRunHandler = (
        codeToRun: string, 
        setOutput: React.Dispatch<React.SetStateAction<string[]>>,
        setIsError: React.Dispatch<React.SetStateAction<boolean>>
    ) => () => {
        if (!['javascript', 'typescript'].includes(language)) {
            setOutput([`// Execution for '${language}' is not supported in the browser.`]);
            setIsError(true);
            return;
        }

        if (!codeToRun || typeof codeToRun !== 'string' || codeToRun.trim() === '') {
            setOutput(['// Code is empty. Nothing to execute.']);
            setIsError(false);
            return;
        }

        if (/<[a-z][\s\S]*>/i.test(codeToRun)) {
            setOutput([
                "Execution Error: Cannot run code containing JSX.",
                "The 'Run Code' feature is for plain JavaScript and does not support JSX syntax (e.g., <div>, <Component />)."
            ]);
            setIsError(true);
            return;
        }
        
        const logs: string[] = [];
        const originalConsoleLog = console.log;
        
        console.log = (...args) => {
            const formattedArgs = args.map(arg => {
                if (typeof arg === 'object' && arg !== null) {
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch {
                        return '[Circular Object]';
                    }
                }
                return String(arg);
            }).join(' ');
            logs.push(formattedArgs);
        };

        try {
            // Using Function constructor for safer execution than eval
            new Function(codeToRun)();
            setOutput(logs.length > 0 ? logs : ['// Code executed successfully with no output.']);
            setIsError(false);
        } catch (e: any) {
            setOutput([e.stack || e.message]);
            setIsError(true);
        } finally {
            console.log = originalConsoleLog;
        }
    }

    const handleRunInputCode = createRunHandler(inputCode, setRunInputOutput, setIsRunInputError);
    const handleRunOutputCode = createRunHandler(outputCode, setRunOutputOutput, setIsRunOutputError);


    return (
        <div className="min-h-screen bg-background-dark text-text-primary p-4 lg:p-8 space-y-8">
            <header className="flex items-center justify-between">
                 <div className="flex items-center">
                    <CodeMorphFullLogo />
                </div>
                 <button onClick={onGoHome} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">&larr; Back to Home</button>
            </header>

            <main className="flex flex-col gap-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[50vh] lg:min-h-[60vh]">
                    <div className="flex flex-col gap-4 min-h-[50vh] lg:min-h-[60vh]">
                        <CodeEditor
                            title="Input Code"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            placeholder="Paste your code here, or load a sample..."
                            language={language}
                            onLanguageChange={setLanguage}
                            onFileUpload={handleFileUpload}
                            onSampleLoad={loadSample}
                            onRunCode={handleRunInputCode}
                        />
                        <RunOutputConsole output={runInputOutput} isError={isRunInputError} onClear={() => setRunInputOutput([])} />
                    </div>
                    <div className="flex flex-col gap-4 min-h-[50vh] lg:min-h-[60vh]">
                         <CodeEditor
                            title="✨ AI Transformed Code"
                            value={outputCode}
                            readOnly
                            placeholder="Your transformed code will appear here..."
                            language={language}
                            onDownload={handleDownload}
                            isLoading={isLoading && !outputCode}
                            onRunCode={handleRunOutputCode}
                        />
                        <RunOutputConsole output={runOutputOutput} isError={isRunOutputError} onClear={() => setRunOutputOutput([])} />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center">Choose Transformation Goal(s)</h3>
                    <TransformationOptions selected={selectedTransformations} onSelect={handleSelectTransformation} disabled={isLoading} />
                </div>
                
                 {error && (
                    <div className="text-center p-4 bg-error/20 text-error rounded-lg border border-error/50">
                        {error}
                    </div>
                )}


                <button onClick={handleTransform} disabled={isLoading || !inputCode || selectedTransformations.length === 0}
                    className="w-full h-14 text-lg font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg shadow-primary/40 hover:scale-[1.02] active:scale-100 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3">
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Analyzing...
                        </>
                    ) : (
                        'Transform Code'
                    )}
                </button>
                
                <AnalysisPanel analysis={analysis} isLoading={isLoading && !!outputCode} />
            </main>
        </div>
    );
};

// FIX: Add a default export to make the component available for import in other files.
export default DemoPage;