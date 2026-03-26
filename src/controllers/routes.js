import express from 'express';

import { showHomePage } from './index.js';
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm,
     processNewOrganizationForm 
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

// ✅ NEW ROUTE (Add Organization Form)
router.get('/organizations/new', showNewOrganizationForm);

// Organization details
router.get('/organization/:id', showOrganizationDetailsPage);

// Project details
router.get('/project/:id', showProjectDetailsPage);

// Category details
router.get('/category/:id', showCategoryDetailsPage);

// Error testing
router.get('/test-error', testErrorPage);
// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', processNewOrganizationForm);

export default router;