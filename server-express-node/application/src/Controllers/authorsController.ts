import {Sequelize, DataTypes, Model} from 'sequelize';
import {Request, Response} from 'express';

const sequelize = new Sequelize('mysql://root:@booknotes-database:3306/marknotes');

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
    modelName: 'authors',
});

export const getAllAuthors = (request: Request, response: Response): Response => {
    Authors.findAll({order:[ ['last_name', 'ASC'], ['first_name', 'ASC'], ['middle_name', 'ASC'] ]}).then(results => {
        response.type('json');
        response.send({ Authors: results });
    });
    return response;
};

export const createNewAuthor = (request: Request, response: Response): Response => {

    // TODO Parse Request Body into Author Object

    Authors.create(request.body).then(() => {
        Authors.findOne({where: request.body}).then(result => {
            response.type('json');
            response.status(201);
            response.send({ Authors: [result] });
        });
    });
    return response;
};
