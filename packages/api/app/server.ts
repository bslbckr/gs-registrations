import express from 'express';
import { registrationRouter } from './router/registration';
import { init } from './utils/mysql.connector';
import * as path from 'path';
import multer from 'multer';
import morgan from 'morgan';

const server: express.Application = express();
const upload = multer();

init();
server.use(morgan('combined'));
server.use(express.urlencoded({ extended: false }));

server.use('/', upload.none(), registrationRouter);
server.use(express.static(path.join(__dirname, '../public')));

if (server.get('env') === 'production') {
    console.info("running in production, listening on 0.0.0.0:8080");
    server.listen(8080, "0.0.0.0");
} else {
    console.info("running in dev, lisening on localhost:8080");
    server.listen(8080);
}
