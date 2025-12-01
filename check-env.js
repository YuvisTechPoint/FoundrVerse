const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const reportPath = path.join(process.cwd(), 'env-report.txt');

let report = '';
const log = (msg) => {
  console.log(msg);
  report += msg + '\n';
};

if (!fs.existsSync(envPath)) {
  log('❌ .env.local file not found!');
  fs.writeFileSync(reportPath, report);
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const env = {};

content.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
    env[key] = value;
  }
});

const requiredKeys = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID"
];

const placeholderPatterns = [
  /^your[_-]/i,
  /^your/i,
  /^change[_-]me/i,
  /^placeholder/i,
  /^example/i,
  /^test[_-]value/i
];

log('🔍 Checking Firebase Environment Variables in .env.local...\n');

let hasError = false;

requiredKeys.forEach(key => {
  const value = env[key];
  if (!value) {
    log(`❌ ${key}: MISSING`);
    hasError = true;
  } else {
    const isPlaceholder = placeholderPatterns.some(p => p.test(value));
    if (isPlaceholder) {
      log(`⚠️  ${key}: PLACEHOLDER DETECTED ('${value}')`);
      hasError = true;
    } else {
      if (value.trim() === '') {
        log(`❌ ${key}: EMPTY`);
        hasError = true;
      } else {
        const masked = value.length > 4 ? value.substring(0, 4) + '...' : '****';
        log(`✅ ${key}: Present (${masked})`);
      }
    }
  }
});

if (hasError) {
  log('\n❌ Issues found in .env.local. Please update the file with real Firebase credentials.');
} else {
  log('\n✅ All Firebase environment variables look good!');
}

fs.writeFileSync(reportPath, report);
