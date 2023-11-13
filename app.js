const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("Connected to DB...");
  },
  (e) => console.log("DB Error: ", e),
);

const routes = require("./routes");

app.use((req, res, next) => {
  req.user = {
    _id: "654fad2bf416f146d64c4f2c", // Id created by postman test user
  };
  next();
});
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}`);
  console.log("This is working from app.js");
});
