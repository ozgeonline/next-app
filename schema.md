# Database Schema Relationship Diagram

Shows how MongoDB models are related

```mermaid
erDiagram
    %% Legend:
    %% PK: Primary Key
    %% FK: Foreign Key
    %% UK: Unique Key

    User ||--o{ Rating : "writes"
    User ||--o{ Reservation : "books"
    Meal ||--o{ Rating : "has"

    User {
        ObjectId _id PK
        String name
        String email UK
        String password
        Date createdAt
    }

    Meal {
        ObjectId _id PK
        String title
        String slug UK
        String image
        String summary
        String instructions
        String creator
        String creator_email
        Number averageRating "Calculated/Stored"
        Date createdAt
    }

    Rating {
        ObjectId _id PK
        ObjectId mealId FK
        ObjectId userId FK
        Number rating "1-5"
        Date createdAt
    }

    Reservation {
        ObjectId _id PK
        ObjectId userId FK
        String date
        String time
        Number guests
        String notes
        Date createdAt
    }
```

### Relationships

1. **User and Rating**: A user can leave more than one rating.
2. **User and Reservation**: A user cannot make more than one reservation.
3. **Meal and Rating**: A meal can have more than one rating.

### Notes
- **User**: Central entity for authentication.
- **Meal**: Core content. `averageRating` is currently calculated via aggregation but technically exists in the schema.
- **Rating**: Junction table linking Users and Meals with a score.
- **Reservation**: Linked directly to User.
