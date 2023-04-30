const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const redis = require('redis');
const { authRoutes } = require('./src/routes/v1');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/bank_app', {
  // useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection
  .once('open', () => console.log('connected to database'))
  .on('error', (err) => console.log('connection to database failed!!', err));

app.use('/api/v1/', authRoutes);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));