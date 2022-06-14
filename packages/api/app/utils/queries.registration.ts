export const RegistrationQueries = {
    AddRegistration: `
INSERT INTO registrations 
  (team,
   city,
   strength,
   contact,
   email,
   comment,
   confirmed,
   paid)
VALUES
  (?, ?, ?, ?, ?, ?, false, false);
`,
    GetRegistrations: `
SELECT (team, city, paid) FROM registrations`
}
