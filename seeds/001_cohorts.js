exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("cohorts")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("cohorts").insert([
        { name: "Web 1" },
        { name: "Android 2" },
        { name: "Data Science 3" }
      ]);
    });
};
