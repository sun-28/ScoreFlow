const connectToMongo = require("./config/db");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.API_PORT;
dotenv.config();
connectToMongo();

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/code", require("./routes/submission"));
app.use("/test", require("./routes/test"));
app.use("/ques", require("./routes/question"));
app.use("/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  return res.send("Server Healthy!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
