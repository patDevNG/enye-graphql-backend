const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar Date
  schema {
    query: Query
   
  }
  type Query {
    history(id: ID!): [Location]
  }
  type Status {
    message: Boolean
  }
  type Location {
    id: ID
    createdAt: Date
    address: String
    name: String
    user: ID
    lat: Float
    lng: Float
    url: String
  }

 

  type Geometry {
    location: MainLocation
  }

  type MainLocation {
    lat: Float
    lng: Float
  }
  
`;