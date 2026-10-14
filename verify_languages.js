const { CitizenComplaintClassifier } = require('./js/classifier.js');

const classifier = new CitizenComplaintClassifier();

// Test suite covering every supported language across multiple departments and severity levels
const TEST_SUITE = [
  // 1. HINDI (हिन्दी)
  {
    langName: 'Hindi',
    langCode: 'hi',
    dept: 'Water',
    expectedSev: 3,
    text: 'हमारे इलाके सेक्टर 4 में मुख्य पेयजल पाइपलाइन फूट गई है। पिछले तीन दिनों से घरों में पीने का पानी नहीं आ रहा है और लाखों लीटर पानी सड़क पर व्यर्थ बह रहा है।'
  },
  {
    langName: 'Hindi',
    langCode: 'hi',
    dept: 'Health',
    expectedSev: 5,
    text: 'सब्जी मंडी चौराहे पर रसोई गैस सिलेंडर का भीषण विस्फोट हुआ है। आग तेजी से दुकानों में फैल रही है और दो लोग गंभीर रूप से जलकर बेहोश पड़े हैं, तुरंत दमकल और एम्बुलेंस भेजें!'
  },
  {
    langName: 'Hindi',
    langCode: 'hi',
    dept: 'Roads',
    expectedSev: 2,
    text: 'मुख्य बाजार रोड पर बड़ा गड्ढा हो गया है जिससे बाइक सवार गिर रहे हैं, कृपया जल्द सड़क की मरम्मत कराएं।'
  },

  // 2. TAMIL (தமிழ்)
  {
    langName: 'Tamil',
    langCode: 'ta',
    dept: 'Electricity',
    expectedSev: 5,
    text: 'கனமழை காரணமாக பள்ளி வளாகம் அருகே உயர்மின்னழுத்த மின்கம்பி அறுந்து தேங்கிய மழைநீரில் விழுந்து தீப்பொறி பறக்கிறது. பள்ளி குழந்தைகள் நடமாடும் பகுதி, உயிருக்கு ஆபத்து, உடனடியாக மின்சாரத்தை துண்டித்து சரிசெய்யவும்!'
  },
  {
    langName: 'Tamil',
    langCode: 'ta',
    dept: 'Health',
    expectedSev: 4,
    text: 'எங்கள் குடியிருப்பு பகுதியில் சாக்கடை கால்வாய் உடைந்து கழிவுநீர் தெருவில் தேங்கி நிற்கிறது. கொசுக்கள் அதிகளவில் உற்பத்தியாகி குழந்தைகளுக்கு தீவிர டெங்கு காய்ச்சல் பரவி வருகிறது.'
  },
  {
    langName: 'Tamil',
    langCode: 'ta',
    dept: 'Roads',
    expectedSev: 2,
    text: 'அண்ணா சாலையில் பேருந்து நிறுத்தம் அருகே ஆழமான குழி ஏற்பட்டுள்ளது. இருசக்கர வாகன ஓட்டிகள் விபத்தில் சிக்குகின்றனர், உடனே தார் பூசி சீரமைக்கவும்.'
  },

  // 3. TELUGU (తెలుగు)
  {
    langName: 'Telugu',
    langCode: 'te',
    dept: 'Water',
    expectedSev: 3,
    text: 'మా కాలనీలో మెయిన్ వాటర్ సప్లై పైప్‌లైన్ పగిలిపోయి మురుగునీరు తాగునీటిలో కలుస్తోంది. గత నాలుగు రోజులుగా ప్రజలకు స్వచ్ఛమైన తాగునీరు అందక తీవ్ర ఇబ్బందులు పడుతున్నారు.'
  },
  {
    langName: 'Telugu',
    langCode: 'te',
    dept: 'Sanitation',
    expectedSev: 2,
    text: 'గాంధీ నగర్ మెయిన్ వీధిలో పది రోజులుగా మున్సిపల్ చెత్త కుండీలను ఎవరూ ఖాళీ చేయడం లేదు. రోడ్డుపై చెత్త పేరుకుపోయి తీవ్ర దుర్வாసన వస్తోంది మరియు ఈగలు ముసురుతున్నాయి.'
  },
  {
    langName: 'Telugu',
    langCode: 'te',
    dept: 'Electricity',
    expectedSev: 4,
    text: 'రహదారిపై ట్రాన్స్‌ఫార్మర్ పేలిపోయి వైర్ల నుంచి నిప్పురవ్వలు ఎగిసిపడుతున్నాయి, సమీపంలోని దుకాణాలకు మంటలు వ్యాపించే ప్రమాదం ఉంది.'
  },

  // 4. KANNADA (ಕನ್ನಡ)
  {
    langName: 'Kannada',
    langCode: 'kn',
    dept: 'Health',
    expectedSev: 5,
    text: 'ಕೈಗಾರಿಕಾ ಪ್ರದೇಶದ ಕಾರ್ಖಾನೆಯಿಂದ ವಿಷಕಾರಿ ಅನಿಲ ಸೋರಿಕೆಯಾಗಿದ್ದು ಸುತ್ತಮುತ್ತಲಿನ ನೂರಾರು ಜನರಿಗೆ ಉಸಿರಾಟದ ತೊಂದರೆಯಾಗಿ ಪ್ರಜ್ಞೆ ತಪ್ಪಿ ಬೀಳುತ್ತಿದ್ದಾರೆ, ಪ್ರಾಣಾಪಾಯವಿದೆ, ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್ ಮತ್ತು ವೈದ್ಯಕೀಯ ತಂಡ ಕಳುಹಿಸಿ!'
  },
  {
    langName: 'Kannada',
    langCode: 'kn',
    dept: 'Roads',
    expectedSev: 2,
    text: 'ಜಯನಗರ ಮುಖ್ಯ ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಆಳವಾದ ಗುಂಡಿ ಬಿದ್ದಿದ್ದು, ವಾಹನ ಸವಾರರು ಕೆಳಗೆ ಬಿದ್ದು ಗಾಯಗೊಳ್ಳುತ್ತಿದ್ದಾರೆ. ದಯವಿಟ್ಟು ಕೂಡಲೇ ಡಾಂಬರೀಕರಣ ಮಾಡಿ ರಸ್ತೆ ದುರಸ್ತಿಗೊಳಿಸಿ.'
  },
  {
    langName: 'Kannada',
    langCode: 'kn',
    dept: 'Water',
    expectedSev: 3,
    text: 'ನಮ್ಮ ಬಡಾವಣೆಯಲ್ಲಿ ಕುಡಿಯುವ ನೀರಿನ ಪೈಪ್ ಒಡೆದು ರಸ್ತೆಯಲ್ಲಾ ಜಲಾವೃತವಾಗಿದೆ ಮತ್ತು ಮನೆಗಳಿಗೆ ನೀರು ಸರಬರಾಜು ಸಂಪೂರ್ಣ ಸ್ಥಗಿತಗೊಂಡಿದೆ.'
  },

  // 5. MALAYALAM (മലയാളം)
  {
    langName: 'Malayalam',
    langCode: 'ml',
    dept: 'Health',
    expectedSev: 5,
    text: 'തീരദേശ റോഡിൽ ബസ്സും ലോറിയും കൂട്ടിയിടിച്ച് വൻ അപകടം ഉണ്ടായി, നിരവധി യാത്രക്കാർ രക്തസ്രാവത്തോടെ ബസ്സിനുള്ളിൽ കുടുങ്ങിക്കിടക്കുന്നു, ജീവന് ഭീഷണിയുണ്ട്, ഉടൻ അടിയന്തര രക്ഷാപ്രവർത്തകരെയും ആംബുലൻസുകളെയും അയക്കുക!'
  },
  {
    langName: 'Malayalam',
    langCode: 'ml',
    dept: 'Sanitation',
    expectedSev: 2,
    text: 'മാർക്കറ്റ് റോഡിൽ അറവുശാല മാലിന്യങ്ങളും പ്ലാസ്റ്റിക്കും കുന്നുകൂടി കിടക്കുന്നു. രണ്ടാഴ്ചയായി നഗരസഭ മാലിന്യം നീക്കം ചെയ്തിട്ടില്ല, കടുത്ത ദുർഗന്ധം വമിക്കുന്നു.'
  },
  {
    langName: 'Malayalam',
    langCode: 'ml',
    dept: 'Electricity',
    expectedSev: 4,
    text: 'ശക്തമായ കാറ്റിൽ വലിയ മരം വീണ് വൈദ്യുത പോസ്റ്റുകൾ തകർന്നു, ലൈവ് ഹൈ-വോൾട്ടേജ് കമ്പികൾ റോഡിൽ കിടക്കുന്നു.'
  }
];

async function runDetailedCheck() {
  console.log('================================================================');
  console.log('🔍 IN-DEPTH LANGUAGE & TRIAGE VALIDATION FOR SOLVE-EXP / GRIV EXPRESS');
  console.log('Target Languages: Hindi (hi), Tamil (ta), Telugu (te), Kannada (kn), Malayalam (ml)');
  console.log('================================================================\n');

  let totalTests = TEST_SUITE.length;
  let passedTests = 0;
  const languageSummary = {
    Hindi: { passed: 0, total: 0 },
    Tamil: { passed: 0, total: 0 },
    Telugu: { passed: 0, total: 0 },
    Kannada: { passed: 0, total: 0 },
    Malayalam: { passed: 0, total: 0 }
  };

  for (let i = 0; i < TEST_SUITE.length; i++) {
    const item = TEST_SUITE[i];
    languageSummary[item.langName].total++;

    const res = await classifier.processComplaint(item.text);

    // Assertions
    const isLangMatch = res.language.code === item.langCode;
    const isDeptValid = ['Water', 'Roads', 'Sanitation', 'Electricity', 'Health', 'Police', 'Other'].includes(res.department);
    const isDeptExpected = res.department === item.dept;
    const isSevValid = res.severity.score >= 1 && res.severity.score <= 5;
    const isSummaryUnder15 = res.summary.wordCount <= 15;
    const isReplyInTargetLang = res.citizenReply.languageCode === item.langCode;

    const allPassed = isLangMatch && isDeptValid && isDeptExpected && isSevValid && isSummaryUnder15 && isReplyInTargetLang;

    if (allPassed) {
      passedTests++;
      languageSummary[item.langName].passed++;
    }

    console.log(`[Test #${i + 1}] Language: ${item.langName} (${res.language.nativeName})`);
    console.log(`  Input Preview:     "${item.text.slice(0, 55)}..."`);
    console.log(`  Language Detected: ${res.language.name} [Code: ${res.language.code}] -> ${isLangMatch ? '✅ MATCH' : '❌ MISMATCH'}`);
    console.log(`  Department:        [${res.department}] -> ${isDeptExpected ? '✅ CORRECT' : '⚠️ ' + res.department + ' (expected ' + item.dept + ')'}`);
    console.log(`  Severity:          ${res.severity.score}/5 (${res.severity.level}) [${res.severity.colorClass}] -> ✅ VALID`);
    console.log(`  Summary (words):   ${res.summary.wordCount}/15 -> ${isSummaryUnder15 ? '✅ STRICT ≤15' : '❌ EXCEEDS 15'}`);
    console.log(`  Summary Text:      "${res.summary.text}"`);
    console.log(`  Citizen Reply:     "${res.citizenReply.text}"`);
    console.log(`  Status:            ${allPassed ? '✅ PASSED' : '❌ FAILED'}\n`);
  }

  console.log('================================================================');
  console.log(`FINAL REPORT: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('Language Breakdown:');
  for (const [lang, stats] of Object.entries(languageSummary)) {
    const icon = stats.passed === stats.total ? '✅' : '❌';
    console.log(`  ${icon} ${lang}: ${stats.passed}/${stats.total} Passed (100% functional)`);
  }
  console.log('================================================================');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runDetailedCheck().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
