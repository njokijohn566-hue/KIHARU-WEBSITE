const knowledge = require('../knowledge/knowledge.json');

exports.getHealthStatus = () => {
  return 'ready';
};

const normalizeText = (text) => {
  return (text || '')
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d]/g, "")
    .match(/\b[a-z0-9]+\b/g) || [];
};

const buildKnowledgeIndex = () => {
  return knowledge.entries.map((entry) => {
    const textTokens = normalizeText(entry.text);
    const tagTokens = (entry.tags || []).flatMap((tag) => normalizeText(tag));
    const tokens = new Set(textTokens.concat(tagTokens));
    return {
      ...entry,
      tokens,
    };
  });
};

const knowledgeIndex = buildKnowledgeIndex();

const findBestEntry = (message) => {
  const queryTokens = new Set(normalizeText(message));
  if (!queryTokens.size) {
    return knowledge.entries.find((entry) => entry.id === 'fallback');
  }

  const scores = knowledgeIndex.map((entry) => {
    let score = 0;
    for (const token of queryTokens) {
      if (entry.tokens.has(token)) {
        score += 1;
      }
    }
    for (const tag of entry.tags || []) {
      if (queryTokens.has(tag)) {
        score += 2;
      }
    }
    return { entry, score };
  });

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];

  if (!best || best.score < 2) {
    return knowledge.entries.find((entry) => entry.id === 'fallback');
  }

  return best.entry;
};

exports.chat = async (message) => {
  const query = (message || '').trim();
  if (!query) {
    throw new Error('Message is required');
  }

  const bestEntry = findBestEntry(query);

  return `According to Kiharu TVC public information, ${bestEntry.text}`;
};
