const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");

const app = express();
//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use("/api", authRoutes);
//global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "something went wrong";
  const data = err.data;
  res.status(status).json({ message, data });
});

mongoose.connect("mongodb://localhost:27017/cat-wick").then(() => {
  console.log("database connected");
  app.listen(3000, () => {
    console.log("server is listening 3000");
  });
});
