const express = require('express');

function keepAlive() {
  const app = express();

  app.get('/', (req, res) => {
    res.send('✅ Bot działa i nie śpi!');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🌐 Keep-alive działa na porcie ${PORT}`);
  });
}

module.exports = keepAlive;
