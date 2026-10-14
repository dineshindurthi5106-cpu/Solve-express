const { SAMPLE_COMPLAINTS } = require('./js/samples.js');
const { CitizenComplaintClassifier } = require('./js/classifier.js');

const classifier = new CitizenComplaintClassifier();

async function run() {
  console.log('--- Testing Solve-exp / GRIV Express (South Indian Languages & Hindi) ---');
  for (const s of SAMPLE_COMPLAINTS) {
    const res = await classifier.processComplaint(s.text);
    console.log(`\nSample: ${s.title}`);
    console.log(`  Language:   ${res.language.flag} ${res.language.name} (${res.language.nativeName})`);
    console.log(`  Department: [${res.department}]`);
    console.log(`  Severity:   ${res.severity.score}/5 -> ${res.severity.level} (${res.severity.colorClass})`);
    console.log(`  Summary (${res.summary.wordCount} words): "${res.summary.text}"`);
    console.log(`  Citizen Reply: "${res.citizenReply.text}"`);
    if (res.summary.wordCount > 15) {
      throw new Error(`Summary has ${res.summary.wordCount} words which exceeds 15 words limit!`);
    }
  }
  console.log('\n============================================================');
  console.log('SUCCESS! ALL SOUTH INDIAN & HINDI COMPLAINTS PASSED CLEANLY.');
  console.log('============================================================');
}

run().catch(console.error);
