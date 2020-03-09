const Sequelize = require('sequelize');
const Umzug = require('umzug');

const databaseProtocol  = process.env.DB_PROTOCOL || 'mysql';
const databaseHost      = process.env.DB_HOSTNAME || '';
const databasePort      = process.env.DB_PORT || 3306;
const databaseUsername  = process.env.DB_USERNAME || 'root';
const databasePassword  = process.env.DB_PASSWORD || '';
const databaseSchema    = process.env.DB_SCHEMA || 'booknotes';

const sequelize = new Sequelize(databaseProtocol + '://' + databaseUsername + ':' + databasePassword + '@' + databaseHost + ':' + databasePort + '/' + databaseSchema);
const umzug = new Umzug({
    storage: '',
    storageOptions: {},
    logging: false,
    upName: 'up',
    downName: 'down',
    migrations: {
        params: [],
        path: '',
    },
});

export default {
    sequelize,
    umzug,
};