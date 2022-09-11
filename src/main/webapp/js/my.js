const requestURL = '/rest/players';
const requestURLForCount = '/rest/players/count';
const tableHead = ['id', 'Name', 'Title', 'Race', 'Profession', 'Level', 'Birthday', 'Banned', 'Edit', 'Delete'];
const races = ['DWARF', 'ELF', 'GIANT', 'HUMAN', 'ORC', 'TROLL', 'HOBBIT'];
const professions = ['CLERIC', 'DRUID', 'NAZGUL', 'PALADIN', 'ROGUE', 'SORCERER', 'WARLOCK', 'WARRIOR'];
const selectMenu = document.querySelector('select[id=countOfPlayersSelect]');
let pageNumber = 0;
const imgEditSrc = "img/edit.png";
const imgDeleteSrc = "img/delete.png";
const imgSaveSrc = "img/save.png";
const banned = ['false', 'true'];

//"main"
putDataInTableBody('GET', requestURL
    + '?pageNumber=0'
    + '&pageSize=' + getNumberOfPagesFromSelect());
createPageButtons();

function sendRequest(method, url, body = null) {
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

function createPageButtons() {
    let pagesButton = document.getElementById('pagesButton');
    let newButtons = [];
    sendRequest('GET', requestURLForCount)
        .then(data => {
            let countOfPages = data / getNumberOfPagesFromSelect();
            for (let i = 1; i <= countOfPages; i++) {
                let button = document.createElement('button');
                button.innerText = String(i);
                button.setAttribute('id', i - 1);
                button.setAttribute('onclick', 'pagesButtonClick(this);');
                if (i === 1) {
                    button.setAttribute('class', 'btn active');
                } else {
                    button.setAttribute('class', 'btn');
                }
                newButtons.push(button);
            }
            pagesButton.replaceChildren(...newButtons);
        });
}

function putDataInTableBody(method, url) {
    let tBody = document.getElementById('tableBody');
    let newTBody = [];
    sendRequest(method, url)
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
                addIconsToTable(row, 'Edit', imgEditSrc);
                addIconsToTable(row, 'Delete', imgDeleteSrc);
                newTBody.push(row);
            }
        });
    tBody.replaceChildren(...newTBody);
}

function addIconsToTable(row, name, src) {
    let img = document.createElement('img');
    img.src = src;
    img.setAttribute('onclick', 'img' + name + 'Click(this);');
    row.cells[tableHead.indexOf(name)].appendChild(img);
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

selectMenu.onchange = function () {
    putDataInTableBody('GET', requestURL
        + '?pageNumber=0'
        + '&pageSize=' + getNumberOfPagesFromSelect());
    createPageButtons();
    pageNumber = 0;
}

function pagesButtonClick(button) {
    let currentPage = document.getElementById(pageNumber);
    currentPage.className = "btn";
    putDataInTableBody('GET', requestURL
        + '?pageNumber=' + button.id
        + '&pageSize=' + getNumberOfPagesFromSelect());
    button.className += " active";
    pageNumber = button.id;
}

function imgEditClick(element) {
    element.src = imgSaveSrc;
    let elementRow = getElementRow(element);
    console.log(elementRow);
    getNeededElementAfterClickingTheRow(element, 9).hidden = true;
    let tdName = getNeededElementAfterClickingTheRow(element, 1);
    let tdTitle = getNeededElementAfterClickingTheRow(element, 2);
    let tdRace = getNeededElementAfterClickingTheRow(element, 3);
    let tdProfession = getNeededElementAfterClickingTheRow(element, 4);
    let tdBanned = getNeededElementAfterClickingTheRow(element, 7);
    const tdNameEdit = createInputField(tdName.innerText, 'nameEdit');
    const tdTitleEdit = createInputField(tdTitle.innerText, 'titleEdit');
    const tdRaceSelect = createSelect(races, tdRace.innerText, 'raceEdit');
    const tdProfessionSelect = createSelect(professions, tdProfession.innerText, 'professionEdit');
    const tdBannedSelect = createSelect(banned, tdBanned.innerText, 'bannedEdit');
    tdName.replaceChild(tdNameEdit, tdName.firstChild);
    tdTitle.replaceChild(tdTitleEdit, tdTitle.firstChild);
    tdRace.replaceChild(tdRaceSelect, tdRace.firstChild);
    tdProfession.replaceChild(tdProfessionSelect, tdProfession.firstChild);
    tdBanned.replaceChild(tdBannedSelect, tdBanned.firstChild);
    element.onclick = function () {
        const body = {
            name: tdNameEdit.value,
            title: tdTitleEdit.value,
            race: tdRaceSelect.value,
            profession: tdProfessionSelect.value,
            banned: tdBannedSelect.value
        }
        let id = getNeededTextAfterClickingTheRow(element, 0);
        sendRequest('POST', requestURL + '/' + id, body)
            .then(() => putDataInTableBody('GET', requestURL
                + '?pageNumber=' + pageNumber
                + '&pageSize=' + getNumberOfPagesFromSelect()));
        createPageButtons();
    };
}

function imgDeleteClick(element) {
    let id = getNeededTextAfterClickingTheRow(element, 0);
    sendRequest('DELETE', requestURL + '/' + id)
        .then(() => putDataInTableBody('GET', requestURL
            + '?pageNumber=' + pageNumber
            + '&pageSize=' + getNumberOfPagesFromSelect()));
    createPageButtons();
}

function getElementRow(element) {
    let index = $(element).closest('tr').index();
    let tBody = document.getElementById('tableBody');
    return tBody.rows[index];

}

function getNeededTextAfterClickingTheRow(element, column) {
    let row = getElementRow(element);
    return row.cells[column].innerText;
}

function getNeededElementAfterClickingTheRow(element, column) {
    let row = getElementRow(element);
    return row.cells[column];
}

function createInputField(value, id) {
    const input = document.createElement('input');
    input.id = id;
    input.type = 'text'
    input.value = value
    return input
}

function createSelect(options, selectedOption, id) {
    const select = document.createElement('select')
    select.id = id;
    for (let index = 0; index < options.length; index++) {
        const option = document.createElement('option')
        option.innerText = options[index];
        select.add(option);
        if (options[index] === selectedOption) {
            select.selectedIndex = index
        }
    }
    return select
}

/*function drawAccountCreator() {
    selectRace.innerHTML = (createSelect(races).innerHTML)
    selectProfession.innerHTML = (createSelect(professions).innerHTML)
    selectBanned.innerHTML = (createSelect(banned).innerHTML)
    document.getElementById('createAccountForm')
        .addEventListener('submit', submitForm);
}

function submitForm(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let body = {};
    formData.forEach((value, key) => {
        body[key] = value;
        if (key === 'birthday') {
            const birthday = document.getElementById("inputBirthday")
            body[key] = birthday.valueAsNumber
        }
    });
    sendRequest('POST', accountsURL, body)
        .then(() => putDataInTableBody('GET', requestURL
            + '?pageNumber=' + pageNumber
            + '&pageSize=' + getNumberOfPagesFromSelect()))
    clearInput()
}

function clearInput() {
    const formInput = document.querySelectorAll('#createAccountTable input');
    for (const input of formInput) {
        input.value = "";
    }
    const formSelect = document.querySelectorAll('#createAccountTable select');
    for (const select of formSelect) {
        select.selectedIndex = "0"
    }
}*/






