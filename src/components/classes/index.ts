import { Class } from '@src/models/Class';
import { container } from 'tsyringe';
import { ClassesService } from './classes.services';
import { Router } from 'express';

const router = Router();

container.register('classesRepository', Class);
container.register('classesService', ClassesService);
