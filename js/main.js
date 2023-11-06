const MARKERS = {
    '0': null,
    '1': 'X',
    '-1': 'COMPUTER',
}
const WINCOUNT = {
    '1': 0,
    '-1': 0
}

let board
let turn
let winner
let tieGame
let numRows = 3
let numCols = 3

const messageEl = document.querySelector('h1')
const playAgainBtn = document.querySelector('button')
const cellEls = document.querySelectorAll('.cell')

cellEls.forEach(cell => {
    cell.addEventListener('click', inputMarker)
})

playAgainBtn.addEventListener('click', () => {
    init()
})

init()

function init() {
    console.log(MARKERS[winner])
    board = [
        [0, 0, 0],  // col 0
        [0, 0, 0],  // col 1
        [0, 0, 0],  // col 2
    ]
    turn = 1
    winner = null
    render()
    renderEls()
}

function inputMarker(e) {
    const cellElement = e.target
    const [colIdx, rowIdx] = cellElement.id.match(/\d+/g).map(Number)
    if (board[colIdx][rowIdx] !== 0 || winner) return
    board[colIdx][rowIdx] = turn
    turn *= -1
    tieGame = catsGame()
    checkWin(colIdx, rowIdx)
    render()
    cellElement.classList.remove('cell-hover')
    setTimeout(computerMove, 450)
}

function computerMove() {
    if (!winner && turn === -1) {
        for (let colIdx = 0; colIdx < numCols; colIdx++) {
            for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
                if (board[colIdx][rowIdx] === 0) {
                    board[colIdx][rowIdx] = -1
                    turn *= -1
                    tieGame = catsGame()
                    checkWin(colIdx, rowIdx)
                    render()
                    const cellElement = document.getElementById(`c${colIdx}r${rowIdx}`)
                    cellElement.classList.remove('cell-hover')
                    return
                }
            }
        }
    }
}

function checkWin(colIdx, rowIdx) {
    if (checkVerticalWin(colIdx, rowIdx) 
    || checkHorizontalWin(colIdx, rowIdx) 
    || checkDiagonalWin(colIdx, rowIdx)) {
        winner = board[colIdx][rowIdx]
        if (winner !== null) {
            WINCOUNT[winner]++ 
        }
    }
}

function catsGame() {
    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
            if (board[i][j] === 0) {
                return false
            }
        }
    }
    return true
}

function checkVerticalWin(colIdx, rowIdx) {
    const player = board[colIdx][rowIdx]
    for (let i = 0; i < numCols; i++) {
        if (board[i][rowIdx] !== player) return false
    }
    return true
}

function checkHorizontalWin(colIdx, rowIdx) {
    const player = board[colIdx][rowIdx]
    for (let i = 0; i < numRows; i++) {
        if (board[colIdx][i] !== player) return false
    }
    return true
}

function checkDiagonalWin(colIdx, rowIdx) {
    const player = board[colIdx][rowIdx]
    if (board[0][0] === player 
        && board[1][1] === player 
        && board[2][2] === player) return true
    if (board[0][2] === player 
        && board[1][1] === player 
        && board[2][0] === player) return true
    return false
}

function render() {
    renderBoard()
    renderMessage()
}

function renderBoard() {
    board.forEach(function(colArr, colIdx) {
        colArr.forEach(function(cellVal, rowIdx) {
        const cellId = `c${colIdx}r${rowIdx}`
        const cellEl = document.getElementById(cellId)
        cellEl.innerHTML = cellVal === 1 ? '🙅‍♀️' : cellVal === -1 ? '🙆‍♂️' : ''
        })
    })
}

function renderMessage() {
    if (winner) {
        messageEl.innerHTML = `${MARKERS[winner]} Wins! 🙅‍♀️: ${WINCOUNT['1']} 🙆‍♂️: ${WINCOUNT['-1']}`
    } else if (tieGame){ 
        messageEl.innerHTML = "🐱 It's a tie! 🐱"
    } else {
        messageEl.innerHTML = `${MARKERS[turn]}'s Turn`
    }
}

function renderEls() {
    messageEl.innerHTML = "X's Turn"
    cellEls.forEach(cell => {
        cell.classList.add('cell-hover')
    })
}

cellEls.forEach(cell => {
    cell.addEventListener('mouseenter', () => {
        if (turn === 1 
            && cell.classList.contains('cell-hover') 
            && !winner) {
            cell.innerHTML = '🙅‍♀️'
        } else if (turn === -1 
            && cell.classList.contains('cell-hover') 
            && !winner) {
            cell.innerHTML = ''
        } 
    })

    cell.addEventListener('mouseleave', () => {
        if (turn === 1 
            && cell.innerHTML === '🙅‍♀️' 
            && cell.classList.contains('cell-hover') 
            && !winner) {
            cell.innerHTML = ''
        }
    })
})