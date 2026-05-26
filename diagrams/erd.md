# Entity Relationship Diagram (ERD) — ScholarAI

```mermaid
erDiagram
    USERS {
        string _id PK
        string clerkId UK
        string email
        string name
        string imageUrl
        number createdAt
    }

    DOCUMENTS {
        string _id PK
        string userId FK
        string name
        string type
        number size
        string storageId
        string url
        string extractedText
        string status
        number createdAt
        number updatedAt
    }

    CHATS {
        string _id PK
        string userId FK
        string documentId FK
        string title
        string mode
        number createdAt
        number updatedAt
    }

    MESSAGES {
        string _id PK
        string chatId FK
        string role
        string content
        number createdAt
    }

    USERS ||--o{ DOCUMENTS : "owns"
    USERS ||--o{ CHATS : "initiates"
    DOCUMENTS ||--o{ CHATS : "referenced in"
    CHATS ||--o{ MESSAGES : "contains"
```

## Field Notes

| Table | Key Fields | Index |
|---|---|---|
| `users` | `clerkId` (unique) | `by_clerk_id` |
| `documents` | `userId`, `status` | `by_user`, `by_user_and_status` |
| `chats` | `userId`, `documentId` | `by_user`, `by_user_and_document` |
| `messages` | `chatId` | `by_chat` |

**Status values for `documents`:** `"uploading"` → `"processing"` → `"ready"` | `"error"`

**Mode values for `chats`:** `"qa"` | `"summarize"` | `"quiz"` | `"flashcards"`

**Role values for `messages`:** `"user"` | `"assistant"`
