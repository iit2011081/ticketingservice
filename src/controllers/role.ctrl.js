import responseService from '../services/response.service'
import roleService from '../services/role.service'
import errorMessages from '../utils/errorMessages'

class Role {
    async fetchRoles(ctx) {
        await roleService.fetchRoles().then(user => {
			const msg = errorMessages.MSG_10;
			return responseService.sendSuccessResponse(ctx, user, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
    }

    async createRole(ctx) {
        await roleService.createRole(ctx.request.user, ctx.request.body).then(user => {
			const msg = errorMessages.MSG_11;
			return responseService.sendSuccessResponse(ctx, user, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
    }
}
const roleCtrl = new Role();
export default roleCtrl;