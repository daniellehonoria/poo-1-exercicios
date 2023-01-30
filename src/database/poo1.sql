-- Active: 1675082415099@@127.0.0.1@3306
CREATE Table videos(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    title TEXT NOT NULL,
    duration INTEGER NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);
INSERT INTO videos(id, title, duration)
VALUES
("v001", "JS aula 1", 27),("v002", "JS aula 2", 18),("v003", "JS aula 3", 21);