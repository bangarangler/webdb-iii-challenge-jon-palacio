const express = require("express");
const router = express.Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  debug: true //TODO remove before deploying
};

const db = knex(knexConfig);

router.get("/", (req, res) => {
  db("cohorts")
    .then(cohort => {
      res.status(200).json(cohort);
    })
    .catch(err => {
      res.status(500).json({ message: "Internal Error", err });
    });
});

module.exports = router;
