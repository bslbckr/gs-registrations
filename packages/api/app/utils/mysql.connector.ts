import { createPool, Pool } from 'mysql';

let pool: Pool;
export const init = () => {
    try {
        pool = createPool({
            host: "localhost",
            user: "guc",
            password: "guc",
            database: "guc_registrations"
        });
    } catch (error) {
        console.error(error);
        throw new Error('failed to initialize connection pool');
    }

};

export const execute = <T>(query: string, params: string[] | Object): Promise<T> => {
    try {
        if (!pool) {
            throw new Error('initialize pool first');
        }
        return new Promise<T>((resolve, reject) => {
            pool.query(query, params, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    } catch (error) {
        console.error(error);
        throw new Error('failed to execute mysql query');
    }
};
