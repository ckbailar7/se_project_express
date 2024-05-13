const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const { createUser, login } = require("./controllers/users");
const auth = require("./middlewares/auth");
app.use(cors());

const routes = require("./routes");

const app = express();

const { PORT = 3001 } = process.env;

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// app.post("/signup", createUser);
// app.post("/signin", login);

// app.use(auth);

app.use(routes);

// app.listen(PORT);
app.listen(PORT, () => {
  // console.log(`App listening to port ${PORT}`);
  // console.log("This is working from app.js");
});
