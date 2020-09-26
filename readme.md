# Booknotes (JS)

A web-based tool for cataloging your library and keeping notes about books that you're reading. This application allows you to create authors, books, notes, and tags. Notes can be created and are associated with a specific book. Authors, books, and notes can all be tagged.

## Developent Version

This project has not yet reached a functioning state and is in development.

## How to use it

At present, I am working towards my first versioned release. This means that the primary way that this application has been used is through my development workflow (_more below_).

## How to develop

In the root directory, there is a `docker-compose.yml` file which can be used to get an environment up-and-running. This configuration mounts the application folders from the server-side and client-side applications into the containers which means you will need to install dependencies via [NPM](https://www.npmjs.com/) the first time you use it.

1. Clone the repository. I tend to check out code to this directory: `~/Documents/Projects`. If you check this project out to a different location, please be sure to update the paths in the example commands.

    ```bash
    git clone git@github.com:markguyver/booknotes-js.git ~/Documents/Projects/booknotes-js
    ```

2. Change into the directory where you checked out the project:

    ```bash
    cd ~/Documents/Projects/booknotes-js
    ```

    Start the project with Docker Compose:

    ```bash
    docker-compose up
    ```

3. Because of the mounted volumes in the running containers, there will be errors, the first time that you start up Docker Compose.

    **Server:**

    ```bash
    docker exec -it --rm -v ~/Documents/Projects/booknotes-js/server/application:/var/node booknotesjs_server_1:latest sh -l
    ```

    ```bash
    npm install
    ```

    **Client:**

    ```bash
    docker exec -it --rm -v ~/Documents/Projects/booknotes-js/client/application:/var/node booknotesjs_client_1:latest sh -l
    ```

    ```bash
    npm install
    ```

4. Connect to MariaDB and create the `booknotes` schema (_or whichever schema you choose to use via the `.env` file_). You will also need to run the migrations and (_optionally_) the seeders.

    **Server:**

    ```bash
    docker exec -it --rm --network booknotes-network -v ~/Documents/Projects/booknotes-js/server/application:/var/node booknotesjs_server_1:latest sh -l
    ```

    ```bash
    cd database
    sequelize db:migrate:all
    sequelize db:seed:all
    ```

## Technologies Used

This list is not comprehensive but includes the key dependencies.

### Client-Side Application

* [Docker](https://docs.docker.com/reference/)
* [NodeJS](https://nodejs.org/docs/latest-v12.x/api/)
* [Vue 2](https://vuejs.org/v2/guide/)
* [Vue CLI](https://cli.vuejs.org/)
* [Bootstrap](https://getbootstrap.com/docs/4.4/getting-started/introduction/)
* [Bootstrap-Vue](https://bootstrap-vue.js.org/docs/)
* [Axios](https://github.com/axios/axios)
* [Apex Charts](https://apexcharts.com/docs/installation/)
* [Vue Apex Charts](https://apexcharts.com/docs/vue-charts/)
* [CKEditor4](https://ckeditor.com/docs/ckeditor4/latest/)
* [CKEditor4-Vue](https://github.com/ckeditor/ckeditor4-vue)
* [PopperJS](https://popper.js.org/)
* [Serve](https://github.com/zeit/serve#readme)

### Server-Side Application

* [Docker](https://docs.docker.com/reference/)
* [NodeJS](https://nodejs.org/docs/latest-v12.x/api/)
* [Typescript](https://www.typescriptlang.org/docs/home.html)
* [Mysql2](https://github.com/sidorares/node-mysql2#readme)
* [Sequelize](https://github.com/sequelize/sequelize)
* [Umzug](https://github.com/sequelize/umzug)
* [ExpressJS](https://expressjs.com/en/4x/api.html)
* [Nodemon](https://github.com/remy/nodemon#nodemon)
* [PM2](https://github.com/Unitech/pm2)
* [Redoc](https://github.com/Redocly/redoc)
* [Pino](https://getpino.io/)
* [Express Pino](https://github.com/pinojs/express-pino-logger)
* [Ramda](https://ramdajs.com/)

### Database

* [Docker](https://docs.docker.com/reference/)
* [MariaDB](https://mariadb.com/kb/en/documentation/)

### Development

* [Docker Compose](https://docs.docker.com/compose/)