import express from 'express';

import { showHomePage } from './index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from './organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './projects.js'; // ✅ added
import { showCategoriesPage } from './categories.js';
import { testErrorPage } from './errors.js';

const router = express.Router();

// Main routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Organization details
router.get('/organization/:id', showOrganizationDetailsPage);

// ✅ NEW: Project details route
router.get('/project/:id', showProjectDetailsPage);

// Error testing
router.get('/test-error', testErrorPage);

export default router;