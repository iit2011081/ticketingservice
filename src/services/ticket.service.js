import models from '../models'
import constants from '../utils/constants';
import _ from 'lodash'

class Ticket {
    async createTicket(loginUser, data) {
        try {
            let status = constants.TICKET_STATUS_OPEN;
            if(data.assignedTo && (data.assignedTo.userIds.length || data.assignedTo.roleIds.length)) {
                status = constants.TICKET_STATUS_ASSIGNED;
            } else {
                data.assignedTo = {
                    userIds : [],
                    roleIds : []
                }
            }
            let ticket = await models.ticket.create({
                name : data.name,
                description : data.description || '',
                attachment : data.attachment || [],
                status : status,
                priority : data.priority || constants.TICKET_PRIORITY_LOW,
                createdById : loginUser.id,
                categoryId : data.categoryId
            });
            models.access.create({
                ticketId : ticket.id,
                userId : loginUser.id,
                permission : constants.TICKET_PERMISSION_WRITE
            })
            this.createTicketAccess(ticket.id, status,{userIds : [], roleIds : []}, data.assignedTo)
            return {
                id : ticket.id
            }
        } catch (err) {
            console.log("err", err);
            throw err;
        }
    }

    async createTicketAccess(ticketId, status, oldAssignedTo, newAssignedTo) {
        let usersRemoved = _.difference(oldAssignedTo.userIds, newAssignedTo.userIds);
		let usersAdded = _.difference(newAssignedTo.userIds, oldAssignedTo.userIds);
        let rolesRemoved = _.difference(oldAssignedTo.roleIds, newAssignedTo.roleIds);
		let rolesAdded = _.difference(newAssignedTo.roleIds, oldAssignedTo.roleIds);

        if(!usersRemoved.length && !usersAdded.length && !rolesRemoved.length && !rolesAdded.length) {
            return status;
        }

        if(usersRemoved.length || rolesRemoved.length) {
            let accessRemoveCond = {
                ticketId : ticketId,
                '$or' : []
            }
            if(usersRemoved.length) {
                accessRemoveCond['$or'].push({
                    userId : {
                        $in : usersRemoved
                    }
                })
            }
            if(rolesRemoved.length) {
                accessRemoveCond['$or'].push({
                    roleId : {
                        $in : rolesRemoved
                    }
                })
            }
            models.access.destroy({where : accessRemoveCond});
        }
        if(usersAdded.length) {
            for(const userId of usersAdded) {
                models.access.create({
                    ticketId : ticketId,
                    userId : userId,
                    permission : constants.TICKET_PERMISSION_READ
                })
            }
        }
        if(rolesAdded.length) {
            for(const roleId of rolesAdded) {
                models.access.create({
                    ticketId : ticketId,
                    roleId : roleId,
                    permission : constants.TICKET_PERMISSION_READ
                })
            }
        }
        if(!usersRemoved.length && !rolesRemoved.length) {
            //It means this ticket is being assigned first time
            return status;
        } else {
            return constants.TICKET_STATUS_REASSIGNED;
        }
    }


    async findTickets(extra_filters) {
        try {
            let accessFindCond = {
                    '$or' : []
                },
                ticketFindCond = {},
                pageParams = {};
            for (var key in extra_filters) {
                let filterValue = extra_filters[key];
                switch (key) {
                    case 'page':
                        pageParams['page'] = filterValue;
                        break;

                    case 'limit':
                        pageParams['limit'] = filterValue;
                        break;

                    case 'name':
                        ticketFindCond['name'] = { $iLike: `%${filterValue}%` };
                        break;

                    case 'categoryId':
                        ticketFindCond['categoryId'] = filterValue;
                        break;

                    case 'userId':
                        accessFindCond['$or'].push({
                            userId : filterValue
                        });
                        break;

                    case 'roleId':
                        accessFindCond['$or'].push({
                            roleId : filterValue
                        });
                        break;

                }
            }
            var find_object = {
                distinct: true,
                where: accessFindCond,
                include: [
                    {
                        model: models.ticket,
                        as: 'ticket',
                        where : ticketFindCond,
                        required: true,
                        include : [
                            {
                                model : models.category,
                                as : 'category'
                            },
                            {
                                model : models.user,
                                as : 'createdBy'
                            }
                        ]
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ],
            }
            if (pageParams.page) {
                find_object['offset'] = (pageParams.page - 1) * pageParams.limit;
                find_object['limit'] = parseInt(pageParams.limit);
            }
            let access = await models.access.findAndCountAll(find_object);
            let access_array = {
                tickets: access.rows,
                length: access.count
            };
            return access_array;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async fetchTickets(loginUser, query = {}) {
        try {
            let filters = {};
			let validFilters = ['name',  'page', 'limit', 'categoryId'];
			for (let filter in query) {
				if (validFilters.indexOf(filter) !== -1) {
					filters[filter] = query[filter];
				}
			}
            filters.userId = loginUser.id,
            filters.roleId = loginUser.roleId;
            return this.findTickets(filters);
        } catch (err) {
            console.log("err", err);
            throw err;
        }
    }

    async editTicket(loginUser, ticketId, data) {
        try {
            let ticket = await models.ticket.findOne({
                where : {
                    id : ticketId
                },
                include : [
                    {
                        model : models.access,
                        as : 'assignedTo',
                        where : {
                            permission : constants.TICKET_PERMISSION_READ
                        }
                    }
                ]
            })
            let dataToUpdate = {
                status : data.status || ticket.status
            }
            if(data.assignedTo) {
                let oldAssignedTo = {
                    userIds : [],
                    roleIds : []
                };
                dataToUpdate.status = await this.createTicketAccess(ticketId, ticket.status, oldAssignedTo, data.assignedTo)
            }
            models.ticket.update(dataToUpdate, {
                where : {
                    id : ticketId
                },
                individualHooks: true
            })
            return {
                id : ticketId
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}
const ticketService = new Ticket();
export default ticketService;