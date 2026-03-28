import { getAllOrganizations, getOrganizationDetails, createOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

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
    try {
        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

        // Create the new organization
        const organizationId = await createOrganization(name, description, contactEmail, logoFilename);

        // ✅ Set a success flash message
        req.flash('success', 'Organization added successfully!');

        // Redirect to the organization's details page
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to create organization. Please try again.');
        res.redirect('/organizations/new');
    }
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
    processNewOrganizationForm
};