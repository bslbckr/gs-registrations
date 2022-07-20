import { createPool, Pool, PoolConfig } from 'mysql';

let pool: Pool;
function buildPoolConfig(): PoolConfig {
    const result: PoolConfig = {
        user: process.env.DB_USER || "guc",
        password: process.env.DB_PASSWORD || "guc",
        database: process.env.DB_NAME || "guc_registrations"
    };
    if (process.env.DB_SOCKET) {
        result.socketPath = process.env.DB_SOCKET;
    } else {
        result.host = process.env.DB_HOST || "localhost";
    }
    return result;
}
export const init = () => {
    try {
        pool = createPool(buildPoolConfig());
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
