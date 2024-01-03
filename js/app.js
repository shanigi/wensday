'use strict'
const MINE = 'MINE'
const EMPTY = 'EMPTY'
const FLAG = 'FLAG'

const MINE_IMG = '<img src="img/mine icon.png">'
const FLAG_IMG = '<img src="img/flag.png">'


// Model:
var gBoard
var gCell = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: true
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gLevel = {
    SIZE: 4,
    MINES: 2
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function initGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)

    var cells = document.querySelectorAll('.board td')
    cells.forEach(function (cell, index) {
        cell.addEventListener('click', function () {
            var i = Math.floor(index / gLevel.SIZE)
            var j = index % gLevel.SIZE
            onCellClicked(cell, i, j)
        })
        cell.addEventListener('contextmenu', function (event) {
            event.preventDefault()
            var i = Math.floor(index / gLevel.SIZE)
            var j = index % gLevel.SIZE
            onCellRightClicked(cell, i, j)

        })
    })
}

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            if ((i === 1 && j === 1) || (i === 2 && j === 2)) {
                cell.isMine = true
            }

            // cell.isMine = getRandomInt(0, gLevel.MINES)
            board[i][j] = cell
        }
    }
    console.table(board)
    return board
}

function renderBoard(board) {
    var cell = gBoard[i] && gBoard[i][j]
    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
            const cellContent = currCell.isMine ? 'MINE' : ''
            strHTML += `<td class="cell" onclick="onCellClicked(${i},${j})">${cellContent}</td>\n`
            if (cell && cell.isMine)
                strHTML += MINE_IMG
        }
        if (cell && cell.isMarked) {
            strHTML += FLAG_IMG
            cell.isShown = true
        }
        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(rowIdx, colIdx, board) {
    var minesAroundCount = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            if (board[i][j].isMine) minesAroundCount++
        }
    }
    return minesAroundCount
}

var board = buildBoard()
console.log(setMinesNegsCount(1, 2, board))


function onCellRightClicked(elCell, i, j) {
    var cell = gBoard[i] && gBoard[i][j]

    if (cell && cell.isShown) {
        return
    }
    cell.isMarked = !cell.isMarked

    if (cell.isMarked) {
        elCell.innerHTML = FLAG_IMG
        elCell.classList.add('mark')
    } else {
        elCell.innerHTML = ''
        elCell.classList.remove('mark')
    }
    gGame.markedCount += cell.isMarked ? 1 : -1

    console.log('check right click')
}

function onCellClicked(elCell, i, j) {
    if (!elCell) {
        console.error('Invalid cell element')
        return
    }
    var cell = gBoard[i] && gBoard[i][j]
    console.log('check after marked')

    if (cell && cell.isMarked) {
        return
    }
    else {
        if (cell && cell.isMine) {
            // alert('Game over')
            elCell.innerHTML = MINE_IMG
        } else if (cell && !cell.isMine) {
            cell.isShown = true
            cell.isMarked = true
            cell.minesAroundCount = setMinesNegsCount(i, j, gBoard)
            // renderBoard(gBoard)
            // elCell.innerHTML = minesAroundCount
            elCell.innerHTML = cell.minesAroundCount
        }
        console.log('check', cell.minesAroundCount)
    }
}


