const express = require("express");
import models from "./models";
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const usersRouter = require("./routes/user");
const accountsRouter = require("./routes/accounts");
const transactionsRouter = require("./routes/transactions");

const PORT = process.env.PORT || 4000;

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const specs = swaggerJsDoc(options);

app.use("/", swaggerUI.serve, swaggerUI.setup(specs));

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/users", usersRouter);
app.use("/accounts", accountsRouter);
app.use("/transactions", transactionsRouter);

models.sequelize.sync({ force: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
  });
  console.log("db is created");
});
