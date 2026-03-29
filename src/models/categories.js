import db from './db.js';

// Get all categories
const getAllCategories = async () => {
  const query = `
    SELECT category_id, name
    FROM public.category
    ORDER BY name;
  `;
  const result = await db.query(query);
  return result.rows;
};

// Get single category by ID
const getCategoryById = async (categoryId) => {
  const query = `
    SELECT category_id, name
    FROM public.category
    WHERE category_id = $1;
  `;
  const result = await db.query(query, [categoryId]);
  return result.rows[0];
};

// Get all projects for a given category
const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT 
        sp.project_id, 
        sp.title, 
        sp.description,
        sp.project_date AS date, 
        sp.organization_id, 
        o.name AS organization_name
    FROM public.service_project sp
    JOIN public.project_category pc ON sp.project_id = pc.project_id
    JOIN public.organization o ON sp.organization_id = o.organization_id
    WHERE pc.category_id = $1
    ORDER BY sp.project_date ASC;
  `;
  const result = await db.query(query, [categoryId]);
  return result.rows;
};

export { 
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
};

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
}