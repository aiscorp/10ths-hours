// lib/app.ts
import express = require('express');
import config = require('config');
import mongoose = require('mongoose');




// Create a new express application instance
const app: express.Application = express();


// Routing
app.use('/api/auth', require('./routes/auth.routes'))



// Getting port number from config
const PORT: number = config.get("port") || 3000 // In default 3000

// Initialisation
async function start() {
    try {
      await mongoose.connect(config.get('mongoUri'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
    } catch (e) {
      console.log('Server Error', e.message)
      process.exit(1)
    }
  }

  start()

app.get('/', function (req, res) {
    res.send('Hello World!');
});

