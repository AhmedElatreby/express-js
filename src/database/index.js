const mongoose = require("mongoose");


mongoose
  .connect("mongodb+srv://admin:admin@cluster0.tyqr1iw.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => console.log(err));
