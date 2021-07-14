import { Sequelize, Model, DataTypes, Includeable, WhereOptions, WhereAttributeHash, FindOptions } from 'sequelize';
import { logger } from '../../logger';

// Declare Types
export type SequelizeDeleteQueryOptions = {
    force: boolean;
    where: WhereAttributeHash;
};

// Prepare General Helpers
export const insertWhereEqualsToQueryOptionsAsIncludeable = (
    columnName: string,
    columnValue: number|string,
    queryOptions: Includeable
): Includeable => {
    const whereClause: WhereOptions = {};
    whereClause[columnName] = columnValue;
    return Object.assign({ where: whereClause }, queryOptions);
};
export const insertWhereEqualsToQueryOptionsAsFindOptions = (
    columnName: string,
    columnValue: number|string,
    queryOptions: FindOptions
): FindOptions => {
    const whereClause: WhereOptions = {};
    whereClause[columnName] = columnValue;
    return Object.assign({ where: whereClause }, queryOptions);
};

// Prepare Sequelize Database Connection

const databaseHost      = process.env.DB_HOSTNAME || '';
const databasePort      = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
const databaseUsername  = process.env.DB_USERNAME || 'root';
const databasePassword  = process.env.DB_PASSWORD || '';
const databaseSchema    = process.env.DB_SCHEMA || 'booknotes';

// TODO: Switch dialect to mariadb
export const sequelizeInstance = new Sequelize(databaseSchema, databaseUsername, databasePassword, {
    dialect: "mysql",
    dialectOptions: { connectTimeout: 1000 },
    host: databaseHost,
    port: databasePort,
    logging: message => logger.info({source:"Sequelize"}, message),
});

// Create Individual Models for All Tables

class Author extends Model {
    public id!: number;
    public first_name!: string | null;
    public middle_name!: string | null;
    public last_name!: string;
    public parent_author_id!: number | null;
}
Author.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: 'uniqueFullName',
    },
    middle_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: 'uniqueFullName',
    },
    last_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: 'uniqueFullName',
    },
    parent_author_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
},{
    sequelize: sequelizeInstance,
    tableName: 'authors',
    modelName: 'Author',
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

class Book extends Model {
    public id!: number;
    public title!: string;
}
Book.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
},{
    sequelize: sequelizeInstance,
    tableName: 'books',
    modelName: 'Book',
    timestamps: true,
    paranoid: true,
    underscored: true,
});

class ContributionType extends Model {
    public id!: number;
    public name!: string;
}
ContributionType.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
},{
    sequelize: sequelizeInstance,
    tableName: 'contribution_types',
    modelName: 'ContributionType',
    timestamps: false,
    underscored: true,
});

class BookAuthor extends Model {
    public book_id!: number;
    public author_id!: number;
    public contribution_type_id!: number;
    public order!: number | null;
}
BookAuthor.init({
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
    sequelize: sequelizeInstance,
    tableName: 'book_authors',
    modelName: 'BookAuthor',
    timestamps: false,
    underscored: true,
});

class Note extends Model {
    public id!: number;
    public note!: string;
    public title!: string;
    public book_id!: number;
}
Note.init({
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
        allowNull: true, // This is temporary and should be false after Vue UI updated
    },
    book_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
},{
    sequelize: sequelizeInstance,
    tableName: 'notes',
    modelName: 'Note',
    timestamps: true,
    paranoid: true,
    underscored: true,
});

class Tag extends Model {
    public id!: number;
    public tag!: string;
}
Tag.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
    },
    tag: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
},{
    sequelize: sequelizeInstance,
    tableName: 'tags',
    modelName: 'Tag',
    timestamps: true,
    paranoid: true,
    underscored: true,
});


// Define Model Relationships

// Authors <=> Authors
Author              .belongsTo(Author, { foreignKey: 'parent_author_id', as: 'ActualAuthor' });
Author              .hasMany(Author, { foreignKey: 'parent_author_id', as: 'Pseudonym' });

// Authors <=> Books <=> Contribution Types
Author              .hasMany(BookAuthor);
Book                .hasMany(BookAuthor);
ContributionType    .hasMany(BookAuthor);
BookAuthor          .belongsTo(Author);
BookAuthor          .belongsTo(Book);
BookAuthor          .belongsTo(ContributionType);

// Books <=> Notes
Book                .hasMany(Note);
Note                .belongsTo(Book);

// Tags <=> Authors , Tags <=> Books , Tags <=> Notes
Tag                 .belongsToMany(Author, { through: 'author_tags', timestamps: false });
Author              .belongsToMany(Tag, { through: 'author_tags', timestamps: false });
Tag                 .belongsToMany(Book, { through: 'book_tags', timestamps: false });
Book                .belongsToMany(Tag, { through: 'book_tags', timestamps: false });
Tag                 .belongsToMany(Note, { through: 'note_tags', timestamps: false });
Note                .belongsToMany(Tag, { through: 'note_tags', timestamps: false });