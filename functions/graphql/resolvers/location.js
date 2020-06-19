const axios = require("axios");
const moment = require("moment");
const admin = require("firebase-admin");

const db = admin.firestore();

module.exports = {
 
  history: async (_, { id }) => {
    try {
      const searchHistory = await db
        .collection("searches")
        .where("user", "==", id)
        .orderBy("createdAt", "desc")
        .get();
      // console.log(searchHistory);

      const results = searchHistory.docs.map((result) => {
        return Object.assign({}, { id: result.id }, result.data());
      });

      return results;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};