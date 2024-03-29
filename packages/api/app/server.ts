import * as dotenv from 'dotenv';
import express from 'express';
import { registrationRouter } from './router/registration';
import { backendRouter } from './router/backend';
import { init } from './utils/mysql.connector';
import * as path from 'path';
import multer from 'multer';
import morgan from 'morgan';
import helmet from 'helmet';
import { auth, claimCheck } from 'express-oauth2-jwt-bearer';

dotenv.config();

const server: express.Application = express();
const upload = multer();

init();
server.use(morgan('combined'));
server.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": [process.env.BASE_URL || 'localhost:8080', 'https://guc-backends-3wlox6.zitadel.cloud', 'https://api.zitadel.ch'],
            "font-src": ['https://fonts.gstatic.com', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/'],
            "style-src": ['https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', 'https://fonts.googleapis.com', "'self'", "'unsafe-inline'"],
            "style-src-elem": [process.env.BASE_URL || 'localhost:8080', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', "'unsafe-inline'"]
        },
        useDefaults: true
    }
}));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use('/api/backend',
    auth({ strict: false }),
    //claimEquals("urn:zitadel:iam:org:project:roles", "manager"),
    claimCheck(payload => {
        const roles = payload['urn:zitadel:iam:org:project:roles'];
        return roles !== null && typeof roles === 'object' && 'manager' in roles;
    }),
    backendRouter);
server.use('/', upload.none(), registrationRouter);
server.use('/api/backend', backendRouter);
server.use(express.static(path.join(__dirname, '../public')));
server.use('/backend/', (req, res) => {

    res.sendFile(path.resolve(path.join(__dirname, '../public/backend'), 'index.html'));
});
if (server.get('env') === 'production') {
    console.info("running in production, listening on 0.0.0.0:8080");
    server.listen(8080, "0.0.0.0");
} else {
    console.info("running in dev, lisening on localhost:8080");
    server.listen(8080);
}
