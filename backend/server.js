const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('☕ ================================');
  console.log(`☕  Kopi Kombo API`);
  console.log(`☕  http://localhost:${PORT}`);
  console.log('☕ ================================');
  console.log('');
});
