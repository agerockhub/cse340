import { 
    getAllOrganizations, 
    getOrganizationDetails, 
    createOrganization, 
    updateOrganization 
} from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

// ✅ Criteria 4: Server-side Validation Rules (The "Wiring")
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Organization name is required.')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters.'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.'),
    body('email')
        .trim()
        .isEmail().withMessage('A valid email is required.')
];

// Show all organizations
const showOrganizationsPage = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('organizations', { title: 'Organizations', organizations });
    } catch (err) { next(err); }
};

// Show details
const showOrganizationDetailsPage = async (req, res, next) => {
    try {
        const organization = await getOrganizationDetails(req.params.id);
        if (!organization) throw new Error('Organization not found');
        res.render('organization', { title: organization.name, organization });
    } catch (err) { next(err); }
};

// Show Create Form
const showNewOrganizationForm = (req, res) => {
    res.render('new-organization', { title: 'Add New Organization', errors: null, org: {} });
};

// Process Create Form
const processNewOrganizationForm = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('new-organization', {
            title: 'Add New Organization',
            errors: errors.array(),
            org: req.body // ✅ Returns data so the form stays "sticky"
        });
    }

    try {
        const { name, description, email } = req.body;
        // Adjust the parameters below based on your model's createOrganization(name, desc, email, logo)
        await createOrganization(name, description, email, null); 
        req.flash('success', 'Organization created successfully!');
        res.redirect('/organizations');
    } catch (err) { next(err); }
};

// Show Edit Form
const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organization = await getOrganizationDetails(req.params.id);
        res.render('edit-organization', { title: `Edit ${organization.name}`, organization, errors: null });
    } catch (err) { next(err); }
};

// Process Edit Form
const processEditOrganizationForm = async (req, res, next) => {
    const errors = validationResult(req);
    const orgId = req.params.id;

    if (!errors.isEmpty()) {
        return res.render('edit-organization', {
            title: 'Edit Organization',
            organization: { organization_id: orgId, ...req.body },
            errors: errors.array()
        });
    }

    try {
        const { name, description, email } = req.body;
        await updateOrganization(orgId, name, description, email, null);
        req.flash('success', 'Organization updated successfully!');
        res.redirect(`/organization/${orgId}`);
    } catch (err) { next(err); }
};

// ✅ ALL EXPORTS RESTORED (Fixes the SyntaxError in routes.js)
export { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm, 
    processNewOrganizationForm, 
    showEditOrganizationForm, 
    processEditOrganizationForm, 
    organizationValidation 
};
