import SnowflakeCondon from 'snowflake-codon'
import _ from 'lodash';

module.exports = function (sequelize, DataTypes) {
	const generator = new SnowflakeCondon();
	const role = sequelize.define('role', {
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
		tableName: 'role',
		timestamps: true,
		paranoid: true
	});

	role.beforeValidate((com) => {
		com.id = generator.nextId();
		return com;
	});

	role.prototype.toJSON = function () {
		let role = {
			id: this.id,
			name: this.name
		};
		return role;
	};
	return role;
};