-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    location VARCHAR(255),
    image_url VARCHAR(500),
    is_featured_banner BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_events_tenant_id ON events(tenant_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_featured_banner ON events(is_featured_banner);
CREATE INDEX idx_events_tenant_featured ON events(tenant_id, is_featured_banner);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for events table
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample events for Gislev Kirke (tenant_id = 1)
INSERT INTO events (tenant_id, title, description, start_date, end_date, location, is_featured_banner)
VALUES
    (1, 'Søndagsgudstjeneste', 'Ugentlig gudstjeneste med fællessang og prædiken', '2025-01-19 10:00:00', '2025-01-19 11:00:00', 'Gislev Kirke', true),
    (1, 'Konfirmandundervisning', 'Undervisning for konfirmander', '2025-01-22 19:00:00', '2025-01-22 20:30:00', 'Sognehuset', false),
    (1, 'Koncert: Julens melodier', 'Traditionel julekoncert med lokale kunstnere', '2025-01-25 19:30:00', '2025-01-25 21:00:00', 'Gislev Kirke', true);