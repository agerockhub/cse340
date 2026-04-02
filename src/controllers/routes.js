import express from 'express';
import { showHomePage } from './index.js';
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './organizations.js';

import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from './projects.js';

import { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm,
    showAddCategoryForm,       // ✅ New
    processAddCategoryForm,    // ✅ New
    showEditCategoryForm,      // ✅ New
    processEditCategoryForm,   // ✅ New
    categoryValidation         // ✅ New
} from './categories.js';

import { testErrorPage } from './errors.js';
import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm, processLoginForm,
    processLogout, requireLogin,
    showDashboard
} from './users.js';

const router = express.Router(); // This line must stay here!

// Main routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Organization routes
router.get('/organizations/new', showNewOrganizationForm);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Project routes
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// Category Management Routes
router.get('/category/:id', showCategoryDetailsPage);
router.get('/categories/new', showAddCategoryForm);
router.post('/categories/new', categoryValidation, processAddCategoryForm);
router.get('/categories/edit/:id', showEditCategoryForm);
router.post('/categories/edit/:id', categoryValidation, processEditCategoryForm);

// Project-Category assignment routes
router.get('/assign-categories/:projectId', showAssignCategoriesForm);
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

// Error testing
router.get('/test-error', testErrorPage);

export default router;
