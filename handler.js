'use strict';

const {
	ApolloServer
} = require('apollo-server-lambda');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

const jwks = require('./jwks');
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

const getUser = idToken => {
	const NO_USER = {};

	if (!idToken) return NO_USER;

	try {
		const pem = jwkToPem(jwks.keys[0]);
		const user = jwt.verify(idToken, pem);

		if (user) return user;
	} catch (err) {
		console.error('Failed to authenticate user', err);
	}

	return NO_USER;
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({
		event,
		context,
	}) => {
		const idToken = event.headers.Authorization || '';
		const user = getUser(idToken);

		return {
			context,
			event,
			functionName: context.functionName,
			headers: event.headers,
			user
		};
	}
});

exports.graphql = server.createHandler({
	cors: {
		credentials: true,
		origin: '*',
	},
});
