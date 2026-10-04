const express = require('express');
const cookiesParser = require('cookie-parser');

const authrouter = require('./routes/auth.routes');
const accountrouter = require('./routes/account.route');

const app = express();
app.use(cookiesParser());  
app.use(express.json());  //ye middleware hum use karte hein take hum req.body se data ko access kar sakein

app.use('/api/auth', authrouter);
app.use('/api/account', accountrouter);


module.exports = app;