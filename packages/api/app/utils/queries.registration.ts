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
SELECT 
team, city, confirmed, waiting_list, paid
FROM registrations
WHERE 
  confirmed = true 
  OR waiting_list = true
ORDER BY confirmed DESC, position ASC`
}
