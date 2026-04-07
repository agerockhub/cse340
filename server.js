// server.js
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import router from './src/controllers/routes.js';
import session from 'express-session';
import flash from './src/middleware/flash.js';

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// 1. Sessions must come first
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

// 2. Flash messages next
app.use(flash);

// 3. ONE Middleware to rule them all (Consolidated)
app.use((req, res, next) => {
    // This is the source of truth for your EJS templates
    const user = req.session.user || null;
    res.locals.user = user;
    res.locals.isLoggedIn = !!user;
    
    // Pass flash function/messages to locals
    res.locals.flash = req.flash;
    
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
    next();
});

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 4. Routes last
app.use('/', router);

// 404 handler
app.use((req, res) => {
    res.status(404).render('errors/404', {
        title: 'Page Not Found',
        error: 'The page you are looking for does not exist.'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    const status = err.status || 500;
    res.status(status).render(`errors/${status === 404 ? '404' : '500'}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
});

// Start server
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server running at http://127.0.0.1:${PORT}`);
    } catch (error) {
        console.error('Database connection error:', error);
    }
});
