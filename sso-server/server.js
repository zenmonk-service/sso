require("dotenv").config();
global.argv = process.argv.slice(2);
global.listeningPort = argv[0] || 5555;
if (!global.listeningPort) {
  console.log("port is not defined. argv = ", argv);
  process.exit(128);
}

const path = require("path");
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const RedisStore = require("connect-redis").default;

const app = express();
const server = require("http").Server(app);

app.set('views', path.join( __dirname, 'views'))
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "Public"), {}));

const allowedOrigins = ["http://localhost:3000", "http://public.zenmonk.in"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// app.use(function (req, res, next) {
// 	if ( req.headers && req.headers.origin ) res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
// })

// Redis connection
const { connectRedisClient } = require("./config/redis");
global.redisClient = connectRedisClient();
app.use(
  session({
    store: new RedisStore({ client: global.redisClient, prefix: "session:" }),
    secret: process.env.REDIS_SESSION_SECRET_KEY || "topsecret~!@#$%^&*",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      domain: '.zenmonk.in',
      maxAge: 1000 * 60 * 60 * 3 // 3 hours in second
      // httpOnly: false,
      //maxAge: 1000 * 60 * 1440, // 1440 minutes or 1 day
    },
  })
);

// Routes declaration
app.use("/", require("./routes"));

process.on("SIGINT", function () {
  process.exit(0);
});

process.on("uncaughtException", function (err) {
  console.error("uncaughtException--", err);
});

process.on("unhandledRejection", (reason, p) => {
  // application specific logging, throwing an error, or other logic here
  console.error("Unhandled Rejection at:", p, "reason:", reason);
});

app.listen(global.listeningPort, () => {
  console.log("ENV: ", process.env.ENV);
  console.log(`listening on port ${global.listeningPort}`);
});
