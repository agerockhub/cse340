import { getAllOrganizations, getOrganizationDetails, createOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';
// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

// Show all organizations
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
};

// Show single organization details
const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', { title, organizationDetails, projects });
};

// Show form
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';
    res.render('new-organization', { title });
};

// Handle form submission and store success message
const processNewOrganizationForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations    

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    res.redirect(`/organization/${organizationId}`);
};

// Legacy/additional handler (if still used)
const addOrganization = async (req, res) => {
    try {
        const { name, description, contact_email, logo_filename } = req.body;

        await createOrganization(name, description, contact_email, logo_filename);

        // Redirect after successful creation
        res.redirect('/organizations');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating organization');
    }
};

// ✅ EXPORT EVERYTHING
export { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm,
    addOrganization,
    processNewOrganizationForm,
    organizationValidation
};