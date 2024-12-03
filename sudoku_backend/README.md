# Sudoku Backend
## Usage
1. Create Virtual Environment
    ```bash
    python -m venv env
    source /env/bin/activate
    ```
2. Install Required Packages
    ```bash
    pip install -r requirements.txt
    ```

3. Get database ready
    ```bash
    python manage.py makemigrations sudoku
    python manage.py migrate sudoku
    python manage.py makemigrations
    python manage.py migrate
    ```

4. Run Locally
    ```bash
    python manage.py runserver
    ```