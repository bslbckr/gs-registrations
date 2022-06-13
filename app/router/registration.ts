import { RequestHandler, Router } from 'express';
import { execute } from '../utils/mysql.connector';
import { RegistrationQueries } from '../utils/queries.registration';

const checkContentType: RequestHandler = (req, res, next) => {
    if (req.is(["multipart/form-data", "application/x-www-form-urlencoded"])) {
        next();
    } else {
        res.status(400).send();
    }
};

const newRegistrationHandler: RequestHandler = async (req, res, next) => {
    try {
        await execute(RegistrationQueries.AddRegistration,
            [req.body['team'],
            req.body['city'],
            req.body['strength'],
            req.body['contact'],
            req.body['email'],
            req.body['comment']
            ]);
        res.status(200).send({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};

export const registrationRouter = Router();

registrationRouter.post('/api/registration', checkContentType, newRegistrationHandler);

