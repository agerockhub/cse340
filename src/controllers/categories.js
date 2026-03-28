// src/controllers/categories.js
import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId 
} from '../models/categories.js';

console.log('Categories controller loaded'); // helps debugging

// Show all categories
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Categories', categories });
    } catch (err) {
        next(err);
    }
};

// Show single category details
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

// ✅ Proper named exports
export { showCategoriesPage, showCategoryDetailsPage };