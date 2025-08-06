import 'dotenv/config';

console.log('🔍 Testing environment variables in app context...\n');

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
  console.log('This means your app is not loading the .env file properly.');
  console.log('\nPossible solutions:');
  console.log('1. Make sure your .env file is in the backend directory');
  console.log('2. Restart your development server');
  console.log('3. Check if your .env file has the correct variable names');
} else {
  console.log('✅ All environment variables are loaded correctly!');
  console.log('The issue might be elsewhere in your application.');
}
