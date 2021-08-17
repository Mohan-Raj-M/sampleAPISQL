const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const router = require('./routes/router.js');
app.use('/', router);

app.listen(PORT, () => console.log('Server running on port' + 5000));
