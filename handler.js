'use strict';

const { ApolloServer } = require('apollo-server-lambda');

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
});

exports.graphql = server.createHandler({
  cors: {
		//credentials: true,
		origin: '*',
	},
});
