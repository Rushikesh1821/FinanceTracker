const fs = require('fs');
const path = require('path');
const { scanReceipt } = require('../actions/transaction');

(async () => {
  try {
    const imgPath = path.resolve(__dirname, 'sample.png');
    const buffer = fs.readFileSync(imgPath);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

    const fileLike = {
      name: 'sample.png',
      type: 'image/png',
      size: buffer.length,
      arrayBuffer: async () => arrayBuffer,
    };

    console.log('Running scanReceipt test...');
    const result = await scanReceipt(fileLike);
    console.log('scanReceipt result:', result);
  } catch (err) {
    console.error('scanReceipt test error:', err);
    process.exit(1);
  }
})();
