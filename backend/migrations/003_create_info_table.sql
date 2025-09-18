-- Create info table for news and announcements
CREATE TABLE info (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('news', 'announcement', 'general')),
    image_url VARCHAR(500),
    is_featured_banner BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_info_tenant_id ON info(tenant_id);
CREATE INDEX idx_info_published_at ON info(published_at);
CREATE INDEX idx_info_featured_banner ON info(is_featured_banner);
CREATE INDEX idx_info_tenant_featured ON info(tenant_id, is_featured_banner);
CREATE INDEX idx_info_type ON info(type);

-- Create trigger for info table
CREATE TRIGGER update_info_updated_at
    BEFORE UPDATE ON info
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample info/news for Gislev Kirke (tenant_id = 1)
INSERT INTO info (tenant_id, title, content, type, is_featured_banner, published_at)
VALUES
    (1, 'Velkommen til Gislev Kirke', 'Vi glæder os til at byde dig velkommen i vores varme og rummeligt fællesskab. Gislev Kirke har været en del af lokalsamfundet i over 800 år.', 'general', true, '2025-01-15 10:00:00'),
    (1, 'Nyt fra menighedsrådet', 'Menighedsrådet har besluttet at gennemføre renovering af kirkens tag i foråret 2025. Arbejdet vil blive udført uden at forstyrre gudstjenesterne.', 'news', false, '2025-01-10 14:30:00'),
    (1, 'Julekoncert - billetsalg åbnet', 'Billetter til årets julekoncert er nu til salg. Koncerten afholdes den 25. januar og byder på traditionelle julehits og lokale kunstnere.', 'announcement', true, '2025-01-08 12:00:00');