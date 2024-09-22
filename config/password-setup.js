const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Here, you can save the user to your database or retrieve user information
    // For now, we'll just pass the profile information

    const user = {
      id: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value
    };

    // Generate JWT token
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
    user.token = token;

    // Pass the user with token to be used in the route
    done(null, user);
  }
));

// Serialize user to store in session (optional, if using session)
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from session (optional, if using session)
passport.deserializeUser((user, done) => {
    done(null, user);
});
