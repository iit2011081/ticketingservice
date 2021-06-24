import SnowflakeCondon from 'snowflake-codon'

module.exports = function (sequelize, DataTypes) {
	const generator = new SnowflakeCondon();
	const user = sequelize.define('user', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
			field: 'first_name'
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'last_name'
		},
		email: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'email'
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'phone'
		},
		countryCode: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'country_code'
		},
		password: {
			type: DataTypes.STRING(512),
			allowNull: false,
			field: 'password'
		},
		isEmailVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			field: 'is_email_verified'
		},
		isPhoneVerified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			field: 'is_phone_verified'
		},
		verificationToken: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'verification_token'
		},
		resetPasswordToken: {
			type: DataTypes.STRING,
			allowNull: true,
			field: 'reset_password_token'
		},
		resetExpiry: {
			type: DataTypes.DATE,
			allowNull: true,
			field: 'reset_expiry'
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
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
		tableName: 'user',
		timestamps: true,
		paranoid: true
	});

	user.beforeValidate((user) => {
		user.id = generator.nextId();
		return user;
	});

	user.associate = function (models) {
		user.belongsTo(models.user, {
			onDelete: "CASCADE",
			as: 'role',
			foreignKey: {
				name: 'roleId',
				field: 'role_id',
				allowNull: false
			}
		});
	};

	user.prototype.toJSON = function () {
		let user = {
			id: this.id,
			firstName: this.firstName || '',
			lastName: this.lastName || '',
			email: this.email || '',
			phone: this.phone || '',
        };
		return user;
	};

	return user;
};