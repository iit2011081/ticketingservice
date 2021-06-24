import AppError from '../utils/appError';

class ResponseService {
	sendErrorResponse(ctx, err) {
		let response = {};
		if (err instanceof AppError) {
			ctx.status = err.responseCode;
			response = {
				status: false,
				errorCode: err.errorCode || err.code,
				message: err.message
			};

			if (err.errorInfo && err.errorInfo.length > 0) {
				response.errorInfo = [];
				let errInfo = err.errorInfo;
				for (let error of errInfo) {
					response.errorInfo.push({
						param: error.param,
						message: error.msg
					});
				}
			}
			ctx.body = response;
			return ctx;
		} else {
			ctx.status = 500;
			err = 'Something went wrong';
			response = {
				status: false,
				errorCode: 500,
				message: err
			};
		}
		ctx.body = response;
		return ctx;
	}

	sendSuccessResponse(ctx, data, message, options) {
		options = options || {};
		let responseCode = options.responseCode ? options.responseCode : 200;
		ctx.status = responseCode;

		let response = {
			status: true,
			data: data,
			message: message ? message : "Success"
		};
		ctx.body = response;
		return ctx;
	}
}

let responseService = new ResponseService();
export default responseService;