const { db } = require('./database');

const { character, log, pick, user } = db.models;

const resolvers = {
	Query: {
		characters: (parent, args, context, info) => character.findAll(),
		logs: (parent, args, context, info) => log.findAll(),
		picks: (parent, args, context, info) => pick.findAll(),
		users: (parent, args, context, info) => user.findAll(),
	},
	Log: {
		user: ({ user_id }, args, context, info) => user.findById(user_id),
	},
	Pick: {
		character: ({ character_id }, args, context, info) => character.findById(character_id),
		user: ({ user_id }, args, context, info) => user.findById(user_id),
	},
	Mutation: {
		logAction: (parent, args, context, info) => log.create(args),
	},
};

module.exports = resolvers;
