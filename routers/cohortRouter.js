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

router.get("/:id", async (req, res) => {
  const cHRTID = req.params.id;
  try {
    const cohort = await db("cohorts")
      .where({ id: cHRTID })
      .first();
    res.status(200).json(cohort);
  } catch (err) {
    res.status(500).json({ message: "Internal Error", err });
  }
});

router.post("/", async (req, res) => {
  if (req.body.name === "") {
    return res
      .status(400)
      .json({ message: "Bad request! must provide a name" });
  }
  try {
    const newChrtID = await db("cohorts").insert(req.body);
    const id = newChrtID[0];
    const newChrt = await db("cohorts")
      .where({ id })
      .first();
    res.status(201).json(newChrt);
  } catch (err) {
    res.status(500).json({ message: "Internal Error", err });
  }
});

router.put("/:id", (req, res) => {
  db("cohorts")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "No Cohort found for that ID" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Internal Error", err });
    });
});

module.exports = router;
