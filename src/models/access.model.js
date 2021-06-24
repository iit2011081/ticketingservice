import SnowflakeCondon from 'snowflake-codon'
import _ from 'lodash';
import constants from '../utils/constants';

module.exports = function (sequelize, DataTypes) {
	const generator = new SnowflakeCondon();
	const access = sequelize.define('access', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		permission: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'permission'
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
		tableName: 'access',
		timestamps: true,
		paranoid: true
	});

	access.associate = function (models) {
		access.belongsTo(models.ticket, {
			onDelete: "CASCADE",
			as: 'ticket',
			foreignKey: {
				name: 'ticketId',
				field: 'ticket_id',
				allowNull: false
			}
		});
		access.belongsTo(models.user, {
			onDelete: "CASCADE",
			as: 'user',
			foreignKey: {
				name: 'userId',
				field: 'user_id',
				allowNull: true
			}
		});
		access.belongsTo(models.role, {
			onDelete: "CASCADE",
			as: 'role',
			foreignKey: {
				name: 'roleId',
				field: 'role_id',
				allowNull: true
			}
		});
	};

	access.beforeValidate((com) => {
		com.id = generator.nextId();
		return com;
	});

	access.prototype.toJSON = function () {
		let ticket = {
			id: this.ticket.id,
			status: this.ticket.status,
            priority : this.ticket.priority,
            attachment : this.ticket.attachment,
            description : this.ticket.description || '',
			createdAt: this.ticket.createdAt,
            updatedAt : this.ticket.updatedAt
		};

		if (this.ticket.category) {
            ticket.category = this.ticket.category.toJSON();
		}
		if (this.ticket.createdBy) {
            const createdBy = this.ticket.createdBy.toJSON();
			ticket.createdBy = {
				id : createdBy.id,
				firstName : createdBy.firstName,
				lastName : createdBy.lastName
			}
		}
		return ticket;
	};
	return access;
};