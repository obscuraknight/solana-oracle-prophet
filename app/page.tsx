'use client';
import { useState, useEffect } from 'react';

const cryptoQuotes = [
  "HODL like your life depends on it — because your portfolio does.",
  "The market can stay irrational longer than you can stay solvent.",
  "Buy the dip. Sell the rip. Regret everything.",
  "In crypto we trust. Everyone else pays cash.",
  "Not financial advice. Just vibes and hopium.",
  "When the market is bleeding, the wise accumulate in silence.",
  "Solana moves at light speed. Degens move at FOMO speed.",
  "The frog does not chase the price. The price chases the frog.",
  "Diamond hands today. Regret tomorrow.",
  "Crypto: Where your money goes to die... or multiply.",
  "Never bet against the frog army.",
  "Patience is the rarest commodity in crypto.",
  "The best time to buy was yesterday. The second best is now.",
  "Stay humble. Stack sats. Touch grass occasionally.",
  "Fear is temporary. Diamond hands are forever.",
  "The market rewards the patient and punishes the greedy.",
  "Every rug teaches a lesson. Every moon creates a legend.",
  "I’m not addicted to crypto. I’m just in a very committed relationship.",
  "Time in the market beats timing the market.",
  "The Prophet speaks in candles, not words.",
];

function getRandomQuote() {
  return cryptoQuotes[Math.floor(Math.random() * cryptoQuotes.length)];
}

export default function Home() {
  const [question, setQuestion] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);
  const [pricePrediction, setPricePrediction] = useState('');
  const [isBullish, setIsBullish] = useState(true);
  const [fullAnswer, setFullAnswer] = useState('');
  const [propheciesMade, setPropheciesMade] = useState(87);
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote());

  useEffect(() => {
    fetch('https://api.counterapi.dev/v1/solana-oracle-prophet/prophecies')
      .then(res => res.json())
      .then(data => setPropheciesMade(data.value || 87))
      .catch(() => setPropheciesMade(87));
  }, []);

  const consultProphet = async () => {
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

        setFullAnswer(data.answer || "The Prophet is meditating...");
        setIsBullish(data.isBullish ?? true);

        const priceMatch = data.answer?.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?/i) ||
                          data.answer?.match(/\d{3,}\s*-\s*\d{3,}/);
        setPricePrediction(priceMatch ? priceMatch[0] : "The future is unclear...");

        if (data.propheciesMade !== undefined) {
          setPropheciesMade(data.propheciesMade);
        } else {
          setPropheciesMade(prev => prev + 1);
        }

        setCurrentQuote(getRandomQuote());

      } catch (err) {
        setFullAnswer("The Prophet is meditating...");
        setPricePrediction("???");
      } finally {
        setIsConsulting(false);
      }
    }, 6000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6 relative">
      {/* Prophecies Counter */}
      <div className="absolute top-6 right-6 bg-black/80 border border-[#14F195]/30 px-5 py-2.5 rounded-2xl font-mono text-sm flex items-center gap-2 z-50">
        <span className="text-gray-400">Prophecies Made:</span>
        <span className="text-[#14F195] font-bold text-lg">
          {propheciesMade.toLocaleString()}
        </span>
      </div>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-12 tracking-tighter 
                       bg-gradient-to-r from-[#9945FF] via-[#14F195] to-[#9945FF] 
                       bg-clip-text text-transparent 
                       drop-shadow-[0_0_25px_#9945FF] 
                       drop-shadow-[0_0_50px_#14F195] 
                       drop-shadow-[0_0_80px_#9945FF]">
          SOLANA ORACLE PROPHET
        </h1>

        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
          
          {/* LEFT COLUMN */}
          <div className="flex-shrink-0 flex flex-col items-center lg:items-start">
            <div className="relative mb-6">
              {isConsulting ? (
                <video 
                  src="/videos/video1.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-[360px] lg:w-[420px] rounded-3xl shadow-2xl shadow-purple-500/60" 
                />
              ) : (
                <img 
                  src="/images/prophet-pepe.png" 
                  alt="Advanced Mystic Prophet Pepe" 
                  className="w-[360px] lg:w-[420px] rounded-3xl shadow-2xl shadow-purple-500/60" 
                />
              )}
            </div>

            <div className="w-[360px] lg:w-[420px]">
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
                placeholder="What will SOL be in May 2027?"
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

            {/* Mystic Crypto Quote Box */}
            <div className="mt-8 bg-gradient-to-br from-purple-900/30 to-black border border-[#14F195]/20 rounded-3xl p-6 text-center">
              <p className="text-purple-300 text-sm italic">✧ The Prophet whispers...</p>
              <p className="mt-3 text-lg text-white/90 font-light">"{currentQuote}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <footer className="mt-24 py-16 border-t border-purple-500/20 bg-black/60 text-center text-xs text-gray-400 leading-relaxed">
        <div className="max-w-2xl mx-auto px-6">
          ⚠️ <strong>This is NOT financial advice.</strong><br />
          The Prophet’s prophecies are for <strong>entertainment purposes only</strong>.<br />
          <strong>Answers are not randomly generated</strong> — they are based on real-time and historical market data from trustworthy sources.<br /><br />
          Always do your own research (DYOR). Cryptocurrency investments involve high risk of loss.
        </div>
      </footer>
    </main>
  );
}
