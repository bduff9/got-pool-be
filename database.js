const Sequelize = require('sequelize');

const user = process.env.MYSQL_USER;
const pwd = process.env.MYSQL_PASS;
const host = process.env.MYSQL_HOST;
const port = 3306;

const db = new Sequelize('GoT', user, pwd, {
	define: {
		freezeTableName: true,
		underscored: true,
	},
	dialect: 'mysql',
	dialectOptions: {},
	host,
	operatorsAliases: false,
	pool: {
		max: 5,
		min: 0,
		idle: 20000,
	},
	port,
});

// Define the models
const Characters = db.define('character', {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.INTEGER,
	},
	name: {
		allowNull: false,
		type: Sequelize.STRING(30),
		unique: true,
		validate: {
			notEmpty: true,
		},
	},
	img: {
		allowNull: false,
		type: Sequelize.STRING(30),
		unique: true,
		validate: {
			notEmpty: true,
		},
	},
	alive: {
		allowNull: false,
		defaultValue: 'Y',
		type: Sequelize.ENUM(['N', 'Y']),
	},
}, {
	comment: 'All possible main characters in Game of Thrones',
});

const Logs = db.define('log', {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.INTEGER,
	},
	user_id: {
		allowNull: true,
		type: Sequelize.CHAR(40),
		validate: {
			isUUID: 4,
		},
	},
	message: {
		allowNull: false,
		type: Sequelize.STRING,
		validate: {
			notEmpty: true,
		},
	},
	action: {
		allowNull: false,
		type: Sequelize.ENUM([
			'_404',
			'LOGIN',
			'LOGOUT',
			'PAID',
			'REGISTER',
			'SUBMIT',
		]),
	},
}, {
	comment: 'All logged actions for users',
});

const Picks = db.define('pick', {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: Sequelize.INTEGER,
	},
	user_id: {
		allowNull: false,
		type: Sequelize.CHAR(40),
		validate: {
			isUUID: 4,
		},
	},
	points: {
		allowNull: false,
		type: Sequelize.INTEGER(1),
		validate: {
			min: 1,
			max: 7,
		},
	},
	character_id: {
		allowNull: false,
		type: Sequelize.INTEGER,
	},
}, {
	comment: 'All user picks for the pool',
});

const Users = db.define('user', {
	id: {
		allowNull: false,
		primaryKey: true,
		type: Sequelize.CHAR(40),
		validate: {
			isUUID: 4,
		},
	},
	name: {
		allowNull: false,
		type: Sequelize.STRING,
		unique: true,
		validate: {
			contains: ' ',
			notEmpty: true,
		},
	},
	paid: {
		allowNull: false,
		defaultValue: 'N',
		type: Sequelize.ENUM(['N', 'Y']),
	},
	payment_option: {
		allowNull: false,
		type: Sequelize.ENUM([
			'CASH',
			'PAYPAL',
			'VENMO',
			'ZELLE',
		]),
	},
	payment_account: {
		allowNull: true,
		type: Sequelize.STRING,
		unique: true,
	},
	tiebreaker: {
		allowNull: true,
		type: Sequelize.INTEGER(2),
		validate: {
			min: 0,
			max: 34,
		},
	},
	submitted: {
		allowNull: false,
		defaultValue: 'N',
		type: Sequelize.ENUM(['N', 'Y']),
	},
}, {
	comment: 'All user profile information',
});

// Define table relationships
Logs.belongsTo(Users, { foreignKey: 'user_id' });
Picks.belongsTo(Users, { foreignKey: 'user_id' });
Picks.belongsTo(Characters, { foreignKey: 'character_id' });

// Create the tables if they don't exist yet
db.sync();

module.exports = { db, Sequelize };
