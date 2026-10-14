// South Indian Languages & Hindi Sample Citizen Complaints for Solve-exp / GRIV Express
const SAMPLE_COMPLAINTS = [
  {
    id: 'sample-hi-3',
    title: 'Hindi: Broken Main Water Pipeline (Severity 3)',
    language: 'Hindi',
    flag: '🇮🇳',
    code: 'hi',
    text: 'हमारे इलाके सेक्टर 4 में मुख्य पेयजल पाइपलाइन फूट गई है। पिछले तीन दिनों से घरों में पीने का पानी नहीं आ रहा है और लाखों लीटर पानी सड़क पर व्यर्थ बह रहा है।',
    expectedDept: 'Water',
    expectedSev: 3
  },
  {
    id: 'sample-ta-5',
    title: 'Tamil: High-Voltage Wire in Flooded School Area (Severity 5)',
    language: 'Tamil',
    flag: '🇮🇳',
    code: 'ta',
    text: 'கனமழை காரணமாக பள்ளி வளாகம் அருகே உயர்மின்னழுத்த மின்கம்பி அறுந்து தேங்கிய மழைநீரில் விழுந்து தீப்பொறி பறக்கிறது. பள்ளி குழந்தைகள் நடமாடும் பகுதி, உயிருக்கு ஆபத்து, உடனடியாக மின்சாரத்தை துண்டித்து சரிசெய்யவும்!',
    expectedDept: 'Electricity',
    expectedSev: 5
  },
  {
    id: 'sample-te-3',
    title: 'Telugu: Contaminated Water Supply Leak (Severity 3)',
    language: 'Telugu',
    flag: '🇮🇳',
    code: 'te',
    text: 'మా కాలనీలో మెయిన్ వాటర్ సప్లై పైప్‌లైన్ పగిలిపోయి మురుగునీరు తాగునీటిలో కలుస్తోంది. గత నాలుగు రోజులుగా ప్రజలకు స్వచ్ఛమైన తాగునీరు అందక తీవ్ర ఇబ్బందులు పడుతున్నారు.',
    expectedDept: 'Water',
    expectedSev: 3
  },
  {
    id: 'sample-kn-5',
    title: 'Kannada: Toxic Gas Leak & Unconscious Citizens (Severity 5)',
    language: 'Kannada',
    flag: '🇮🇳',
    code: 'kn',
    text: 'ಕೈಗಾರಿಕಾ ಪ್ರದೇಶದ ಕಾರ್ಖಾನೆಯಿಂದ ವಿಷಕಾರಿ ಅನಿಲ ಸೋರಿಕೆಯಾಗಿದ್ದು ಸುತ್ತಮುತ್ತಲಿನ ನೂರಾರು ಜನರಿಗೆ ಉಸಿರಾಟದ ತೊಂದರೆಯಾಗಿ ಪ್ರಜ್ಞೆ ತಪ್ಪಿ ಬೀಳುತ್ತಿದ್ದಾರೆ, ಪ್ರಾಣಾಪಾಯವಿದೆ, ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್ ಮತ್ತು ವೈದ್ಯಕೀಯ ತಂಡ ಕಳುಹಿಸಿ!',
    expectedDept: 'Health',
    expectedSev: 5
  },
  {
    id: 'sample-ml-5',
    title: 'Malayalam: Critical Road Collision & Trapped Victims (Severity 5)',
    language: 'Malayalam',
    flag: '🇮🇳',
    code: 'ml',
    text: 'തീരദേശ റോഡിൽ ബസ്സും ലോറിയും കൂട്ടിയിടിച്ച് വൻ അപകടം ഉണ്ടായി, നിരവധി യാത്രക്കാർ രക്തസ്രാവത്തോടെ ബസ്സിനുള്ളിൽ കുടുങ്ങിക്കിടക്കുന്നു, ജീവന് ഭീഷണിയുണ്ട്, ഉടൻ അടിയന്തര രക്ഷാപ്രവർത്തകരെയും ആംಬುലൻസുകളെയും അയക്കുക!',
    expectedDept: 'Health',
    expectedSev: 5
  },
  {
    id: 'sample-ta-4',
    title: 'Tamil: Stagnant Sewage & Dengue Outbreak (Severity 4)',
    language: 'Tamil',
    flag: '🇮🇳',
    code: 'ta',
    text: 'எங்கள் குடியிருப்பு பகுதியில் சாக்கடை கால்வாய் உடைந்து கழிவுநீர் தெருவில் தேங்கி நிற்கிறது. கொசுக்கள் அதிகளவில் உற்பத்தியாகி குழந்தைகளுக்கு தீவிர டெங்கு காய்ச்சல் பரவி வருகிறது.',
    expectedDept: 'Health',
    expectedSev: 4
  },
  {
    id: 'sample-te-2',
    title: 'Telugu: Overflowing Garbage & Stench (Severity 2)',
    language: 'Telugu',
    flag: '🇮🇳',
    code: 'te',
    text: 'గాంధీ నగర్ మెయిన్ వీధిలో పది రోజులుగా మున్సిపల్ చెత్త కుండీలను ఎవరూ ఖాళీ చేయడం లేదు. రోడ్డుపై చెత్త పేరుకుపోయి తీవ్ర దుర్వాసన వస్తోంది మరియు ఈగలు ముసురుతున్నాయి.',
    expectedDept: 'Sanitation',
    expectedSev: 2
  },
  {
    id: 'sample-kn-2',
    title: 'Kannada: Deep Potholes on Commuter Transit (Severity 2)',
    language: 'Kannada',
    flag: '🇮🇳',
    code: 'kn',
    text: 'ಜಯನಗರ ಮುಖ್ಯ ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಆಳವಾದ ಗುಂಡಿ ಬಿದ್ದಿದ್ದು, ವಾಹನ ಸವಾರರು ಕೆಳಗೆ ಬಿದ್ದು ಗಾಯಗೊಳ್ಳುತ್ತಿದ್ದಾರೆ. ದಯವಿಟ್ಟು ಕೂಡಲೇ ಡಾಂಬರೀಕರಣ ಮಾಡಿ ರಸ್ತೆ ದುರಸ್ತಿಗೊಳಿಸಿ.',
    expectedDept: 'Roads',
    expectedSev: 2
  },
  {
    id: 'sample-ml-2',
    title: 'Malayalam: Market Waste Accumulation (Severity 2)',
    language: 'Malayalam',
    flag: '🇮🇳',
    code: 'ml',
    text: 'മാർക്കറ്റ് റോഡിൽ അറവുശാല മാലിന്യങ്ങളും പ്ലാസ്റ്റിക്കും കുന്നുകൂടി കിടക്കുന്നു. രണ്ടാഴ്ചയായി നഗരസഭ മാലിന്യം നീക്കം ചെയ്തിട്ടില്ല, കടുത്ത ദുർഗಂಧം വമിക്കുന്നു.',
    expectedDept: 'Sanitation',
    expectedSev: 2
  },
  {
    id: 'sample-hi-5',
    title: 'Hindi: Gas Cylinder Blast & Severe Burns (Severity 5)',
    language: 'Hindi',
    flag: '🇮🇳',
    code: 'hi',
    text: 'सब्जी मंडी चौराहे पर रसोई गैस सिलेंडर का भीषण विस्फोट हुआ है। आग तेजी से दुकानों में फैल रही है और दो लोग गंभीर रूप से जलकर बेहोश पड़े हैं, तुरंत दमकल और एम्बुलेंस भेजें!',
    expectedDept: 'Health',
    expectedSev: 5
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SAMPLE_COMPLAINTS };
}
