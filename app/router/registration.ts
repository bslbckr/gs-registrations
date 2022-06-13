import { RequestHandler, Router } from 'express';
import { execute } from '../utils/mysql.connector';
import { RegistrationQueries } from '../utils/queries.registration';

/*export interface IRegistrationData {
    readonly team: string;
    readonly city: string;
    readonly email: string;
    readonly contact: string;
    readonly strength: number;
    readonly comment: string;
}

export class RegistrationData {
    private _team: string;
    private _city: string;
    private _email: string;
    private _contact: string;
    private _strength: number;
    private _comment: string;
    constructor(input: IRegistrationData) {
        this._team = input.team;
        this._city = input.city;
        this._email = input.email;
        this._contact = input.contact;
        this._strength = input.strength;
        this._comment = input.comment;
    }
    get team() {
        return this._team;
    }
    get city() { return this._city; }
    get email() { return this._email; }
    get contact() { return this._contact; }
    get strength() { return this._strength; }
    get comment() { return this._comment; }

    get valid(): boolean {
        if (this._team && this._city && this._email && this._contact && this._strength && this._comment) {
            return true;
        }
        return false;
    }
}*/
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

registrationRouter.post('/api/registration', newRegistrationHandler);

