const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db", (e) =>
  console.log("DB error : ", e),
);

app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
});

app.use((req, res, next) => {
  req.user = {
    _id: "6542409b7c09c363de9c6a8e",
  };
  next();
});
