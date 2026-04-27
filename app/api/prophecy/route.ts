import { NextRequest, NextResponse } from 'next/server';

async function getRealTimeSolPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true', {
      next: { revalidate: 30 }
    });
    const data = await res.json();
    return {
      price: data.solana.usd.toFixed(2),
      change24h: data.solana.usd_24h_change.toFixed(2)
    };
  } catch {
    return { price: "86.50", change24h: "0.00" };
  }
}

// Averaged monthly forecasts 2026 - 2030 (from multiple sources)
const monthlyForecasts: Record<number, number[]> = {
  2026: [110, 115, 118, 122, 128, 135, 142, 148, 155, 162, 170, 178],   // Jan to Dec
  2027: [180, 185, 190, 198, 205, 215, 225, 235, 245, 255, 265, 275],
  2028: [280, 290, 300, 315, 330, 345, 360, 375, 390, 405, 420, 435],
  2029: [440, 455, 470, 490, 510, 530, 555, 580, 605, 630, 655, 680],
  2030: [690, 710, 735, 765, 795, 830, 870, 910, 950, 990, 1030, 1070],
};

function getMonthlyPrice(year: number, month: number): number {
  const yearData = monthlyForecasts[year];
  if (yearData && month >= 1 && month <= 12) {
    return yearData[month - 1];
  }
  // Fallback for other years
  return 450;
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    if (!question || question.trim() === '') {
      return NextResponse.json({ answer: "Speak clearly, degen..." });
    }

    const solData = await getRealTimeSolPrice();
    const q = question.toLowerCase().trim();

    // 1. Current price
    if (q.includes("current") || q.includes("now") || q.includes("this month") || q.includes("today") || q.includes("april")) {
      const dir = parseFloat(solData.change24h) >= 0 ? "climbing" : "dipping";
      return NextResponse.json({
        answer: `The crystal is crystal clear... SOL is currently at **$${solData.price}** and is ${dir} ${solData.change24h}% in the last 24 hours.`,
        isBullish: parseFloat(solData.change24h) >= -1
      });
    }

    // 2. Specific month + year (e.g. "May 2027", "October 2029")
    const monthNames = ["january","february","march","april","may","june","july","august","september","october","november","december"];
    const monthMatch = q.match(new RegExp(`(${monthNames.join("|")})\\s*(\\d{4})`, 'i'));

    if (monthMatch) {
      const monthName = monthMatch[1].toLowerCase();
      const year = parseInt(monthMatch[2]);
      const monthNum = monthNames.indexOf(monthName) + 1;
      const price = getMonthlyPrice(year, monthNum);

      return NextResponse.json({
        answer: `In **${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}**, the averaged forecast from many sources shows SOL around **$${price}**. The frog moves steadily forward.`,
        isBullish: true
      });
    }

    // 3. Year only
    const yearMatch = q.match(/\b(202[6-9]|203[0-9])\b/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0]);
      const yearData = monthlyForecasts[year];
      if (yearData) {
        const avg = Math.round(yearData.reduce((a, b) => a + b, 0) / 12);
        return NextResponse.json({
          answer: `Throughout **${year}**, the averaged prediction shows SOL trading between **$${Math.min(...yearData)} – $${Math.max(...yearData)}** (average ~$${avg}).`,
          isBullish: true
        });
      }
    }

    // 4. Default / general future
    return NextResponse.json({
      answer: `The Prophet sees the long path... Right now SOL is at **$${solData.price}**. Ask for a specific month and year (like "May 2027" or "December 2030") for a clearer vision.`,
      isBullish: true
    });

  } catch (error) {
    return NextResponse.json({ answer: "The Prophet is meditating... Try asking again." });
  }
}
