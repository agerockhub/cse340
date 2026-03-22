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