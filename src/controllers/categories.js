import { 
    getAllCategories, 
    getCategoryById, 
    getProjectsByCategoryId,
    createCategory,
    updateCategory 
} from '../models/categories.js';

import { getProjectDetails, getCategoriesByServiceProjectId, updateCategoryAssignments } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// ✅ Validation Rules
const categoryValidation = [
    body('categoryName')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters.')
        .isLength({ max: 100 }).withMessage('Category name cannot exceed 100 characters.')
];

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Categories', categories });
    } catch (err) { next(err); }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);
        if (!category) throw new Error('Category Not Found');
        const projects = await getProjectsByCategoryId(categoryId);
        res.render('category', { title: category.name, category, projects });
    } catch (err) { next(err); }
};

// ✅ ADDED: Show/Process Add Category
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

// ✅ ADDED: Show/Process Edit Category
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

// (Assign Category functions stay the same...)
const showAssignCategoriesForm = async (req, res, next) => { /* ... existing code ... */ };
const processAssignCategoriesForm = async (req, res, next) => { /* ... existing code ... */ };

export { 
    showCategoriesPage, showCategoryDetailsPage, 
    showAssignCategoriesForm, processAssignCategoriesForm,
    showAddCategoryForm, processAddCategoryForm,
    showEditCategoryForm, processEditCategoryForm,
    categoryValidation 
};
