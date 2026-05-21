const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => { res.status(200).send('Hello from DevTrack!'); });

const server = app.listen(PORT, () => {
  console.log(`✅ Minimal test server running on port ${PORT}`);
});
