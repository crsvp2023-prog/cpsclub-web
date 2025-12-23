import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    console.log('Chat message received:', message?.substring(0, 50));

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Provide helpful responses about CPS Club
    const response = provideCPSClubResponse(message);
    return NextResponse.json({ message: response });

  } catch (error) {
    console.error('❌ CHAT API ERROR:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function provideCPSClubResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // CPS Club information responses
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


