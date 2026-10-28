const dns = require('dns');
const mongoose = require('mongoose');

const fallbackMongoUri = 'mongodb://127.0.0.1:27017/resume-builder';
const placeholderTokens = ['******', '<username>', '<password>', 'mongodb+srv://your-username', 'mongodb://your-user'];

function resolveMongoUri() {
   const configuredUri = process.env.MONGO_URI?.trim();

   if (!configuredUri) {
      return fallbackMongoUri;
   }

   const hasPlaceholder = placeholderTokens.some((token) => configuredUri.includes(token));
   return hasPlaceholder ? fallbackMongoUri : configuredUri;
}

function maskMongoUri(uri) {
   try {
      const parsed = new URL(uri);
      if (parsed.username || parsed.password) {
         parsed.username = '***';
         parsed.password = '***';
         return parsed.toString();
      }
      return uri;
   } catch {
      return uri;
   }
}

const dnsServers = process.env.MONGO_DNS_SERVERS
   ? process.env.MONGO_DNS_SERVERS.split(',').map((server) => server.trim()).filter(Boolean)
   : ['8.8.8.8', '8.8.4.4'];

if (dnsServers.length) {
   dns.setServers(dnsServers);
}

async function connectDB() {
   const mongoUri = resolveMongoUri();

   if (mongoUri === fallbackMongoUri && (!process.env.MONGO_URI || process.env.MONGO_URI.trim() === '')) {
      console.warn('MONGO_URI is missing. Falling back to a local MongoDB instance at mongodb://127.0.0.1:27017/resume-builder.');
   } else if (mongoUri === fallbackMongoUri) {
      console.warn('MONGO_URI appears to be a placeholder or invalid. Falling back to a local MongoDB instance at mongodb://127.0.0.1:27017/resume-builder.');
   }

   await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
   });

   console.log(`Database connected using ${maskMongoUri(mongoUri)}`);
}

module.exports = connectDB;
module.exports.resolveMongoUri = resolveMongoUri;
module.exports.fallbackMongoUri = fallbackMongoUri;