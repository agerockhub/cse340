// src/models/users.js
import db from './db.js';
import bcrypt from 'bcryptjs'; // Ensure bcrypt is imported for verifyPassword to work

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const query_params = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
   const query = `
    SELECT u.user_id, u.email, u.password_hash, r.role_name 
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1
`;
    const query_params = [email];
    
    const result = await db.query(query, query_params);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Authenticates a user by email and password
 */
const authenticateUser = async (email, password) => {
    // 1. Use findUserByEmail to get the user
    const user = await findUserByEmail(email);

    // 2. If no user is found, return null
    if (!user) {
        return null;
    }

    // 3. Use verifyPassword to check if the password is correct
    const isPasswordCorrect = await verifyPassword(password, user.password_hash);

    // 4. If correct, remove password_hash and return user; otherwise return null
    if (isPasswordCorrect) {
        delete user.password_hash;
        return user;
    }

    return null;
};

// Only export the functions the controller needs access to
export { createUser, authenticateUser };
