import mailchimp from '@mailchimp/mailchimp_marketing';

// Test Mailchimp configuration
async function testMailchimp() {
  console.log('🔍 Testing Mailchimp configuration...\n');

  // Check environment variables
  const apiKey = process.env.YUZZI_MAILCHIMP_API_KEY;
  const serverPrefix = process.env.YUZZI_MAILCHIMP_SERVER_PREFIX;
  const listId = process.env.YUZZI_MAILCHIMP_LIST_ID;

  console.log('Environment Variables:');
  console.log(`  API Key: ${apiKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`  Server Prefix: ${serverPrefix ? '✅ Set' : '❌ Missing'}`);
  console.log(`  List ID: ${listId ? '✅ Set' : '❌ Missing'}\n`);

  if (!apiKey || !serverPrefix || !listId) {
    console.log('❌ Missing required environment variables!');
    console.log('Please set:');
    console.log('  - YUZZI_MAILCHIMP_API_KEY');
    console.log('  - YUZZI_MAILCHIMP_SERVER_PREFIX');
    console.log('  - YUZZI_MAILCHIMP_LIST_ID');
    return;
  }

  try {
    // Configure Mailchimp
    mailchimp.setConfig({
      apiKey: apiKey,
      server: serverPrefix,
    });

    console.log('✅ Mailchimp client configured successfully');

    // Test API connection by getting account info
    console.log('\n🔍 Testing API connection...');
    const account = await mailchimp.ping.get();
    console.log('✅ API connection successful');
    console.log(`Account: ${account.account_name}`);

    // Test list access
    console.log('\n🔍 Testing list access...');
    const list = await mailchimp.lists.getList(listId);
    console.log('✅ List access successful');
    console.log(`List Name: ${list.name}`);
    console.log(`Subscriber Count: ${list.stats.member_count}`);

    // Test adding a subscriber (with a test email)
    console.log('\n🔍 Testing subscriber addition...');
    const testEmail = `test-${Date.now()}@gmail.com`;

    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: testEmail,
        status: 'pending',
      });
      console.log('✅ Test subscriber added successfully');
      console.log(`Member ID: ${response.id}`);

      // Clean up - delete the test subscriber
      console.log('\n🧹 Cleaning up test subscriber...');
      await mailchimp.lists.deleteListMember(listId, testEmail);
      console.log('✅ Test subscriber removed');
    } catch (error) {
      console.log('❌ Failed to add test subscriber:', error.message);
      console.log('Error details:', JSON.stringify(error, null, 2));

      if (error.response) {
        console.log('Response status:', error.response.status);
        console.log('Response body:', error.response.body);
      }
    }
  } catch (error) {
    console.log('❌ Mailchimp test failed:', error.message);

    if (error.status === 401) {
      console.log('\n💡 This looks like an authentication error.');
      console.log('Please check your API key and server prefix.');
    } else if (error.status === 404) {
      console.log('\n💡 This looks like a list not found error.');
      console.log('Please check your list ID.');
    }
  }
}

// Run the test
testMailchimp().catch(console.error);
