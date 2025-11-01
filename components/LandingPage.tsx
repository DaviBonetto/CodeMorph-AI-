import React from 'react';
import { CodeMorphFullLogo, Rocket, ShieldCheck, Accessibility, Smartphone, Zap, Wand2 } from './icons/LucideIcons';

interface LandingPageProps {
  onLaunchDemo: () => void;
}

const Header: React.FC<LandingPageProps> = ({ onLaunchDemo }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md">
    <div className="container mx-auto px-6 h-[72px] flex items-center justify-between border-b border-border">
      <div className="flex items-center">
        <CodeMorphFullLogo />
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <a href="#features" className="text-text-secondary hover:text-primary transition-colors">Features</a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">GitHub</a>
      </nav>
      <button onClick={onLaunchDemo} className="bg-primary hover:bg-secondary text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50">
        Try Demo
      </button>
    </div>
  </header>
);

const Hero: React.FC<LandingPageProps> = ({ onLaunchDemo }) => (
  <section className="pt-32 pb-20 md:pt-48 md:pb-32 text-center relative overflow-hidden">
    <div className="absolute inset-0 -z-10 bg-grid-slate-800 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,#000)]"></div>
     <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-blob"></div>
    <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>

    <div className="container mx-auto px-6 relative z-10">
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-text-primary to-text-secondary">
        Transform Your Code with AI
      </h1>
      <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-text-secondary">
        Instantly optimize, modernize, and enhance your codebase using advanced AI analysis and transformation.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button onClick={onLaunchDemo} className="text-lg font-semibold text-white bg-gradient-to-r from-primary to-secondary px-8 py-4 rounded-xl shadow-lg shadow-primary/40 hover:scale-105 transition-transform duration-300">
          Start Free Demo &rarr;
        </button>
      </div>

       <div className="mt-16 max-w-4xl mx-auto bg-slate-900/50 rounded-xl border border-border shadow-2xl shadow-black/30 overflow-hidden">
        <div className="p-3 bg-slate-800 border-b border-border flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="p-4 text-left font-mono text-sm overflow-x-auto">
            <pre>
                <code>
                    <span className="text-purple-400">function</span> <span className="text-yellow-300">InefficientComponent</span>() &#123;
                    <br />
                    {'  '}<span className="text-gray-500">// ... lots of unoptimized code</span>
                    <br />
                    &#125;
                    <br />
                    <span className="text-green-400">// Becomes...</span>
                    <br />
                    <span className="text-purple-400">const</span> <span className="text-yellow-300">OptimizedComponent</span> = React.memo(() => &#123;
                    <br />
                    {'  '}<span className="text-gray-500">// ... fast, efficient, and clean code</span>
                    <br />
                    &#125;);
                </code>
            </pre>
        </div>
       </div>
    </div>
  </section>
);

const features = [
  { icon: <Rocket className="w-12 h-12 text-primary" />, title: 'Performance', description: 'Boost code speed and reduce memory usage by 10x.' },
  { icon: <ShieldCheck className="w-12 h-12 text-primary" />, title: 'Security', description: 'Fix vulnerabilities and harden your code instantly.' },
  { icon: <Accessibility className="w-12 h-12 text-primary" />, title: 'Accessibility', description: 'Automatically add WCAG compliance and ARIA support.' },
  { icon: <Smartphone className="w-12 h-12 text-primary" />, title: 'Modern Stack', description: 'Update dependencies and refactor to modern patterns.' },
  { icon: <Wand2 className="w-12 h-12 text-primary" />, title: 'Best Practices', description: 'Clean up your codebase with proven design patterns.' },
  { icon: <Zap className="w-12 h-12 text-primary" />, title: 'Mobile-First', description: 'Ensure your components are fully responsive.' },
];

const FeaturesSection = () => (
    <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center">Why CodeMorph AI?</h2>
            <p className="text-lg text-text-secondary text-center mt-4 max-w-2xl mx-auto">Go beyond linting. Get deep, structural improvements that make a real impact.</p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="bg-background-card/50 border border-border rounded-xl p-8 backdrop-blur-sm transition-all duration-300 hover:border-primary hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
                        {feature.icon}
                        <h3 className="text-xl font-semibold mt-6">{feature.title}</h3>
                        <p className="text-text-secondary mt-2">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FinalCTA: React.FC<LandingPageProps> = ({ onLaunchDemo }) => (
    <section className="py-20">
        <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-xl text-center py-16 px-8">
                <h2 className="text-4xl font-bold">Ready to Transform Your Code?</h2>
                <p className="text-lg text-blue-200 mt-4">Start optimizing in seconds - no signup needed.</p>
                <button onClick={onLaunchDemo} className="mt-8 text-xl font-semibold text-white bg-gradient-to-r from-primary to-secondary px-12 py-5 rounded-xl shadow-lg shadow-primary/40 hover:scale-105 transition-transform duration-300 relative overflow-hidden group">
                     <span className="absolute -inset-0.5 bg-white opacity-0 group-hover:opacity-10 rounded-xl blur-lg transition duration-500"></span>
                     <span className="relative">Launch Demo App &rarr;</span>
                </button>
            </div>
        </div>
    </section>
);

const Footer: React.FC = () => (
    <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div>
                <p className="font-semibold">CodeMorph AI</p>
                <p className="text-sm text-text-secondary">&copy; 2024. All rights reserved.</p>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-text-secondary">
                Built for the <span className="font-semibold text-primary">Octopus Hackathon</span>
            </div>
        </div>
    </footer>
);


const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDemo }) => {
  return (
    <>
      <Header onLaunchDemo={onLaunchDemo} />
      <main>
        <Hero onLaunchDemo={onLaunchDemo} />
        <FeaturesSection />
        <FinalCTA onLaunchDemo={onLaunchDemo} />
      </main>
      <Footer />
    </>
  );
};

export default LandingPage;