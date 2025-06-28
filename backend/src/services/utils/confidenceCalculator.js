
export function calculateConfidence(text) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return 0;
  }

  const cleanText = text.trim();
  let score = 0.5;

  score += evaluateLength(cleanText);
  score += evaluatePunctuation(cleanText);
  score += evaluateWordQuality(cleanText);
  score += evaluateCharacterDistribution(cleanText);
  score += evaluateLanguageConsistency(cleanText);

  return Math.max(0, Math.min(1, score));
}

function evaluateLength(text) {
  const length = text.length;
  
  if (length < 10) return -0.3; 
  if (length < 30) return -0.1;
  if (length > 50) return 0.1;  
  if (length > 200) return 0.2; 
  
  return 0;
}

function evaluatePunctuation(text) {
  let score = 0;
  
  if (/[.!?]$/.test(text)) score += 0.15;
  
  const commaRatio = (text.match(/,/g) || []).length / text.split(' ').length;
  if (commaRatio > 0 && commaRatio < 0.3) score += 0.1;
  if (/[:;]/.test(text)) score += 0.05;
  return score;
}

function evaluateWordQuality(text) {
  const words = text.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0) return -0.5;
  
  let score = 0;
  
  const avgLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  if (avgLength < 2) score -= 0.3; 
  if (avgLength >= 3 && avgLength <= 8) score += 0.1; 
  
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const diversityRatio = uniqueWords.size / words.length;
  if (diversityRatio > 0.7) score += 0.15; 
  if (diversityRatio < 0.3) score -= 0.2; 
  
  const wordCounts = {};
  words.forEach(word => {
    const clean = word.toLowerCase().replace(/[^\w]/g, '');
    wordCounts[clean] = (wordCounts[clean] || 0) + 1;
  });
  
  const maxRepetitions = Math.max(...Object.values(wordCounts));
  if (maxRepetitions > words.length * 0.5) score -= 0.3; 
  
  return score;
}

function evaluateCharacterDistribution(text) {
  let score = 0;
  const strangeChars = text.match(/[^\w\s\p{P}\p{M}]/gu) || [];
  const strangeRatio = strangeChars.length / text.length;
  if (strangeRatio > 0.1) score -= 0.3;
  if (strangeRatio > 0.2) score -= 0.5;
  
  const repeatedChars = text.match(/(.)\1{3,}/g) || [];
  if (repeatedChars.length > 0) score -= 0.2;
  
  const numbers = text.match(/\d/g) || [];
  const letters = text.match(/[a-zA-ZÀ-ÿ]/g) || [];
  if (letters.length > 0) {
    const numberRatio = numbers.length / (numbers.length + letters.length);
    if (numberRatio < 0.3) score += 0.1;
  }
  
  return score;
}

function evaluateLanguageConsistency(text) {
  let score = 0;

  const commonWords = ['o', 'a', 'e', 'de', 'da', 'do', 'em', 'um', 'uma', 'para', 'com', 'não', 'que', 'se', 'eu', 'você'];
  const words = text.toLowerCase().split(/\s+/);
  const commonWordCount = words.filter(word => commonWords.includes(word)).length;
  const commonRatio = commonWordCount / words.length;
  
  if (commonRatio > 0.1) score += 0.1;
  if (commonRatio > 0.2) score += 0.1;
  
  if (/\b(que|para|com|não|muito|bem|então)\b/i.test(text)) score += 0.05;
  
  if (/\b\w+(ção|são|mente|ando|endo|ido|ada)\b/i.test(text)) score += 0.05;
  
  return score;
}

export function getTextStatistics(text) {
  if (!text || typeof text !== 'string') {
    return {
      wordCount: 0,
      charCount: 0,
      sentenceCount: 0,
      avgWordsPerSentence: 0,
      avgCharsPerWord: 0
    };
  }

  const cleanText = text.trim();
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  return {
    wordCount: words.length,
    charCount: cleanText.length,
    sentenceCount: sentences.length,
    avgWordsPerSentence: sentences.length > 0 ? (words.length / sentences.length).toFixed(1) : 0,
    avgCharsPerWord: words.length > 0 ? (cleanText.replace(/\s/g, '').length / words.length).toFixed(1) : 0,
    confidence: calculateConfidence(text)
  };
}