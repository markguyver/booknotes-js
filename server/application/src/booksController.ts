import {Sequelize} from 'sequelize';

var sequelize = new Sequelize('mysql://root:@booknotes-database:3306/booknotes');

enum eBookType {
    Fiction = 'Fiction',
    NonFiction = 'Non-Fiction',
    InspiredFiction = 'Fiction based on Fact'
};

interface iBook {
    title: string;
    type: eBookType;
};

const Books = sequelize.define('books', {
    title: {
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.ENUM('Fiction','Non-Fiction','Fiction based on Fact'),
    },
    published_date: {
        type: Sequelize.DATE,
    },
    edition: {
        type: Sequelize.STRING,
    },
    possession_status: {
        type: Sequelize.ENUM('Owned','On Loan','Not Owned'),
    },
}, {});