const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const User = require("../database/schemas/User");
const { comparePassword } = require("../utils/helper");

// passport.use(
//   new LocalStrategy(function (email, password, done) {
//     console.log(email);
//     console.log(password);
//     User.findOne(username, (err, user) => {
//       if (err) return done(err);
//       if (!user) return done(null, false);
//       if (user.password != password) return done(null, false);
//       return done(null, user)
//     });
//   })
// );
passport.serializeUser((user, done) => {
  console.log("Serialzing user ....");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserlizining user....");
  console.log(id);
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    console.log(user);
    done(null, user);
  } catch (err) {
    console.log(err);
    done(err, null);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      console.log(email);
      console.log(password);

      try {
        if (!email || !password) {
          throw new Error("Missing Credentials");
        }
        const userDB = await User.findOne({ email });
        if (!userDB) throw new Error("user not found");
        const isValid = comparePassword(password, userDB.password);
        if (isValid) {
          console.log("Authentication Successfully");
          done(null, userDB);
        } else {
          console.log("Invalid Authentication");
          done(null, null);
        }
      } catch (err) {
        console.log("Error");
        done(err, null);
      }
    }
  )
);
