export const BackendQueries = {
    DeleteRegistration: `
DELETE FROM registrations WHERE ID = ?`,
    PaidRegistration: `
UPDATE registrations SET paid = ? WHERE id = ?`,
    ConfirmRegistration: `
UPDATE registrations SET confirmed = ? WHERE id = ?`,
    WaitingRegistration: `
UPDATE registrations SET waiting_list = ? WHERE id = ?`,
    AllRegistrations: `
SELECT id, team, city, strength, contact, email, comment, registration_date, confirmed, paid, waiting_list, position, division FROM registrations`
};
