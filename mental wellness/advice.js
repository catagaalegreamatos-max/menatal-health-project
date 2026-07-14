(function (global) {
  const supportPatterns = [
    {
      id: 'urgent',
      keywords: ['suicide', 'hurt myself', 'kill myself', 'end my life', 'want to die', 'self harm', 'self-harm'],
      title: 'Immediate support is important',
      summary: 'You may be feeling unsafe or overwhelmed right now. Please reach out to emergency services, a crisis line, or a trusted person immediately.',
      actions: [
        'Call emergency services or a local crisis line now.',
        'Tell a trusted person what you are feeling right now.',
        'Move to a safe place and remove anything you could use to hurt yourself.'
      ]
    },
    {
      id: 'panic',
      keywords: ['panic', 'panic attack', 'heart racing', 'short of breath', 'overwhelmed'],
      title: 'Panic or intense fear',
      summary: 'Your body may be reacting to stress or fear. Slow breathing and grounding can help calm the reaction.',
      actions: [
        'Breathe in for 4 counts and out for 6 counts for one minute.',
        'Name 5 things you can see, 4 you can feel, and 3 you can hear.',
        'Sit down, drink water, and avoid caffeine for a little while.'
      ]
    },
    {
      id: 'sleep',
      keywords: ['sleep', 'insomnia', 'can\'t sleep', 'awake at night', 'tired'],
      title: 'Sleep and energy support',
      summary: 'Poor sleep can make stress and emotions feel stronger. A calm routine can help the body reset.',
      actions: [
        'Lower screen time before bed and keep the room dim and quiet.',
        'Keep a simple bedtime routine with the same wake and sleep time.',
        'Try a short walk or light stretching before bed.'
      ]
    },
    {
      id: 'anxiety',
      keywords: ['anxious', 'anxiety', 'nervous', 'worry'],
      title: 'Anxiety support',
      summary: 'Anxiety often gets stronger when the mind feels overloaded. Grounding and structure can help bring it back under control.',
      actions: [
        'Try a brief breathing exercise and focus on one thing at a time.',
        'Write down the main worry and one small step you can take today.',
        'Talk with someone you trust instead of carrying it alone.'
      ]
    },
    {
      id: 'mood',
      keywords: ['sad', 'depressed', 'low mood', 'hopeless', 'lonely'],
      title: 'Low mood and discouragement',
      summary: 'It can help to slow down and choose one small comforting action instead of pushing yourself too hard.',
      actions: [
        'Do one gentle activity that feels comforting or meaningful.',
        'Spend a little time with someone supportive or message someone you trust.',
        'Take the pressure off yourself and focus on one small win for today.'
      ]
    },
    {
      id: 'stress',
      keywords: ['stress', 'overwhelmed', 'pressure', 'burnout'],
      title: 'Stress and pressure',
      summary: 'When life feels heavy, a simple plan helps more than a perfect plan.',
      actions: [
        'Break the day into three small tasks instead of one big list.',
        'Take a short break and breathe slowly before continuing.',
        'Let one thing wait if it is not urgent.'
      ]
    }
  ];

  function normalizeText(text) {
    return (text || '')
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function buildSupportResponse(text, context = {}) {
    const lower = normalizeText(text);
    const matched = supportPatterns.filter((pattern) =>
      pattern.keywords.some((keyword) => lower.includes(keyword))
    );

    const primary = matched[0] || {
      title: 'A calm next step',
      summary: 'You do not have to solve everything at once. Start with one small action and let the rest wait.',
      actions: [
        'Take five slow breaths and pause for a moment.',
        'Write down one thing that feels hardest right now.',
        'Choose one small task you can complete in the next 10 minutes.'
      ]
    };

    return {
      title: primary.title,
      summary: primary.summary,
      actions: primary.actions,
      urgency: primary.id === 'urgent' ? 'high' : 'moderate'
    };
  }

  function buildWellnessMessage(data, level, notes = '') {
    const categories = ['stress', 'anxiety', 'sleep', 'mood', 'social', 'physical', 'pressure', 'irritability', 'concentration', 'hope'];
    const names = {
      stress: 'stress',
      anxiety: 'anxiety',
      sleep: 'sleep',
      mood: 'mood',
      social: 'support',
      physical: 'movement and self-care',
      pressure: 'pressure',
      irritability: 'irritability',
      concentration: 'focus',
      hope: 'hope and motivation'
    };

    const concerns = categories.filter((cat) => {
      const value = parseInt(data[cat], 10) || 3;
      return value <= 2;
    });

    if (concerns.length === 0) {
      return 'Your responses suggest that you are coping fairly well. Keep your routine steady, protect your sleep, and continue checking in with yourself.';
    }

    const firstConcern = concerns[0];
    const response = buildSupportResponse(notes || '', { type: 'assessment' });

    if (level === 'Needs Attention') {
      return `Your results suggest several areas need care right now. ${response.summary} Please be gentle with yourself and consider reaching out to a trusted person or a health professional if the struggle continues.`;
    }

    return `Your results point most strongly to ${names[firstConcern]}. ${response.summary} A small, steady plan like rest, breathing, movement, and one supportive conversation can make a meaningful difference.`;
  }

  global.generateAdviceResponse = buildSupportResponse;
  global.buildWellnessMessage = buildWellnessMessage;
})(window);
