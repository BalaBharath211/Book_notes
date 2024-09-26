## Book_notes

## Description
**Book Notes** is a personal space to share insights, reviews, and recommendations from my reading journey. This web application allows users to keep track of books they've read, provide feedback, and explore suggestions based on their interests.

## Features
- View and sort books by recommendations, title, newest, or best.
- Add and edit book entries with personal feedback.
- FAQ section for common queries.
- Contact email for inquiries and feedback.

## Technologies Used
- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- PostgreSQL

# Installation
    Prerequisites
    - Node.js
    - PostgreSQL

## Steps
1. Clone the repository:
    - git clone https://github.com/yourusername/book-notes.git
    - cd book-notes

2. Install the dependencies:
    - npm install

3. Set up PostgreSQL database:
    - Create a PostgreSQL database.
    - Set the database credentials in a .env file:

        DB_HOST=your_database_host,
        DB_USER=your_database_user,
        DB_PASS=your_database_password,
        DB_NAME=your_database_name

4. Run database migrations (if any):
    - npm run migrate

5. Start the development server:
    - npm start

Open your browser and navigate to http://localhost:3000.

# Usage
- Add books by providing an ISBN number.
- View, edit, or delete existing books.
- Sort books based on various criteria (e.g., recommendations, title).
- Visit the FAQ page for additional information.

# API Integration
- Book Notes fetches book cover images using the Open Library Covers API. The API is queried using the ISBN number of the book.

- For more information on the API, visit: Open Library Covers API.

# Contributing
Contributions are welcome! Please fork the repository and create a pull request.

# Steps:
Fork the repository.
1. Create a new branch (git checkout -b feature-branch).
2. Commit your changes (git commit -m 'Add new feature').
3. Push to the branch (git push origin feature-branch).
4. Open a pull request.