-- ==================================
-- organization Table
-- ==================================
CREATE TABLE organization(
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES (
        'Tech Solutions Ltd',
        'A technology company providing software development and IT consulting services.',
        'info@techsolutions.com',
        'techsolutions_logo.png'
    ),
    (
        'Green Earth Initiative',
        'A non-profit organization focused on environmental sustainability and climate awareness.',
        'contact@greenearth.org',
        'greenearth_logo.png'
    ),
    (
        'Global Education Network',
        'An international organization promoting access to quality education worldwide.',
        'support@genetwork.org',
        'genetwork_logo.png'
    ),
    (
        'Health First Foundation',
        'A charitable organization dedicated to improving healthcare access in rural communities.',
        'info@healthfirst.org',
        'healthfirst_logo.png'
    ),
    (
        'Creative Media Group',
        'A media company specializing in digital marketing, branding, and content creation.',
        'hello@creativemedia.com',
        'creativemedia_logo.png'
    );
-- ==================================
-- service_project Table
-- ==================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization FOREIGN KEY (organization_id) REFERENCES organization(organization_id) ON DELETE CASCADE
);
INSERT INTO service_project (
        organization_id,
        title,
        description,
        location,
        project_date
    )
VALUES (
        1,
        'Community Coding Bootcamp',
        'Training youth in basic programming skills.',
        'Accra',
        '2026-04-10'
    ),
    (
        1,
        'School Computer Donation',
        'Donating refurbished computers to schools.',
        'Kumasi',
        '2026-05-12'
    ),
    (
        1,
        'Digital Literacy Workshop',
        'Helping adults learn essential computer skills.',
        'Tamale',
        '2026-06-20'
    ),
    (
        2,
        'Free Health Screening',
        'Providing free medical checkups for the community.',
        'Cape Coast',
        '2026-04-15'
    ),
    (
        2,
        'Blood Donation Drive',
        'Encouraging voluntary blood donation.',
        'Accra',
        '2026-05-25'
    ),
    (
        2,
        'Maternal Health Seminar',
        'Educating mothers on prenatal health.',
        'Sunyani',
        '2026-07-05'
    ),
    (
        3,
        'Global Education Conference',
        'Discussing global education strategies.',
        'Accra',
        '2026-03-30'
    ),
    (
        3,
        'School Supplies Distribution',
        'Providing books and stationery to students.',
        'Bolgatanga',
        '2026-06-15'
    ),
    (
        3,
        'Teacher Training Program',
        'Professional development for teachers.',
        'Kumasi',
        '2026-08-01'
    ),
    (
        4,
        'Tree Planting Campaign',
        'Planting trees to promote environmental sustainability.',
        'Takoradi',
        '2026-04-22'
    ),
    (
        4,
        'Recycling Awareness Program',
        'Teaching communities about recycling.',
        'Accra',
        '2026-05-30'
    ),
    (
        4,
        'Clean Water Initiative',
        'Improving access to clean drinking water.',
        'Ho',
        '2026-09-10'
    ),
    (
        5,
        'Small Business Marketing Workshop',
        'Helping entrepreneurs with marketing skills.',
        'Accra',
        '2026-04-18'
    ),
    (
        5,
        'Community Media Training',
        'Training youth in video and media production.',
        'Kumasi',
        '2026-06-05'
    ),
    (
        5,
        'Digital Branding Seminar',
        'Teaching branding and online promotion.',
        'Tamale',
        '2026-07-22'
    );
-- ==================================
-- category Tables
-- ==================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL
);
INSERT INTO category (name)
VALUES ('Education'),
    ('Health'),
    ('Technology'),
    ('Environment'),
    ('Community Development');
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES service_project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);
INSERT INTO project_category (project_id, category_id)
VALUES (1, 1),
    (2, 1),
    (7, 1),
    (4, 2),
    (5, 2),
    (1, 3),
    (3, 3),
    (10, 4),
    (11, 4),
    (6, 5),
    (12, 5);
-- ==================================
-- Auth & Roles Tables
-- ==================================
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);
INSERT INTO roles (role_name, role_description)
VALUES ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ==================================
-- NEW: project_volunteers (Junction Table)
-- ==================================
CREATE TABLE project_volunteers (
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    volunteered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id),
    CONSTRAINT fk_project_volunteer FOREIGN KEY (project_id) REFERENCES service_project(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_volunteer FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);