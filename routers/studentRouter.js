const express = require("express");
const router = express.Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  },
  debug: true
};

const db = knex(knexConfig);

router.get("/", (req, res) => {
  db("students")
    .then(student => {
      res.status(200).json(student);
    })
    .catch(err => {
      res.status(500).json({ message: "Internal Error", err });
    });
});

module.exports = router;
