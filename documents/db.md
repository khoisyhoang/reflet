# Database Design for Book Reflection App (MVP)

## Overview
This document outlines a simple database schema for the MVP of the book reflection app. The focus is on allowing each user to have their own books and chapters, with basic relationships for reflections and tasks.

## Entities and Relationships
- **Users**: Represent individual users of the app.
- **Books**: Books that users are reading or have read. Each book belongs to a user.
- **Chapters**: Chapters within a book. Each chapter belongs to a book.
- **Reflections**: User reflections on chapters. Each reflection belongs to a chapter.
- **Tasks**: Actionable tasks derived from reflections. Each task belongs to a user and can be linked to a reflection.

## Tables

### Users
| Field       | Type          | Description                  |
|-------------|---------------|------------------------------|
| id          | INTEGER (PK) | Unique identifier            |
| username    | VARCHAR(255) | User's username              |
| email       | VARCHAR(255) | User's email                 |
| created_at  | DATETIME     | Account creation timestamp   |

### Books
| Field       | Type          | Description                  |
|-------------|---------------|------------------------------|
| id          | INTEGER (PK) | Unique identifier            |
| user_id     | INTEGER (FK) | Reference to Users.id        |
| title       | VARCHAR(255) | Book title                   |
| author      | VARCHAR(255) | Book author                  |
| isbn        | VARCHAR(20)  | ISBN (optional)              |
| created_at  | DATETIME     | When the book was added      |
| is_deleted  | BOOLEAN      | Soft delete flag             |

### Chapters
| Field       | Type          | Description                  |
|-------------|---------------|------------------------------|
| id          | INTEGER (PK) | Unique identifier            |
| book_id     | INTEGER (FK) | Reference to Books.id        |
| user_id     | INTEGER (FK) | Reference to Users.id        |
| title       | VARCHAR(255) | Chapter title                |
| number      | INTEGER      | Chapter number               |
| content     | TEXT         | Chapter content (if stored)  |
| created_at  | DATETIME     | When the chapter was added   |

### Reflections
| Field          | Type          | Description                  |
|-------------    |---------------|------------------------------|
| id             | INTEGER (PK) | Unique identifier            |
| chapter_id     | INTEGER (FK) | Reference to Chapters.id     |
| user_id        | INTEGER (FK) | Reference to Users.id        |
| content        | TEXT         | User's reflection text       |
| ai_evaluation  | TEXT         | AI-generated evaluation      |
| created_at     | DATETIME     | When the reflection was added|

### Tasks
| Field          | Type          | Description                  |
|-------------    |---------------|------------------------------|
| id             | INTEGER (PK) | Unique identifier            |
| user_id        | INTEGER (FK) | Reference to Users.id        |
| reflection_id  | INTEGER (FK) | Reference to Reflections.id (optional) |
| title          | VARCHAR(255) | Task title                   |
| description    | TEXT         | Task description             |
| status         | VARCHAR(50)  | e.g., 'pending', 'completed' |
| due_date       | DATETIME     | Task due date (optional)     |
| created_at     | DATETIME     | When the task was created    |

## Notes
- For MVP, we can use SQLite for simplicity.
- Foreign keys ensure data integrity.
- As the app grows, we can add more tables like BookRecommendations, ReadingSessions, etc.
- Indexes on user_id, book_id, chapter_id for performance.
- Soft deletes added to Books for audit trails.
