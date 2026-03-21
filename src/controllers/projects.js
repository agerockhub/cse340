// Import model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

// ✅ Define constant (THIS was missing)
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Controller: show upcoming projects
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render('projects', { 
        title: 'Upcoming Service Projects', 
        projects 
    });
};

// Controller: show single project details
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    res.render('project', {
        title: project.title,
        project
    });
};

// ✅ Export ONLY ONCE
export { 
    showProjectsPage,
    showProjectDetailsPage
};