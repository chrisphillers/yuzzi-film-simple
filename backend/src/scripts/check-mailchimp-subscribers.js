import 'dotenv/config';
import mailchimp from '@mailchimp/mailchimp_marketing';

// Check Mailchimp subscribers
async function checkSubscribers() {
  console.log('🔍 Checking Mailchimp subscribers...\n');

  const apiKey = process.env.YUZZI_MAILCHIMP_API_KEY;
  const serverPrefix = process.env.YUZZI_MAILCHIMP_SERVER_PREFIX;
  const listId = process.env.YUZZI_MAILCHIMP_LIST_ID;

  if (!apiKey || !serverPrefix || !listId) {
    console.log('❌ Missing environment variables');
    return;
  }

  try {
    // Configure Mailchimp
    mailchimp.setConfig({
      apiKey: apiKey,
      server: serverPrefix,
    });

    console.log('✅ Connected to Mailchimp');

    // Get list details
    console.log('\n📋 List Details:');
    const list = await mailchimp.lists.getList(listId);
    console.log(`List Name: ${list.name}`);
    console.log(`List ID: ${list.id}`);
    console.log(`Total Subscribers: ${list.stats.member_count}`);
    console.log(`Pending Subscribers: ${list.stats.pending_count}`);
    console.log(`Subscribed: ${list.stats.subscribed_count}`);

    // Get all members
    console.log('\n👥 All Members:');
    const members = await mailchimp.lists.getListMembersInfo(listId, {
      count: 100,
      status: 'all', // This gets all statuses: subscribed, unsubscribed, cleaned, pending
    });

    if (members.members.length === 0) {
      console.log('❌ No members found in the list');
    } else {
      console.log(`Found ${members.members.length} members:`);
      members.members.forEach((member, index) => {
        console.log(`\n${index + 1}. Email: ${member.email_address}`);
        console.log(`   Status: ${member.status}`);
        console.log(`   Member ID: ${member.id}`);
        console.log(`   Added: ${member.timestamp_signup}`);
        console.log(`   Last Changed: ${member.last_changed}`);
      });
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response body:', error.response.body);
    }
  }
}

// Run the check
checkSubscribers().catch(console.error);
