import {Response} from 'express';
import {curry} from 'ramda';
import {Sequelize, Model, DataTypes, ModelCtor, FindOptions} from 'sequelize';
import {respondWith500, respondWithAuthorsPayload, respondWithAuthorNotFound, respondInvalidAuthorId} from './Http/helpers';

const databaseProtocol  = process.env.DB_PROTOCOL || 'mysql';
const databaseHost      = process.env.DB_HOSTNAME || '';
const databasePort      = process.env.DB_PORT || 3306;
const databaseUsername  = process.env.DB_USERNAME || 'root';
const databasePassword  = process.env.DB_PASSWORD || '';
const databaseSchema    = process.env.DB_SCHEMA || 'booknotes';

export const sequelize = new Sequelize(databaseProtocol + '://' + databaseUsername + ':' + databasePassword + '@' + databaseHost + ':' + databasePort + '/' + databaseSchema);

class BookNotesModel extends Model {
}

class Authors extends BookNotesModel {
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

class Books extends BookNotesModel {
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

class ContributionTypes extends BookNotesModel {
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

class BookAuthors extends BookNotesModel {
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

class Notes extends BookNotesModel {
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

class Tags extends BookNotesModel {
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

export const validateIdParameter = (idToValidate: string, response: Response): number | null => {
    const filteredIdToValidate = parseInt(idToValidate);
    if (!isNaN(filteredIdToValidate) && filteredIdToValidate > 0) { // Validate ID Parameter
        return filteredIdToValidate;
    } else { // Middle of Validate ID Parameter
        response.status(400).send();
        return null;
    } // End of Validate ID Parameter
};

// TODO Define FindAllResource Curried Function
const fetchAllAndRespond = curry((sequelizeModel: ModelCtor<Model<any, any>>, queryResultsHandler: Function, queryOptions: FindOptions, response: Response) => {
    sequelizeModel.findAll(queryOptions).then(results => queryResultsHandler(response, results));
});
export const fetchAllAuthorsAndRespond = fetchAllAndRespond(sequelize.models.Authors, respondWithAuthorsPayload);

// TODO Define FindOneResource Curried Function
const fetchByIdAndRespond = curry((sequelizeModel: ModelCtor<Model<any, any>>, queryResultsHandler: Function, notFoundHandler: Function, invalidIdHandler: Function, id: number, options: FindOptions, response: Response) => {
    const respondWithResults = queryResultsHandler(response);
    if (!isNaN(id) && id > 0) { // Validate ID Parameter
        sequelizeModel.findByPk(id, options).then(result => { // Middle of Perform Author Retrieval Query
            if (result) { // Check for Results
                respondWithResults([result]);
            } else { // Middle of Check for Results
                notFoundHandler(response);
            } // End of Check for Results
        }).catch(error => { // Middle of Perform Author Retrieval Query
            respondWith500(response);
        }); // End of Perform Author Retrieval Query
    } else { // Middle of Validate ID Parameter
        invalidIdHandler(response);
    } // End of Validate ID Parameter
});
export const fetchAuthorByIdAndRespond = fetchByIdAndRespond(sequelize.models.Authors, respondWithAuthorsPayload, respondWithAuthorNotFound, respondInvalidAuthorId);