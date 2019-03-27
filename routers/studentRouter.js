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

router.get("/:id", async (req, res) => {
  //if (!req.params.id) {
  //res.status(404).json({ message: "No Student found at that id" });
  //}
  const stdntID = req.params.id;
  try {
    const student = await db("students")
      .where({ id: stdntID })
      .first();
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: "Internal Error", err });
  }
});

router.post("/", async (req, res) => {
  if (
    req.body.name === "" ||
    req.body.cohort_id === "" ||
    req.body.cohort_id === null
  ) {
    return res
      .status(400)
      .json({ message: "Bad Request! must provide a name and cohort_id" });
  }
  try {
    const newStdntID = await db("students").insert(req.body);
    const id = newStdntID[0];
    const newStdnt = await db("students")
      .where({ id })
      .first();
    res.status(201).json(newStdnt);
  } catch (err) {
    res.status(500).json({ message: "Internal Error", err });
  }
});

router.put("/:id", (req, res) => {
  db("students")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: "No Student Fount for that ID" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Internal Error", err });
    });
});

router.delete("/:id", (req, res) => {
  db("students")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res
          .status(404)
          .json({ message: "No Student found at ID, can't delete" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Internal Error", err });
    });
});

module.exports = router;
