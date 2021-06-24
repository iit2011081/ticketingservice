var errors = require('../config/errors.json');
import AppError from '../utils/appError';

class AppHelper {
	getAppErrorObject(error_string, code = 0, message = null) {
		var error = errors[error_string];
		if (!error) {
			error = {
				errorCode: 2000,
				message: error_string || 'Bad Request',
				responseCode: 400
			};
		}
		var err_obj = new AppError(error.errorCode, error.message, error.responseCode);
		return err_obj;
	}
}

var appHelper = new AppHelper();
export default appHelper;