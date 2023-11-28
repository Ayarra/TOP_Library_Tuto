const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const ejsLayouts = require("express-ejs-layouts");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog");

const app = express();

// Set Up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
});

// set up mongoose connection

const mongoose = require("mongoose");
const mongodbDevUrl =
  "mongodb+srv://insan:insan-insan@cluster0.p37x07g.mongodb.net/?retryWrites=true&w=majority";

const mongodb = process.env.MONGODB_URI || mongodbDevUrl;
const MongoConnect = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(mongodb);
};
MongoConnect();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.use(ejsLayouts);
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["self", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);
app.use(limiter);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
