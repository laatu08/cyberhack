// elasticClient.js
import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';
dotenv.config();

// ✅ Create Elasticsearch client for Elastic Cloud Serverless
export const elasticClient = new Client({
  node: "https://my-elasticsearch-project-ffe17c.es.ap-southeast-1.aws.elastic.cloud:443",
  auth: {
    apiKey: "c0wtc0haZ0JzNlZHQUVmSlpHUWU6bDdrZWxtSjFhTWI4U3ljYi16YlpVQQ==",// Store securely in .env
  },
  serverless: true, // ✅ Required for Elastic Cloud Serverless
  maxRetries: 5,
  requestTimeout: 60000,
  sniffOnStart: false,
});

// ✅ Utility to wait for Elasticsearch to be ready
export async function waitForElasticsearch(maxRetries = 30, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await elasticClient.ping();
      console.log('✅ Elasticsearch is ready');
      return true;
    } catch (error) {
      console.log(`⏳ Waiting for Elasticsearch... (attempt ${i + 1}/${maxRetries})`);
      if (i === maxRetries - 1) {
        console.error('❌ Elasticsearch failed to become ready');
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}


// // elasticClient.js
// import { Client } from '@elastic/elasticsearch';
// import dotenv from 'dotenv';
// dotenv.config();
//
// // Create client with retry configuration
// export const elasticClient = new Client({
//   node: process.env.ELASTIC_URL || 'http://localhost:9200', 
//   maxRetries: 5,
//   requestTimeout: 60000,
//   sniffOnStart: false,
//   // auth: {
//   //   username: 'elastic',
//   //   password: 'your-password'
//   // },
//   compatibility: true // ✅ This forces Accept headers for ES 8.x
// });
//
// // Function to wait for Elasticsearch to be ready
// export async function waitForElasticsearch(maxRetries = 30, delay = 2000) {
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       await elasticClient.ping();
//       console.log('✅ Elasticsearch is ready');
//       return true;
//     } catch (error) {
//       console.log(`⏳ Waiting for Elasticsearch... (attempt ${i + 1}/${maxRetries})`);
//       if (i === maxRetries - 1) {
//         throw new Error('Elasticsearch failed to become ready');
//       }
//       await new Promise(resolve => setTimeout(resolve, delay));
//     }
//   }
// }
