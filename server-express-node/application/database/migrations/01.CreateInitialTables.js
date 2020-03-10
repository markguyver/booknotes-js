const Sequelize = require('sequelize')
const tablesToCreate = {
    contribution_types: {},
    tags: {},
    authors: {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
        },
        first_name: {
            type: Sequelize.STRING(255),
        },
        middle_name: {
            type: Sequelize.STRING(255),
        },
        last_name: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        parent_author_id: {
            type: Sequelize.INTEGER.UNSIGNED,
        },
        created_at: {
            type: Sequelize.DATETIME,
            allowNull: false,
        },
        updated_at: {
            type: Sequelize.DATETIME,
            allowNull: false,
        },
        deleted_at: {
            type: Sequelize.DATETIME,
        },
    },
    author_tags: {
        author_id: {
            primaryKey: true,
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
        },
        tag_id: {
            primaryKey: true,
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    books: {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        created_at: {
            type: Sequelize.DATETIME,
            allowNull: false,
        },
        updated_at: {
            type: Sequelize.DATETIME,
            allowNull: false,
        },
        deleted_at: {
            type: Sequelize.DATETIME,
        },
    },
    book_authors: {
        book_id: {
            primaryKey: true,
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
        },
        author_id: {
            primaryKey: true,
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
        },
        contribution_type_id: {
            primaryKey: true,
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
        },
        order: {
            type: Sequelize.INTEGER.UNSIGNED,
        },
    },
    book_tags: {
        book_id: {
            primaryKey: true,
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
        },
        tag_id: {
            primaryKey: true,
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    notes: {},
    note_tags: {},
};

export default {
    up: async query => {
        Object.keys(tablesToCreate).map(currentTableToCreate => {
            await query.createTable(currentTableToCreate, tablesToCreate[currentTableToCreate]);
        });
    },
    down: async query => {
        Object.keys(tablesToCreate).map(currentTableToCreate => {
            await query.dropTable(currentTableToCreate);
        });

    },
};