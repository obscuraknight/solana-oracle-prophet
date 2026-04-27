'use client';
import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);
  const [pricePrediction, setPricePrediction] = useState('');
  const [isBullish, setIsBullish] = useState(true);
  const [fullAnswer, setFullAnswer] = useState('');

  const consultProphet = () => {
    if (question.trim() === '') return;
    setIsConsulting(true);
    setPricePrediction('');
    setFullAnswer('');

    setTimeout(async () => {
      try {
        const res = await fetch('/api/prophecy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
        });
        const data = await res.json();

        const answer = data.answer || "The Prophet is meditating...";
        setFullAnswer(answer);
        setIsBullish(data.isBullish ?? true);

        const priceMatch = answer.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?/i) ||
                          answer.match(/\d{3,}\s*-\s*\d{3,}/);
        
        setPricePrediction(priceMatch ? priceMatch[0] : "The future is unclear...");
      } catch (err) {
        setPricePrediction("???");
        setFullAnswer("The Prophet is meditating...");
        setIsBullish(true);
      } finally {
        setIsConsulting(false);
      }
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 tracking-tight">
          🐸 SOLANA ORACLE PROPHET
        </h1>

        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
         
          {/* LEFT COLUMN */}
          <div className="flex-shrink-0 flex flex-col items-center lg:items-start">
            <div className="relative mb-8">
              {isConsulting ? (
                <video 
                  src="/videos/video1.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-[380px] lg:w-[420px] rounded-3xl shadow-2xl shadow-purple-500/60" 
                />
              ) : (
                <img 
                  src="/images/prophet-pepe.png" 
                  alt="Prophet Pepe" 
                  className="w-[380px] lg:w-[420px] rounded-3xl shadow-2xl shadow-purple-500/60" 
                />
              )}
            </div>

            {/* Dynamic Market Cycle */}
            <div className="w-[380px] lg:w-[420px]">
              <h2 className="text-xl font-bold text-center mb-4 text-purple-400">
                🔮 Psychology of a Market Cycle
              </h2>
              
              {pricePrediction ? (
                <video 
                  src={isBullish ? "/videos/bullish.mp4" : "/videos/bearish.mp4"} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full rounded-2xl shadow-xl shadow-purple-500/40 border border-[#9945FF]/20"
                />
              ) : (
                <img
                  src="/images/diagram.jpg"
                  alt="Psychology of a Market Cycle"
                  className="w-full rounded-2xl shadow-xl shadow-purple-500/40 border border-[#9945FF]/20"
                />
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 max-w-lg lg:max-w-md pt-6">
            <p className="text-xl text-gray-400 mb-6 text-center lg:text-left">
              Ask the Prophet anything about Solana...
            </p>
            <div className="space-y-4">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && consultProphet()}
                placeholder="What will SOL be in 2025?"
                className="w-full bg-zinc-900 border border-[#9945FF]/30 focus:border-[#14F195] text-white px-6 py-5 rounded-2xl text-lg outline-none"
              />
              <button
                onClick={consultProphet}
                disabled={isConsulting}
                className="w-full px-10 py-5 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-black text-2xl font-bold rounded-2xl hover:scale-105 transition-all disabled:opacity-70"
              >
                {isConsulting ? "THE PROPHET IS SPEAKING..." : "🔮 CONSULT THE PROPHET"}
              </button>
            </div>

            {pricePrediction && (
              <div className="mt-10 text-center p-8 bg-zinc-900/80 border border-[#14F195]/30 rounded-3xl">
                <div className={`text-5xl md:text-6xl font-bold ${isBullish ? 'text-green-400' : 'text-red-500'}`}>
                  {pricePrediction}
                </div>
                <p className="text-sm text-gray-400 mt-2">SOL Price Prediction</p>
              </div>
            )}

            {fullAnswer && (
              <div className="mt-8 bg-zinc-900/70 border border-[#14F195]/20 rounded-3xl p-7">
                <pre className="whitespace-pre-wrap font-light text-gray-200 text-base leading-relaxed">
                  {fullAnswer}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <footer className="mt-24 py-16 border-t border-purple-500/20 bg-black/60 text-center text-xs text-gray-400 leading-relaxed">
        <div className="max-w-2xl mx-auto px-6">
          ⚠️ <strong>This is NOT financial advice.</strong><br />
          The Prophet’s prophecies are for <strong>entertainment purposes only</strong>.<br />
          <strong>Answers are not random</strong> — they are generated using real-time market data from:<br />
          • <strong>Pyth Network oracles</strong> — primary real-time price feeds<br />
          • <strong>Birdeye.so</strong> and <strong>DEX Screener</strong> — on-chain analytics<br />
          • Solana blockchain — direct on-chain data<br /><br />
          Always do your own research (DYOR). Cryptocurrency investments involve high risk of loss.
        </div>
      </footer>
    </main>
  );
}
