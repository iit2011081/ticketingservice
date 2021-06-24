import appHelper from '../utils/appHelper';
import errorMessages from '../utils/errorMessages';
import models from '../models';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import redisHelper from '../utils/redis';
import JWT from 'jsonwebtoken'
import config from '../config'
import _ from 'lodash'

let JWT_ISSUER = config.jwtIssuer;
let JWT_SECRET_FOR_ACCESS_TOKEN = config.jwtSecretAccessToken;
let JWT_ACCESS_TOKEN_EXPIRY_SECONDS = config.accessTokenLifetime;

class Auth {
    getAccessTokenExpiry(expiryInSeconds = JWT_ACCESS_TOKEN_EXPIRY_SECONDS) {
		let exp = Math.floor(Date.now() / 1000);
		exp = exp + expiryInSeconds;
		return exp;
	}

	async generateAccessToken(client, user, options = {}) {
		const secret = JWT_SECRET_FOR_ACCESS_TOKEN;
		const payload = {
			iss: options.iss || JWT_ISSUER ,
			userId: user.id,
			userMeta: user,
			client: client
		};
		payload.exp = this.getAccessTokenExpiry();
		return JWT.sign(payload, secret);
	}

    setUserDataInRedis(userId, userData, exp) {
		if(!exp) {
			exp = oauth.getAccessTokenExpiry();
		}
		redisHelper.set(userId, JSON.stringify(userData), exp);
    }

    async getLoginResponse(user) {
        try {
            const u = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email || '',
                phone: user.phone || '',
                countryCode : user.countryCode,
                roleId : user.roleId,
                createdAt: user.createdAt
            };
            const uForAcess = {
                id: user.id
            };
            const accessToken = await this.generateAccessToken({}, uForAcess);
            this.setUserDataInRedis("user-"+user.id, u, config.accessTokenLifetime * 60);
            return { user: u, accessToken};
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async signUp(postData) {
        let emailVerified = false,
            phoneVerified = false;
        const countryCode = postData.countryCode || '91';
        let user = await models.user.findOne({
            where : {
                $or : [
                    {
                        "$and" : [
                            {
                                "phone" : postData.phone
                            },
                            {
                                "countryCode" : countryCode
                            }
                        ]
                    },
                    {
                        "email" : {
                            $ilike : postData.email
                        }
                    }
                ]
            }
        });
        if (user) {
            let errorMessage = "";
            if (postData.email === user.email) {
                errorMessage = errorMessages.MSG_1;
            } else if (postData.phone === user.phone) {
                errorMessage = errorMessages.MSG_2;
            } else {
                errorMessage = errorMessages.MSG_3;
            }
            var err = appHelper.getAppErrorObject('INVALID_ID');
            err.message = errorMessage;
            throw err;
        } else {
            postData.isEmailVerified = emailVerified;
            postData.isPhoneVerified = phoneVerified;
            postData.verificationToken = uuid();
            postData.password = bcrypt.hashSync(postData.password, 10);
            user = await models.user.create(postData);
            if (user) {
                // @TODO Email and Phone verification
                return { isEmailVerified: postData.isEmailVerified, isPhoneVerified: postData.isPhoneVerified };
            } else {
                var err = appHelper.getAppErrorObject('SOMETHING_WENT_WRONG');
                throw err;
            }
        }
    }

    async login(data) {
        try {
            if(!data.email && !data.phone) {
                var err = appHelper.getAppErrorObject('INVALID_REQUEST_DATA');
                err.message = errorMessages.MSG_4;
                throw err;
            }
            const countryCode = data.countryCode || '91';
            let user = await models.user.findOne({
                where : {
                    $or : [
                        {
                            "$and" : [
                                {
                                    "phone" : data.phone
                                },
                                {
                                    "countryCode" : countryCode
                                }
                            ]
                        },
                        {
                            "email" : {
                                $ilike : data.email
                            }
                        }
                    ]
                }
            });
            if (!user) {
                var err = appHelper.getAppErrorObject('INVALID_REQUEST_DATA');
                err.message = errorMessages.MSG_5;
                throw err;
            }
            const matches = await bcrypt.compare(data['password'], user.password);
            if(matches) {
                return this.getLoginResponse(user);
            } else {
                var err = appHelper.getAppErrorObject('INVALID_REQUEST_DATA');
                err.message = errorMessages.MSG_5;
                throw err;
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async logout(userData, headers) {
        try {
            if (headers.authorization && headers.authorization.split(" ")[0] === "Bearer") {
                let expirationDate = new Date(parseInt(userData.exp) * 1000);
                let currentDate = new Date();
                let difference = (expirationDate - currentDate) / 1000;
                let token = headers.authorization.split(" ")[1];
                redisHelper.hset('blacklistedTokens', token, userData.userId, difference);
            }
            return {}
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}
const authService = new Auth();
export default authService;