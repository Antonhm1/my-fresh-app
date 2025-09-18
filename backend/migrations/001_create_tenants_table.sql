-- Create tenants table
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    settings JSONB DEFAULT '{}' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on domain for fast lookups
CREATE INDEX idx_tenants_domain ON tenants(domain);

-- Insert Gislev Kirke as the default tenant
INSERT INTO tenants (name, domain, settings)
VALUES (
    'Gislev Kirke',
    'gislevkirke.dk',
    '{"theme": "default", "language": "da", "timezone": "Europe/Copenhagen"}'
);