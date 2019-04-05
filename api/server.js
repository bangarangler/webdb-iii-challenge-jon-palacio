require("dotenv").config();
const express = require("express");
const knex = require("knex");

const cohortRouter = require("../routers/cohortRouter.js");
const studentRouter = require("../routers/studentRouter.js");

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

server.use("/api/cohorts", cohortRouter);
server.use("/api/students", studentRouter);

module.exports = server;
