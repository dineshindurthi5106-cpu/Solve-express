async function testHttp() {
  const res = await fetch('http://localhost:4173');
  const html = await res.text();

  const hasGrivExpress = html.includes('GRIV <span class="highlight">Express</span>');
  const hasNoSubtitle = !html.includes('hero-subtitle');
  const hasNoConstraintBox = !html.includes('Summary Constraint');
  const hasTamil = html.includes('data-preset="sample-ta-5"');
  const hasTelugu = html.includes('data-preset="sample-te-3"');
  const hasKannada = html.includes('data-preset="sample-kn-5"');
  const hasMalayalam = html.includes('data-preset="sample-ml-5"');
  const hasHindi = html.includes('data-preset="sample-hi-3"');
  const hasNoColonSolveExp = html.includes('Solve<span>-exp</span>') && !html.includes(':Solve<span>-exp</span>');

  console.log('HTTP 200 Live Page Integrity Check:');
  console.log('  GRIV Express Title:         ', hasGrivExpress ? '✅ PASSED' : '❌ FAILED');
  console.log('  No Subtitle Description:    ', hasNoSubtitle ? '✅ PASSED' : '❌ FAILED');
  console.log('  No Summary Constraint Box:  ', hasNoConstraintBox ? '✅ PASSED' : '❌ FAILED');
  console.log('  No Colon before Solve-exp:  ', hasNoColonSolveExp ? '✅ PASSED' : '❌ FAILED');
  console.log('  Hindi Preset:               ', hasHindi ? '✅ PASSED' : '❌ FAILED');
  console.log('  Tamil Preset:               ', hasTamil ? '✅ PASSED' : '❌ FAILED');
  console.log('  Telugu Preset:              ', hasTelugu ? '✅ PASSED' : '❌ FAILED');
  console.log('  Kannada Preset:             ', hasKannada ? '✅ PASSED' : '❌ FAILED');
  console.log('  Malayalam Preset:           ', hasMalayalam ? '✅ PASSED' : '❌ FAILED');
}

testHttp().catch(console.error);
