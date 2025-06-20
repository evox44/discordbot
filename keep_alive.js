const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot działa!');
});

app.listen(3000, () => {
  console.log('Keep-alive serwer działa na porcie 3000');
});
