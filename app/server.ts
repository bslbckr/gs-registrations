import express from 'express';
import { registrationRouter } from './router/registration';
import { init } from './utils/mysql.connector';
import * as path from 'path';
import multer from 'multer';

const server: express.Application = express();
const upload = multer();

init();
server.use(express.urlencoded({ extended: false }));

server.use('/', upload.none(), registrationRouter);
server.use(express.static(path.join(__dirname, '../public')));
server.listen(8080);
