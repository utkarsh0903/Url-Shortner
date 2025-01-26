const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/data");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user");
const linkRoute = require("./routes/link");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 7000;

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/user", userRoute);
app.use("/api/link", linkRoute);

app.listen(PORT, () => {
  console.log(`Server runnning on port ${PORT}`);
});
