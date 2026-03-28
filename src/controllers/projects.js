import { getUpcomingProjects, getProjectDetails, getCategoriesByProjectId } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        res.render('projects', { title: 'Upcoming Service Projects', projects });
    } catch (err) {
        console.error('Error fetching projects:', err.message);
        next(err);
    }
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        const categories = await getCategoriesByProjectId(projectId);
        res.render('project', { title: project.title, project, categories });
    } catch (err) {
        console.error('Error fetching project details:', err.message);
        next(err);
    }
};

export { showProjectsPage, showProjectDetailsPage };