const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

require("./db/mongoose");

const userRouter = require("./routes/user.routes");
const candidateRouter = require("./routes/candidate.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);
app.use(candidateRouter);

app.listen(process.env.PORT, () => {
  console.log("Server started at port", process.env.PORT);
});
