
import React, { useState, useEffect, useRef } from 'react';
import HeartBackground from './components/HeartBackground';
import { generateRomanticMessages, generatePoem } from './services/geminiService';
import { AppState, ValentineMessage } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.INITIAL);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);
  const [isJittering, setIsJittering] = useState(false);
  const [messages, setMessages] = useState<ValentineMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [celebrationStarted, setCelebrationStarted] = useState(false);
  
  // New States for Gifts
  const [petals, setPetals] = useState<number[]>([]);
  const [poem, setPoem] = useState<string | null>(null);
  const [isGeneratingPoem, setIsGeneratingPoem] = useState(false);
  const [activeGift, setActiveGift] = useState<string | null>(null);

  const noButtonRef = useRef<HTMLButtonElement>(null);

  const moveNoButton = () => {
    setIsJittering(true);
    setNoCount(prev => prev + 1);
    
    const padding = 100;
    const maxX = window.innerWidth / 2 - padding;
    const maxY = window.innerHeight / 2 - padding;
    
    const newX = (Math.random() - 0.5) * maxX * 1.5;
    const newY = (Math.random() - 0.5) * maxY * 1.5;
    
    setNoOffset({ x: newX, y: newY });
    
    setTimeout(() => setIsJittering(false), 500);
  };

  const handleYesClick = async () => {
    setIsLoading(true);
    const aiData = await generateRomanticMessages();
    setIsLoading(false);
    setState(AppState.ACCEPTED);
    
    const positionedHighlights: ValentineMessage[] = aiData.highlights.map((m, idx) => ({
      id: `high-${idx}`,
      text: m,
      x: 30 + (idx * 20),
      y: 35 + (idx * 5),
      rotation: (Math.random() - 0.5) * 10,
      scale: 1.2,
      isHighlight: true
    }));

    const positionedNotes: ValentineMessage[] = aiData.notes.map((m, idx) => ({
      id: `note-${idx}`,
      text: m,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      rotation: (Math.random() - 0.5) * 40,
      scale: 0.8 + Math.random() * 0.4,
      isHighlight: false
    }));
    
    setMessages([...positionedHighlights, ...positionedNotes]);
    setCelebrationStarted(true);
  };

  const triggerRoseAction = () => {
    setActiveGift('rose');
    setPoem(null);
    const newPetals = Array.from({ length: 40 }).map((_, i) => Date.now() + i);
    setPetals(newPetals);
    // Cleanup petals after animation
    setTimeout(() => setPetals([]), 6000);
  };

  const triggerPoemAction = async () => {
    setActiveGift('poem');
    setIsGeneratingPoem(true);
    const generatedPoem = await generatePoem();
    setPoem(generatedPoem);
    setIsGeneratingPoem(false);
  };

  const funnyPleasedMessages = [
    "Are you sure? 🥺",
    "I'll give you a cookie! 🍪",
    "I've got a really cool poem... 📝",
    "Wait, let me try again! 💖",
    "Is it my hair? I can change it! 💇‍♂️",
    "I'll watch your favorite show with you! 📺",
    "Please? Just one chance? 🙏",
    "I'm running out of places to hide! 🏃‍♂️",
    "Okay, that was close! 🎯",
    "You're very persistent! 😂"
  ];

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-red-50">
      <HeartBackground />

      {/* Petal Shower Layer */}
      {petals.map((id, i) => (
        <div 
          key={id} 
          className="petal text-2xl text-red-400 opacity-80"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDuration: `${3 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        >
          🌹
        </div>
      ))}

      {state === AppState.INITIAL ? (
        <div className="flex flex-col items-center">
           <div className="mb-6 animate-bounce text-pink-500 font-script text-2xl bg-white/50 px-4 py-1 rounded-full backdrop-blur-sm">
             A message just for you... 💌
           </div>

          <div className="text-center max-w-lg w-full bg-white/60 backdrop-blur-xl p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-t border-l border-white/80 animate-in fade-in slide-in-from-bottom-20 duration-1000">
            <div className="relative group mb-8">
              <img 
                src="https://picsum.photos/id/1026/600/400" 
                alt="Romantic view" 
                className="w-full h-56 object-cover rounded-3xl shadow-lg border-8 border-white group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-full shadow-lg transform rotate-12 animate-pulse">
                ❤️
              </div>
            </div>

            <h1 className="text-6xl font-cursive text-red-600 mb-10 drop-shadow-md animate-in zoom-in duration-700 delay-300">
              Will you be my Valentine?
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-12 relative h-32">
              <button
                onClick={handleYesClick}
                disabled={isLoading}
                className={`
                  relative z-10 px-14 py-5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-bold text-3xl 
                  shadow-[0_10px_30px_rgba(239,68,68,0.4)] hover:shadow-[0_15px_40px_rgba(239,68,68,0.6)] 
                  hover:-translate-y-1 hover:scale-110 transition-all duration-300 active:scale-95
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'animate-bounce'}
                `}
              >
                {isLoading ? 'Preparing Magic...' : 'YES! 💖'}
              </button>

              <button
                ref={noButtonRef}
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                style={{
                  transform: `translate(${noOffset.x}px, ${noOffset.y}px)`,
                  transition: isJittering ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                className={`
                  px-10 py-5 bg-white text-gray-500 rounded-full font-bold text-xl border-2 border-gray-100
                  shadow-md whitespace-nowrap z-20
                  ${isJittering ? 'jitter border-red-200' : ''}
                `}
              >
                No
              </button>
            </div>
            
            {noCount > 0 && (
              <p className="mt-6 text-red-400 font-script text-3xl animate-in fade-in zoom-in duration-300">
                {funnyPleasedMessages[Math.min(noCount - 1, funnyPleasedMessages.length - 1)]}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
          
          {/* Main Acceptance Content */}
          <div className="z-30 text-center animate-in fade-in zoom-in duration-1000 mb-8">
            <div className="bg-white/95 p-12 sm:p-16 rounded-[4rem] shadow-[0_30px_100px_rgba(244,114,182,0.4)] border-4 border-pink-100 inline-block transform -rotate-1 hover:rotate-0 transition-transform duration-500 relative">
               <h2 className="text-7xl sm:text-8xl font-script text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-red-600 drop-shadow-sm pb-4">
                You're Mine!
              </h2>
              <div className="h-1 w-3/4 bg-gradient-to-r from-transparent via-pink-300 to-transparent mx-auto mb-4"></div>
              <p className="text-2xl sm:text-3xl text-pink-400 font-cursive animate-pulse">Our journey begins today...</p>
            </div>
          </div>

          {/* Interactive Gifts / Actions */}
          <div className="z-40 flex flex-wrap justify-center gap-4 px-4 animate-in slide-in-from-bottom-10 duration-1000 delay-500">
            <button 
              onClick={triggerRoseAction}
              className="px-6 py-3 bg-white/80 backdrop-blur shadow-lg rounded-full border border-red-100 text-red-500 font-bold hover:scale-110 active:scale-95 transition-all flex items-center gap-2"
            >
              🌹 Give a Rose
            </button>
            <button 
              onClick={triggerPoemAction}
              className="px-6 py-3 bg-white/80 backdrop-blur shadow-lg rounded-full border border-pink-100 text-pink-600 font-bold hover:scale-110 active:scale-95 transition-all flex items-center gap-2"
            >
              💌 Read a Poem
            </button>
          </div>

          {/* Poem Scroll Reveal */}
          {activeGift === 'poem' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/20 backdrop-blur-sm p-4" onClick={() => setActiveGift(null)}>
              <div 
                className="bg-[#fffcf0] max-w-md w-full p-10 rounded-lg shadow-2xl border-x-8 border-amber-100 scroll-reveal text-center relative"
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl">📜</div>
                {isGeneratingPoem ? (
                  <div className="text-amber-800 font-script text-2xl animate-pulse">Writing from the heart...</div>
                ) : (
                  <div className="whitespace-pre-line text-amber-900 font-script text-3xl leading-relaxed">
                    {poem}
                  </div>
                )}
                <button 
                  onClick={() => setActiveGift(null)}
                  className="mt-8 text-amber-700 font-bold hover:underline"
                >
                  Close Scroll
                </button>
              </div>
            </div>
          )}

          {/* Floating Messages Layer */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                className={`
                  absolute px-8 py-4 rounded-2xl shadow-xl transition-all duration-1000
                  ${msg.isHighlight 
                    ? 'bg-pink-600 text-white font-script text-3xl sm:text-4xl z-20 highlight-card scale-110' 
                    : 'bg-white/80 backdrop-blur-sm text-pink-700 font-medium text-lg sm:text-xl z-10 border border-pink-100'}
                  animate-in slide-in-from-bottom-32
                `}
                style={{
                  left: `${msg.x}%`,
                  top: `${msg.y}%`,
                  transform: celebrationStarted ? `rotate(${msg.rotation}deg) scale(${msg.scale})` : 'scale(0)',
                  transitionDelay: `${i * 0.1}s`,
                  opacity: celebrationStarted ? 1 : 0
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Celebration Particles */}
          <div className="fixed inset-0 pointer-events-none">
             {Array.from({length: 40}).map((_, i) => (
                <div 
                  key={i}
                  className="absolute text-3xl sm:text-4xl animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                    opacity: 0.3,
                  }}
                >
                  {['❤️', '💖', '✨', '🌹'][Math.floor(Math.random() * 4)]}
                </div>
             ))}
          </div>
        </div>
      )}

      <footer className="fixed bottom-6 px-6 py-2 bg-white/30 backdrop-blur-sm rounded-full text-red-400 text-xs font-semibold uppercase tracking-[0.2em] z-50 border border-white/40">
        Created for my one and only
      </footer>
    </div>
  );
};

export default App;
