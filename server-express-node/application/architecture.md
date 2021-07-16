# Booknotes Server Architecture

The server application is a web API built with [Express](https://expressjs.com/) in [Typescript](https://www.typescriptlang.org/). The server application uses [MariaDB](https://mariadb.org/) to persist data and [Sequelize](http://sequelize.org/) as the ORM with migrations and seeders being provided by [Sequelize-CLI](https://github.com/sequelize/cli#readme). Logging is provided by [Pino](https://getpino.io/).

The root of the project is the `src` directory and it contains:
* [`/src/cors.ts`](/src/cors.ts): The CORS module where allowable origins can be set. At present, this module is not fully-developed and simply allows all origins.
* `/src/index.ts`: This is the main entry point for the application and it initializes and configures the Express server and starts it.
* `/src/logger.ts`: The module that creates and configures the Pino logger for use by Express, Sequelize, and the application in general.

The `src` directory also contains two sub-folders which further partition the application logic into two sections: database and http. The folder structure for the database section is further sub-divided to allow multiple database servers to accomodate different access patterns; however, at present, only the relational database sub-section is provided:
* `/src/Database/Relational/database-sequelize.ts`: This module initializes Sequelize and defines all of the ORM model objects. It also contains a few helper functions which are exported.

The other sub-section (_i.e. http_) provides all of the API endpoint handling functionality and breaks down as follows:
* `/src/Http/helpers.ts`: This helper module provides a number of functions, types, and variables which are used by the HTTP models and controllers to provide their functionality. This file is the heart of the server application.
* `/src/Http/Models/`: The models are an extension of the database models but with scaffolded functionality added on top of those. The models provided the basic querying functionality for the various lookups that the different controllers will perform but are built in such a way (_i.e. curried with a specific function parameter order_) that controllers can re-use the lookup but pass their own, unique query options for retrieval and display.
* `/src/Http/Controllers/`: The controllers use the lookup method provided by the HTTP models with query options that they (_i.e. the controllers_) provide and format the results for the HTTP payload. The controllers create, define, and export the Express router objects which are imported in the `/src/index.ts` file (_where the Express server is configured_).