// Import model functions
import { 
    getUpcomingProjects, 
    getProjectDetails, 
    getCategoriesByProjectId 
} from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Show upcoming projects
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render('projects', { 
        title: 'Upcoming Service Projects', 
        projects 
    });
};

// ✅ UPDATED: include categories
const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    // 🔥 Get categories for this project
    const categories = await getCategoriesByProjectId(projectId);

    res.render('project', {
        title: project.title,
        project,
        categories   // ✅ pass to view
    });
};

export { 
    showProjectsPage,
    showProjectDetailsPage
};