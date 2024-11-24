const connectToMongo = require("./config/db");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const RedisStore = require("connect-redis").default;
const redis = require("ioredis");
const PORT = process.env.API_PORT;
dotenv.config();
connectToMongo();

const app = express();
const redisClient = new redis({
  host: "127.0.0.1",
  port: 6379,
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  session({
    secret: "scoreflow_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: new RedisStore({ client: redisClient }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/code", require("./routes/submission"));
app.use("/test", require("./routes/test"));
app.use("/ques", require("./routes/question"));
app.use("/auth", require("./routes/auth"));
app.use("/review", require("./routes/review"));
app.use("/", require("./routes/plag"));

app.get("/", (req, res) => {
  return res.send("Server Healthy!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
