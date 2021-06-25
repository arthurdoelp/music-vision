// Config .env to ./config/config.env
require('dotenv').config({
    path: './config/config.env'
});

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const app = express();


// Body Parser
app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

//might need to make using cors only available for dev. might not be allowed to use cors in production. RESEARCH
app.use(cors());
app.use(morgan('dev'));


//Load all routes
const predictRouter = require('./routes/predict.route');


//Use Routes
app.use('/api/', predictRouter);

app.use( (req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Page not found"
    })
});


var port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log("Yay! The server is running on port: " + port);
})