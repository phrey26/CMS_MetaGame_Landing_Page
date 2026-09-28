-- Run once against your MySQL/MariaDB server (e.g. via phpMyAdmin or `mysql -u root -p < setup.sql`).
-- Creates the metagames_cms database, both tables, and seeds page_sections with the content
-- that used to live in src/data/*.json. No admin row is seeded here — create one via
-- /src/admin/register.php after this script has run (passwords must be hashed by PHP).

CREATE DATABASE IF NOT EXISTS metagames_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE metagames_cms;

CREATE TABLE IF NOT EXISTS admins (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS page_sections (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    section    VARCHAR(50) NOT NULL UNIQUE,
    content    JSON NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO page_sections (section, content) VALUES

('navbar', '{
    "logo": { "src": "assets/IMAGES/LOGO.png", "alt": "MetaGames logo" },
    "cta": { "text": "Join MetaGames", "url": "#join" },
    "links": [
        { "text": "Home", "url": "#home" },
        { "text": "What Are MetaGames", "url": "#what-are" },
        { "text": "News & Updates", "url": "#news" },
        { "text": "Sports & Games", "url": "#sports-games" },
        { "text": "Meta Movement", "url": "#meta-movement" },
        { "text": "Emblem & Meaning", "url": "#emblem" },
        { "text": "Official Theme Song", "url": "#theme-song" },
        { "text": "Host Nations", "url": "#host-nations" }
    ]
}'),

('header', '{
    "title": "MetaGames",
    "colors": ["bg-brand-green", "bg-brand-blue", "bg-brand-yellow", "bg-brand-red", "bg-white", "bg-black"],
    "scrollEffect": { "hideOnScrollDown": true, "revealThreshold": 72 }
}'),

('emblem', '{
    "stops": [
        { "name": "Red", "hex": "#dc2626", "meaning": "Physical Sports" },
        { "name": "Yellow", "hex": "#facc15", "meaning": "Mind Sports" },
        { "name": "White", "hex": "#ffffff", "meaning": "Fair Play & Inclusivity" },
        { "name": "Green", "hex": "#16a34a", "meaning": "Multi-Cultural Sports" },
        { "name": "Blue", "hex": "#2563eb", "meaning": "Digital & Virtual Sports" },
        { "name": "Black", "hex": "#111827", "meaning": "Esports" }
    ]
}'),

('news', '{
    "items": [
        {
            "img": "assets/news-featured-host-nations.jpg",
            "alt": "MetaGames host nations announced",
            "title": "MetaGames Host Nations Announced",
            "desc": "Discover the countries leading the global MetaGames experience."
        },
        {
            "img": "assets/news-thumb-new-categories.jpg",
            "alt": "New sports and game categories added",
            "title": "New Sports & Game Categories Added",
            "desc": "Fresh disciplines have joined the roster across mind, digital, and physical sports."
        },
        {
            "img": "assets/news-thumb-registration-updates.jpg",
            "alt": "Registration updates",
            "title": "Registration Updates",
            "desc": "Key dates and requirements for athlete and team registration."
        },
        {
            "img": "assets/news-thumb-partnerships.jpg",
            "alt": "Official partnerships and collaborations",
            "title": "Official Partnerships & Collaborations",
            "desc": "MetaGames welcomes new federations and technology partners."
        }
    ]
}'),

('effects', '{
    "reveal": {
        "threshold": 0.15,
        "rootMargin": "0px 0px -10% 0px",
        "defaultDistance": 32,
        "defaultDuration": 700
    },
    "progressBar": { "color": "#2563eb", "height": 3 },
    "tilt": { "maxTilt": 8 }
}');
