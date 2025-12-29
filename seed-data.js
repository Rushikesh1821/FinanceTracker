const { seedTransactions } = require('./actions/seed.js');

async function runSeed() {
  try {
    console.log('Seeding transactions...');
    const result = await seedTransactions();
    console.log('Seed result:', result);
  } catch (error) {
    console.error('Seed error:', error);
  }
}

runSeed();
