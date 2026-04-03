// src/controllers/routes.js
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
    showAddCategoryForm,       
    processAddCategoryForm,    
    showEditCategoryForm,      
    processEditCategoryForm,   
    categoryValidation         
} from './categories.js';

import { testErrorPage } from './errors.js';
import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm, 
    processLoginForm,
    processLogout, 
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage // ✅ Added
} from './users.js';

const router = express.Router(); 

// Main routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// --- Organization routes ---
router.get('/organizations/new', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);

// --- Project routes ---
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);

// --- Category Management Routes ---
router.get('/category/:id', showCategoryDetailsPage);
router.get('/categories/new', requireRole('admin'), showAddCategoryForm);
router.post('/categories/new', requireRole('admin'), categoryValidation, processAddCategoryForm);
router.get('/categories/edit/:id', requireRole('admin'), showEditCategoryForm);
router.post('/categories/edit/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

// --- Project-Category assignment routes ---
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// --- User registration & auth ---
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// --- Protected User Routes ---
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireRole('admin'), showUsersPage); // ✅ NEW Protected Route

router.get('/test-error', testErrorPage);

export default router;
