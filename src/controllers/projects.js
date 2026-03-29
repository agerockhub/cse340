import { 
    getUpcomingProjects, 
    getProjectDetails, 
    getCategoriesByProjectId, 
    createProject,
    updateProject 
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Validation rules
const projectValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('date').notEmpty().withMessage('Date is required').isISO8601(),
    body('organizationId').notEmpty().isInt().withMessage('Valid Organization is required')
];

// 1. Show all projects
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        res.render('projects', { title: 'Upcoming Service Projects', projects });
    } catch (err) {
        next(err);
    }
};

// 2. Show single project details
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        const categories = await getCategoriesByProjectId(projectId);
        res.render('project', { title: project.title, project, categories });
    } catch (err) {
        next(err);
    }
};

// 3. Show new project form
const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('new-project', { title: 'Add New Service Project', organizations });
    } catch (err) {
        next(err);
    }
};

// 4. Process new project form
const processNewProjectForm = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const organizations = await getAllOrganizations();
        return res.render('new-project', {
            title: 'Add New Service Project',
            organizations,
            errors: errors.array()
        });
    }
    const { title, description, location, date, organizationId } = req.body;
    try {
        const newProjectId = await createProject(title, description, location, date, organizationId);
        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        next(error);
    }
};

// 5. Show Edit Project Form
const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const projectData = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations();

        if (!projectData) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }

        res.render('update-project', { 
            title: `Edit ${projectData.title}`, 
            project: projectData, 
            organizations,
            errors: null 
        });
    } catch (err) {
        next(err);
    }
};

// 6. Process Edit Project Form
const processEditProjectForm = async (req, res, next) => {
    const projectId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const organizations = await getAllOrganizations();
        const project = req.body;
        project.project_id = projectId;

        return res.render('update-project', {
            title: 'Edit Project',
            project,
            organizations,
            errors: errors.array()
        });
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        await updateProject(projectId, title, description, location, date, organizationId);
        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

// ✅ ALL EXPORTS RESTORED
export { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation  
};
