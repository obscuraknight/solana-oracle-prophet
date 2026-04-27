import { NextRequest, NextResponse } from 'next/server';

const currentPrice = 86;

const forecasts = {
  2026: { avg: 135, phrase: "modest but steady frog hop" },
  2027: { avg: 190, phrase: "getting spicy" },
  2028: { avg: 280, phrase: "bull run warming up" },
  2029: { avg: 420, phrase: "the frog starts mooning" },
  2030: { avg: 620, phrase: "serious degen territory" },
  2035: { avg: 1450, phrase: "frog empire era" },
  2040: { avg: 2450, phrase: "Solana becomes boomer asset" },
};

function getMysticAnswer(question: string) {
  const q = question.toLowerCase().trim();

  // Current price
  if (q.includes("this month") || q.includes("now") || q.includes("current") || q.includes("april")) {
    return {
      answer: `The crystal ball is crystal clear, my degen... Right now in late April 2026, SOL sits at around $${currentPrice}, looking a bit sleepy but with naughty eyes. Don't poke him too hard yet.`,
      isBullish: true
    };
  }

  // Year detection
  const yearMatch = q.match(/\b(202[5-9]|203[0-9]|2040)\b/);
  if (yearMatch) {
    const year = parseInt(yearMatch[0]);
    const data = forecasts[year as keyof typeof forecasts];

    if (data) {
      return {
        answer: `The Prophet squints into the glowing orb... In ${year}, SOL shall dance between $${Math.round(data.avg * 0.7)} and $${Math.round(data.avg * 1.4)}. ${data.phrase.toUpperCase()}. The frog is not in a hurry... but he is horny for gains.`,
        isBullish: true
      };
    }
  }

  // Monthly example
  if (q.includes("may 202") || q.includes("june") || q.includes("december")) {
    return {
      answer: "The mists part slightly... In that specific month, the Prophet sees SOL wiggling around $110–$160. Not a moonshot, but enough to make your portfolio tingle.",
      isBullish: true
    };
  }

  // General spicy answer
  return {
    answer: "The ancient frog in the crystal ball laughs... Solana won't make you rich overnight, but if you have diamond hands and a strong heart (and maybe a little degeneracy), the long path is upward. The real question is: Can you survive the boredom between pumps?",
    isBullish: true
  };
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || question.trim() === '') {
      return NextResponse.json({ 
        answer: "Speak up, degen! The Prophet doesn't read minds... yet.", 
        isBullish: true 
      });
    }

    const result = getMysticAnswer(question);
    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({ 
      answer: "The Prophet choked on his cosmic weed... Ask again, mortal.", 
      isBullish: true 
    });
  }
}
