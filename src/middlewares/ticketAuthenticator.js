import models from '../models/index'

module.exports = (ticketIdKey, getDataFrom, permission) => async(ctx, next) => {
    const loginUser = ctx.request.user;
	if(loginUser) {
		let ticketId = false;
		if(getDataFrom == 'url') {
			ticketId = ctx.params[ticketIdKey];
		} else if(getDataFrom == 'body') {
			ticketId = ctx.request.body[ticketIdKey];
		} else if(getDataFrom == 'query') {
			ticketId = ctx.request.query[ticketIdKey];
		}
		if(ticketId) {
            let access = await models.access.findOne({
                where : {
                    ticketId : ticketId,
                    '$or' : [
                        {
                            userId : loginUser.id
                        },
                        {
                            roleId : loginUser.roleId
                        }
                    ]
                }
            });
            if(!access || (access.permission != permission)) {
                ctx.throw(403, 'Unauthorized Access');
            }
            return next();
		} else {
			ctx.throw(403, 'Unauthorized Access');
		}
	} else {
		ctx.throw(403, 'Unauthorized Access');
	}
};