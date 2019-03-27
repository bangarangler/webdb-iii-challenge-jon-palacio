exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("students")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("students").insert([
        { cohort_id: 1, name: "Jon" },
        { cohort_id: 2, name: "Tim" },
        { cohort_id: 3, name: "Kelly" }
      ]);
    });
};
