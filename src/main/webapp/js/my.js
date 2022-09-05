const requestURL = '/rest/players';
const requestURLForCount = '/rest/players/count';
const tableHead = ['id', 'Name', 'Title', 'Race', 'Profession', 'Level', 'Birthday', 'Banned'];
const races = ['DWARF', 'ELF', 'GIANT', 'HUMAN', 'ORC', 'TROLL', 'HOBBIT'];
const professions = ['CLERIC', 'DRUID', 'NAZGUL', 'PALADIN', 'ROGUE', 'SORCERER', 'WARLOCK', 'WARRIOR'];
const selectMenu = document.querySelector('select[id=countOfPlayersSelect]');
const div = document.querySelector('#someDiv');

function getDataFromSrc(method, url, body = null) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open(method, url);
        request.responseType = 'json';
        request.setRequestHeader('Content-Type', 'application/json');
        request.onload = () => {
            if (request.status >= 400) {
                reject(request.response);
            } else {
                resolve(request.response);
            }
        }
        request.onerror = () => {
            reject(request.response);
        }
        request.send(JSON.stringify(body));
    });
}

function createOfPageButtons() {
    getDataFromSrc('GET', requestURLForCount)
        .then(data => {
            let countOfPages = data / getNumberOfPagesFromSelect();
            for (let i = 1; i <= countOfPages; i++) {
                let button = document.createElement('button');
                button.innerText = String(i);
                document.body.appendChild(button);
            }
        });
}

function putDataInTableBody() {
    let tBody = document.getElementById('tableBody');
    let newTBody = [];
    getDataFromSrc('GET', requestURL
        + '?pageNumber=0'
        + '&pageSize=' + getNumberOfPagesFromSelect())
        .then((data) => {
            for (let key in data) {
                let person = data[key];
                let row = addRow(tBody);
                for (let key in person) {
                    for (let i = 0; i < tableHead.length; i++) {
                        if (tableHead[i].toLowerCase() === key.toLowerCase()) {
                            let cellText;
                            if (tableHead[i] === 'Birthday') {
                                cellText = transformBDay(person[key]);
                            } else {
                                cellText = document.createTextNode(person[key]);
                            }
                            row.cells[i].appendChild(cellText);

                        }
                    }
                }
                newTBody.push(row);
            }
        });
    tBody.replaceChildren(...newTBody);
}

function addRow(tableBody) {
    let newRow = document.createElement('tr');
    for (let i = 0; i < tableHead.length; i++) {
        let newCell = document.createElement('td');
        newRow.appendChild(newCell);
    }
    tableBody.appendChild(newRow);
    return newRow;
}

function transformBDay(day) {
    return document.createTextNode(new Date(day)
        .toLocaleString('en', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        }));
}

function getNumberOfPagesFromSelect() {
    let list = document.getElementById("countOfPlayersSelect");
    return list.options[list.selectedIndex].value;
}

function getCurrentPageFromPageList() {

}

selectMenu.onchange = function () {
    putDataInTableBody('GET', requestURL
        + '?pageNumber=0'
        + '&pageSize=' + getNumberOfPagesFromSelect());
    createOfPageButtons();
}

/*function countOfPageButtons() {
    let numberOfPagesFromSelect = getNumberOfPagesFromSelect();
    console.log(numberOfPagesFromSelect);
    let selectMenu = getCountOfPages();
    console.log(selectMenu);
    return Math.ceil(numberOfPagesFromSelect / selectMenu);
}*/

//"main"
getDataFromSrc('GET', requestURL)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
getDataFromSrc('GET', requestURL)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
getDataFromSrc('GET', requestURLForCount)
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
putDataInTableBody();
console.log(getNumberOfPagesFromSelect());





