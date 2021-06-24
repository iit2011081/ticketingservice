import models from '../models'

class Category {
    async createCategory(loginUser, data) {
        try {
            let category = await models.category.create({name : data.name});
            return {
                id : category.id
            }
        } catch (err) {
            throw err;
        }
    }

    async fetchCategories(loginUser) {
        try {
            let categories = await models.category.findAll();
            return categories;
        } catch (err) {
            throw err;
        }
    }
}
const categoryService = new Category();
export default categoryService;