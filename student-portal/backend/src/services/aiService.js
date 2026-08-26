const fs = require('fs');
const path = require('path');

const knowledgePath = path.join(__dirname, '..', 'knowledge', 'knowledge.json');
const knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));

const SCOPE_RESPONSE =
  "Hello! 👋 I'm Kiharu AI, the virtual assistant for Kiharu Technical & Vocational College. I can help you with programmes, admissions, fees, entry requirements, contacts, services and other information about the college. How may I help you today?";

const UNKNOWN_RESPONSE =
  "I'm sorry, I don't have that information yet. Please contact Kiharu Technical & Vocational College for further assistance.";

const stopWords = new Set([
  'a', 'an', 'and', 'are', 'at', 'can', 'college', 'does', 'for', 'from', 'how',
  'i', 'is', 'it', 'kiharu', 'me', 'of', 'on', 'please', 'technical', 'the',
  'there', 'to', 'tvc', 'vocational', 'what', 'when', 'where', 'which', 'with',
  'you', 'your'
]);

const synonyms = {
  course: [
    'courses',
    'programme',
    'programmes',
    'program',
    'programs',
    'study',
    'studies',
    'available',
    'offer',
    'offered'
  ],

  location: [
    'located',
    'find',
    'directions',
    'map',
    'address'
  ],

  contact: [
    'contacts',
    'phone',
    'call',
    'email',
    'reach',
    'address'
  ],

  admissions: [
    'admission',
    'apply',
    'application',
    'applications',
    'intake',
    'join',
    'registration'
  ],

  fees: [
    'fee',
    'payment',
    'payments',
    'finance',
    'structure',
    'mpesa',
    'm',
    'pesa'
  ],

  jobs: [
    'job',
    'career',
    'careers',
    'vacancy',
    'vacancies',
    'employment'
  ],

  tenders: [
    'tender',
    'procurement',
    'bid',
    'bids',
    'supplier',
    'suppliers'
  ],

  requirements: [
    'requirement',
    'eligibility',
    'entry',
    'kcse',
    'kcpe'
  ],

  services: [
    'service',
    'charter',
    'facility',
    'facilities'
  ]
};

const intentEntryIds = [
  {
    terms: [
      'courses',
      'course',
      'programmes',
      'programme',
      'programs',
      'program',
      'study',
      'studies',
      'offered',
      'offer',
      'available'
    ],
    ids: ['programmes', 'short-courses']
  },

  {
    terms: [
      'apply',
      'application',
      'admission',
      'admissions',
      'join',
      'intake',
      'registration'
    ],
    ids: ['admissions', 'application-process']
  },

  {
    terms: [
      'location',
      'located',
      'where',
      'find',
      'directions',
      'map'
    ],
    ids: ['location', 'contact']
  },

  {
    terms: [
      'contact',
      'phone',
      'call',
      'reach',
      'address',
      'office'
    ],
    ids: ['contact']
  },

  {
    terms: [
      'fees',
      'fee',
      'payment',
      'payments',
      'mpesa',
      'finance'
    ],
    ids: ['fees']
  },

  {
    terms: [
      'requirements',
      'requirement',
      'eligibility',
      'entry',
      'kcse',
      'kcpe'
    ],
    ids: ['entry-requirements']
  },

  {
    terms: [
      'jobs',
      'job',
      'vacancies',
      'vacancy',
      'careers',
      'employment'
    ],
    ids: ['jobs']
  },

  {
    terms: [
      'tenders',
      'tender',
      'procurement',
      'bids',
      'suppliers'
    ],
    ids: ['tenders']
  }
];

const GREETING_RESPONSES = {
  english: [
    "Hello! 👋 Welcome to Kiharu TVC. How may I help you today?",
    "Hi! 👋 Welcome to Kiharu Technical & Vocational College. What would you like to know?",
    "Hey! 👋 Welcome to Kiharu TVC. How can I assist you today?"
  ],

  swahili: [
    "Habari! 👋 Karibu Kiharu TVC. Ninaweza kukusaidia kwa jambo gani leo?",
    "Karibu Kiharu Technical & Vocational College! 👋 Ungependa kujua nini?",
    "Habari! 👋 Karibu Kiharu TVC. Unaweza kuniuliza kuhusu kozi, udahili, ada au huduma za chuo."
  ]
};

const GREETING_WORDS = new Set([
  'hi',
  'hello',
  'hey',
  'hallo',
  'morning',
  'afternoon',
  'evening',
  'good',
  'habari',
  'hujambo',
  'jambo',
  'mambo',
  'salamu',
  'niaje'
]);

const SWAHILI_WORDS = new Set([
  'habari',
  'hujambo',
  'jambo',
  'mambo',
  'asante',
  'tafadhali',
  'nina',
  'naweza',
  'naweza',
  'je',
  'ni',
  'gani',
  'wapi',
  'lini',
  'kiasi',
  'ada',
  'kozi',
  'masomo',
  'kujiunga',
  'uandikishaji',
  'shule',
  'chuo',
  'mtihani',
  'mahafali',
  'nifanye',
  'nataka',
  'ninahitaji',
  'hii',
  'hiyo',
  'pia',
  'kwa',
  'ya',
  'wa',
  'katika'
]);

exports.getHealthStatus = () => {
  return 'ready';
};

const normalizeText = (text) => {
  return (text || '')
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d]/g, '')
    .match(/\b[a-z0-9]+\b/g) || [];
};

const expandTokens = (tokens) => {
  const expanded = new Set(tokens);

  for (const token of tokens) {
    for (const [canonical, variants] of Object.entries(synonyms)) {
      if (token === canonical || variants.includes(token)) {
        expanded.add(canonical);

        for (const variant of variants) {
          expanded.add(variant);
        }
      }
    }
  }

  return expanded;
};

const detectLanguage = (message) => {
  const tokens = normalizeText(message);

  const swahiliCount = tokens.filter((token) =>
    SWAHILI_WORDS.has(token)
  ).length;

  return swahiliCount > 0 ? 'swahili' : 'english';
};

const isGreeting = (message) => {
  const tokens = normalizeText(message);

  if (!tokens.length) {
    return false;
  }

  return tokens.every((token) => GREETING_WORDS.has(token));
};

const buildKnowledgeIndex = () => {
  return knowledge.entries.map((entry) => {
    const textTokens = normalizeText(entry.text);
    const tagTokens = (entry.tags || []).flatMap((tag) =>
      normalizeText(tag)
    );
    const titleTokens = normalizeText(entry.title);

    const tokens = expandTokens(
      textTokens.concat(tagTokens, titleTokens)
    );

    return {
      ...entry,
      tokens
    };
  });
};

const knowledgeIndex = buildKnowledgeIndex();

const findBestEntry = (message) => {
  const queryTokenList = normalizeText(message);
  const queryTokens = expandTokens(queryTokenList);

  if (!queryTokens.size) {
    return null;
  }

  const scores = knowledgeIndex.map((entry) => {
    let score = 0;

    for (const token of queryTokens) {
      if (stopWords.has(token)) {
        continue;
      }

      if (entry.tokens.has(token)) {
        score += 1;
      }
    }

    for (const tag of entry.tags || []) {
      const tagTokens = normalizeText(tag).filter(
        (token) => !stopWords.has(token)
      );

      if (
        tagTokens.length &&
        tagTokens.every((token) => queryTokens.has(token))
      ) {
        score += tagTokens.length + 2;
      }
    }

    for (const intent of intentEntryIds) {
      if (
        intent.ids.includes(entry.id) &&
        intent.terms.some((term) => queryTokens.has(term))
      ) {
        score += 5;
      }
    }

    return {
      entry,
      score
    };
  });

  scores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return (
      (a.entry.id === 'fallback') -
      (b.entry.id === 'fallback')
    );
  });

  const best = scores[0];

  if (
    !best ||
    best.score < 2 ||
    best.entry.id === 'fallback'
  ) {
    return null;
  }

  return best.entry;
};

const isInKiharuScope = (message) => {
  const tokens = expandTokens(normalizeText(message));

  const explicitKiharuTerms = [
    'kiharu',
    'tvc',
    'technical',
    'vocational',
    'college'
  ];

  if (
    explicitKiharuTerms.some((term) =>
      tokens.has(term)
    )
  ) {
    return true;
  }

  return knowledgeIndex.some((entry) => {
    if (entry.id === 'fallback') {
      return false;
    }

    return [...tokens].some(
      (token) =>
        !stopWords.has(token) &&
        entry.tokens.has(token)
    );
  });
};

exports.chat = async (message) => {
  const query = (message || '').trim();

  if (!query) {
    throw new Error('Message is required');
  }

  const language = detectLanguage(query);

  if (isGreeting(query)) {
    const responses = GREETING_RESPONSES[language];

    return responses[
      Math.floor(Math.random() * responses.length)
    ];
  }

  if (!isInKiharuScope(query)) {
    return SCOPE_RESPONSE;
  }

  const isGeneralFeesQuestion = (message) => {
    const text = message.toLowerCase().trim();

    const generalFeePatterns = [
      /^(what|how much|how|tell me|show me).*(fees?|fee structure|school fees|cost)/,
      /^(fees?|fee structure|school fees|cost)$/i,
      /(how do i pay|payment methods|pay fees)/,
      /^(ada|muundo wa ada|gharama).*$/i
    ];

    const specificFeePatterns = [
      /module\s*[123]/i,
      /registration fee/i,
      /student id/i,
      /student welfare/i,
      /tveta fee/i,
      /kuccps fee/i,
      /account number/i,
      /bank/i,
      /kcb/i,
      /equity/i,
      /mpesa/i
    ];

    if (specificFeePatterns.some((pattern) => pattern.test(text))) {
      return false;
    }

    return generalFeePatterns.some((pattern) => pattern.test(text));
  };

  const bestEntry = findBestEntry(query);

  if (!bestEntry) {
    return UNKNOWN_RESPONSE;
  }

  if (isGeneralFeesQuestion(query)) {
    return {
      text: "Kiharu TVC fees vary by programme and level. You can view the official fees structure below.",
      document: {
        title: "Kiharu TVC Fees Structure",
        label: "View Fees Structure (PDF)",
        url: "/feesstructure.pdf"
      }
    };
  }

  return {
    text: bestEntry.text
  };
};