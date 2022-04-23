const path          = require('path');
const authRouter    = require('express').Router();
const mongoose      = require('mongoose');
const session       = require('express-session');
const MongoStore    = require('connect-mongo');
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt        = require('bcrypt');
const auth          = require('../models/authentication/auth.js');
const saltStrength  = 10;
const GoogleStrategy = require('passport-google-oauth2').Strategy;

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoURL = process.env.auth;
const mongoAdmin = process.env.authuser;
const mongoPW = process.env.authpw;
const mongoStoreUrl = `mongodb://${mongoAdmin}:${mongoPW}@${mongoURL}:27017/bocauthstore`;
const bocAuthOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};
const congolmerateSecret = process.env.loginsecret;
const loginFailurePath = '/auth/failure';
const loginSuccessPath = '/auth/success';

authRouter.use(session({
  secret: congolmerateSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoStoreUrl}),
  ttl: 14 * 24 * 60 * 60 // = 14 days. Default
}));

authRouter.use(passport.initialize());
authRouter.use(passport.session());

passport.use(new LocalStrategy(
  {usernameField:"email", passwordField:"password"},
  function(usernameField, passwordField, cb) {
    auth.findUserByEmail(usernameField, async (err, info) => {
        if (err)    { return cb(err, false)};
        if (!info)  { return cb(null, true, { message: 'Incorrect username or password.' })};
        var hash = info.password;
        return bcrypt.compare(passwordField, hash, (err, result) => {
          if (err) {
            return cb(err, false);
          }
          if (!result) {
            return cb(null, true, { message: 'Incorrect username or password.' })
          }
          return cb(null, info)
        })
    })
  }
));

passport.use(new GoogleStrategy({
  clientID: '384082777651-3e339admf544k9oeu2bohree85k2uqrt.apps.googleusercontent.com',
  clientSecret: process.env.googlesecret,
  callbackURL: "http://localhost:3000/auth/google/home",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  proxy:true
},
 async function(accessToken, refreshToken, profile, email, cb) {
  try {
    await auth.findUserByEmail(email.emails[0].value, async (err, response) => {
      if (err) {
        return cb(err);
      } else {
        if (response === null) {
            let newData = {
              email: email.emails[0].value,
              password: null,
              firstName: email.name.familyName,
              lastName: email.name.givenName,
              googleId: email.id
            };
            const insertResult = await auth.addNewUser(newData, (err, response) => {
              if (err) {
                cb(err);
              } else {
                cb(null, response);
              }
          });
        } else {
          cb(null, response);
        }
      }
    });
  } catch (error) {
    res.status(500).send("Internal Server error Occured");
  }
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { username: user.email });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, user);
  });
});

authRouter.get("/google", passport.authenticate('google', { scope: ["profile", "email"] }));

authRouter.get("/google/home",
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3001/',
    failureRedirect: "/auth/failure"
  })
);

authRouter.post("/register", async (req, res) => {
  try {
    let user = await auth.findUserByEmail(req.body.email, async (err, response) => {
      if (err) {
        return err;
      } else {
        if (response === null) {
            const hashedPw = await bcrypt.hash(req.body.password, saltStrength);
            const insertResult = await auth.addNewUser({
            email: req.body.email,
            password: hashedPw,
            firstName: req.body.firstName,
            lastName: req.body.lastName
          }, (err, response) => {
              if (err) {
                console.log(err);
              } else {
                res.send(true);
              }
          });
        } else {
          res.send(false);
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
});

authRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/auth/success',
  failureRedirect: '/auth/failure',
  failureMessage: true
}));


authRouter.route('/success').get((req, res) => {
  if (req.session.passport.user.username) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

authRouter.get('/isLoggedIn', (req, res) => {
  let isAuth = req.isAuthenticated();
  if (isAuth) {
    res.status(200).send({loggedIn: isAuth, info: req.session.passport.user.username})
  } else {
    res.send(isAuth);
  }
});

authRouter.route('/failure').get((req, res) => {
  res.status(400).send(false);
});

authRouter.get('/logout', function(req, res) {
   req.session.destroy(function (err) {
    res.send(false);
  });
});

module.exports = authRouter;