import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'grok-4-1-fast-reasoning',
        messages: [
          { 
            role: 'system', 
            content: `You are the Solana Oracle Prophet. 

You MUST be realistic and data-driven.
- Never give crazy short-term predictions (example: SOL to $1000 tomorrow is forbidden).
- Base your answers on real market cycles, historical data, and current conditions (April 2026).
- For price predictions, be conservative and reasonable.

Structure every response exactly like this:

First line: Direct clear answer (e.g. "SOL will likely trade between $180-$280 in the next 30 days.")

Then:
Bullish Scenario: ...
Moderate Scenario: ...
Bearish Scenario: ...

The Oracle's Most Likely Vision: [Your final realistic view in mystical language]

End with: "This is not financial advice. DYOR."` 
          },
          { role: 'user', content: `Current date is April 2026. Question: ${question}` }
        ],
        temperature: 0.7,     // Lower = more realistic
        max_tokens: 750,
      }),
    });

    const data = await response.json();
    const prophecy = data.choices?.[0]?.message?.content || "The Oracle is silent...";

    return Response.json({ prophecy });

  } catch (error: any) {
    return Response.json({ prophecy: `Error: ${error.message}` });
  }
}
