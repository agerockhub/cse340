import { 
    getAllOrganizations, 
    getOrganizationDetails, 
    createOrganization,
    updateOrganization
} from '../models/organizations.js';

import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// ================= VALIDATION =================
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required')
        .isLength({ max: 150 }).withMessage('Max 150 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 500 }).withMessage('Max 500 characters'),

    body('contactEmail')
        .normalizeEmail()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Valid email required')
];

// ================= CONTROLLERS =================

// Show all organizations
const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', { title: 'Our Partner Organizations', organizations });
    } catch (err) {
        next(err);
    }
};

// Show details
const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const organizationDetails = await getOrganizationDetails(id);
        const projects = await getProjectsByOrganizationId(id);

        if (!organizationDetails) {
            return res.status(404).render('errors/404', { title: 'Not Found' });
        }

        res.render('organization', { 
            title: 'Organization Details', 
            organizationDetails, 
            projects 
        });
    } catch (err) {
        next(err);
    }
};

// Show new form
const showNewOrganizationForm = (req, res) => {
    res.render('new-organization', { title: 'Add New Organization' });
};

// Create organization
const processNewOrganizationForm = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            errors.array().forEach(err => req.flash('error', err.msg));
            return res.redirect('/organizations/new');
        }

        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png';

        const id = await createOrganization(name, description, contactEmail, logoFilename);

        req.flash('success', 'Organization created!');
        res.redirect(`/organization/${id}`);
    } catch (err) {
        next(err);
    }
};

// Show edit form
const showEditOrganizationForm = async (req, res, next) => {
    try {
        const id = req.params.id;
        const organizationDetails = await getOrganizationDetails(id);

        if (!organizationDetails) {
            return res.status(404).render('errors/404', { title: 'Not Found' });
        }

        res.render('edit-organization', { 
            title: 'Edit Organization', 
            organizationDetails 
        });
    } catch (err) {
        next(err);
    }
};

// ✅ UPDATED: now includes validation check
const processEditOrganizationForm = async (req, res, next) => {
    try {
        const id = req.params.id;

        // ✅ Check for validation errors
        const results = validationResult(req);
        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return res.redirect('/edit-organization/' + id);
        }

        const { name, description, contactEmail, logo_filename } = req.body;

        await updateOrganization(id, name, description, contactEmail, logo_filename);

        req.flash('success', 'Organization updated successfully!');
        res.redirect(`/organization/${id}`);

    } catch (err) {
        next(err);
    }
};

// EXPORTS
export { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
};