const axios = require("axios");
const moment = require("moment");
const admin = require("firebase-admin");

const db = admin.firestore();

module.exports = {
  root: async (_, { lat, lng, radius, name, address, userId }) => {
    let searchName;
    if (
      address === "hopital" ||
      address === "pharmacy" ||
      address === "clinics" ||
      address === "medical office"
    ) {
      searchName = name;
    } else {
      searchName = "hospital";
    }

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&types=health&name=${searchName}&key=AIzaSyC08P9EaaVvSb4aqiYc8F7plZifcXCBc20`;

    try {
      const response = await axios.get(url);
      const resp = await response.data;
      await db.collection("searches").add({
        url: url,
        lat: lat,
        lng: lng,
        address: address,
        name: searchName,
        user: userId,
        createdAt: moment().format("LLL")
      });

      // console.log(response);

      return resp.results;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

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