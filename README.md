# Hierarchical To-Do List Web App

## Overview
This application allows users to create, view, and manage a hierarchical list of tasks. Each task can have multiple sub-tasks, allowing for a depth of up to three levels (task -> sub-task -> sub-sub-task).

Check out Demo Video here: https://www.loom.com/share/5357bf687b6f4bbcbc74695e7b2c5fe0?sid=619d680d-15e8-4ae3-8658-5ede5b185b39

## Features
- **User Authentication:** Implements secure login and signup functionalities.
- **Task Management:** Enables creating, editing, and deleting of tasks, sub-tasks, and sub-sub-tasks.
- **Hierarchical Organization:** Supports organizing tasks in up to three levels of hierarchy for detailed structuring.
- **Visibility Control:** Users can easily toggle the visibility of sub-tasks.

## Technologies
- **Backend:** Flask
- **Frontend:** React
- **Database:** SQLite/SQLAlchecmy

## Setup and Installation
1. Clone the repository.
2. Install dependencies:
   - Backend: `pip install -r requirements.txt`
   - Frontend: `npm install`
3. Initialize the database: 
    - Initialize the database with `flask db init` to create a new migration repository.
    - Generate an initial migration with `flask db migrate -m "Initial migration."`
    - Apply the migration to the database with `flask db upgrade`.

4. Start the backend server: `flask run`
5. Start the frontend: `npm start`
6. Visit `http://localhost:3000` in your browser.

N.B: When running the backend, remember to go into /api and run: 
```python
export FLASK_APP=__init__.py
```

## Breakdown
- All pages are located in /src/pages
- All components are located in /src/components
- All backend files are located in /api

## Usage
- Sign up for an account and log in.
- Create a new list by clicking "New list".
- Click add new task to add a task and its sub tasks
- Toggle the visibility of sub-tasks as needed using the down arrow.

## AI Policy
I used ChatGPT to refine my ideas and troubleshoot my code. While ChatGPT provided valuable insights and suggestions, the core design, implementation, and problem-solving efforts were independently conducted. I also used GitHub Copilot in VS Code whenever it autofilled with correct code.