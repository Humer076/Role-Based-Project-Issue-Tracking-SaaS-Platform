const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send('Hello from DevTrack minimal test!');
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
});
