import models from '../models'

class Role {
    async createRole(loginUser, data) {
        try {
            let role = await models.role.create({name : data.name});
            return {
                id : role.id
            }
        } catch (err) {
            throw err;
        }
    }

    async fetchRoles() {
        try {
            let roles = await models.role.findAll();
            return roles;
        } catch (err) {
            throw err;
        }
    }
}
const roleService = new Role();
export default roleService;