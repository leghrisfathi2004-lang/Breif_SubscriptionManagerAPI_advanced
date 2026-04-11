const express = require('express');
const {connectionDB} = require('./database/config.js')
require('dotenv').config();
const router = require('./routes/routes.js');

const app = express();
app.use(express.json());


app.use("/", router);

connectionDB();

const port = process.env.port || process.env.port || 8080;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});