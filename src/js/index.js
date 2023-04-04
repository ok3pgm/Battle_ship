const DOM = {
    form: document.querySelector('.form-js'),
    fireButton: document.getElementById('fireButton'),
    input: document.getElementById('guessInput'),
    btnWelcome: document.querySelector('.welcome'),
    board: document.getElementById('board'),
    buttonReStart: document.querySelector('.buttonReStart-js')
}

let view = {
    displayMessage: function(msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(locationTD){
        let cell = document.getElementById(locationTD);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(locationTD){
        let cell = document.getElementById(locationTD);
        cell.setAttribute("class", "miss");
    }
};

const dataBase = {
    arrWithCorrectChar: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    arrWithCorrectNubmer: [0, 1, 2, 3, 4, 5, 6],
    boardSize: 7,
    numberOfShoot: 0,
    numberOfShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    arrWithLocationForShips: [],
    ships: [{location: ['', '', ''], hits: ['', '', '']},
            {location: ['', '', ''], hits: ['', '', '']},
            {location: ['', '', ''], hits: ['', '', '']},
],
}
const model = {

    reStart: function () {
            DOM.buttonReStart.style ='display: flex;';
            DOM.buttonReStart.addEventListener('click', function(e) {
            DOM.buttonReStart.style = 'display: none;';
            window.location.reload();
        })
    },

    checkNumberOfSunkShips: function() {
        if(dataBase.shipsSunk ===3) {
            setTimeout(() => {
                alert(`You win!!!
                Number of shoots fired ${dataBase.numberOfShoot}.
                Number of ships sunk 3.`);
                this.reStart();
            }, 1100);
        }
    },

    SecondGenerateShips: function() {
        let arr;
        for (let i = 0; i<dataBase.numberOfShips; i++) {
            do {
        arr = this.FirstGenerateShips()
        } while (this.checkOverlay(arr));
        dataBase.ships[i].location = arr;
        }
    },

    FirstGenerateShips: function() {
        let position = Math.floor(Math.random()*2);
        let arrWithLocation = [];
        for (let i=0; i<3; i++){
            let column = Math.floor(Math.random()*7);
            let row = Math.floor(Math.random()*7);
            if (column>dataBase.boardSize-3) {
                column = column -3;
            }
            if (row>dataBase.boardSize-3) {
                row = row -3;
            }
            let Firstlocation = column.toString()+row.toString();
            arrWithLocation.push(Firstlocation);
            if (position === 0) { //vertical
                let secondColumn = column+1;
                let thirdColumn = column+2;
                let SecondLocation = secondColumn.toString()+row.toString();
                let ThirdLocation = thirdColumn.toString()+row.toString();
                arrWithLocation.push(SecondLocation, ThirdLocation);
            } else { //horizontal
                let secondRow= row+1;
                let thirdRow = row+2;
                let SecondLocation = column.toString()+secondRow.toString();
                let ThirdLocation = column.toString()+thirdRow.toString();
                arrWithLocation.push(SecondLocation, ThirdLocation);
            }
            return arrWithLocation;
        }
    },
    checkOverlay: function(arr) {
        for (let i=0; i<dataBase.numberOfShips; i++) {
            let ship = dataBase.ships[i]
            for (let j=0; j<arr.length; j++) {
                if (ship.location.indexOf(arr[j])>=0) {
                    return true;
                } 
            }
        }
        return false;
    },

    checkTDBoard: function (res, column, row, columnTD) {
        let locationTD = columnTD.toString()+row.toString();
        for(let i =0; i<dataBase.numberOfShips; i++) {
            let ship = dataBase.ships[i];
            let index = ship.location.indexOf(res);
            if(index>=0){
                ship.hits[index]='hit';
                view.displayMessage("Hit");
                view.displayHit(locationTD);
                if(this.isSunk(ship)) {
                    view.displayMessage("You sunk my ship");
                    dataBase.shipsSunk +=1;
                    this.checkNumberOfSunkShips();
                }
                return true;
            }
        }
        view.displayMessage("Miss");
        view.displayMiss(locationTD);
    },

    isSunk: function (ship) {
        for (let i=0; i<dataBase.shipLength; i++) {
            if(ship.hits[i] !=='hit') {
                return false;
            }
        }
        return true;
    }
}

function checkCoords(currentValue) {
    let firstChar = currentValue.charAt(0);
    let column = firstChar;
    let row = +currentValue.charAt(1);
    let columnTD = dataBase.arrWithCorrectChar.indexOf(column);
    let TypeOfStringColumnTD =row.toString();
    let TypeOfStringRow =columnTD.toString();
    if ((dataBase.arrWithCorrectChar.indexOf(firstChar)>=0) && (dataBase.arrWithCorrectNubmer.indexOf(row)>=0)) {
        dataBase.numberOfShoot++;
        let res= TypeOfStringColumnTD+TypeOfStringRow;
        model.checkTDBoard(res, column, row, columnTD);
    } else {
        alert('Please, enter correct coords');
    }
    }

function getValueOnInput (e) {
    e.preventDefault();
    const currentValue = DOM.input.value;
    DOM.input.value = "";
    if (currentValue.length == 2 && currentValue !==null) {
        checkCoords(currentValue);
        const info = document.querySelector('.infoForUser');
        info.style = 'display: none;';
    } else {
        alert('Please, enter correct coords');
    }
}

function init() {  
    DOM.btnWelcome.addEventListener('click', function(e) {
        DOM.btnWelcome.style = 'display: none';
        board.style = 'display: block';
    })
    model.SecondGenerateShips();
    DOM.form.addEventListener('submit', getValueOnInput);
}

window.onload = init();