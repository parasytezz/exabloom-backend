# Exabloom Backend Test

This is a backend system built with **Express**, **TypeScript**, and **PostgreSQL**.  
It fulfills the requirements of the Exabloom backend internship test, including:

- Managing `contacts` and their `messages`
- Efficiently querying the 50 most recent conversations
- Pagination support
- Search functionality on message content, contact name, or phone number

---

## Features

- RESTful API with endpoints to:
  - Create and fetch contacts/messages
  - Retrieve 50 most recent conversations
  - Filter conversations with a search term
- Efficient SQL queries using `DISTINCT ON` and indexing
- CSV-based seeding of 100k contacts and 5M messages
- Type-safe code using TypeScript
- Environment-based configuration using `.env`

---

## System Requirements

- **Node.js** >= 18
- **PostgreSQL** >= 14 (v17 recommended)
- **npm** >= 9
- Disk space for 5M message inserts (~600MB+ during runtime)

---

## Setup Instructions

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/exabloom-backend.git
   cd exabloom-backend
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Setup environment**

   Create a .env file in the root:

   ```env
   PORT=3000
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   DB_NAME=exabloom
   DB_HOST=localhost
   DB_PORT=5432
   ```
4. **Create PostgreSQL database**

   ```sql
   CREATE DATABASE exabloom;
   ```
5. **Create tables**

   Run the following SQL:
  
   ```sql
   CREATE TABLE contacts (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     phone VARCHAR(20),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
  
   CREATE TABLE messages (
     id SERIAL PRIMARY KEY,
     contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
     body TEXT NOT NULL,
     sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```
6. **Download CSV file**

   Place the provided message_content.csv file in the root directory (same level as package.json).

7. **Seed database** 

   Inserts 100,000 contacts and 5,000,000 messages
   May take 10–15 mins
  
   ```bash
   npx ts-node src/seed.ts
   ```
8. **Start the server**

   ```bash
   npx ts-node-dev src/index.ts
   ```
**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | Get all contacts |
| POST | `/api/contacts` | Create a new contact |
| GET | `/api/messages` | Get all messages |
| POST | `/api/messages` | Create a new message |
| GET | `/api/conversations` | Get 50 most recent conversations |
| GET | `/api/conversations?search=...` | Filter conversations by name/phone/content |
| GET | `/api/conversations?page=2` | Get page 2 of conversations (pagination) |

**Design Decisions**

- PostgreSQL over NoSQL: Chosen for relational integrity and powerful SQL querying

- DISTINCT ON query: Used to efficiently retrieve the latest message per contact

- Raw SQL instead of ORM: To meet performance requirements under large datasets

- CSV Seeding: Simplified bulk insert without large fixture files

**Assumptions Made**
- Conversations are defined as the latest message per contact (1:1 message group)

- Messages can be seeded with random pairing to simulate real-world traffic

- Only text search was required, so full-text search extensions were not added

- Frontend integration is out of scope for this test

**Folder Structure**
```pgsql
exabloom-backend/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── db.ts
│   ├── index.ts
│   └── seed.ts
├── message_content.csv
├── package.json
├── tsconfig.json
└── .env
```


**Tech Stack**

- Express.js
- TypeScript
- PostgreSQL
- pg and csv-parser
- ts-node-dev








