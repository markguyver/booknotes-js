# Booknotes (JS): Server-Side Application

## Docker Image Environment Variables

*   `APP_PORT` (Default: `3000`)
*   `LOG_LEVEL` (Default: `error`)
*   `DB_HOSTNAME`
*   `DB_PORT` (Default: `3306`)
*   `DB_USERNAME` (Default: `root`)
*   `DB_PASSWORD`
*   `DB_SCHEMA` (Default: `booknotes`)

## NPM Scripts

*   `compile`
*   `db:migrate`
*   `db:rollback`
*   `develop`
*   `documentation`
*   `minimize`
*   `start`

## Using Sequelize for Migrations

Before you can use the database migration scripts via NPM (see section above), you will need to initialize and setup your environments in a config file. Luckily, Sequelize CLI provides a handy method for that.

[Insert step-by-step directions here]

## Application Architecture

Read more about the application architecture [here](architecture.md).