-- ============================================================
-- Enactus ADGIPS — PostgreSQL schema + seed data
-- Target: Neon DB (or any PostgreSQL 14+)
-- ============================================================
--
-- HOW TO RUN:
--   Option A) Paste this whole file into the Neon SQL Editor and run.
--   Option B) Command line:  psql "$DATABASE_URL" -f schema.sql
--
-- WARNING: This file DROPS and recreates the `event` and
-- `registration` tables, wiping any existing data.
-- Run it only when setting up a fresh database.
--
-- After setup, point the app at Neon with:
--   $env:DATABASE_URL = "postgresql://user:password@host/db?sslmode=require"
--   python app.py
-- The app then uses Neon (no need to run seed_database()'s inserts —
-- they only fire when the event table is empty anyway).

DROP TABLE IF EXISTS registration;
DROP TABLE IF EXISTS event;

-- ---------- Tables ----------

CREATE TABLE event (
    id               SERIAL PRIMARY KEY,
    title            VARCHAR(100) NOT NULL,
    date_day         VARCHAR(10)  NOT NULL,
    date_month       VARCHAR(10)  NOT NULL,
    short_desc       VARCHAR(200) NOT NULL,
    full_desc        TEXT         NOT NULL,
    image_url        VARCHAR(500) NOT NULL,
    is_open          BOOLEAN      DEFAULT TRUE,
    event_type       VARCHAR(20)  DEFAULT 'solo',          -- 'solo' or 'team'
    start_date       VARCHAR(20),                          -- YYYY-MM-DD
    end_date         VARCHAR(20),                          -- YYYY-MM-DD
    event_time       VARCHAR(20),                          -- HH:MM
    venue            VARCHAR(200),
    max_registrations INTEGER,
    min_team_size    INTEGER,                              -- team events
    max_team_size    INTEGER,                              -- team events
    event_link       VARCHAR(500),
    brochure_link    VARCHAR(500)
);

CREATE TABLE registration (
    id                SERIAL PRIMARY KEY,
    event_id          INTEGER NOT NULL REFERENCES event (id),
    registration_type VARCHAR(20) DEFAULT 'solo',          -- 'solo' or 'team'
    name              VARCHAR(100),                        -- solo
    email             VARCHAR(100),                        -- solo
    student_id        VARCHAR(50),                         -- solo
    contact_no        VARCHAR(20),                         -- solo
    branch            VARCHAR(100),                        -- solo
    college_name      VARCHAR(200),
    team_name         VARCHAR(100),                        -- team
    team_size         INTEGER,                             -- team
    leader_name       VARCHAR(100),                        -- team
    leader_email      VARCHAR(100),                        -- team
    leader_contact    VARCHAR(20)                          -- team
);

CREATE INDEX idx_registration_event_id ON registration (event_id);

-- ---------- Seed data (mirrors seed_database() in app.py) ----------

INSERT INTO event (title, date_day, date_month, short_desc, full_desc, image_url, is_open, event_type, venue, min_team_size, max_team_size) VALUES
('Chak De Pitch',     '22', 'OCT', 'The ultimate B-Plan competition.',       'Chak De Pitch is our flagship business plan competition.', '/static/images/events/Chak_De_Pitch.png',    FALSE, 'team', 'Main Auditorium', 2, 4),
('Clash of Carnival', '05', 'FEB', 'A vibrant celebration of culture.',      'Clash of Carnival brings the campus to life.',            '/static/images/events/Clash_Of_Carnival.png', FALSE, 'solo', 'Campus Grounds',  NULL, NULL),
('Corporate Titanic', '14', 'MAR', 'Can you navigate the corporate high seas?', 'Management simulation event.',                       '/static/images/events/Corporate_Titanic.png', TRUE,  'team', 'Seminar Hall',   3, 5),
('Enpitch',           '18', 'SEP', 'Refine your project ideas.',             'Internal pitching event.',                               '/static/images/events/Enpitch.png',           FALSE, 'solo', 'Lab 101',        NULL, NULL),
('Fresh-O-Preneur',   '10', 'JAN', 'Onboarding for young leaders.',          'Event for first-year students.',                         '/static/images/events/Fresh_O_Preneur.png',   FALSE, 'solo', 'M-Block',        NULL, NULL),
('Meme-O-Crisy',      '01', 'APR', 'Humor for a cause.',                     'Online meme competition.',                               '/static/images/events/Meme_O_Crisy.png',      FALSE, 'solo', 'Online',         NULL, NULL);