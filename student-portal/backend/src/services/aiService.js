const fs = require('fs');
const path = require('path');

const knowledgePath = path.join(__dirname, '..', 'knowledge', 'knowledge.json');
const knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));

const SCOPE_RESPONSE = "I'm Kiharu AI, the virtual assistant for Kiharu Technical & Vocational College. I can help with questions about the college, its courses, admissions, fees, services and other information available on our website.";
const UNKNOWN_RESPONSE = "I don't currently have that information in my Kiharu knowledge base. Please contact Kiharu Technical & Vocational College for assistance.";

const stopWords = new Set([
  'a', 'an', 'and', 'are', 'at', 'can', 'college', 'does', 'for', 'from', 'how',
  'i', 'is', 'it', 'kiharu', 'me', 'of', 'on', 'please', 'technical', 'the',
  'there', 'to', 'tvc', 'vocational', 'what', 'when', 'where', 'which', 'with',
  'you', 'your'
]);

const synonyms = {
  course: ['courses', 'programme', 'programmes', 'program', 'programs', 'study', 'studies', 'available', 'offer', 'offered'],
  location: ['located', 'find', 'directions', 'map', 'address'],
  contact: ['contacts', 'phone', 'call', 'email', 'reach', 'address'],
  admissions: ['admission', 'apply', 'application', 'applications', 'intake', 'join', 'registration'],
  fees: ['fee', 'payment', 'payments', 'finance', 'structure', 'mpesa', 'm', 'pesa'],
  jobs: ['job', 'career', 'careers', 'vacancy', 'vacancies', 'employment'],
  tenders: ['tender', 'procurement', 'bid', 'bids', 'supplier', 'suppliers'],
  requirements: ['requirement', 'eligibility', 'entry', 'kcse', 'kcpe'],
  services: ['service', 'charter', 'facility', 'facilities']
};

const intentEntryIds = [
  { terms: ['courses', 'course', 'programmes', 'programme', 'programs', 'program', 'study', 'studies', 'offered', 'offer', 'available'], ids: ['programmes', 'short-courses'] },
  { terms: ['apply', 'application', 'admission', 'admissions', 'join', 'intake', 'registration'], ids: ['admissions', 'application-process'] },
  { terms: ['location', 'located', 'where', 'find', 'directions', 'map'], ids: ['location', 'contact'] },
  { terms: ['contact', 'phone', 'call', 'reach', 'address', 'office'], ids: ['contact'] },
  { terms: ['fees', 'fee', 'payment', 'payments', 'mpesa', 'finance'], ids: ['fees'] },
  { terms: ['requirements', 'requirement', 'eligibility', 'entry', 'kcse', 'kcpe'], ids: ['entry-requirements'] },
  { terms: ['jobs', 'job', 'vacancies', 'vacancy', 'careers', 'employment'], ids: ['jobs'] },
  { terms: ['tenders', 'tender', 'procurement', 'bids', 'suppliers'], ids: ['tenders'] }
];

exports.getHealthStatus = () => {
  return 'ready';
};

const normalizeText = (text) => {
  return (text || '')
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d]/g, "")
    .match(/\b[a-z0-9]+\b/g) || [];
};

const expandTokens = (tokens) => {
  const expanded = new Set(tokens);

  for (const token of tokens) {
    for (const [canonical, variants] of Object.entries(synonyms)) {
      if (token === canonical || variants.includes(token)) {
        expanded.add(canonical);
        variants.forEach((variant) => expanded.add(variant));
      }
    }
  }

  return expanded;
};

const buildKnowledgeIndex = () => {
  return knowledge.entries.map((entry) => {
    const textTokens = normalizeText(entry.text);
    const tagTokens = (entry.tags || []).flatMap((tag) => normalizeText(tag));
    const titleTokens = normalizeText(entry.title);
    const tokens = expandTokens(textTokens.concat(tagTokens, titleTokens));
    return {
      ...entry,
      tokens,
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

    for (const tag of (entry.tags || [])) {
      const tagTokens = normalizeText(tag).filter((token) => !stopWords.has(token));
      if (tagTokens.length && tagTokens.every((token) => queryTokens.has(token))) {
        score += tagTokens.length + 2;
      }
    }

    for (const intent of intentEntryIds) {
      if (intent.ids.includes(entry.id) && intent.terms.some((term) => queryTokens.has(term))) {
        score += 5;
      }
    }

    return { entry, score };
  });

  scores.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (a.entry.id === 'fallback') - (b.entry.id === 'fallback');
  });
  const best = scores[0];

  if (!best || best.score < 2 || best.entry.id === 'fallback') {
    return null;
  }

  return best.entry;
};

const isInKiharuScope = (message) => {
  const tokens = expandTokens(normalizeText(message));
  const explicitKiharuTerms = ['kiharu', 'tvc', 'technical', 'vocational', 'college'];
  if (explicitKiharuTerms.some((term) => tokens.has(term))) {
    return true;
  }

  return knowledgeIndex.some((entry) => {
    if (entry.id === 'fallback') {
      return false;
    }
    return [...tokens].some((token) => !stopWords.has(token) && entry.tokens.has(token));
  });
};

exports.chat = async (message) => {
  const query = (message || '').trim();
  if (!query) {
    throw new Error('Message is required');
  }

  if (!isInKiharuScope(query)) {
    return SCOPE_RESPONSE;
  }

  const bestEntry = findBestEntry(query);
  if (!bestEntry) {
    return UNKNOWN_RESPONSE;
  }

  return `According to Kiharu TVC public information, ${bestEntry.text}`;
};
