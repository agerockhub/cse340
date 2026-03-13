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