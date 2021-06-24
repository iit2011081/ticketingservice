import models from '../models/index'
import redisHelper from '../utils/redis'

class Authenticator {
	async authenticateUser(ctx, next) {
		let userData = ctx.state.user;
		if(userData && userData.userMeta && userData.userMeta.id) {
			let user = await redisHelper.get('user-'+userData.userMeta.id);
			if(!user) {
				user = await models.user.findByPk(userData.userMeta.id);
				user = user.dataValues;
			} else {
				user = JSON.parse(user);
			}
			ctx.request.user = user;
			if(ctx.request.user) {
				await next();
			} else {
				ctx.throw(401, 'Unauthorized Access');
			}
		} else {
			ctx.throw(401, 'Unauthorized Access');
		}
	}
}
var authenticator = new Authenticator();
export default authenticator;