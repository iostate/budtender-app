const {GraphQLServer} = require('graphql-yoga');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

const Budtender = mongoose.model('Budtender', {
  firstName: String,
  lastName: String,
  age: Number,
  dhsNumber: Number,
});

const typeDefs = `
    type Query {
        hello(firstName: String): String! 
        budtenders: [Budtender]
    }
    type Budtender {
        id: ID!
        firstName: String!
        lastName: String!
        age: ID!
        dhsNumber: ID!
    }
    type Mutation {
        createBudtender(firstName: String!, lastName: String!, age: ID!, dhsNumber: ID!): Budtender
        updateBudtender(id: ID!, firstName: String, lastName: String, dhsNumber: ID!): Boolean
        removeBudtender(id: ID!): Boolean
    }
`;

const resolvers = {
  Query: {
    hello: (_, {firstName}) => `Hello ${firstName || 'World'}`,
    budtenders: () => Budtender.find(),
  },

  Mutation: {
    createBudtender: async (_, {firstName, lastName, age, dhsNumber}) => {
      const budtender = new Budtender({firstName, lastName, age, dhsNumber});
      await budtender.save();
      return true;
    },
    updateBudtender: async (_, {firstName, lastName, age, dhsNumber}) => {
      await Budtender.findByIdAndUpdate(id, {
        firstName,
        lastName,
        age,
        dhsNumber,
      });
      return true;
    },
    removeBudtender: async (_, {firstName, lastName, age, dhsNumber}) => {
      await Budtender.findByIdAndRemove(id);
      return true;
    },
  },
};

const db = mongoose.connection;

const server = new GraphQLServer({typeDefs, resolvers});
db.once('open', function() {
  server.start(() => console.log('Server is running on localhost:4000'));
});
