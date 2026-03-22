import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId 
} from '../models/categories.js';

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Categories', categories });
    } catch (err) {
        next(err);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            const error = new Error('Category Not Found');
            error.status = 404;
            throw error;
        }

        const projects = await getProjectsByCategoryId(categoryId);

        res.render('category', { 
            title: category.name,
            category,
            projects
        });
    } catch (err) {
        next(err);
    }
};

export { 
    showCategoriesPage,
    showCategoryDetailsPage
};