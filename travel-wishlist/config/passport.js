import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';  // Correct import for ESM
import { User } from '../models/User.js';  // Use named import for the User model

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',  // Use 'username' field for authentication
      passwordField: 'password',  // Even though we won't use the password, it's still part of the form
    },
    async (username, password, done) => {
      try {
        // Find the user by username (bypassing password check)
        const user = await User.findOne({ username });

        if (!user) {
          return done(null, false, { message: 'Username not found' });
        }

        // Skip checking the password (always authenticate if username matches)
        return done(null, user);  // If user exists, log them in regardless of password
      } catch (err) {
        console.error('Passport Authentication Error:', err);
        return done(err);
      }
    }
  )
);

// Serialize and deserialize the user to store in the session
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
