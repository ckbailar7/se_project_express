// const express = require("express");

// const mongoose = require("mongoose");

// const cors = require("cors");

// require("dotenv").config();

// const routes = require("./routes");

// const app = express();

// const { PORT = 3001 } = process.env;

// app.use(cors());

// app.use(express.json());

// mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

// // app.post("/signup", createUser);
// // app.post("/signin", login);

// // app.use(auth);

// app.use(routes);

// // app.listen(PORT);
// app.listen(PORT, () => {
//   // console.log(`App listening to port ${PORT}`);
//   // console.log("This is working from app.js");
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");

const app = express();

// Define your CORS options
const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"], // React app's URL
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
};

// Use CORS with options
app.use(cors(corsOptions));

const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
