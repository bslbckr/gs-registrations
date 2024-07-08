import { claimCheck } from 'express-oauth2-jwt-bearer';
import { execute } from '../utils/mysql.connector';
import { BackendQueries } from '../utils/queries.backend';
import { Handler, RequestHandler, Router } from 'express';

type DbResult = { id: number, team: string, city: string, strength: number, contact: string, email: string, comment: string, registration_date: string, confirmed: number, paid: number, waiting_list: number, position: number, division: string };
type JsonResult = { id: number, team: string, city: string, strength: number, contact: string, email: string, comment: string, registrationDate: string, confirmed: boolean, paid: boolean, waitingList: boolean, position: number, division: string };

export const backendRouter = Router();
const deleteRegistration: RequestHandler = (req, res, next) => { execute(BackendQueries.DeleteRegistration, [req.params['id']]); };
const confirmRegistration: RequestHandler = async (req, res, next) => {
    try {

        await execute(BackendQueries.ConfirmRegistration, [req.body.confirmed, req.params['id']]);
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};
const paidRegistration: RequestHandler = async (req, res, next) => {
    try {
        await execute(BackendQueries.PaidRegistration, [req.body.paid, req.params['id']]);
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};
const waitingRegistration: RequestHandler = async (req, res, next) => {
    try {
        console.dir(req.body);
        await execute(BackendQueries.WaitingRegistration, [req.body.waitingList, req.params['id']]);
        res.status(200).send();
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
};
const allRegistrations: RequestHandler = async (req, res, next) => {
    const result = await execute<DbResult[]>(BackendQueries.AllRegistrations, []);
    console.dir(result);
    const mapped = result.map<JsonResult>(r => {
        return {
            id: r.id,
            team: r.team,
            city: r.city,
            strength: r.strength,
            contact: r.contact,
            email: r.email,
            comment: r.comment,
            registrationDate: r.registration_date,
            confirmed: r.confirmed === 1,
            paid: r.paid === 1,
            waitingList: r.waiting_list === 1,
            position: r.position,
            division: r.division
        };
    });
    res.status(200).send(mapped);
};

const requireManagerRole: Handler =
    claimCheck(payload => {
        const roles = payload['resource_access'] as { [client: string]: { roles: string[] } };
        if (roles === null || typeof roles !== 'object') {
            return false;
        }
        return roles['gs_registration'].roles.includes('manager');
    });

backendRouter.delete('/registrations/:id', requireManagerRole, deleteRegistration);
backendRouter.post('/registrations/:id/confirm', requireManagerRole, confirmRegistration);
backendRouter.post('/registrations/:id/paid', requireManagerRole, paidRegistration);
backendRouter.post('/registrations/:id/waiting', requireManagerRole, waitingRegistration);
backendRouter.get('/registrations', allRegistrations);
