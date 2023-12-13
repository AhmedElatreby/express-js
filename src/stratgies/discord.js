require('dotenv').config();
const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");
const DiscordUser = require("../database/schemas/DiscordUser");



passport.serializeUser((user, done) => {
    console.log("Serialzing user ....");
    console.log(user);
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    console.log("Deserlizining user....");
    console.log(id);
    try {
      const user = await DiscordUser.findById(id);
      if (!user) throw new Error("User not found");
      console.log(user);
      done(null, user);
    } catch (err) {
      console.log(err);
      done(err, null);
    }
  });

passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3001/api/v1/auth/discord/redirect",
      scope: ["identify"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("access token: ", accessToken);
      console.log("refresh token ", refreshToken);
      console.log("profile ", profile);

      try {
        const discordUser = await DiscordUser.findOne({
          discordId: profile.id,
        });
        if (discordUser) {
          console.log(`Found User: ${discordUser}`);
          return done(null, discordUser);
        } else {
          const newUser = await DiscordUser.create({
            discordId: profile.id,
          });
          console.log(`Created User: ${newUser}`);
          return done(null, newUser);
        }
      } catch (err) {
        console.log(err);
        return done(err, null);
      }
    }
  )
);
