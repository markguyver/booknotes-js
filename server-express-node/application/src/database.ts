import {Response} from 'express';
import {Sequelize, Model, DataTypes} from 'sequelize';

const databaseProtocol  = process.env.DB_PROTOCOL || 'mysql';
const databaseHost      = process.env.DB_HOSTNAME || '';
const databasePort      = process.env.DB_PORT || 3306;
const databaseUsername  = process.env.DB_USERNAME || 'root';
const databasePassword  = process.env.DB_PASSWORD || '';
const databaseSchema    = process.env.DB_SCHEMA || 'booknotes';

export const sequelize = new Sequelize(databaseProtocol + '://' + databaseUsername + ':' + databasePassword + '@' + databaseHost + ':' + databasePort + '/' + databaseSchema);
export const validateIdParameter = (idToValidate: string, response: Response): number | null => {
    const filteredIdToValidate = parseInt(idToValidate);
    if (!isNaN(filteredIdToValidate) && filteredIdToValidate > 0) { // Validate ID Parameter
        return filteredIdToValidate;
    } else { // Middle of Validate ID Parameter
        response.status(400).send();
        return null;
    } // End of Validate ID Parameter
};

const handleDatabaseResults = (response: Response, results: Array<Model>, successStatusCode: number, responsePayloadResourceName: string): Response => {
    if (results) { // Check for Retrieved Database Rows
        const responsePayload = {};
        // responsePayload[responsePayloadResourceName] = results;
        response.status(successStatusCode).type('json').send(responsePayload);
    } else { // Middle of Check for Retrieved Database Rows
        response.status(404).send();
    } // End of Check for Retrieved Database Rows
    return response;
};
// TODO Write Curried Functions for Handling findAll() Results and Errors

class Authors extends Model {
    public id!: number;
    public first_name!: string | null;
    public middle_name!: string | null;
    public last_name!: string;
    public parent_author_id!: number | null;
}
Authors.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    middle_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    last_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    parent_author_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
},{
    sequelize,
    tableName: 'authors',
    modelName: 'Authors',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: [{
                name: 'last_name',
                order: 'ASC',
            }, {
                name: 'first_name',
                order: 'ASC',
            }, {
                name: 'middle_name',
                order: 'ASC',
            }],
        }
    ],
});

class Books extends Model {
    public id!: number;
    public title!: string;
}
Books.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
},{
    sequelize,
    tableName: 'books',
    modelName: 'Books',
    timestamps: true,
    paranoid: true,
    underscored: true,
});

class ContributionTypes extends Model {
    public id!: number;
    public name!: string;
}
ContributionTypes.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
},{
    sequelize,
    tableName: 'contribution_types',
    modelName: 'ContributionTypes',
    timestamps: false,
    underscored: true,
});

class BookAuthors extends Model {
    public book_id!: number;
    public author_id!: number;
    public contribution_type_id!: number;
    public order!: number | null;
}
BookAuthors.init({
    book_id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    author_id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    contribution_type_id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    order: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
    },
},{
    sequelize,
    tableName: 'book_authors',
    modelName: 'BookAuthors',
    timestamps: false,
    underscored: true,
});

class Notes extends Model {
    public id!: number;
    public note!: string;
    public title!: string;
    public book_id!: number;
}
Notes.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    book_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
},{
    sequelize,
    tableName: 'notes',
    modelName: 'Notes',
    timestamps: true,
    paranoid: true,
    underscored: true,
});

class Tags extends Model {
    public id!: number;
    public tag!: string;
}
Tags.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
    },
    tag: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
},{
    sequelize,
    tableName: 'tags',
    modelName: 'Tags',
    timestamps: true,
    paranoid: true,
    underscored: true,
});

// Authors <=> Authors
Authors.belongsTo(Authors, { foreignKey: 'parent_author_id', as: 'ActualAuthor' });
Authors.hasMany(Authors, { foreignKey: 'parent_author_id', as: 'Pseudonyms' });

// Authors <=> Books <=> Contribution Types
Authors.hasMany(BookAuthors);
Books.hasMany(BookAuthors);
ContributionTypes.hasMany(BookAuthors);
BookAuthors.belongsTo(Authors);
BookAuthors.belongsTo(Books);
BookAuthors.belongsTo(ContributionTypes);

// Books <=> Notes
Books.hasMany(Notes);
Notes.belongsTo(Books);

// Tags <=> Authors , Tags <=> Books , Tags <=> Notes
Tags        .belongsToMany(Authors, { through: 'author_tags', timestamps: false });
Authors     .belongsToMany(Tags, { through: 'author_tags', timestamps: false });
Tags        .belongsToMany(Books, { through: 'book_tags', timestamps: false });
Books       .belongsToMany(Tags, { through: 'book_tags', timestamps: false });
Tags        .belongsToMany(Notes, { through: 'note_tags', timestamps: false });
Notes       .belongsToMany(Tags, { through: 'note_tags', timestamps: false });