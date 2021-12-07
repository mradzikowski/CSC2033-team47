# ClimateXtractor project for CSC2033 developed by team47

# Structure of code

We have divided our system for extracting the data into three services (for now), because it would speed up the
development in our team and it will help to keep the code clean and modularised.
There are services: users (for managing logging, adding users, deleting, updating) and stuff related to users,
climate (This microservice will take care about uploading and retrieving files in different formats),
client (This microservice will be a frontend app that will interact with other microservices)

# Before the developing

Make sure that you have virtual environment enabled
You can create one using Pycharm by going into File -> Settings -> Project: CSC2033-team47 -> Python Interpreter ->
Add (settings icon)

Creating python environment from terminal

```shell
python3 -m venv venv
source venv/bin/activate
```

If you had any problems creating the virtual environment refer to this link ->
[Virtual Environments Python](https://docs.python.org/3/tutorial/venv.html)

Then you can install the project dependencies

```shell
pip install -r requirements.txt
```

# Code of conduct

We have added pre-commit automation tool to help us keep the consistency of the code.
It contains git hooks that ensure good coding style. It will provide us a good coding styles
that are maintained also in other projects. We could focus more on writing the code instead of
taking care of the small mistakes. Pre-commit tools will ensure that they are minimised.

### To install precommit

By installing the requirements for the project pre-commit will also be installed.
You can double-check if it is installed by `pre-commit --version`

You can always refer to [Pre-commit documentation](https://pre-commit.com/) for any help.
The config file for pre-commit is in root folder **pre-commit-config.yaml** file.

It will run on your commits, but you can also use `pre-commit run --all-files`
It consists of some checks and reformatting tools. It might change the code that you have added,
so you can apply changes and commit them to the codebase.

# Using docker and starting the project

Start by ensuring that you have Docker and Docker-compose installed

```shell
docker -v
docker-compose -v
```

To install them refer to this [link](https://docs.docker.com/get-docker/). This will help you install them
regarding your operating system.

Set the environmental variables used in **docker-compose.yaml** file

```shell
export REACT_APP_USERS_SERVICE_URL=http://localhost:5004
export REACT_APP_CLIMATE_SERVICE_URL=http://localhost:5005
```

To build the images run:

```shell
docker-compose build
```

Once the build is done you can fire up the containers. Run:

```shell
docker-compose up -d
```

While updating the container you might want to run:

```shell
docker-compose up -d --build
```

To view the docker images and their logs you can use:

```shell
docker ps -a
```

And to view logs:

```shell
docker-compose logs
```

To stop the containers run:

```shell
docker-compose stop
```

To bring down the containers:

```shell
docker-compose down
```

To lint with **flake8** you can run:

```shell
docker-compose exec $name_of_service black src
```

**Black** and **isort** refactoring tools

```shell
docker-compose exec $name_of_service black src
docker-compose exec $name_of_service isort src
```

To refactor the code of the React app run:

```shell
docker-compose exec client npm run prettier:write
```

To lint the code of the React app run:

```shell
docker-compose exec client npm run lint
```

Name of services could be found in **docker-compose.yaml** file.

# Basic testing of the routes

In the microservices there are implemented ping routes to check if the services are responsive.

To check for working users microservice go to [ping endpoint](http://localhost:5004/ping) or [link](http://localhost:5004/)

To check for working climate microservice go to [ping endpoint](http://localhost:5005/ping) or [link](http://localhost:5005/)

To check for working client microservice and see the basic react app go to [link](http://localhost:3007/)

# Test routes

Before testing you should create the database

```shell
docker-compose api_users python manage.py recreate_db
```

You can seed the database with given users by

```shell
docker-compose api_users python manage.py seed_db
```

You can go into the postgreSQL command line by and see the tables

```shell
docker-compose exec api_users_db psql -U postgres
\c api_users_dev
\dt
```

To test routes you can use

```shell
docker-compose exec api_users python -m pytest "src/tests"
```

To run last failed tests use

```shell
docker-compose exec api_users python -m pytest "src/tests" --lf
```

To test the users' route go to [link](http://localhost:5004/users)
You should see

```json
[
  {
    "user_id": 1,
    "username": "Mateusz",
    "email": "mateusz@email.com",
    "date_created": "2021-12-04T16:33:17.836632"
  },
  {
    "user_id": 2,
    "username": "Toby",
    "email": "toby@email.com",
    "date_created": "2021-12-04T16:33:17.836632"
  },
  {
    "user_id": 3,
    "username": "Melissa",
    "email": "melissa@email.com",
    "date_created": "2021-12-04T16:33:17.836632"
  },
  {
    "user_id": 4,
    "username": "Joseph",
    "email": "joseph@email.com",
    "date_created": "2021-12-04T16:33:17.836632"
  },
  {
    "user_id": 5,
    "username": "Chloe",
    "email": "chloe@email.com",
    "date_created": "2021-12-04T16:33:17.836632"
  }
]
```

To see the coverage of the tests run:

```shell
docker-compose exec api_users python -m pytests "src/tests" -p "no:warnings" --cov="src"
```

To see the coverage in html run and use the browser of your type or right click on the file and click `open in -> browser -> your choice`

```shell
docker-compose exec api_users python -m pytests "src/tests" -p "no:warnings" --cov="src" --cov-report html
google-chrome services/users/htmlcov/index.html
```
