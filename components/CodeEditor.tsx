import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Copy, Check, Play, X } from './icons/LucideIcons';
// FIX: Import TextShimmer component to make it available for use.
import { TextShimmer } from './TextShimmer';

interface CodeEditorProps {
    title: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    readOnly?: boolean;
    language: string;
    onFileUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSampleLoad?: () => void;
    onRunCode?: () => void;
    onDownload?: () => void;
    onCopy?: () => void;
    isLoading?: boolean;
    onLanguageChange?: (lang: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ title, value, onChange, placeholder, readOnly = false, language, onFileUpload, onSampleLoad, onRunCode, onDownload, onCopy, isLoading = false, onLanguageChange }) => {
    const [isCopied, setIsCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isJsOrTs = ['javascript', 'typescript'].includes(language);
    
    const getRunButtonTitle = () => {
        if (!isJsOrTs) {
            return "Run is only available for JavaScript/TypeScript";
        }
        return "Run Code";
    };

    const handleCopy = () => {
        if(onCopy) {
            onCopy();
        } else {
            navigator.clipboard.writeText(value);
        }
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };
    
    return (
        <div className="flex flex-col h-full bg-background-card border border-border rounded-xl overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-border">
                {!readOnly ? (
                     <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-text-primary">Input Code</h2>
                        <select
                            value={language}
                            onChange={(e) => onLanguageChange?.(e.target.value)}
                            className="bg-background-card border border-border rounded text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                            aria-label="Select code language"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="go">Go</option>
                        </select>
                    </div>
                ) : (
                    <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
                )}
                <div className="flex items-center gap-2">
                     {onRunCode && (
                        <button onClick={onRunCode} disabled={!isJsOrTs} title={getRunButtonTitle()} className="p-1.5 text-text-secondary hover:text-primary rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-text-secondary">
                            <Play className="w-4 h-4" />
                        </button>
                    )}
                    {!readOnly && (
                         <>
                            <button onClick={onSampleLoad} className="text-xs text-text-secondary hover:text-primary transition-colors">Load Sample</button>
                             <input type="file" ref={fileInputRef} onChange={onFileUpload} className="hidden" accept=".js,.ts,.jsx,.tsx,.py,.java,.go" />
                             <button onClick={handleFileClick} title="Upload File" className="p-1.5 text-text-secondary hover:text-primary rounded-md transition-colors"><Upload className="w-4 h-4" /></button>
                         </>
                    )}
                    {readOnly && value && (
                        <>
                             <button onClick={onDownload} title="Download File" className="p-1.5 text-text-secondary hover:text-primary rounded-md transition-colors"><Download className="w-4 h-4" /></button>
                            <button onClick={handleCopy} title="Copy to Clipboard" className="p-1.5 text-text-secondary hover:text-primary rounded-md transition-colors">
                                {isCopied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="relative flex-grow">
                {isLoading ? (
                    <div className="w-full h-full p-4 flex items-center justify-center text-center">
                        <TextShimmer 
                            as="div"
                            className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
                            children={'// CodeMorph AI is transforming your code...\n// This may take a few seconds...'}
                        />
                    </div>
                ) : (
                    <textarea
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        className="w-full h-full p-4 bg-transparent text-text-primary caret-primary font-mono text-sm resize-none focus:outline-none leading-relaxed whitespace-pre-wrap break-words"
                        spellCheck="false"
                        aria-label={readOnly ? "Transformed code output" : "Code input"}
                    />
                )}
            </div>
        </div>
    )
}

// FIX: This component was moved out of DemoPage.tsx to its own file.
// For some reason it was still here. I removed it.
// This is not a component that should be exported from here.
// const TransformationOptions...

// FIX: This component was moved out of DemoPage.tsx to its own file.
// For some reason it was still here. I removed it.
// This is not a component that should be exported from here.
// const AnalysisPanel...

// FIX: This component was moved out of DemoPage.tsx to its own file.
// For some reason it was still here. I removed it.
// This is not a component that should be exported from here.
// const RunOutputConsole...

// FIX: This component was moved out of DemoPage.tsx to its own file.
// For some reason it was still here. I removed it.
// This is not a component that should be exported from here.
// const DemoPage...

export default CodeEditor;