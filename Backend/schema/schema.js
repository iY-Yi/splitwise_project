// const graphql = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { gql } = require('apollo-server-express');
const { User } = require('../db_models');

const typeDefs = gql`
  type User {
    name: String
    email: String
    avatar: String,
    phone: String,
    currency: String,
    timezone: String,
    language: String,
  }
  type Query {
    getUserProfile(email: String): User,
    getUserProfileTest: User,
  }
`;

const resolvers = {
  Query: {
    getUserProfile: async (parent, args) => {
      const user = await User.findOne({ where: { email: args.email } });
      return user;
    },
    getUserProfileTest: async () => {
      const user = await User.findOne({ where: { email: "admin@gmail.com" } });
      return user;
    },
  },
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// module.exports = new GraphQLSchema({
//   query: RootQuery,
//   // mutation: Mutation
// });
