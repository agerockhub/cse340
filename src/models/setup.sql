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
-- ===================================
-- Insert sample data: organization
-- ===================================
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
SELECT *
FROM organization;
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization FOREIGN KEY (organization_id) REFERENCES organization(organization_id) ON DELETE CASCADE
);
--===========================
-- insert sample data
--===========================
INSERT INTO service_project (
        organization_id,
        title,
        description,
        location,
        project_date
    )
VALUES -- Organization 1
    (
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
    -- Organization 2
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
    -- Organization 3
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
    -- Organization 4
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
    -- Organization 5
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
SELECT *
FROM service_project;
-- ==================================
-- category Table
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