import SnowflakeCondon from 'snowflake-codon'
import _ from 'lodash';
import constants from '../utils/constants';

module.exports = function (sequelize, DataTypes) {
	const generator = new SnowflakeCondon();
	const ticket = sequelize.define('ticket', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'name'
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'status'
		},
		attachment:{
			type:DataTypes.ARRAY(DataTypes.STRING),
			allowNull:false,
			field:'attachment',
			defaultValue: []
		},
		priority: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'priority',
            defaultValue : constants.TICKET_PRIORITY_LOW
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'description'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'created_at'
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			field: 'updated_at'
		},
		deletedAt: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'deleted_at'
		}
	}, {
		tableName: 'ticket',
		timestamps: true,
		paranoid: true
	});

	ticket.associate = function (models) {
		ticket.belongsTo(models.user, {
			onDelete: "CASCADE",
			as: 'createdBy',
			foreignKey: {
				name: 'createdById',
				field: 'created_by',
				allowNull: false
			}
		});
		ticket.belongsTo(models.category, {
			onDelete: "CASCADE",
			as: 'category',
			foreignKey: {
				name: 'categoryId',
				field: 'category_id',
				allowNull: false
			}
		});
		ticket.hasMany(models.access, {
			onDelete: "RESTRICT",
			as: 'assignedTo',
			foreignKey: {
				name: 'ticketId',
				field: 'ticket_id',
				allowNull: false
			}
		});
	};

	ticket.beforeValidate((com) => {
		com.id = generator.nextId();
		return com;
	});

	ticket.hook('afterUpdate', function(ticket, options) {
		if(ticket.dataValues.status != ticket._previousDataValues.status) {
			console.log("status changed");
		} else {
			console.log("status same");
		}
	})
	return ticket;
};