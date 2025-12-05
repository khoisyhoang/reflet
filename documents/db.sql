-- Database Schema for Book Reflection App (MVP)
-- SQLite compatible

-- Create Users table
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Books table
CREATE TABLE Books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Create Chapters table
CREATE TABLE Chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    number INTEGER NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES Books(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Create Reflections table
CREATE TABLE Reflections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    ai_evaluation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES Chapters(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Create Tasks table
CREATE TABLE Tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    reflection_id INTEGER,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    due_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (reflection_id) REFERENCES Reflections(id)
);

-- Indexes for performance
CREATE INDEX idx_books_user_id ON Books(user_id);
CREATE INDEX idx_books_is_deleted ON Books(is_deleted);
CREATE INDEX idx_chapters_book_id ON Chapters(book_id);
CREATE INDEX idx_chapters_user_id ON Chapters(user_id);
CREATE INDEX idx_reflections_chapter_id ON Reflections(chapter_id);
CREATE INDEX idx_reflections_user_id ON Reflections(user_id);
CREATE INDEX idx_tasks_user_id ON Tasks(user_id);
CREATE INDEX idx_tasks_reflection_id ON Tasks(reflection_id);
CREATE INDEX idx_tasks_status ON Tasks(status);
