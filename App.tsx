
import React, { useState, useEffect, useRef } from 'react';
import HeartBackground from './components/HeartBackground';
import { generateRomanticMessages, generatePoem, generateSecret } from './services/geminiService';
import { AppState, ValentineMessage } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.INITIAL);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [noCount, setNoCount] = useState(0);
  const [isJittering, setIsJittering] = useState(false);
  const [messages, setMessages] = useState<ValentineMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [celebrationStarted, setCelebrationStarted] = useState(false);
  
  // Gift & Animation States
  const [petals, setPetals] = useState<number[]>([]);
  const [activeGift, setActiveGift] = useState<string | null>(null);
  const [giftContent, setGiftContent] = useState<string | null>(null);
  const [isGeneratingGift, setIsGeneratingGift] = useState(false);

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
      scale: 1.15,
      isHighlight: true
    }));

    const positionedNotes: ValentineMessage[] = aiData.notes.map((m, idx) => ({
      id: `note-${idx}`,
      text: m,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      rotation: (Math.random() - 0.5) * 40,
      scale: 0.85 + Math.random() * 0.3,
      isHighlight: false
    }));
    
    setMessages([...positionedHighlights, ...positionedNotes]);
    setCelebrationStarted(true);
  };

  const triggerRoseAction = () => {
    setActiveGift('rose');
    setGiftContent(null);
    const newPetals = Array.from({ length: 50 }).map((_, i) => Date.now() + i);
    setPetals(newPetals);
    setTimeout(() => setPetals([]), 6000);
  };

  const triggerPoemAction = async () => {
    setActiveGift('poem');
    setIsGeneratingGift(true);
    const generatedPoem = await generatePoem();
    setGiftContent(generatedPoem);
    setIsGeneratingGift(false);
  };

  const triggerSecretAction = async () => {
    setActiveGift('secret');
    setIsGeneratingGift(true);
    const generatedSecret = await generateSecret();
    setGiftContent(generatedSecret);
    setIsGeneratingGift(false);
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
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#fff0f3] to-[#ffe5ec] overflow-hidden">
      <HeartBackground />

      {/* Rose Petal Rain Layer */}
      {petals.map((id, i) => (
        <div 
          key={id} 
          className="petal text-2xl text-red-500 opacity-90 drop-shadow-sm"
          style={{
            left: `${Math.random() * 100}vw`,
            animationDuration: `${4 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        >
          {['🌹', '🌸', '🌹'][Math.floor(Math.random() * 3)]}
        </div>
      ))}

      {state === AppState.INITIAL ? (
        <div className="flex flex-col items-center z-10">
           <div className="mb-6 animate-bounce text-pink-600 font-script text-2xl bg-white/70 px-6 py-2 rounded-full backdrop-blur-md border border-white/50 shadow-sm">
             A secret invitation for you... 💌
           </div>

          <div className="text-center max-w-lg w-full bg-white/80 backdrop-blur-2xl p-10 rounded-[4rem] shadow-[0_25px_60px_rgba(251,113,133,0.15)] border border-white/40 animate-in fade-in slide-in-from-bottom-20 duration-1000">
            <div className="relative group mb-8">
              <img 
                src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800" 
                alt="Romantic mood" 
                className="w-full h-64 object-cover rounded-[2.5rem] shadow-xl border-8 border-white group-hover:rotate-1 transition-transform duration-500"
              />
              <div className="absolute -top-4 -right-4 bg-red-500 text-white p-4 rounded-full shadow-2xl transform rotate-12 animate-pulse text-2xl">
                💝
              </div>
            </div>

            <h1 className="text-6xl font-cursive text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-500 mb-12 drop-shadow-sm leading-tight">
              Will you be my Valentine?
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-12 relative h-40">
              <button
                onClick={handleYesClick}
                disabled={isLoading}
                className={`
                  relative z-10 px-16 py-6 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white rounded-full font-bold text-3xl 
                  shadow-[0_15px_35px_rgba(244,63,94,0.4)] hover:shadow-[0_20px_45px_rgba(244,63,94,0.6)] 
                  hover:-translate-y-2 hover:scale-110 active:scale-95 transition-all duration-300
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}
                `}
              >
                {isLoading ? 'Creating Magic...' : 'YES! 💖'}
              </button>

              <button
                ref={noButtonRef}
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                style={{
                  transform: `translate(${noOffset.x}px, ${noOffset.y}px)`,
                  transition: isJittering ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                className={`
                  px-12 py-6 bg-white/90 text-gray-400 rounded-full font-bold text-xl border-2 border-gray-100/50
                  shadow-lg whitespace-nowrap z-20 backdrop-blur-sm
                  ${isJittering ? 'jitter border-red-300' : ''}
                `}
              >
                No
              </button>
            </div>
            
            {noCount > 0 && (
              <p className="mt-8 text-pink-500 font-script text-3xl animate-in fade-in zoom-in duration-300 italic">
                {funnyPleasedMessages[Math.min(noCount - 1, funnyPleasedMessages.length - 1)]}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center pt-20">
          
          {/* Main Acceptance Content */}
          <div className="z-30 text-center animate-in fade-in zoom-in duration-1000 mb-12">
            <div className="bg-white/90 p-12 sm:p-20 rounded-[5rem] shadow-[0_40px_120px_rgba(251,113,133,0.3)] border-4 border-white inline-block transform -rotate-2 hover:rotate-0 transition-all duration-700 relative backdrop-blur-xl group">
               <h2 className="text-8xl sm:text-9xl font-script text-transparent bg-clip-text bg-gradient-to-br from-red-600 via-pink-600 to-rose-500 drop-shadow-sm pb-6 leading-[1.2]">
                You're Mine!
              </h2>
              <div className="h-1.5 w-48 bg-gradient-to-r from-transparent via-red-400 to-transparent mx-auto mb-6 rounded-full group-hover:w-64 transition-all duration-1000"></div>
              <p className="text-3xl sm:text-4xl text-rose-400 font-cursive animate-pulse tracking-wide italic">Our love story starts now...</p>
            </div>
          </div>

          {/* Interactive Gift Menu */}
          <div className="z-40 flex flex-wrap justify-center gap-6 px-4 animate-in slide-in-from-bottom-16 duration-1000 delay-500 mb-12">
            <button 
              onClick={triggerRoseAction}
              className="group px-8 py-4 bg-white/90 backdrop-blur shadow-[0_10px_25px_rgba(0,0,0,0.05)] rounded-full border border-red-100 text-red-500 font-bold hover:bg-red-50 hover:scale-110 active:scale-95 transition-all flex items-center gap-3 text-lg"
            >
              <span className="text-2xl group-hover:rotate-12 transition-transform">🌹</span> Give a Rose
            </button>
            <button 
              onClick={triggerPoemAction}
              className="group px-8 py-4 bg-white/90 backdrop-blur shadow-[0_10px_25px_rgba(0,0,0,0.05)] rounded-full border border-pink-100 text-pink-600 font-bold hover:bg-pink-50 hover:scale-110 active:scale-95 transition-all flex items-center gap-3 text-lg"
            >
              <span className="text-2xl group-hover:animate-pulse transition-transform">💌</span> Write a Poem
            </button>
            <button 
              onClick={triggerSecretAction}
              className="group px-8 py-4 bg-white/90 backdrop-blur shadow-[0_10px_25px_rgba(0,0,0,0.05)] rounded-full border border-rose-100 text-rose-600 font-bold hover:bg-rose-50 hover:scale-110 active:scale-95 transition-all flex items-center gap-3 text-lg"
            >
              <span className="text-2xl group-hover:-translate-y-1 transition-transform">🤫</span> Tell a Secret
            </button>
          </div>

          {/* Reveal Overlays (Poem Scroll / Secret Card) */}
          {activeGift && activeGift !== 'rose' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-900/30 backdrop-blur-sm p-6" onClick={() => setActiveGift(null)}>
              <div 
                className={`
                  max-w-lg w-full p-12 rounded-[2rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] scroll-reveal text-center relative
                  ${activeGift === 'poem' ? 'bg-[#fffef5] border-x-[12px] border-amber-200' : 'bg-white border-4 border-rose-100'}
                `}
                onClick={e => e.stopPropagation()}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-6xl drop-shadow-lg">
                  {activeGift === 'poem' ? '📜' : '🔒'}
                </div>
                {isGeneratingGift ? (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                    <div className="text-rose-500 font-script text-3xl animate-pulse">Whispering to the heart...</div>
                  </div>
                ) : (
                  <div className={`whitespace-pre-line leading-relaxed italic ${activeGift === 'poem' ? 'text-amber-900 font-script text-4xl' : 'text-rose-700 font-cursive text-5xl'}`}>
                    {giftContent}
                  </div>
                )}
                <button 
                  onClick={() => setActiveGift(null)}
                  className="mt-12 px-8 py-3 bg-rose-500 text-white rounded-full font-bold hover:bg-rose-600 transition-colors shadow-lg"
                >
                  Keep this close ❤️
                </button>
              </div>
            </div>
          )}

          {/* Background Floating Messages */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-60">
            {messages.map((msg, i) => (
              <div
                key={msg.id}
                className={`
                  absolute px-10 py-5 rounded-[2rem] shadow-lg transition-all duration-1000
                  ${msg.isHighlight 
                    ? 'bg-rose-500 text-white font-script text-4xl z-20 highlight-card scale-110' 
                    : 'bg-white/80 backdrop-blur-sm text-rose-700 font-medium text-xl z-10 border border-rose-100/50'}
                  animate-in slide-in-from-bottom-40
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

          {/* Celebration Ambiance */}
          <div className="fixed inset-0 pointer-events-none">
             {Array.from({length: 45}).map((_, i) => (
                <div 
                  key={i}
                  className="absolute text-4xl animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 4}s`,
                    opacity: 0.25,
                    filter: 'blur(1px)'
                  }}
                >
                  {['❤️', '💖', '💐', '🕊️'][Math.floor(Math.random() * 4)]}
                </div>
             ))}
          </div>
        </div>
      )}

      <footer className="fixed bottom-8 px-8 py-3 bg-white/40 backdrop-blur-md rounded-full text-rose-500 text-sm font-bold uppercase tracking-[0.25em] z-50 border border-white/50 shadow-sm animate-pulse">
        Forever Yours
      </footer>
    </div>
  );
};

export default App;
