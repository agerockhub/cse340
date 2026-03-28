import db from './db.js';

const getAllOrganizations = async () => {
    const result = await db.query(`
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization;
    `);
    return result.rows;
};

const getOrganizationDetails = async (id) => {
    const result = await db.query(`
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM organization
        WHERE organization_id = $1;
    `, [id]);

    return result.rows[0] || null;
};

const createOrganization = async (name, description, email, logo) => {
    const result = await db.query(`
        INSERT INTO organization (name, description, contact_email, logo_filename)
        VALUES ($1, $2, $3, $4)
        RETURNING organization_id;
    `, [name, description, email, logo]);

    return result.rows[0].organization_id;
};

const updateOrganization = async (id, name, description, email, logo) => {
    const result = await db.query(`
        UPDATE organization
        SET name = $1, description = $2, contact_email = $3, logo_filename = $4
        WHERE organization_id = $5
        RETURNING organization_id;
    `, [name, description, email, logo, id]);

    if (!result.rows.length) throw new Error('Organization not found');

    return result.rows[0].organization_id;
};

export { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization };