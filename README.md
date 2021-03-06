LisTent Application

## Backend setup

First of all, move to the backend folder with `cd backend` command

### Setup Virtual Environment and Manage Dependencies

Make sure virtualenv is installed

```bash
pip install virtualenv
```

Create virtual environment named **venv**.

```bash
python3 -m venv venv
```

A **venv** should be created with the following structure:

```bash
venv
├── bin
├── include
├── lib
│   └── python3.6
│       └── site-packages
│           ├── easy_install.py
│           ├── pip
```

Activate virtual environment

```bash
source venv/bin/activate
```

Install all dependencies in **requirements.txt**

```bash
pip3 install wheel
pip3 install -r requirements.txt
```

### Run the Flask API Application

The application can be run from the root **main.py**.

```bash
python3 main.py
```

Open browser and visit **http://localhost:5000/api/v1** to see the Swagger UI of the API.

## Frontend setup

1. Install nodejs.
2. `cd` to `client` folder and run `npm install`.
3. Start the frontend with `npm run start`. Frontend should be running at `localhost:3000`.
