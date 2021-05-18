// const graphql = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { gql } = require('apollo-server-express');
const bcrypt = require('bcrypt');

const saltRound = 10;
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
  type Mutation {
    userSignup(email: String, name: String, password: String): User
  }
`;

const resolvers = {
  Query: {
    getUserProfile: async (parent, args) => {
      console.log(args);
      const user = await User.findOne({ where: { email: args.email } });
      console.log(user);
      return user;
    },
    getUserProfileTest: async () => {
      const user = await User.findOne({ where: { email: 'admin@gmail.com' } });
      return user;
    },
  },
  Mutation: {
    userSignup: (parent, args, context) => {
      (async () => {
        console.log(args);
        try {
          const salt = await bcrypt.genSalt(saltRound);
          const newUser = {
            ...args, avatar: '/default.jpg', currency: 'USD', language: 'English', timezone: 'US/Pacific',
          };
          newUser.password = await bcrypt.hash(args.password, salt);
          const createUser = await User.create(newUser);
          console.log(createUser);
          return createUser;
        } catch (err) {
          return ({ error: 'User_Signup_Fail' });
          // res.status(400).end(JSON.stringify(err));
        }
      })();
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
