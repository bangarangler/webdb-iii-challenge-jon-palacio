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

router.get("/", async (req, res) => {
  try {
    const cohorts = await db("cohorts");
    res.status(200).json(cohorts);
  } catch (err) {
    res.status(500).json({ message: "Internal Error", err });
  }
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

router.get("/:id/students", async (req, res) => {
  const { id } = req.params;
  try {
    const students = await db
      .select("*")
      .from("cohorts")
      .where({ "cohorts.id": id })
      .join("students", { "cohorts.id": "students.cohort_id" });
    return !students.length
      ? res.status(404).json({ message: "Cohort non exsistant" })
      : res.status(200).json(students);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting student info Internal Issue" });
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

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  try {
    const count = await db("cohorts")
      .where({ id })
      .update(changes);
    const cohort = await db("cohorts").where({ id });
    return count
      ? res.status(200).json({ ...cohort[0] })
      : res.status(404).json({ message: "Id Can Not Be Found" });
} catch (err) {
res.status(500).json({ message: 'Internal Server Error', err })
}
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const count = await db("cohorts")
      .where({ id })
      .del();
    return count
      ? res.status(200).json(count)
      : res.status(404).json({ message: "Can't Find!" });
  } catch (err) {
    res.status(500).json({ message: "Internal Error", err });
  }
});

module.exports = router;
