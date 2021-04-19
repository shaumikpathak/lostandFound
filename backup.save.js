const express = require("express");
const app = express();

const expressSession = require('express-session');
app.use(expressSession({ 
  secret: Math.random().toString(36).substring(2, 15),
  maxAge: 6 * 60 * 60 * 1000,
  resave: true,
  saveUninitialized: false,
  name: "week7-login-session-cookie"
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'https://week7-login-demo.glitch.me/auth/accepted',
  userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
  scope: ['profile']
}, (accessToken, refreshToken, profile, done)=>{
  let id = 1;
  done(null, profile);
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((data, done) => {
  done(null, data);
});

passport.deserializeUser((data, done) => {
  let userData = {userData: "maybe data from db row goes here"};
  done(null, data);
});

app.use(express.static('public'));
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

app.get('/user/*', requireLogin, express.static('.'));

app.get('/auth/google', checkLogin, passport.authenticate('google'));

app.get('/auth/accepted',
  passport.authenticate('google', 
    { successRedirect: '/auth/success', failureRedirect: '/' }
  )
);

app.get('/auth/success', requireUser,
  function(req, res) {
    // req.header or req.get
    if(req.header('Referrer') && (req.header('Referrer').indexOf("google.com")!=-1 || req.header('Referrer').indexOf("youtube.com")!=-1)){
      res.cookie('google-passport-cookie', new Date());
      res.redirect('/user/index.html');
    } else {
       res.redirect('/');
    }
  }
);

function requireUser (req, res, next) {
  if (!req.user) {
    res.redirect('/');
  } else {
    console.log("user is",req.user);
    res.cookie('user-data', req.user);
    next();
  }
};

function requireLogin (req, res, next) {
  console.log("checking:",req.cookies);
  if (!req.cookies['week7-login-session-cookie']) {
    console.log("requireLogin redirect to /");
    res.sendFile(__dirname + "/public/not_signed_in.html");
  } else {
    next();
  }
};

function checkLogin (req, res, next) {
  console.log("checking:",req.cookies);
  if (req.cookies['week7-login-session-cookie']) {
    res.redirect('/user/index.html');
  } else {
    next();
  }
};

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});