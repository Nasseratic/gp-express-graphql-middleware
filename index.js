const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const middlewares = require('./middlewares');
const user = require('./routes/user.router');
const auth = require('./routes/auth.router');

// Db connection
mongoose.Promise = global.Promise;
mongoose.connect(keys.db, {
    useMongoClient: true
  }).then(() =>{
      console.log('Connected');
  }).catch((err)=>{
      if(err) throw err;
      console.log('Connection error');
  });

var app = express();

app.use( express.static('./uploads') );
app.use( '/' , middlewares.CROS);
app.use( '/' , middlewares.bodyParse);
app.use( '/' , middlewares.urlencodedParser);
app.use( '/' , middlewares.removePowered);


// -----------------------------AUTH ROUTES --------------------
app.use('/', auth);

// ---------------------------- USER ROUTES --------------------
app.use('/user', middlewares.isAuthenticated , user)


// --- ---------- ------------ --------------- -------- // 
app.use( '/' , middlewares.handleErrors);
app.use( '/' , middlewares.handle404);
app.use( '/' , middlewares.handle500);
// --- ---------- ------------ --------------- -------- // 


app.listen(3000);