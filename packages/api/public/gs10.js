(function() {
    function postIfValid(event) {
        event.preventDefault();
        var formElement = document.querySelector('main > section > div#formContainer > form');
        var isFormValid = formElement.checkValidity();
        if (isFormValid) {
            submitRegistration();
        }
    }

    window.submitRegistration = function() {
        var formElement = document.querySelector('main > section > div#formContainer > form');
        
        var data = new FormData(formElement);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "api/registration");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var responseObject = JSON.parse(xhr.responseText);
                    var formContainer = document.getElementById('formContainer');
                    if (responseObject.success) {
                        formContainer.innerHTML = "<div class='alert alert-success'><h3>Received registration!</h3></div>";
                    } else {
                        var div = document.createElement('div');
                        div.className = 'alert alert-warning';
                        div.innerHTML = '<strong>Oups</strong> something went wrong';
                        
                        formContainer.insertAdjacentElement('beforeend',div);
                    }
                }
            }
        };
        xhr.send(data);
    };


    
    function loadTeams() {
        function createTeamListTable() {
            var leTable = document.createElement('table');
            leTable.className = 'table';
            var tableHeader = leTable.createTHead();
            ['Team','City','paid'].forEach(function(x) {
                var cell = document.createElement('td');
                cell.appendChild(document.createTextNode(x));
                tableHeader.appendChild(cell);
            });
            return leTable;
        }

        function insertTeamRow(table, team) {
            var row = table.insertRow();
            row.insertCell().appendChild(document.createTextNode(team.team));
            row.insertCell().appendChild(document.createTextNode(team.city));
            var span = document.createElement('span');
            span.className= team.paid && team.paid === true ? 'glyphicon glyphicon-check' : 'glyphicon glyphicon-unchecked';
            row.insertCell().appendChild(span);
        }

        function insertTable(teams, section) {

            if (teams && teams.length && teams.length > 0) {
                var leTable = createTeamListTable();
                var insertIntoTeamTable = insertTeamRow.bind(this, leTable);
                teams.filter(function(team) {return team.safeSpot === true;})
                    .forEach(insertIntoTeamTable);

                section.appendChild(leTable);

                var waitingListHeader = document.createElement('h4');
                waitingListHeader.appendChild(document.createTextNode('Waiting list'));
                var waitingListTable = createTeamListTable();
                var waitingListFilled = false;
                var insertIntoWaitingListTable = function(team) {
                    insertTeamRow(waitingListTable,team);
                    waitingListFilled = true;
                };

                teams.filter(function(team) { return team.waitingList === true;}).forEach(insertIntoWaitingListTable);

                if (waitingListFilled) {
                    section.appendChild(waitingListHeader);
                    section.appendChild(waitingListTable);
                }
            } else {
                section.appendChild(document.createElement('p').appendChild(document.createTextNode('TBA')));
            }
        };

        function splitTeamsByDivions(teams) {
            const buildDivisionHeader = (title) => {
                const divisionSection = document.createElement('h3');
                divisionSection.appendChild(document.createTextNode(title));
                return divisionSection;
            };
            if (teams && teams.length && teams.length > 0) {
                const grouping = Object.groupBy(teams, ({division}) => division);
                const section = document.getElementById('teamsSection');
                if (grouping.M) {
                    const mixedSection = buildDivisionHeader('Mixed');
                    section.appendChild(mixedSection);
                    insertTable(grouping.M, section);
                }
                if (grouping.W) {
                    const womenSection = buildDivisionHeader('Women');
                    section.appendChild(womenSection);
                    insertTable(grouping.W, section);
                }
                if (grouping.O) {
                    const openSection = buildDivisionHeader('Open');
                    section.appendChild(openSection);
                    insertTable(grouping.O, section);
                }
            }
        }
        
        fetch('/api/registration',
              { method:'GET',
                redirect:'follow',
                cache:'no-cache',
                mode:'cors'
              }).then(function(resp) {
                  if(resp.ok) {
                      return resp.json();
                  }
                  return [];
                  
              }).then(splitTeamsByDivions).catch(function(err){console.log(err);});
    }

    var bttn = document.getElementById('submitButton');
    bttn.addEventListener('click', postIfValid);
    loadTeams();
})();
