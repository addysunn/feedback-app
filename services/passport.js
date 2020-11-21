const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');
const { use } = require('passport');

const User = mongoose.model('users');
//just pulling out users collection from mongoos, not requiring it so mongoose won't think we are creating/loading users collection

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('profile: ', profile.id);

      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        // we already have a user
        return done(null, existingUser);
      }
      // we don't have a user woth this ID
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);
