import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId,
    createCategory,
    updateCategory 
} from '../models/categories.js';

import { getProjectDetails, getCategoriesByServiceProjectId, updateCategoryAssignments } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Validation Rules
const categoryValidation = [
    body('categoryName')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters.')
];

// 1. Show all categories list
const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        // Passing 'categories' as an array for the list view
        res.render('categories', { title: 'All Categories', categories });
    } catch (err) { next(err); }
};

// 2. Show single category details (and projects in that category)
const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);
        if (!category) throw new Error('Category Not Found');
        const projects = await getProjectsByCategoryId(categoryId);
        // This renders 'category.ejs' (singular)
        res.render('category', { title: category.name, category, projects });
    } catch (err) { next(err); }
};

const showAddCategoryForm = (req, res) => {
    res.render('add-category', { title: 'Add New Category', errors: null, categoryName: '' });
};

const processAddCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);
    const { categoryName } = req.body;
    if (!errors.isEmpty()) {
        return res.render('add-category', { title: 'Add New Category', errors: errors.array(), categoryName });
    }
    try {
        await createCategory(categoryName);
        req.flash('success', 'Category added!');
        res.redirect('/categories');
    } catch (err) { next(err); }
};

const showEditCategoryForm = async (req, res, next) => {
    try {
        const category = await getCategoryById(req.params.id);
        res.render('edit-category', { title: `Edit ${category.name}`, category, errors: null });
    } catch (err) { next(err); }
};

const processEditCategoryForm = async (req, res, next) => {
    const errors = validationResult(req);
    const categoryId = req.params.id;
    if (!errors.isEmpty()) {
        return res.render('edit-category', { 
            title: 'Edit Category', 
            category: { category_id: categoryId, name: req.body.categoryName }, 
            errors: errors.array() 
        });
    }
    try {
        await updateCategory(categoryId, req.body.categoryName);
        req.flash('success', 'Category updated!');
        res.redirect('/categories');
    } catch (err) { next(err); }
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
    } catch (err) { next(err); }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const selectedCategoryIds = req.body.categoryIds || [];
        const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
        await updateCategoryAssignments(projectId, categoryIdsArray);
        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (err) { next(err); }
};

export { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm,
    showAddCategoryForm, 
    processAddCategoryForm, 
    showEditCategoryForm, 
    processEditCategoryForm, 
    categoryValidation 
};
