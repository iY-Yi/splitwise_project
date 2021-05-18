const graphql = require('graphql');
const { User, Group, GroupUser } = require('../db_models');
const { userLogin, userSignup, userUpdate } = require('../mutations/user');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    password: { type: GraphQLString },
    phone: { type: GraphQLString },
    avatar: { type: GraphQLString },
    currency: { type: GraphQLString },
    timezone: { type: GraphQLString },
    language: { type: GraphQLString },
  }),
});

const StatusType = new GraphQLObjectType({
  name: 'Status',
  fields: () => ({
    status: { type: GraphQLString },
    message: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getUserProfile: {
      type: UserType,
      args: { email: { type: GraphQLString } },
      async resolve(parent, args) {
        const user = await User.findOne({ where: { email: args.email } });
        if (user) {
          return user;
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    userLogin: {
      type: StatusType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return userLogin(args);
      },
    },

    userSignup: {
      type: StatusType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args) {
        return userSignup(args);
      },
    },

    profileUpdate: {
      type: StatusType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
        language: { type: GraphQLString },
        timezone: { type: GraphQLString },
        currency: { type: GraphQLString },
        avatar: { type: GraphQLString },
      },
      async resolve(parent, args) {
        return userUpdate(args);
      },
    },

  },

});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
