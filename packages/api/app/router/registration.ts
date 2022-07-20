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
const getConfirmedRegistrationsHandler: RequestHandler = async (req, res, next) => {
    try {
        const regs = await execute<{ team: string, city: string, confirmed: number, waiting_list: number, paid: number }[]>(RegistrationQueries.GetRegistrations, []);
        const mapped = regs.map<{ team: string, city: string, paid: boolean, safeSpot: boolean, waitingList: boolean }>(r => {
            return {
                team: r.team,
                city: r.city,
                paid: r.paid === 1,
                safeSpot: r.confirmed === 1,
                waitingList: r.waiting_list === 1
            };
        });
        res.status(200).send(mapped);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};
export const registrationRouter = Router();

registrationRouter.post('/api/registration', checkContentType, newRegistrationHandler);

registrationRouter.get('/api/registration', getConfirmedRegistrationsHandler);
