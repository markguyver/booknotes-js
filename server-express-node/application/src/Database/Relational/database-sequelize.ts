import {

    // Main Service Objects
    Sequelize,
    Model,
    DataTypes,
    Op,

    // Query Options Data Objects
    Includeable,
    WhereOptions,
    WhereAttributeHash,
    FindOptions,

    // Relationship General
    Association,

    // Relationship Mixins (Belongs To)
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    BelongsToCreateAssociationMixin,

    // Relationship Mixins (Belongs To Many)
    BelongsToManyGetAssociationsMixin,
    BelongsToManySetAssociationsMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyAddAssociationMixin,
    BelongsToManyCreateAssociationMixin,
    BelongsToManyRemoveAssociationMixin,
    BelongsToManyRemoveAssociationsMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyHasAssociationsMixin,
    BelongsToManyCountAssociationsMixin,

    // Relationship Mixins (Has Many)
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    HasManyAddAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyCreateAssociationMixin,
    HasManyRemoveAssociationMixin,
    HasManyRemoveAssociationsMixin,
    HasManyCountAssociationsMixin

} from 'sequelize';
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
export const insertWhereLikeFuzzyQueryOptionsAsFindOptions = (
    columnName: string,
    columnValue: string,
    queryOptions: FindOptions
): FindOptions => {
    const whereClause: WhereOptions = {};
    whereClause[columnName] = { [Op.like]: '%' + columnValue + '%' };
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

export class Author extends Model {
    public id!: number;
    public first_name!: string | null;
    public middle_name!: string | null;
    public last_name!: string;
    public parent_author_id!: number | null;

    public static associations: {
        ActualAuthor: Association<Author, Author>,
        Pseudonym: Association<Author, Author>,
        BookAuthor: Association<Author, BookAuthor>,
        Tag: Association<Author, Tag>,
    };

    public getActualAuthor!: BelongsToGetAssociationMixin<Author>;
    public setActualAuthor!: BelongsToSetAssociationMixin<Author, number>;
    public createActualAuthor!: BelongsToCreateAssociationMixin<Author>;

    public getPseudonyms!: HasManyGetAssociationsMixin<Author>;
    public setPseudonyms!: HasManySetAssociationsMixin<Author, number>;
    public addPseudonyms!: HasManyAddAssociationsMixin<Author, number>;
    public addPseudonym!: HasManyAddAssociationMixin<Author, number>;
    public createPseudonym!: HasManyCreateAssociationMixin<Author>;
    public removePseudonym!: HasManyRemoveAssociationMixin<Author, number>;
    public removePseudonyms!: HasManyRemoveAssociationsMixin<Author, number>;
    public countPseudonyms!: HasManyCountAssociationsMixin;

    public getBookAuthors!: HasManyGetAssociationsMixin<BookAuthor>;
    public setBookAuthors!: HasManySetAssociationsMixin<BookAuthor, number>;
    public addBookAuthors!: HasManyAddAssociationsMixin<BookAuthor, number>;
    public addBookAuthor!: HasManyAddAssociationMixin<BookAuthor, number>;
    public createBookAuthor!: HasManyCreateAssociationMixin<BookAuthor>;
    public removeBookAuthor!: HasManyRemoveAssociationMixin<BookAuthor, number>;
    public removeBookAuthors!: HasManyRemoveAssociationsMixin<BookAuthor, number>;
    public countBookAuthors!: HasManyCountAssociationsMixin;

    public getTags!: BelongsToManyGetAssociationsMixin<Tag>;
    public setTags!: BelongsToManySetAssociationsMixin<Tag, number>;
    public addTags!: BelongsToManyAddAssociationsMixin<Tag, number>;
    public addTag!: BelongsToManyAddAssociationMixin<Tag, number>;
    public createTag!: BelongsToManyCreateAssociationMixin<Tag>;
    public removeTag!: BelongsToManyRemoveAssociationMixin<Tag, number>;
    public removeTags!: BelongsToManyRemoveAssociationsMixin<Tag, number>;
    public hasTag!: BelongsToManyHasAssociationMixin<Tag, number>;
    public hasTags!: BelongsToManyHasAssociationsMixin<Tag, number>;
    public countTags!: BelongsToManyCountAssociationsMixin;
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

export class Book extends Model {
    public id!: number;
    public title!: string;

    public static associations: {
        BookAuthor: Association<Book, BookAuthor>,
        Note: Association<Book, Note>,
        Tag: Association<Book, Tag>,
    };

    public getBookAuthors!: HasManyGetAssociationsMixin<BookAuthor>;
    public setBookAuthors!: HasManySetAssociationsMixin<BookAuthor, number>;
    public addBookAuthors!: HasManyAddAssociationsMixin<BookAuthor, number>;
    public addBookAuthor!: HasManyAddAssociationMixin<BookAuthor, number>;
    public createBookAuthor!: HasManyCreateAssociationMixin<BookAuthor>;
    public removeBookAuthor!: HasManyRemoveAssociationMixin<BookAuthor, number>;
    public removeBookAuthors!: HasManyRemoveAssociationsMixin<BookAuthor, number>;
    public countBookAuthors!: HasManyCountAssociationsMixin;

    public getNotes!: HasManyGetAssociationsMixin<Note>;
    public setNotes!: HasManySetAssociationsMixin<Note, number>;
    public addNotes!: HasManyAddAssociationsMixin<Note, number>;
    public addNote!: HasManyAddAssociationMixin<Note, number>;
    public createNote!: HasManyCreateAssociationMixin<Note>;
    public removeNote!: HasManyRemoveAssociationMixin<Note, number>;
    public removeNotes!: HasManyRemoveAssociationsMixin<Note, number>;
    public countNotes!: HasManyCountAssociationsMixin;

    public getTags!: BelongsToManyGetAssociationsMixin<Tag>;
    public setTags!: BelongsToManySetAssociationsMixin<Tag, number>;
    public addTags!: BelongsToManyAddAssociationsMixin<Tag, number>;
    public addTag!: BelongsToManyAddAssociationMixin<Tag, number>;
    public createTag!: BelongsToManyCreateAssociationMixin<Tag>;
    public removeTag!: BelongsToManyRemoveAssociationMixin<Tag, number>;
    public removeTags!: BelongsToManyRemoveAssociationsMixin<Tag, number>;
    public hasTag!: BelongsToManyHasAssociationMixin<Tag, number>;
    public hasTags!: BelongsToManyHasAssociationsMixin<Tag, number>;
    public countTags!: BelongsToManyCountAssociationsMixin;
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

export class ContributionType extends Model {
    public id!: number;
    public name!: string;

    public static associations: {
        BookAuthor: Association<ContributionType, BookAuthor>,
    };

    public getBookAuthors!: HasManyGetAssociationsMixin<BookAuthor>;
    public setBookAuthors!: HasManySetAssociationsMixin<BookAuthor, number>;
    public addBookAuthors!: HasManyAddAssociationsMixin<BookAuthor, number>;
    public addBookAuthor!: HasManyAddAssociationMixin<BookAuthor, number>;
    public createBookAuthor!: HasManyCreateAssociationMixin<BookAuthor>;
    public removeBookAuthor!: HasManyRemoveAssociationMixin<BookAuthor, number>;
    public removeBookAuthors!: HasManyRemoveAssociationsMixin<BookAuthor, number>;
    public countBookAuthors!: HasManyCountAssociationsMixin;
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

export class BookAuthor extends Model {
    public book_id!: number;
    public author_id!: number;
    public contribution_type_id!: number;
    public order!: number | null;

    public static associations: {
        Author: Association<BookAuthor, Author>,
        Book: Association<BookAuthor, Book>,
        ContributionType: Association<BookAuthor, ContributionType>,
    };

    public getAuthor!: BelongsToGetAssociationMixin<Author>;
    public setAuthor!: BelongsToSetAssociationMixin<Author, number>;
    public createAuthor!: BelongsToCreateAssociationMixin<Author>;

    public getBook!: BelongsToGetAssociationMixin<Book>;
    public setBook!: BelongsToSetAssociationMixin<Book, number>;
    public createBook!: BelongsToCreateAssociationMixin<Book>;

    public getContributionType!: BelongsToGetAssociationMixin<ContributionType>;
    public setContributionType!: BelongsToSetAssociationMixin<ContributionType, number>;
    public createContributionType!: BelongsToCreateAssociationMixin<ContributionType>;
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

export class Note extends Model {
    public id!: number;
    public note!: string;
    public title!: string;
    public book_id!: number;

    public static associations: {
        Book: Association<Note, Book>,
        Tag: Association<Note, Tag>,
    };

    public getBook!: BelongsToGetAssociationMixin<Book>;
    public setBook!: BelongsToSetAssociationMixin<Book, number>;
    public createBook!: BelongsToCreateAssociationMixin<Book>;

    public getTags!: BelongsToManyGetAssociationsMixin<Tag>;
    public setTags!: BelongsToManySetAssociationsMixin<Tag, number>;
    public addTags!: BelongsToManyAddAssociationsMixin<Tag, number>;
    public addTag!: BelongsToManyAddAssociationMixin<Tag, number>;
    public createTag!: BelongsToManyCreateAssociationMixin<Tag>;
    public removeTag!: BelongsToManyRemoveAssociationMixin<Tag, number>;
    public removeTags!: BelongsToManyRemoveAssociationsMixin<Tag, number>;
    public hasTag!: BelongsToManyHasAssociationMixin<Tag, number>;
    public hasTags!: BelongsToManyHasAssociationsMixin<Tag, number>;
    public countTags!: BelongsToManyCountAssociationsMixin;
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

export class Tag extends Model {
    public id!: number;
    public tag!: string;

    public static associations: {
        Author: Association<Tag, Author>,
        Book: Association<Tag, Book>,
        Note: Association<Tag, Note>,
    };

    public getAuthors!: BelongsToManyGetAssociationsMixin<Author>;
    public setAuthors!: BelongsToManySetAssociationsMixin<Author, number>;
    public addAuthors!: BelongsToManyAddAssociationsMixin<Author, number>;
    public addAuthor!: BelongsToManyAddAssociationMixin<Author, number>;
    public createAuthor!: BelongsToManyCreateAssociationMixin<Author>;
    public removeAuthor!: BelongsToManyRemoveAssociationMixin<Author, number>;
    public removeAuthors!: BelongsToManyRemoveAssociationsMixin<Author, number>;
    public hasAuthor!: BelongsToManyHasAssociationMixin<Author, number>;
    public hasAuthors!: BelongsToManyHasAssociationsMixin<Author, number>;
    public countAuthors!: BelongsToManyCountAssociationsMixin;

    public getBooks!: BelongsToManyGetAssociationsMixin<Book>;
    public setBooks!: BelongsToManySetAssociationsMixin<Book, number>;
    public addBooks!: BelongsToManyAddAssociationsMixin<Book, number>;
    public addBook!: BelongsToManyAddAssociationMixin<Book, number>;
    public createBook!: BelongsToManyCreateAssociationMixin<Book>;
    public removeBook!: BelongsToManyRemoveAssociationMixin<Book, number>;
    public removeBooks!: BelongsToManyRemoveAssociationsMixin<Book, number>;
    public hasBook!: BelongsToManyHasAssociationMixin<Book, number>;
    public hasBooks!: BelongsToManyHasAssociationsMixin<Book, number>;
    public countBooks!: BelongsToManyCountAssociationsMixin;

    public getNotes!: BelongsToManyGetAssociationsMixin<Note>;
    public setNotes!: BelongsToManySetAssociationsMixin<Note, number>;
    public addNotes!: BelongsToManyAddAssociationsMixin<Note, number>;
    public addNote!: BelongsToManyAddAssociationMixin<Note, number>;
    public createNote!: BelongsToManyCreateAssociationMixin<Note>;
    public removeNote!: BelongsToManyRemoveAssociationMixin<Note, number>;
    public removeNotes!: BelongsToManyRemoveAssociationsMixin<Note, number>;
    public hasNote!: BelongsToManyHasAssociationMixin<Note, number>;
    public hasNotes!: BelongsToManyHasAssociationsMixin<Note, number>;
    public countNotes!: BelongsToManyCountAssociationsMixin;
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