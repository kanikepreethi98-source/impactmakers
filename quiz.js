const express = require('express');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Quiz route is available.' });
});

module.exports = router;
