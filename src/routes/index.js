import Router from 'koa-router';
import authCtrl from '../controllers/auth.ctrl.js'
import categoryCtrl from '../controllers/category.ctrl.js';
import roleCtrl from '../controllers/role.ctrl.js';
import ticketCtrl from '../controllers/ticket.ctrl'
import validate from 'koa2-validation'
import schema from '../utils/validation'
import authenticator from '../middlewares/authenticator'
import ticketAuthenticator from '../middlewares/ticketAuthenticator'
import constants from '../utils/constants.js';

const router = new Router({
	prefix: '/api/v1'
});


//App APIs
/***************************Auth routes******************************/
router.post('/web/auth/signup', validate(schema.signUp), authCtrl.signUp);
router.post('/web/auth/login', validate(schema.login), authCtrl.login);
router.get('/app/auth/logout', authCtrl.logout);

/***************************Category routes******************************/
router.get('/web/categories', authenticator.authenticateUser, categoryCtrl.fetchCategories);
router.post('/web/category', validate(schema.roleOrCategoryCreation), authenticator.authenticateUser, categoryCtrl.createCategory);

/***************************Role routes******************************/
router.get('/web/roles', roleCtrl.fetchRoles);
router.post('/web/role', validate(schema.roleOrCategoryCreation), authenticator.authenticateUser, roleCtrl.createRole);

/***************************Ticket routes******************************/
router.post('/web/ticket', validate(schema.createTicket), authenticator.authenticateUser, ticketCtrl.createTicket);
router.get('/web/tickets', authenticator.authenticateUser, ticketCtrl.fetchTickets);
router.put('/web/ticket/:id', validate(schema.editTicket), authenticator.authenticateUser, ticketAuthenticator('id', 'url', constants.TICKET_PERMISSION_WRITE), ticketCtrl.editTicket);

export default router;



