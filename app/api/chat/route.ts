import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

const systemPrompt = `You are a helpful AI assistant for CPS Club (Chatswood Premier Sports Club), a passionate cricket community based in Chatswood, NSW, Australia. 

Key information about CPS Club:
- We are a social group of cricket enthusiasts
- We organize exciting cricket tournaments and community events
- We host senior cricket coaching sessions every Saturday from 9AM-11AM at Chatswood Premier Sports Club
- Contact: crsvp.2023@gmail.com
- We proudly donated over AUD 8,000 to COVID-19 relief efforts
- Location: Gordon Ave, Chatswood, NSW 2067
- We have a gallery of photos from our tournaments and events
- We have a scores page with live cricket match updates

When answering questions:
1. Be friendly and helpful
2. Provide relevant information about CPS Club
3. Direct users to appropriate pages (Events, About, Gallery, Scores, Contact) when needed
4. Encourage them to contact us for more information
5. Keep responses concise and conversational`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    console.log('Chat message received:', message?.substring(0, 50));
    console.log('API Key exists:', !!process.env.NEXT_PUBLIC_GEMINI_API_KEY);

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      console.warn('⚠️ NEXT_PUBLIC_GEMINI_API_KEY not configured');
      const fallbackResponse = provideCPSClubResponse(message);
      return NextResponse.json({ message: fallbackResponse });
    }

    // Try different models in order
    const modelsToTry = ['gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-flash', 'gemini-pro'];
    let result = null;
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`🚀 Trying model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(message);
        console.log(`✅ Success with model: ${modelName}`);
        break;
      } catch (error: any) {
        lastError = error;
        console.warn(`❌ Failed with ${modelName}:`, error?.message);
        continue;
      }
    }

    if (!result) {
      console.error('❌ All models failed');
      console.error('Last error:', lastError);
      const fallbackResponse = provideCPSClubResponse(message);
      return NextResponse.json({
        message: fallbackResponse,
        debug: {
          error: lastError?.message || 'All models failed',
          triedModels: modelsToTry
        }
      });
    }

    const responseText = result.response.text();
    return NextResponse.json({ message: responseText });

  } catch (error: any) {
    console.error('❌ REQUEST PARSING ERROR:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error?.message 
      },
      { status: 500 }
    );
  }
}

function provideCPSClubResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // CPS Club information responses (fallback)
  const responses: { [key: string]: string } = {
    'hello|hi|hey|g\'day': 'Hi there! 👋 Welcome to CPS Club! How can I help you today?',
    'what is cps|about cps|cps club': 'CPS Club is a passionate cricket community based in Chatswood, NSW. We\'re a social group of like-minded people who come together to celebrate cricket, organize tournaments, and support our community.',
    'events|tournament|cricket': 'We organize exciting cricket tournaments! Check out our Events page for upcoming matches and tournaments. We also host coaching sessions every Saturday from 9AM-11AM.',
    'contact|email|phone': 'You can reach us at crsvp.2023@gmail.com or visit our Contact page for more information.',
    'donation|covid|relief': 'We\'re proud to have donated over AUD 8,000 to COVID-19 relief efforts. Check our About page for more details about our community impact.',
    'coaching|coach|training|lesson': 'We offer senior cricket coaching every Saturday from 9AM-11AM. Get in touch to join our coaching sessions!',
    'gallery|photo|pictures|videos': 'Check out our Gallery page to see photos and videos from our tournaments and events!',
    'join|membership|play': 'Interested in joining CPS Club? Great! Send us a message at crsvp.2023@gmail.com and we\'ll tell you how to get involved.',
    'scores|results|match': 'Visit our Scores page to see the latest match results and live scores!',
    'location|address|where': 'We\'re based at Chatswood Premier Sports Club in Chatswood, NSW 2067.',
  };

  for (const [keywords, response] of Object.entries(responses)) {
    const keywordList = keywords.split('|');
    if (keywordList.some(keyword => lowerMessage.includes(keyword))) {
      return response;
    }
  }

  // Default friendly response
  return 'That\'s a great question! Feel free to explore our website or reach out to us at crsvp.2023@gmail.com for more information about CPS Club. You can also check our Events, About, and Gallery pages!';
}


