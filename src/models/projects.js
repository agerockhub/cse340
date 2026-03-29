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

// Update categories (Deletes old ones and inserts new selections)
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

// ✅ ALL EXPORTS RESTORED
export { 
    getAllProjects, 
    getProjectsByOrganizationId, 
    getUpcomingProjects, 
    getProjectDetails,
    getCategoriesByProjectId,
    getCategoriesByServiceProjectId,
    updateCategoryAssignments,
    createProject
};
