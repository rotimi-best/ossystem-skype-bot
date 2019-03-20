const Datastore = require("nedb-promises");

const versionTwoSuggestionsDb = Datastore.create({
  filename: "db/data/versionTwoSuggestions.db",
  timestampData: true,
  autoload: true
});

module.exports = { versionTwoSuggestionsDb };
