// src/controllers/categories.js
import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId 
} from '../models/categories.js';

// ✅ IMPORTED the missing functions from the project model
import { 
    getProjectDetails, 
    getCategoriesByServiceProjectId, 
    updateCategoryAssignments 
} from '../models/projects.js';

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
        res.render('category', { title: category.name, category, projects });
    } catch (err) {
        next(err);
    }
};

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const projectDetails = await getProjectDetails(projectId);
        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByServiceProjectId(projectId);

        res.render('assign-categories', { 
            title: 'Assign Categories to Project', 
            projectId, 
            projectDetails, 
            categories, 
            assignedCategories 
        });
    } catch (err) {
        next(err);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const selectedCategoryIds = req.body.categoryIds || [];
        const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
        
        await updateCategoryAssignments(projectId, categoryIdsArray);
        
        if (req.flash) req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (err) {
        next(err);
    }
};

export { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm 
};
