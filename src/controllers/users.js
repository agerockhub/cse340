// src/controllers/users.js
import bcrypt from 'bcryptjs'; // Updated to bcryptjs to match your previous fix
import { createUser, authenticateUser } from '../models/users.js';

// --- Registration Functions ---

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await createUser(name, email, passwordHash);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login'); // Redirecting to login after registration
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

// --- Login & Logout Functions ---

// Renders the login view
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

// Processes the login submission
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (user) {
            //  Add the user object to the session object
            req.session.user = user;

            //  Log the user in the console for debugging
            console.log('User logged in:', user);

            //  Add a success flash message
            req.flash('success', 'Login successful!');

            //  Redirect to the home page
            res.redirect('/');
        } else {
            //  Handle failed authentication
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

// Processes the logout
const processLogout = (req, res) => {
    // Destroys the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/');
        }
        // Redirect to login after session is gone
        res.clearCookie('connect.sid'); // Clean up the session cookie
        res.redirect('/login');
    });
};

// Export all functions
export { 
    showUserRegistrationForm, 
    processUserRegistrationForm, 
    showLoginForm, 
    processLoginForm, 
    processLogout 
};
