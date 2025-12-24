import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const { matchType, homeTeam, awayTeam, context } = await req.json();

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert cricket analyst. Generate a catchy, engaging match insight for a cricket match.

Match Details:
- Format: ${matchType}
- Home Team: ${homeTeam}
- Away Team: ${awayTeam}
- Context: ${context}

Generate a response in this exact JSON format:
{
  "title": "A catchy title (5-8 words, max)",
  "content": "An engaging 2-3 sentence insight about what makes this match exciting or important. Include cricket strategy, team strengths, or player matchups. Make it enthusiastic but professional.",
  "emoji": "A single relevant cricket emoji"
}

Make it catchy, use sports terminology, and focus on what makes this match interesting. Return ONLY valid JSON, no markdown or extra text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const insight = JSON.parse(jsonMatch[0]);

    // Validate response structure
    if (!insight.title || !insight.content || !insight.emoji) {
      throw new Error('Missing required fields in AI response');
    }

    return NextResponse.json({ insight }, { status: 200 });
  } catch (error) {
    console.error('AI Insights error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
