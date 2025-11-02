-- Gettysburg Park Application Database Schema
-- Drop existing tables if they exist (for development)
DROP TABLE IF EXISTS trail_monuments CASCADE;
DROP TABLE IF EXISTS user_submissions CASCADE;
DROP TABLE IF EXISTS monuments CASCADE;
DROP TABLE IF EXISTS trails CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS battle_sites CASCADE;

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- TABLE: battle_sites
-- ============================================================================
CREATE TABLE battle_sites (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  battle_date DATE,
  description TEXT,
  casualties INTEGER,
  geom GEOMETRY(Polygon, 4326) NOT NULL
);

CREATE INDEX idx_battle_sites_geom ON battle_sites USING GIST(geom);

-- ============================================================================
-- TABLE: monuments
-- ============================================================================
CREATE TABLE monuments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  dedication_date DATE,
  accessibility_rating INTEGER CHECK (accessibility_rating BETWEEN 1 AND 5),
  battle_site_id INTEGER REFERENCES battle_sites(id) ON DELETE SET NULL,
  photo_url VARCHAR(500),
  geom GEOMETRY(Point, 4326) NOT NULL
);

CREATE INDEX idx_monuments_geom ON monuments USING GIST(geom);
CREATE INDEX idx_monuments_accessibility ON monuments(accessibility_rating);
CREATE INDEX idx_monuments_battle_site ON monuments(battle_site_id);

-- ============================================================================
-- TABLE: trails
-- ============================================================================
CREATE TABLE trails (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  length_miles DECIMAL(5,2),
  surface_type VARCHAR(50) CHECK (surface_type IN ('paved', 'gravel', 'dirt', 'mixed')),
  is_accessible BOOLEAN DEFAULT false,
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'moderate', 'hard')),
  geom GEOMETRY(LineString, 4326) NOT NULL
);

CREATE INDEX idx_trails_geom ON trails USING GIST(geom);
CREATE INDEX idx_trails_accessible ON trails(is_accessible);

-- ============================================================================
-- TABLE: facilities
-- ============================================================================
CREATE TABLE facilities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('restroom', 'parking', 'visitor_center', 'picnic_area', 'other')),
  is_accessible BOOLEAN DEFAULT false,
  hours_open VARCHAR(100),
  geom GEOMETRY(Point, 4326) NOT NULL
);

CREATE INDEX idx_facilities_geom ON facilities USING GIST(geom);
CREATE INDEX idx_facilities_type ON facilities(type);

-- ============================================================================
-- TABLE: user_submissions
-- ============================================================================
CREATE TABLE user_submissions (
  id SERIAL PRIMARY KEY,
  monument_id INTEGER REFERENCES monuments(id) ON DELETE CASCADE,
  user_name VARCHAR(100),
  story_text TEXT NOT NULL CHECK (char_length(story_text) <= 500 AND char_length(story_text) >= 1),
  photo_url VARCHAR(500),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  geom GEOMETRY(Point, 4326) NOT NULL
);

CREATE INDEX idx_user_submissions_monument ON user_submissions(monument_id);
CREATE INDEX idx_user_submissions_date ON user_submissions(submitted_at DESC);

-- ============================================================================
-- TABLE: trail_monuments (Junction Table)
-- ============================================================================
CREATE TABLE trail_monuments (
  trail_id INTEGER REFERENCES trails(id) ON DELETE CASCADE,
  monument_id INTEGER REFERENCES monuments(id) ON DELETE CASCADE,
  PRIMARY KEY (trail_id, monument_id)
);

CREATE INDEX idx_trail_monuments_trail ON trail_monuments(trail_id);
CREATE INDEX idx_trail_monuments_monument ON trail_monuments(monument_id);

-- ============================================================================
-- HELPER FUNCTION: Find nearest facilities
-- ============================================================================
CREATE OR REPLACE FUNCTION get_nearest_facilities(
  user_lng DOUBLE PRECISION,
  user_lat DOUBLE PRECISION,
  facility_type VARCHAR DEFAULT NULL,
  search_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
  id INTEGER,
  name VARCHAR,
  type VARCHAR,
  distance_meters DOUBLE PRECISION,
  is_accessible BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.name,
    f.type,
    ST_Distance(
      f.geom::geography,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) AS distance_meters,
    f.is_accessible
  FROM facilities f
  WHERE facility_type IS NULL OR f.type = facility_type
  ORDER BY f.geom <-> ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)
  LIMIT search_limit;
END;
$$ LANGUAGE plpgsql;