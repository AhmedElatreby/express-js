const { Router } = require("express");
const passport = require("passport");
const User = require("../database/schemas/User");
const { hashPassword, comparePassword } = require("../utils/helper");
const { route } = require("./groceries");

const router = Router();

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.sendStatus(400);
//   const userDB = await User.findOne({ email });
//   if (!userDB) return res.sendStatus(401);
//   const isValid = comparePassword(password, userDB.password);
//   if (isValid) {
//     console.log("Authentication Successfully");
//     req.session.user = userDB;
//     return res.sendStatus(200);
//   } else {
//     console.log("Authentication Failed");

//     return res.sendStatus(401);
//   }
// });

router.post("/login", passport.authenticate("local"));

router.post("/register", async (request, response) => {
  const { email, password } = request.body;
  const userDB = await User.findOne({ email });

  if (userDB) {
    response.status(400).send({ msg: "User already exists!" });
  } else {
    const hashedPassword = hashPassword(password);
    console.log(hashedPassword);

    try {
      const newUser = await User.create({
        password: hashedPassword,
        email,
      });
      response.sendStatus(201);
    } catch (error) {
      console.error(error);
      response.status(500).send({ msg: "Internal Server Error" });
    }
  }
});

router.get("/discord", passport.authenticate("discord"), (req, res) => {
  res.sendStatus(200);
});

router.get(
  "/discord/redirect",
  passport.authenticate("discord"),
  (req, res) => {
    res.sendStatus(200);
  }
);

module.exports = router;
