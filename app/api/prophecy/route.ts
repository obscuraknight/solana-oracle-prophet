import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { question } = await request.json();
  const q = question.toLowerCase().trim();

  // Try real API first on localhost
  if (process.env.GROK_API_KEY) {
    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "grok-4",
          messages: [{ role: 'user', content: `You are Solana Oracle Prophet. Answer this: ${question}` }],
          temperature: 0.75,
        }),
      });
      const data = await res.json();
      if (data.choices?.[0]?.message?.content) {
        return NextResponse.json({ answer: data.choices[0].message.content });
      }
    } catch (e) {}
  }

  // Smart Static Responses
  let answer = '';

  if (q.includes('2029') || q.includes('may 2029')) {
    answer = `**The Prophet's Answer:**\n\nIn May 2029, SOL will likely trade between **$450 – $950**, most probably around **$680**. We will be in the post-bull correction phase of the 2028 cycle.`;
  } 
  else if (q.includes('2027')) {
    answer = `**The Prophet's Answer:**\n\nIn 2027, SOL should reach **$350 – $750**. This will be during the peak of the current bull cycle.`;
  } 
  else if (q.includes('2028')) {
    answer = `**The Prophet's Answer:**\n\n2028 will be a strong year — SOL could hit **$600 – $1,100** at the top of the cycle.`;
  } 
  else if (q.includes('2030')) {
    answer = `**The Prophet's Answer:**\n\nBy 2030, SOL is expected to stabilize between **$800 – $2,000** as the new bull cycle begins.`;
  } 
  else if (q.includes('price') || q.includes('2026')) {
    answer = `**The Prophet's Answer:**\n\nCurrent cycle (2026) still has strong upside. SOL likely ends the year between **$180 – $380**.`;
  } 
  else if (q.includes('bear') || q.includes('crash') || q.includes('down')) {
    answer = `**The Prophet's Answer:**\n\nShort-term dips are normal, but Solana’s fundamentals remain very strong.`;
  } 
  else {
    answer = `**The Prophet's Answer:**\n\nThe crystal ball shows positive energy for Solana. The future favors speed and strong community.`;
  }

  return NextResponse.json({ 
    answer: answer + `\n\n**Your Question:** "${question}"` 
  });
}
