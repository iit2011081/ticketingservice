import responseService from '../services/response.service'
import categoryService from '../services/category.service'
import errorMessages from '../utils/errorMessages';

class Category {
    async fetchCategories(ctx) {
        await categoryService.fetchCategories(ctx.request.user).then(user => {
			const msg = errorMessages.MSG_8;
			return responseService.sendSuccessResponse(ctx, user, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
    }

    async createCategory(ctx) {
        await categoryService.createCategory(ctx.request.user, ctx.request.body).then(user => {
			const msg = errorMessages.MSG_9;
			return responseService.sendSuccessResponse(ctx, user, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
    }
}
const categoryCtrl = new Category();
export default categoryCtrl;