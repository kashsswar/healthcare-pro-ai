const SalesContactGenerator = require('./contact-list');

// Sales automation script
async function runSalesAutomation() {
  console.log('🚀 Starting Healthcare Platform Sales Automation...\n');

  try {
    // Generate target contacts
    console.log('📋 Generating target contacts...');
    const contacts = await SalesContactGenerator.generateTargetContacts();
    
    console.log(`✅ Found ${contacts.length} potential buyers\n`);

    // Generate personalized emails for top 5 contacts
    console.log('📧 Generating personalized sales emails...\n');
    
    for (let i = 0; i < Math.min(5, contacts.length); i++) {
      const contact = contacts[i];
      console.log(`--- ${contact.name} ---`);
      
      const email = await SalesContactGenerator.generatePersonalizedEmail(contact);
      console.log(email);
      console.log('\n' + '='.repeat(80) + '\n');
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('✅ Sales automation complete!');
    console.log('\n📊 Summary:');
    console.log(`• ${contacts.length} potential buyers identified`);
    console.log('• 5 personalized emails generated');
    console.log('• Ready for immediate outreach');
    
  } catch (error) {
    console.error('❌ Error in sales automation:', error.message);
  }
}

// Export for use
module.exports = { runSalesAutomation };

// Run if called directly
if (require.main === module) {
  runSalesAutomation();
}