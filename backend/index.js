const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.BACK_PORT;

dotenv.config();

connectToMongo();

const app = express();

app.use(cors());
app.use(express.json());

app.get("helo", (req, res) => {
  res.json({ Hello: "World" });
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
