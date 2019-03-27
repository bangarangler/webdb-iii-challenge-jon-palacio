require("dotenv").config();
const express = require("express");
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  useNullAsDefault: true
};

const db = knex(knexConfig);

const server = express();

server.use(express.json());

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`API running on localhost:${port}`);
});
