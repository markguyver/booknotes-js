import {DataTypes, Model} from 'sequelize';
import {Request, Response} from 'express';
import {sequelizeInstance} from '../../database';
import {respondWith500, respondWithContributionTypeNotFound, respondWithContributionTypesPayload} from '../helpers';