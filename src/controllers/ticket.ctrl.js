import responseService from '../services/response.service'
import ticketService from '../services/ticket.service'

class Ticket {
    async createTicket(ctx) {
        await ticketService.createTicket(ctx.request.user, ctx.request.body).then(user => {
			let msg = 'Ticket created successfully';
			return responseService.sendSuccessResponse(ctx, user, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
    }

    async fetchTickets(ctx) {
        await ticketService.fetchTickets(ctx.request.user, ctx.request.query).then(user => {
			let msg = 'Tickets fetched successfully';
			return responseService.sendSuccessResponse(ctx, user, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
    }

    async editTicket(ctx) {
        await ticketService.editTicket(ctx.request.user, ctx.params.id, ctx.request.body).then(user => {
			let msg = 'Ticket edited successfully';
			return responseService.sendSuccessResponse(ctx, user, msg);
		}).catch(function (err) {
			return responseService.sendErrorResponse(ctx, err);
		});
    }
}

const TicketCtrl = new Ticket();
export default TicketCtrl;