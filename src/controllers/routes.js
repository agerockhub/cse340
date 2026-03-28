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
import { showProjectsPage, showProjectDetailsPage } from './projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './categories.js';
import { testErrorPage } from './errors.js';

const router = express.Router();

// Main routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Organization routes
router.get('/organizations/new', showNewOrganizationForm);
router.get('/organization/:id', showOrganizationDetailsPage);

// ✅ New edit organization route
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Project routes
router.get('/project/:id', showProjectDetailsPage);

// Category routes
router.get('/category/:id', showCategoryDetailsPage);

// Error testing
router.get('/test-error', testErrorPage);

// Route to handle the edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// ✅ Default export
export default router;