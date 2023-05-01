# Setup
1. Make sure you have npm installed (tested with version 6.14.4, if you have a lower version then try updating it if you are unable to build the project).
2. Run the following command in your console to install dependencies:
```bash
npm i
npm i --global webpack ts-node
```
3. Install Redis - on Linux this should be possible through your package manager, but on Windows use an Ubuntu WSL environment

# Building
This project uses webpack for compilation in order to provide benefits like ES2018 syntax, TypeScript, and `.tsx`/`.jsx` file support.
Running the following command will make webpack watch files for changes and automatically recompile when you make changes:
```bash
npm run dev
```
To create a minified production build instead, run:
```bash
npm run build
```

# Running
1. Build the javascript files using the steps above
2. Install python 3.8+ (tested with 3.8.5)
3. Install PostgreSQL and start running the postgres server
4. Create a database in Postgres called "outcropsketch"
4. In the root folder of the repository, create a new python virtual environment with `python -m venv env`
5. Install python requirements with `pip install -r requirements.txt`
6. Create a `.env` file in the root directory of the repo to fill in with sensitive information like database credentials. Use the default one below as a template and replace values with ones for your configuration:
```
DJANGO_SECRET_KEY=123456 # Secret key for django server to use, value doesn't matter except in production
GOOGLE_CREDENTIAL_FILE=outcropsketch-123456789.json # Name of Google service account credential json file located in the webserver folder
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```
7. Run `sudo service redis-server start` to use Redis as a Celery message broker
8. Run [Celery](https://docs.celeryq.dev/en/stable/index.html) in a background process:
```
cd webserver
celery -A outcropsketch worker
```
(on Windows, you will need to use WSL or add `-P solo` to the end of this command as Celery does not officially support Windows)
9. Run the server by running `python webserver/manage.py runserver` and visiting 127.0.0.1:8000 in your browser

# File Conversion for Outcrop Sketch .json files
1. If it doesn't already exist, create a folder named `input` in the root directory of the project
2. Put all the .json files you want to convert in the `input` folder
3. Run the following command to convert all .json files into image and .csv files:
```bash
npm run convert-json
```
4. Check the `converted/x` folder to find the source images, and `converted/y` for .csv label files.
5. Run the following command to convert the `.csv` files into `.png` files with labels:
```bash
python utils/csv_to_png.py
```
6. Check the `converted/StructureTypeLabels` folder for the structure types, and `converted/StructureTypeLabels` for surface types.
