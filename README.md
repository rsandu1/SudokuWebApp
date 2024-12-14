# SudokuWebApp

A full-stack web application for playing Sudoku puzzles with various features and difficulty levels.

## Snapshot

<img src="assets/snapshot.png" width="600" alt="Sudoku Web App Screenshot"/>

## Features

- 4x4 and 9x9 Sudoku boards
- Multiple difficulty levels
- Real-time validation
- Hint system
- Note-taking functionality
- Undo/Redo actions
- Pause/Resume game
- Progress tracking

## Tech Stack
### Frontend
- JavaScript/React.js
- Material-UI
- Bootstrap
- Axios for API calls
- Vite as build tool

### Backend
- Python3.10+/Django
- SQLite database

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/rsandu1/SudokuWebApp.git
```

```bash
git clone https://github.com/rsandu1/SudokuWebApp.git
```

2. Backend Setup
```bash
# Navigate to backend directory
cd sudoku-web-app/sudoku_backend

# Create Virtual Environment
python -m venv env
source /env/bin/activate

# Install Required Packages
pip install -r requirements.txt

# Set up Database
python manage.py makemigrations sudoku
python manage.py migrate sudoku
python manage.py makemigrations
python manage.py migrate

# Run Backend Server
python manage.py runserver
```

3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../sudoku_frontend

# Install Dependencies
npm install

# Run Frontend Development Server
npm run dev
```
## Usage

Follow the README.md in sudoku_backend and sudoku_frontend.
