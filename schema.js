const {
	gql
} = require('apollo-server-lambda');

const typeDefs = gql `
	enum LogActionEnum {
		_404
		LOGIN
		LOGOUT
		PAID
		REGISTER
		SUBMIT
	}

	enum PaymentEnum {
		CASH
		PAYPAL
		VENMO
		ZELLE
	}

	enum YesNoEnum {
		Y
		N
	}

	type Character {
		id: ID!
		name: String!
		img: String!
		alive: YesNoEnum!
	}

	type Log {
		id: ID!
		user: User
		message: String!
		action: LogActionEnum!
		time: String!
	}

	type Pick {
		id: ID!
		user: User!
		points: Int!
		character: Character!
	}

	type User {
		id: String!
		name: String!
		paid: YesNoEnum!
		payment_option: PaymentEnum!
		payment_account: String
		tiebreaker: Int
		submitted: YesNoEnum!
	}

	type Query {
		characters: [Character]
		currentUser: User
		logs: [Log]
		myPicks: [Pick]
		picks: [Pick]
		users: [User]
	}

	type Mutation {
		addUser (
			id: String!,
			name: String!,
			paymentOption: PaymentEnum!,
			account: String
		): User

		logAction (
			user_id: String,
			message: String!,
			action: LogActionEnum!
		): Log
	}
`;

module.exports = typeDefs;
