const SpecializationService = require('./utils/specializationService');

// Test the specialization service
async function testSpecializations() {
  console.log('🧪 Testing Specialization Service...\n');
  
  // Test 1: Get all specializations
  console.log('1. Available Specializations:');
  const specs = SpecializationService.getAllSpecializations();
  console.log(`   Total: ${specs.length} specializations`);
  console.log(`   Sample: ${specs.slice(0, 10).join(', ')}...\n`);
  
  // Test 2: Validate existing specialization
  console.log('2. Validating existing specialization:');
  const result1 = await SpecializationService.validateSpecialization('Cardiology');
  console.log(`   Input: "Cardiology"`);
  console.log(`   Result:`, result1);
  console.log('');
  
  // Test 3: Validate custom specialization
  console.log('3. Validating custom specialization:');
  const result2 = await SpecializationService.validateSpecialization('Interventional Cardiology');
  console.log(`   Input: "Interventional Cardiology"`);
  console.log(`   Result:`, result2);
  console.log('');
  
  // Test 4: Add custom specialization
  console.log('4. Adding custom specialization:');
  const added = await SpecializationService.addCustomSpecialization('Pediatric Oncology');
  console.log(`   Added: "${added}"`);
  console.log(`   New total: ${SpecializationService.getAllSpecializations().length}`);
  
  console.log('\n✅ Specialization Service Test Complete!');
}

// Run test if OpenAI key is available
if (process.env.OPENAI_API_KEY) {
  testSpecializations().catch(console.error);
} else {
  console.log('⚠️  OpenAI API key not found. Testing basic functionality only...');
  
  const specs = SpecializationService.getAllSpecializations();
  console.log(`✅ Basic test passed: ${specs.length} specializations loaded`);
  console.log(`Sample: ${specs.slice(0, 5).join(', ')}...`);
}