const functions = require("firebase-functions");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const admin = require("firebase-admin");
const moment = require("moment");
const config = require("./appconfig");
const firebase = require("firebase");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");
const port = process.env.PORT || 4000;

const serviceAccount = require("./config.json");
// const {
//   UserDimensions
// } = require("firebase-functions/lib/providers/analytics");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.databaseURL,
  storageBucket: config.storageBucket
});
firebase.initializeApp(config);
const db = admin.firestore();
const app = express();
app.use(cors());

// console.log(db);

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const schema = new ApolloServer({
  typeDefs,
  resolvers,
  playground:true,
  introspection:true
});

// app.post("/posting", async (req, res) => {
//   const { lat, lng, radius, name, address, userId } =JSON.parse(req.body);
//   let searchName;
//   // req.body
//   if (
//     address === "hopital" ||
//     address === "pharmacy" ||
//     address === "clinics" ||
//     address === "medical office"
//   ) {
//     searchName = name;
//   } else {
//     searchName = "hospital";
//   }

//   console.log(req.body);
//   console.log(lat, lng, radius, name, address);
//   console.log(searchName);
//   const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&types=health&name=${searchName}&key=AIzaSyC08P9EaaVvSb4aqiYc8F7plZifcXCBc20`;

//   try {
//     const response = await axios.get(url);
//     const resp = await response.data;
//     await db.collection("searches").add({
//       url: url,
//       lat: lat,
//       lng: lng,
//       address: address,
//       name: searchName,
//       user: userId,
//       createdAt: moment().format("LLL")
//     });
//     return res.status(200).json(resp);
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ status: "error", message: "Something went wrong" });
//   }
// });

// app.post("/history", async (req, res) => {
//   const { id } = JSON.parse(req.body);
//   console.log(id);
//   console.log("helo pat");
//   console.log(req.body);

//   try {
//     const searchHistory = await db
//       .collection("searches")
//       .where("user", "==", id)
//       .orderBy("createdAt", "desc")
//       .get();
//     console.log(searchHistory);

//     const results = searchHistory.docs.map((result) => {
//       return Object.assign({}, { id: result.id }, result.data());
//     });
//     return res.status(200).json({ data: results, status: 200 });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ message: "Something went wrong", status: 500 });
//   }
// });

schema.applyMiddleware({ app, path: "/graphql",cors:true });
const graphQLServer = http.createServer(app);
schema.installSubscriptionHandlers(graphQLServer);

// graphQLServer.listen(port, () => {
//   console.log(`Server is Listening on Port ${port}`);
//   console.log(
//     `Subscriptions ready at ws://localhost:${port}${schema.subscriptionsPath}`
  
//   );
// });

exports.graphql = functions.https.onRequest(app);