import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../models/User.js'; 
import dotenv from 'dotenv';
dotenv.config();

// Define Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: 'Username not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (err) {
        console.error('Passport Authentication Error:', err);
        return done(err);
      }
    }
  )
);

// GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/users/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check for existing user with this GitHub ID
    let user = await User.findOne({ githubId: profile.id });

    // If none, create a new user
    if (!user) {
      user = new User({
        githubId: profile.id,
        username: profile.username
      });
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Export passport
export default passport;
