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

router.get("/", async (req, res) => {
  try {
    const students = await db("students");
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Internal Error", err });
  }
});

router.get("/:id", async (req, res) => {
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

// FINAL STRETCH GOAL BELOW WORKING CODE! STUDENT RETURNED BY THE GET :ID
// ENDPOINT INCLUDES THE COHORT NAME AND REMOVES THE COHORT ID FIELDS. RETURNED
// OBJECT LOOKS LIKE THIS: {ID: 1, NAME: 'LAMBDA STUDENT', COHORT: "FULL STACK
// WEB"}
//router.get("/:id", (req, res) => {
//const id = req.params.id;
//db("students")
//.where("students.id", id)
//.join("cohorts", "cohorts.id", "students.cohort_id")
//.select("students.id", "students.name", "cohorts.name as cohort")
//.then(student => {
//res.status(200).json(student);
//})
//.catch(err => {
//res.status(500).json({ message: "Internal Error!" });
//});
//});

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

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  try {
    const count = await db("students")
      .where({ id })
      .update(changes);
    const student = await db("students").where({ id });
    return count
      ? res.status(200).json({ ...student[0] })
      : res.status(404).json({ message: "ID can Not Be Found" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", err });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const count = await db("students")
      .where({ id })
      .del();
    return count
      ? res.status(200).json(count)
      : res.status(404).json({ message: "Can't Find!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Error", error });
  }
});

module.exports = router;
