import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';

//projects
import { getAllProjects } from './src/models/projects.js';


const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
});


//projects PAGE
// projects PAGE
app.get('/projects', async (req, res) => {
  try {
    const projects = await getAllProjects();

    res.render('projects', {
      title: 'Service Projects',
      projects
    });

  } catch (error) {
    console.error("Error retrieving projects:", error);
    res.status(500).send("Database error");
  }
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});

// import at the top
import { getAllCategories } from './src/models/categories.js';

// categories PAGE
app.get('/categories', async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.render('categories', {
      title: 'Our Categories',
      categories
    });

  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).send('Database error');
  }
});