const {
	db
} = require('./database');

const {
	character,
	log,
	pick,
	user
} = db.models;

const resolvers = {
	Query: {
		characters: (parent, args, context, info) => character.findAll(),
		currentUser: (parent, args, context, info) => user.findByPk(context.user.sub),
		logs: (parent, args, context, info) => log.findAll(),
		myPicks: (parent, args, context, info) => pick.findAll({
			where: {
				user_id: context.user.sub
			}
		}),
		picks: (parent, args, context, info) => pick.findAll(),
		users: (parent, args, context, info) => user.findAll(),
	},

	Log: {
		user: ({
			user_id
		}, args, context, info) => user.findByPk(user_id),
	},

	Pick: {
		character: ({
			character_id
		}, args, context, info) => character.findByPk(character_id),
		user: ({
			user_id
		}, args, context, info) => user.findByPk(user_id),
	},

	Mutation: {
		addUser: (parent, {
			account: payment_account,
			paymentOption: payment_option,
			...args
		}, context, info) => user.create({
			...args,
			payment_account,
			payment_option
		}),
		logAction: (parent, args, context, info) => log.create(args),
	},
};

module.exports = resolvers;
