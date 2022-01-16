# ClimateXtractor project for CSC2033 developed by team47

![CI Status](https://github.com/mradzikowski/CSC2033-team47/actions/workflows/push.yml/badge.svg?branch=main)

# Purpose of the application

As we have decided to work on the UN goal Climate Change we did not want to create another website / blog about
climate change but rather create a website that might actually
help scientists and other students to use and have as much data related to climate change in one place.
That is why we have come up with an idea to develop a website with storing datasets related to climate change.
Our aim is to provide a good and reliable source of data that might be helpful for
scientists in writing their research papers and also for students that are eager to find out more about climate change.
We want to encourage users to upload as many datasets as possible if the datasets would meet our requirements.
We know that users value accurate data, so we will also want to add upvoting by other users so that users would know if the specific dataset was useful for them.
Encouraging people by keeping the ranking of the users with the most uploaded files would be another factor that will be beneficial.

# Structure of code

We have divided our system for extracting the data into two services (for now), because it would speed up the
development in our team and it will help to keep the code clean and modularised.
There are services: users (for managing logging, adding users, deleting, updating),
datasets (downloading, uploading files in different formats, routes for trening datasets, upvoting the datasets, categories, retrieving datasets).
It serves as a RESTApi between backend and database (PostgreSQL).
client (This microservice will be a frontend app that will interact with other microservices).

#### Some functionalities are not finished up or are started and not finalised.

We have some routes in the backend that are not yet implemented in the frontend, so that we know that if had more time, we
would be able to finish them to meet the requirements.

# Code of conduct

We have added `pre-commit` automation tool to help us keep the consistency of the code.
It contains `git hooks` that ensure good coding style. It will provide us a good coding styles
that are maintained also in other projects. We could focus more on writing the code instead of
taking care of the small mistakes. Pre-commit tools will ensure that bugs are minimised and that we will be pushing
code that meets style requirements.

We wanted to ensure that this project would not be next example of `spaghetti code`, so we were researching for a tools
that would help us to prevent from that.

### Linters used

- `eslint`
- `flake8`

### Reformatting tools used

- `isort`
- `black`

### Checkers

- `mypy`

### Testing tools

- `Jest`
- `Pytest` with pytest-cov plugin

### Automation tool

- `pre-commit`

### To install `pre-commit`

By installing the requirements for the project pre-commit will also be installed.
You can double-check if it is installed by `pre-commit --version`

You can always refer to [Pre-commit documentation](https://pre-commit.com/) for any help.
The config file for pre-commit is in root folder **pre-commit-config.yaml** file.

It will run on your commits, but you can also use `pre-commit run --all-files`
It consists of some checks and reformatting tools. It might change the code that you have added,
so you can apply changes and commit them to the codebase.

### Stages

### We have three stages for the application:

#### Production

The deployed apps are on [Backend deployed (api documentation)](https://climatextractor-backend.herokuapp.com/doc) and frontend [Frontend deployed (main page)](https://climatextractor-frontend.herokuapp.com/doc)

#### Development

For the development part we have Dockerfiles in the services: users and client that are used in building in the docker-compose.yml file.
We can easily build the development environment with using `docker-compose up -d --build`. There is file `docker-compose.ci.yml` that serves
purpose in continuous integration.

#### Configs

We have three configuration that could be found in `./services/users/src/config` that sets environmental configurations passed through the passed
variables in docker-compose.yml and Dockerfiles.

#### Testing

For testing backend (Flask Application) we use `docker-compose exec api_users python -m pytest "src/tests"`
But if we wanted to see the test coverage we run `sudo docker-compose exec api_users python -m pytest "src/tests" -p no:warnings --cov="src"`

#### Continuous Integration

We use `Github Actions` for our CI tool. It builds the docker images and automatically test the backend.

# Before the developing and contributing

## Setting up the virtual environment

Make sure that you have virtual environment enabled
You can create one using Pycharm by going into `File -> Settings -> Project: CSC2033-team47 -> Python Interpreter -> Add (settings icon)`

### Creating python environment from terminal

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

# Starting the project

### Simple workflow

Start by ensuring that you have Docker and Docker-compose installed

```shell
docker -v
docker-compose -v
```

To install them refer to this [link](https://docs.docker.com/get-docker/). This will help you install them
regarding your operating system.

Set the environmental variables used in **docker-compose.yaml** file, it will be used to link frontend with backend

```shell
export REACT_APP_USERS_SERVICE_URL=http://localhost:5004
```

Build the docker images and spin them in the detached mode:

```shell
docker-compose up -d --build
```

To make sure that these are working you can view running containers by running:

```shell
docker-compose ps
```

To see the logs of the containers run:

```shell
docker-compose logs
```

Once started you will need to:

#### Before developing you need to create the database for development

```shell
docker-compose exec api_users python manage.py recreate_db
```

#### You can seed the database with given users by

```shell
docker-compose exec api_users python manage.py seed_db
```

Then if you would like to visit the app and develop locally go to [http://localhost:3007/](http://localhost:3007/) web app.
To see the routes visit [API DOCUMENTATION DEV](http://localhost:5004/doc).

### Running linters and formatters in backend service

To lint with **flake8** you can run:

```shell
docker-compose exec $name_of_service black src
```

**Black** and **isort** refactoring tools

```shell
docker-compose exec $name_of_service black src
docker-compose exec $name_of_service isort src
```

If you want to use this docker images and its names run with api_users as $name_of_service

### Running linters and formatter in frontend service

To refactor the code of the React app run:

```shell
docker-compose exec client npm run prettier:write
```

To lint the code of the React app run:

```shell
docker-compose exec client npm run lint
```

If you want to use this docker images and its names run with client as $name_of_service

**Name of services could be found in docker-compose.yaml file.**

To stop the containers run:

```shell
docker-compose stop
```

To stop the containers and remove them run (v flag to remove the volumes defined in the docker-compose file, useful because of the problems with installed dependencies):

```shell
docker-compose down -v
```

# Basic testing commands

### Testing Backend

With test coverage

```shell
docker-compose exec api_users python -m pytest "src/tests"
```

To run last failed tests use

```shell
docker-compose exec api_users python -m pytest "src/tests" --lf
```

Without test coverage

```shell
docker-compose exec api_users python -m pytest "src/tests" -p no:warnings --cov="src"
```

To see the coverage in html run and use the browser of your type or right-click on the file and click `open in -> browser -> your choice`

```shell
docker-compose exec api_users python -m pytests "src/tests" -p "no:warnings" --cov="src" --cov-report html
google-chrome services/users/htmlcov/index.html
```

# API documentation

- When developing visit [API DOC DEV](http://localhost:5004/doc)
- Production visit [API DOC PROD](<(https://climatextractor-backend.herokuapp.com/doc)>)

## Workflow

These are added commands that might be useful while developing, debugging

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

You can go into the postgreSQL command line by and see the tables

```shell
docker-compose exec api_users_db psql -U postgres
\c api_users_dev
\dt
```

## FOLDERS EXPLAINED

## REFERENCES

## LICENSE

Copyright, 2022, Newcastle University

You may copy, or use this repository as part of our assessment and feedback at Newcastle University.
