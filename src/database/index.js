const mongoose = require("mongoose");


mongoose
  .connect(process.env.CONNECTDB)
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => console.log(err));
