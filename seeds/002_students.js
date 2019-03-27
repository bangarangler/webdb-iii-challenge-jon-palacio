exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("students")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("students").insert([
        { name: "Jon", cohort_id: 1 },
        { name: "Tim", cohort_id: 2 },
        { name: "Kelly", cohort_id: 3 }
      ]);
    });
};
