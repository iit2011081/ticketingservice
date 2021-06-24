import SnowflakeCondon from 'snowflake-codon'
import _ from 'lodash';

module.exports = function (sequelize, DataTypes) {
	const generator = new SnowflakeCondon();
	const category = sequelize.define('category', {
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
		tableName: 'category',
		timestamps: true,
		paranoid: true
	});

	category.beforeValidate((com) => {
		com.id = generator.nextId();
		return com;
	});

	category.prototype.toJSON = function () {
		let category = {
			id: this.id,
			name: this.name
		};
		return category;
	};
	return category;
};