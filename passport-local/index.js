/**
 * Environment
 */
require("dotenv-safe").config();

/**
 * Setup Express
 */
var express = require("express");
var app = express();

/**
 * Global NPM
 */
global.reqlib = require("app-root-path").require;

/**
 * Parsers
 */
app.use(
  require("body-parser").urlencoded({
    extended: true,
  })
);
app.use(express.json());

/**
 * Database and Session
 */
var mongoose = require("mongoose");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
mongoose.connect(process.env.DATABASE_URL, {
  promiseLibrary: global.Promise,
  keepAlive: true,
  keepAliveInitialDelay: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", function (error) {
  console.error(error);
});
db.once("open", function () {
  console.log("Database Connected");
});
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.SECRET,
    store: new MongoStore({
      mongooseConnection: db,
    }),
  })
);

/**
 * Authentication
 */
var auth = reqlib("/lib/auth.js")(app, {});
auth.init();
auth.registerRoutes();

/**
 * Routes
 */
app.get("/success", (req, res) =>
  res.send("Welcome " + req.user.username + "!!")
);
app.get("/error", (req, res) => res.send("Error logging in!"));

/**
 * Server
 */
app.listen(3000, () => console.log("Server Started"));
