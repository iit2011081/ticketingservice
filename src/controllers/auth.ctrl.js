import responseService from '../services/response.service'
import authService from '../services/auth.service'
import errorMessages from '../utils/errorMessages';

class Auth {
	async signUp(ctx) {
		await authService.signUp(ctx.request.body).then(user => {
			let msg = 'User sucessfully registered';
			if (!user.isEmailVerified && !user.isPhoneVerified) {
				msg += ', Please verify your email and phone.';
			} else if (!user.isEmailVerified) {
				msg += ', Please verify your email.';
			} else if (!user.isPhoneVerified) {
				msg += ' Please verify your phone.';
			}
			return responseService.sendSuccessResponse(ctx, user, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
	}

	async login(ctx) {
		await authService.login(ctx.request.body).then(user => {
			const msg = errorMessages.MSG_6;
			return responseService.sendSuccessResponse(ctx, user, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
	}

	async logout(ctx) {
		await authService.logout(ctx.state.user, ctx.headers).then(user => {
			const msg = errorMessages.MSG_7;
			return responseService.sendSuccessResponse(ctx, user, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
	}
}

const authCtrl = new Auth();
export default authCtrl;