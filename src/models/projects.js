// src/models/projects.js
import db from './db.js';

// Get all projects
const getAllProjects = async () => {
    const query = `
        SELECT 
            sp.project_id,
            sp.organization_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date AS date,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o ON sp.organization_id = o.organization_id
        ORDER BY sp.project_date;
    `;
    const result = await db.query(query);
    return result.rows;
};

// Get projects by organization
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT project_id, organization_id, title, description, location, project_date AS date
        FROM public.service_project
        WHERE organization_id = $1
        ORDER BY project_date;
    `;
    const result = await db.query(query, [organizationId]);
    return result.rows;
};

// Get upcoming projects
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT sp.project_id, sp.title, sp.description, sp.project_date AS date, sp.location, sp.organization_id, o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o ON sp.organization_id = o.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date ASC
        LIMIT $1;
    `;
    const result = await db.query(query, [number_of_projects]);
    return result.rows;
};

// Get single project details
const getProjectDetails = async (projectId) => {
    const query = `
        SELECT sp.project_id, sp.title, sp.description, sp.project_date AS date, sp.location, sp.organization_id, o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows[0];
};

// Get current assigned categories for a specific project
const getCategoriesByServiceProjectId = async (projectId) => {
    const query = `
        SELECT category_id FROM public.project_category 
        WHERE project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

// Update categories
const updateCategoryAssignments = async (projectId, categoryIds) => {
    try {
        await db.query('BEGIN');
        await db.query('DELETE FROM public.project_category WHERE project_id = $1', [projectId]);
        if (categoryIds.length > 0) {
            for (const categoryId of categoryIds) {
                await db.query(
                    'INSERT INTO public.project_category (project_id, category_id) VALUES ($1, $2)',
                    [projectId, categoryId]
                );
            }
        }
        await db.query('COMMIT');
    } catch (err) {
        await db.query('ROLLBACK');
        throw err;
    }
};

// Get categories for a project (for display)
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.category c
        JOIN public.project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

// Create project
const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO public.service_project 
        (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;
    const result = await db.query(query, [title, description, location, date, organizationId]);
    return result.rows[0].project_id;
};

/**
 * Updates an existing service project
 */
const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE public.service_project 
        SET 
            title = $1, 
            description = $2, 
            location = $3, 
            project_date = $4, 
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;
    
    const params = [title, description, location, date, organizationId, projectId];
    const result = await db.query(query, params);

    if (result.rows.length === 0) {
        throw new Error('Project not found or update failed');
    }

    return result.rows[0].project_id;
};

// --- NEW VOLUNTEER FUNCTIONS ---

const addVolunteer = async (projectId, userId) => {
    const query = `
        INSERT INTO project_volunteers (project_id, user_id) 
        VALUES ($1, $2) 
        ON CONFLICT DO NOTHING
    `;
    return await db.query(query, [projectId, userId]);
};

const removeVolunteer = async (projectId, userId) => {
    const query = `
        DELETE FROM project_volunteers 
        WHERE project_id = $1 AND user_id = $2
    `;
    return await db.query(query, [projectId, userId]);
};

const isUserVolunteering = async (projectId, userId) => {
    const query = `
        SELECT 1 FROM project_volunteers 
        WHERE project_id = $1 AND user_id = $2
    `;
    const result = await db.query(query, [projectId, userId]);
    return result.rows.length > 0;
};

const getVolunteeredProjects = async (userId) => {
    const query = `
        SELECT 
            sp.project_id, 
            sp.title, 
            sp.project_date, 
            o.name as organization_name 
        FROM service_project sp
        JOIN project_volunteers pv ON sp.project_id = pv.project_id
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.project_date;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

// ✅ ALL EXPORTS INCLUDED
export { 
    getAllProjects, 
    getProjectsByOrganizationId, 
    getUpcomingProjects, 
    getProjectDetails,
    getCategoriesByProjectId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments,
    createProject,
    updateProject,
    addVolunteer,
    removeVolunteer,
    isUserVolunteering,
    getVolunteeredProjects
};
