const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Bot działa!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Serwer keep-alive działa na porcie ${PORT}`);
});
