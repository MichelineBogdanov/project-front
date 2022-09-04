const requestURL = '/rest/players';
const requestURLForCount = '/rest/players/count';
const tableHead = ['id', 'Name', 'Title', 'Race', 'Profession', 'Level', 'Birthday', 'Banned'];
const races = ['DWARF', 'ELF', 'GIANT', 'HUMAN', 'ORC', 'TROLL', 'HOBBIT'];
const professions = ['CLERIC', 'DRUID', 'NAZGUL', 'PALADIN', 'ROGUE', 'SORCERER', 'WARLOCK', 'WARRIOR'];

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

function putDataInTableBody() {
    getDataFromSrc('GET', requestURL
        + '?pageNumber=0'
        + '&pageSize=' + getNumberOfPagesFromSelect())
        .then((data) => {
            for (let key in data) {
                let person = data[key];
                let row = addRow('accountTable');
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
            }
        });
}

function addRow(tableID) {
    let table = document.getElementById(tableID);
    let row = table.insertRow(table.rows.length);
    let length = table.rows.item(0).cells.length;
    for (let i = 0; i < length; i++) {
        row.insertCell(0);
    }
    return row;
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
    return list.options[list.selectedIndex].text;
}

function getCurrentPageFromPageList() {

}

const selectMenu = document.querySelector('select[id=countOfPlayersSelect]');
const div = document.querySelector('#someDiv');

selectMenu.onchange = function () {
    getDataFromSrc('GET', requestURL
        + '?pageNumber=0'
        + '&pageSize=' + getNumberOfPagesFromSelect())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    putDataInTableBody('GET', requestURL
        + '?pageNumber=0'
        + '&pageSize=' + getNumberOfPagesFromSelect());

}

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





