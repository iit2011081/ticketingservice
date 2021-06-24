import Joi from 'joi'
import constants from './constants';

const schema = {
	signUp: {
		body: {
			firstName: Joi.string().min(3).required().trim(),
			lastName: Joi.string().trim().allow(''),
			email: Joi.string().required().email({ minDomainAtoms: 2 }).lowercase().trim(),
			phone: Joi.string().required(),
			password: Joi.string().min(6).required(),
			countryCode: Joi.string().trim().allow(''),
			roleId : Joi.string().required()
		}
	},
	login: {
		body: {
			phone: Joi.string().allow(''),
			countryCode: Joi.string().trim().allow(''),
			email: Joi.string().email({ minDomainAtoms: 2 }).lowercase().trim(),
		}
	},
	roleOrCategoryCreation: {
		body: {
			name: Joi.string().required(),
		}
	},
	createTicket : {
		body : {
			name : Joi.string().required(),
			description : Joi.string().allow(''),
			attachment : Joi.array().items(Joi.string()).unique(),
			categoryId : Joi.string().required(),
			assignedTo : {
				userIds : Joi.array().items(Joi.string()).unique(),
				roleIds : Joi.array().items(Joi.string()).unique()
			}
		}
	},
	editTicket : {
		body : {
			status : Joi.string().valid([constants.TICKET_STATUS_CANCELLED, constants.TICKET_STATUS_COMPLETED, constants.TICKET_STATUS_OPEN, constants.TICKET_STATUS_INPROGRESS]),
			assignedTo : {
				userIds : Joi.array().items(Joi.string()).unique(),
				roleIds : Joi.array().items(Joi.string()).unique()
			}
		}
	}
};

export default schema;