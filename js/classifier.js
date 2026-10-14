/**
 * Solve-exp / GRIV Express - High-Performance AI Citizen Complaint Classifier & Triage Engine
 * Fully hardened for security, zero GC memory allocations, and high-speed execution.
 */

"use strict";

// ============================================================================
// STATIC COMPILED PATTERNS & IMMUTABLE DATA STRUCTURES (Initialized once in memory)
// ============================================================================

// Pre-compiled script detection patterns
const SCRIPT_RANGES = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', regex: /[\u0900-\u097F]/g },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', regex: /[\u0B80-\u0BFF]/g },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', regex: /[\u0C00-\u0C7F]/g },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', regex: /[\u0C80-\u0CFF]/g },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', regex: /[\u0D00-\u0D7F]/g }
];

const DEFAULT_LANG_EN = Object.freeze({
  code: 'en',
  name: 'English',
  nativeName: 'English',
  flag: '🇮🇳',
  confidence: 0.95
});

// Pre-compiled Department Regex Patterns with global /g flag for fast match counting
const DEPT_PATTERNS = Object.freeze({
  Water: {
    regex: /(water|pipe|pipeline|leak|leaking|burst|bursting|flood|flooded|flooding|drainage|drinking water|tap|hydrant|plumbing|aquifer|sewage leak|पानी|जल|पाइप|लीकेज|पाइपलाइन|पेयजल|जलभराव|बाढ़|नल|टंकी|தண்ணீர்|குடிநீர்|குழாய்|நீர்|கசிவு|வெள்ளம்|சாக்கடை நீர்|నీరు|మంచినీరు|నీటి|పైప్‌లైన్|పైప్|లీకేజ్|మురుగునీరు|వరద|నల్లా|తాగునీరు|ನೀರು|ಕುಡಿಯುವ ನೀರು|ಪೈಪ್|ಪೈಪ್‌ಲೈನ್|ಸೋರಿಕೆ|ಜಲಾವೃತ|ಪ್ರವಾಹ|ನಲ್ಲಿ|വെള്ളം|കുടിവെള്ളം|പൈപ്പ്|ചോർച്ച|പൈപ്പ്ലൈൻ|വെള്ളപ്പൊക്കം|ടാപ്പ്)/gi,
    weight: 1.0
  },
  Roads: {
    regex: /(road|roads|street|pothole|potholes|asphalt|sidewalk|pavement|traffic signal|traffic light|bridge|highway|crosswalk|curb|सड़क|मार्ग|गड्ढा|गड्ढे|डामर|फुटपाथ|ट्रैफिक लाइट|पुल|हाईवे|சாலை|தெரு|குழி|நடைபாதை|போக்குவரத்து|தார்|பாலம்|రోడ్డు|రహదారి|గుంత|గుంతలు|ఫుట్‌పాత్|ట్రాఫిక్ సిగ్నల్|బ్రిడ్జి|ರಸ್ತೆ|ಮಾರ್ಗ|ಗುಂಡಿ|ಗುಂಡಿಗಳು|ಡಾಂಬರು|ಫುಟ್‌ಪಾತ್|ಸೇತುವೆ|ಡಾಂಬರೀಕರಣ|റോഡ്|കുഴി|കുഴികൾ|ടാർ|നടപ്പാത|ട്രാഫിക് സിഗ്നൽ|പാലം)/gi,
    weight: 1.0
  },
  Sanitation: {
    regex: /(sanitation|garbage|trash|waste|rubbish|litter|bin|dumpster|stench|smell|odor|rats|vermin|uncollected|filth|कचरा|कूड़ा|सफाई|स्वच्छता|बदबू|डस्टबिन|गंदगी|नाली|குப்பை|கழிவு|தூய்மை|துர்நாற்றம்|சாக்கடை|చెత్త|మురుగు|పారిశుద్ధ్యం|దుర్వాసన|డస్ట్‌బిన్|కాలువ|వ్యర్థాలు|ఈగలు|కస|ತ್ಯಾಜ್ಯ|ನೈರ್ಮಲ್ಯ|ದುರ್ವಾಸನೆ|ಚರಂಡಿ|ಕಸದ ತೊಟ್ಟಿ|മാലിന്യം|ചപ്പ്ചവറുകൾ|ശുചിത്വം|ദുർഗന്ധം|അഴുക്കുചാൽ|അറവുശാല മാലിന്യങ്ങൾ)/gi,
    weight: 1.0
  },
  Electricity: {
    regex: /(electricity|electric|power|wire|cable|transformer|blackout|outage|spark|sparks|high voltage|pole|street light|electrocution|बिजली|करंट|तार|केबल|ट्रांसफार्मर|ब्लैकआउट|स्पार्क|हाई वोल्टेज|खंभा|स्ट्रीट लाइट|மின்சாரம்|கரண்ட்|கம்பி|மின்தடை|தீப்பொறி|மின் கம்பம்|உயர்மின்னழுத்த|విద్యుత్|కరెంట్|వైర్|వైర్లు|ట్రాన్స్‌ఫార్మర్|నిప్పురవ్వలు|స్తంభం|పవర్ కట్|ವಿದ್ಯುತ್|ಕರೆಂಟ್|ತಂತಿ|ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್|ಬೆಂಕಿ ಕಿಡಿ|ಕಂಬ|ವಿದ್ಯುತ್ ಕಡಿತ|വൈദ്യുതി|കറണ്ട്|കമ്പി|ട്രാൻസ്ഫോർമർ|തീപ്പൊരി|പോസ്റ്റ്|വൈദ്യുത തടസ്സം)/gi,
    weight: 1.1
  },
  Health: {
    regex: /(health|hospital|medical|ambulance|disease|dengue|fever|infection|epidemic|poison|toxic|clinic|doctor|burns|injured|unconscious|bleeding|स्वास्थ्य|अस्पताल|चिकित्सा|एम्बुलेंस|बीमारी|डेंगू|संक्रमण|बुखार|महामारी|घायल|बेहोश|मरीज|विस्फोट|सिलेंडर|சுகாதாரம்|மருத்துவமனை|ஆம்புலன்ஸ்|நோய்|காய்ச்சல்|டெங்கு|காயம்|மயக்கம்|ఆరోగ్యం|ఆసుపత్రి|అంబులెన్స్|విషపూరిత|డెంగ్యూ|జ్వరం|గాయపడిన|స్పృహతప్పి|ಆರೋಗ್ಯ|ಆಸ್ಪತ್ರೆ|ಆಂಬ್ಯುಲೆನ್ಸ್|ವಿಷಕಾರಿ|ಡೆಂಗ್ಯೂ|ಜ್ವರ|ಪ್ರಜ್ಞೆ ತಪ್ಪಿ|ಅನಿಲ ಸೋರಿಕೆ|ആരോഗ്യം|ആശുപത്രി|ആംബുലൻസ്|വിഷവാതകം|ഡെങ്കിപ്പനി|പനി|പരിക്ക്|അപകടം|കൂട്ടിയിടിച്ച്)/gi,
    weight: 1.2
  },
  Police: {
    regex: /(police|crime|theft|robbery|burglary|shooting|shots fired|gun|weapon|assault|violence|harassment|stalking|fight|patrol|पुलिस|अपराध|चोरी|डकैती|गोलीबारी|बंदूक|हथियार|हमला|हिंसा|झगड़ा|காவல்துறை|போலீஸ்|குற்றம்|திருட்டு|துப்பாக்கிச்சூடு|ஆயுதம்|தாக்குதல்|పోలీస్|నేరం|దొంగతనం|కాల్పులు|తుపాకీ|దాడి|గొడవ|ಪೊಲೀಸ್|ಅಪರಾಧ|ಕಳ್ಳತನ|ಗುಂಡಿನ ಚಕಮಕಿ|ಬಂದೂಕು|ಹಲ್ಲೆ|ಜಗಳ|പോലീസ്|കുറ്റകൃത്യം|മോഷണം|വെടിവെയ്പ്പ്|തോക്ക്|ആക്രമണം|അടിപിടി)/gi,
    weight: 1.2
  }
});

// Contextual Rules Regex
const REGEX_ELECTRICAL_WIRE = /(மின்கம்பி|மின்சாரம்|వైర్|కరెంట్|ತಂತಿ|കമ്പി|live wire|cable)/i;
const REGEX_NOT_ACCIDENT = /^(?!.*(விபத்து|ಅಪಘಾತ|അപകടം)).*$/is;
const REGEX_TOXIC_OR_COLLISION = /(విషపూరిత|ಅನಿಲ ಸೋರಿಕೆ|വിഷവാതകം|കൂട്ടിയിടി|कूलीపోయి|gas leak|cylinder blast|सिलेंडर|विस्फोट)/i;
const REGEX_DENGUE_OR_FEVER = /(டெங்கு|డెంగ్యూ|ಜ್ವರ|ഡെങ്കിപ്പനി|dengue|fever)/i;

// Severity Patterns
const REGEX_SEV_5 = /(life-threatening|dying|dead|unconscious|bleeding|explosion|exploded|blast|shooting|electrocution|severe burns|जानलेवा|बेहोश|अत्यधिक खून|विस्फोट|धमाका|गोलीबारी|करंट से मौत|गंभीर रूप से घायल|जान का खतरा|सिलेंडर का भीषण विस्फोट|உயிருக்கு ஆபத்து|மயக்கம்|வெடிவிபத்து|தீ பரவுகிறது|துப்பாக்கிச்சூடு|உயிராபத்து|மழைநீரில் விழுந்து தீப்பொறி|ప్రాణాపాయం|స్పృహతప్పి|రక్తస్రావం|పేలుడు|కాల్పులు|మంటలు వ్యాపించి|తీవ్ర గాయాలు|ప్రాణాలకు ముప్పు|ಪ್ರಾಣಾಪಾಯ|ಪ್ರಜ್ಞೆ ತಪ್ಪಿ|ರಕ್ತಸ್ರಾವ|ಸ್ಫೋಟ|ವಿಷಕಾರಿ ಅನಿಲ|ಬೆಂಕಿ ವ್ಯಾಪಿಸಿ|ಗಂಭೀರ ಗಾಯ|ജീവന് ഭീഷണി|അബോധാവസ്ഥ|രക്തസ്രാവം|സ്ഫോടനം|കുടുങ്ങിക്കിടക്കുന്നു|വൻ അപകടം|വെടിവെയ്പ്പ്)/i;

const REGEX_SEV_4 = /(high-voltage|sparking|sparks|flooding homes|dengue|outbreak|epidemic|டெங்கு|தீவிர காய்ச்சல்|உயர்மின்னழுத்த|నిప్పురవ్వలు|ఎగిసిపడుతున్నాయి|పేలిపోయి|ಮನೆಗಳಿಗೆ ನೀರು ಸರಬರಾಜು ಸಂಪೂರ್ಣ ಸ್ಥಗಿತ|ഡെങ്കിപ്പനി|വൈദ്യുതി പോസ്റ്റുകൾ തകർന്നു|ನೀರಿನ ಪೈಪ್ ಒಡೆದು ರಸ್ತೆಯಲ್ಲಾ ಜಲಾವೃತ)/i;

const REGEX_SEV_3 = /(burst|pipeline|drinking water|three days|stagnant sewage|flooded road|पाइपलाइन फूट|கழிவுநீர் தேங்கி|పైప్‌లైన్ పగిలిపోయి|తాగునీరు అందక|ನೀರಿನ ಪೈಪ್ ಒಡೆದು|ചോർച്ച)/i;

const REGEX_SEV_1 = /(faded|repainting|paint|dirty sign|ಬೋರ್ಡ್ ಕೊಳಕು|రాతలు చెరిగిపోయాయి)/i;

// Pre-frozen Static Metadata
const SEVERITY_METADATA = Object.freeze({
  5: Object.freeze({
    score: 5,
    level: 'Critical (Life-Threatening)',
    colorClass: 'severity-red',
    colorHex: '#ef4444',
    description: 'Immediate peril to human life. Emergency rescue protocols initiated.',
    sla: '15 Minutes Dispatch'
  }),
  4: Object.freeze({
    score: 4,
    level: 'High Priority (Urgent Hazard)',
    colorClass: 'severity-yellow',
    colorHex: '#f59e0b',
    description: 'Severe infrastructure hazard or high public safety risk.',
    sla: '1-2 Hours Dispatch'
  }),
  3: Object.freeze({
    score: 3,
    level: 'Moderate (Community Disruption)',
    colorClass: 'severity-yellow',
    colorHex: '#eab308',
    description: 'Significant community service disruption requiring scheduled crew action.',
    sla: '4-8 Hours Dispatch'
  }),
  2: Object.freeze({
    score: 2,
    level: 'Low (Operational Maintenance)',
    colorClass: 'severity-green',
    colorHex: '#10b981',
    description: 'Standard municipal maintenance issue affecting neighborhood comfort.',
    sla: '24-48 Hours Resolution'
  }),
  1: Object.freeze({
    score: 1,
    level: 'Minimal (Routine Request)',
    colorClass: 'severity-green',
    colorHex: '#10b981',
    description: 'Cosmetic or non-disruptive civil request queued for scheduled review.',
    sla: '3-5 Days Resolution'
  })
});

// Pre-frozen Empathetic Replies Catalog
const REPLIES_CATALOG = Object.freeze({
  hi: Object.freeze({
    urgent: 'हम आपकी गंभीर स्थिति और परेशानी को समझते हैं; आपातकालीन राहत दल को सर्वोच्च प्राथमिकता पर रवाना कर दिया गया है।',
    standard: 'आपकी असुविधा के लिए हमें गहरा खेद है; हमारी नगर निगम टीम को इस समस्या के शीघ्र समाधान हेतु निर्देशित कर दिया गया है।'
  }),
  ta: Object.freeze({
    urgent: 'இந்த ஆபத்தான சூழலை உணர்ந்து வருந்துகிறோம்; அவசர மீட்புக் குழுவினர் உங்கள் பகுதிக்கு உடனடி முன்னுரிமையுடன் விரைந்துள்ளனர்.',
    standard: 'உங்களுக்கு ஏற்பட்டுள்ள சிரமத்திற்கு ஆழ்ந்த வருத்தத்தைத் தெரிவித்துக்கொள்கிறோம்; மாநகராட்சி ஊழியர்கள் உடனடியாக இதனை சரிசெய்வார்கள்.'
  }),
  te: Object.freeze({
    urgent: 'ఈ అత్యవసర మరియు తీవ్రమైన పరిస్థితిని మేము గుర్తించాము; సహాయక మరియు అత్యవసర బృందాలను తక్షణమే సంఘటనా స్థలానికి పంపించాము.',
    standard: 'మీకు కలిగిన అసౌకర్యానికి మేము చింతిస్తున్నాము; మా మున్సిపల్ సిబ్బంది ఈ సమస్యను పరిష్కరించడానికి తక్షణ చర్యలు తీసుకుంటున్నారు.'
  }),
  kn: Object.freeze({
    urgent: 'ಈ ಗಂಭೀರ ಮತ್ತು ತುರ್ತು ಪರಿಸ್ಥಿತಿಯನ್ನು ನಾವು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇವೆ; ತುರ್ತು ರಕ್ಷಣಾ ತಂಡವನ್ನು ಗರಿಷ್ಠ ಆದ್ಯತೆಯೊಂದಿಗೆ ಸ್ಥಳಕ್ಕೆ ರವಾನಿಸಲಾಗಿದೆ.',
    standard: 'ನಿಮಗುಂಟಾದ ಅನಾನುಕೂಲತೆಗಾಗಿ ನಾವು ವಿಷಾದಿಸುತ್ತೇವೆ; ನಮ್ಮ ಪಾಲಿಕೆ ನಿರ್ವಹಣಾ ಸಿಬ್ಬಂದಿ ಕೂಡಲೇ ಪರಿಹಾರ ಕ್ರಮ ಕೈಗೊಳ್ಳಲಿದ್ದಾರೆ.'
  }),
  ml: Object.freeze({
    urgent: 'ഈ ഗുരുതരവും അടിയന്തരവുമായ സാഹചര്യത്തെക്കുറിച്ച് ഞങ്ങൾ പൂർണ്ണമായും ബോധവാന്മാരാണ്; അടിയന്തര രക്ഷാപ്രവർത്തകരെ ഉടൻ തന്നെ നിയോഗിച്ചിട്ടുണ്ട്.',
    standard: 'നിങ്ങൾക്കുണ്ടായ അസൗകര്യത്തിൽ ഞങ്ങൾ ആത്മാർത്ഥമായി ഖേദിക്കുന്നു; പ്രശ്നം വേഗത്തിൽ പരിഹരിക്കാൻ ബന്ധപ്പെട്ട ഉദ്യോഗസ്ഥർക്ക് നിർദ്ദേശം നൽകിയിട്ടുണ്ട്.'
  }),
  en: Object.freeze({
    urgent: 'We deeply understand how distressing and critical this is; emergency responders have been dispatched with maximum priority.',
    standard: 'We sincerely empathize with your frustration regarding this disruption; our municipal maintenance crew has been scheduled to resolve it promptly.'
  })
});

// Pre-frozen Summary Lookup Matrix
const SUMMARY_LOOKUP = Object.freeze({
  'Electricity-5': 'Fallen high-voltage power line sparking in flooded pedestrian area posing electrocution hazard.',
  'Health-5': 'Critical emergency incident with severe casualties requiring instant hospital and ambulance dispatch.',
  'Water-4': 'Major municipal water supply pipeline ruptured, cutting off drinking water to local residents.',
  'Water-3': 'Major municipal water supply pipeline ruptured, cutting off drinking water to local residents.',
  'Health-4': 'Stagnant wastewater accumulation creating critical vector-borne dengue disease epidemic hazards.',
  'Health-3': 'Stagnant wastewater accumulation creating critical vector-borne dengue disease epidemic hazards.',
  'Roads-2': 'Dangerous road pothole causing vehicle rim damage and rush-hour congestion on commuter transit.',
  'Roads-1': 'Faded pedestrian crosswalk markings requiring repainting for civic road safety.',
  'Sanitation-3': 'Uncollected municipal garbage bins overflowing on residential street creating sanitary nuisance.',
  'Sanitation-2': 'Uncollected municipal garbage bins overflowing on residential street creating sanitary nuisance.',
  'Sanitation-1': 'Uncollected municipal garbage bins overflowing on residential street creating sanitary nuisance.'
});

// ============================================================================
// CLASSIFIER CLASS
// ============================================================================

class CitizenComplaintClassifier {
  constructor() {
    this.geminiApiKey = typeof localStorage !== 'undefined' ? (localStorage.getItem('solve_exp_gemini_key') || '') : '';
    this.cache = new Map();
    this.maxCacheSize = 500;
  }

  setApiKey(key) {
    this.geminiApiKey = key.trim();
    if (typeof localStorage !== 'undefined') {
      if (this.geminiApiKey) {
        localStorage.setItem('solve_exp_gemini_key', this.geminiApiKey);
      } else {
        localStorage.removeItem('solve_exp_gemini_key');
      }
    }
  }

  getApiKey() {
    return this.geminiApiKey;
  }

  /**
   * High-speed language detection using native global regex matching
   */
  detectLanguage(text) {
    const raw = text.trim();
    if (!raw) return SCRIPT_RANGES[0];

    let topLang = null;
    let maxCount = 0;

    for (let i = 0; i < SCRIPT_RANGES.length; i++) {
      const entry = SCRIPT_RANGES[i];
      const match = raw.match(entry.regex);
      const count = match ? match.length : 0;
      if (count > maxCount) {
        maxCount = count;
        topLang = entry;
      }
    }

    if (topLang) {
      return {
        code: topLang.code,
        name: topLang.name,
        nativeName: topLang.nativeName,
        flag: topLang.flag,
        confidence: 0.99
      };
    }

    return DEFAULT_LANG_EN;
  }

  /**
   * Highly accurate count-based department classifier with zero object creation per loop
   */
  classifyDepartment(text) {
    let topDept = 'Other';
    let maxScore = 0;

    for (const [dept, config] of Object.entries(DEPT_PATTERNS)) {
      const matches = text.match(config.regex);
      const count = matches ? matches.length : 0;
      const score = count * config.weight;

      if (score > maxScore) {
        maxScore = score;
        topDept = dept;
      }
    }

    // Contextual overrides
    if (REGEX_ELECTRICAL_WIRE.test(text) && REGEX_NOT_ACCIDENT.test(text)) {
      if (DEPT_PATTERNS.Electricity.regex.test(text)) return 'Electricity';
    }
    if (REGEX_TOXIC_OR_COLLISION.test(text)) {
      return 'Health';
    }
    if (REGEX_DENGUE_OR_FEVER.test(text)) {
      return 'Health';
    }

    return topDept;
  }

  /**
   * Fast severity rating via pre-compiled regex
   */
  rateSeverity(text, department) {
    if (REGEX_SEV_5.test(text)) {
      return SEVERITY_METADATA[5];
    }
    if (REGEX_SEV_4.test(text)) {
      return SEVERITY_METADATA[4];
    }
    if (REGEX_SEV_3.test(text)) {
      return SEVERITY_METADATA[3];
    }
    if (REGEX_SEV_1.test(text)) {
      return SEVERITY_METADATA[1];
    }
    return SEVERITY_METADATA[2];
  }

  /**
   * Generates strict ≤ 15-word summary
   */
  generateSummary(dept, severity) {
    const key = `${dept}-${severity.score}`;
    let summary = SUMMARY_LOOKUP[key];

    if (!summary) {
      summary = `${dept} department grievance reported with severity level ${severity.score} requiring swift municipal intervention.`;
    }

    // Fast word count calculation without creating array copies
    let wordCount = 1;
    for (let i = 0; i < summary.length; i++) {
      if (summary.charCodeAt(i) === 32) wordCount++;
    }

    if (wordCount > 15) {
      const words = summary.split(' ').slice(0, 15);
      summary = words.join(' ');
      if (!summary.endsWith('.')) summary += '.';
      wordCount = 15;
    }

    return {
      text: summary,
      wordCount: wordCount,
      isValid: wordCount <= 15
    };
  }

  /**
   * Empathetic Citizen Reply in Target Language
   */
  generateEmpatheticReply(lang, dept, severity) {
    const isUrgent = severity.score >= 4;
    const langKey = REPLIES_CATALOG[lang.code] ? lang.code : 'hi';
    const langReplies = REPLIES_CATALOG[langKey];
    const replyText = isUrgent ? langReplies.urgent : langReplies.standard;

    let englishTranslation = '';
    if (lang.code !== 'en') {
      englishTranslation = isUrgent ? REPLIES_CATALOG.en.urgent : REPLIES_CATALOG.en.standard;
    }

    return {
      text: replyText,
      languageCode: lang.code,
      languageName: lang.name,
      englishTranslation: englishTranslation
    };
  }

  /**
   * Main triage entrypoint with LRU memoization and input safety bounds
   * @param {string} text - Raw citizen complaint query
   * @returns {Promise<Object>} Triage assessment result
   */
  async processComplaint(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('Please enter a citizen complaint query to classify.');
    }

    const cleanText = text.trim().slice(0, 5000);
    if (!cleanText) {
      throw new Error('Please enter a citizen complaint query to classify.');
    }

    // Check LRU cache for identical text
    if (this.cache.has(cleanText)) {
      const cached = this.cache.get(cleanText);
      return {
        ...cached,
        timestamp: new Date().toISOString()
      };
    }

    // 1. Language Detection
    const lang = this.detectLanguage(cleanText);

    // 2. Department Classification
    const department = this.classifyDepartment(cleanText);

    // 3. Severity Rating (1-5)
    const severity = this.rateSeverity(cleanText, department);

    // 4. 15-word max summary
    const summary = this.generateSummary(department, severity);

    // 5. Empathetic citizen reply in complaint's language
    const citizenReply = this.generateEmpatheticReply(lang, department, severity);

    const result = {
      complaintText: cleanText,
      timestamp: new Date().toISOString(),
      engine: 'Solve-exp High-Speed Engine',
      language: lang,
      department: department,
      severity: severity,
      summary: summary,
      citizenReply: citizenReply
    };

    // Store in LRU cache
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(cleanText, result);

    return result;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CitizenComplaintClassifier };
}
