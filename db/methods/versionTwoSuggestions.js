const { versionTwoSuggestionsDb } = require('../index');

const addVersionTwoSuggestion = params => {
  return new Promise(async (resolve, reject) => {
    try {
      const found = await versionTwoSuggestionsDb.insert(params);

      resolve(found);
    } catch (error) {
      reject(`Add VersionTwoSuggestion: ${error}`);
    }
  });
};

const getVersionTwoSuggestion = params => {
  return new Promise(async (resolve, reject) => {
    try {
      const found = await versionTwoSuggestionsDb.find(params);

      resolve(found);
    } catch (error) {
      reject(`Get VersionTwoSuggestion: ${error}`);
    }
  });
};

const updateVersionTwoSuggestion = (findField, setField) => {
  return new Promise(async (resolve, reject) => {
    try {
      await versionTwoSuggestionsDb.update(findField, setField);
      
      resolve(true);
    } catch (error) {
      reject(`Update VersionTwoSuggestion: ${error}`);
    }
  });
};

module.exports = {
  addVersionTwoSuggestion,
  getVersionTwoSuggestion,
  updateVersionTwoSuggestion
};
