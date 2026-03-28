import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import router from './src/controllers/routes.js'; // make sure file is "routes.js"
import session from 'express-session';
import flash from './src/middleware/flash.js';



const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set up session management
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour of inactivity
}));

// Use flash message middleware
app.use(flash);

// Allow Express to receive and process common POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Log requests in development
app.use((req, res, next) => {
    if (process.env.NODE_ENV?.toLowerCase() === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

// NODE_ENV available in templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
    next();
});

// Use routes
app.use(router);

// 404 handler
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    const status = err.status || 500;
    res.status(status).render(`errors/${status === 404 ? '404' : '500'}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    });
});

app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server running at http://127.0.0.1:${PORT}`);
    } catch (error) {
        console.error('Database connection error:', error);
    }
});