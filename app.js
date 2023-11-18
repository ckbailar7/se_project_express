const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use((req, res, next) => {
  req.user = {
    _id: "654fad2bf416f146d64c4f2c",
  };
  next();
});

const routes = require("./routes");

app.use(routes);

app.listen(PORT);
