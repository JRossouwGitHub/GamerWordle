const chars = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Enter', 'Backspace']
const word = ['H', 'E', 'L', 'L', 'O']
let playerScore = []
const letters = 5
const attempts = 5
const table = new Array(attempts)
const game = document.getElementById('game')
const gameover = document.getElementById('gameover')
gameover.addEventListener('click', function(){gameover.style.display = 'none'})
const win = document.getElementById('win')
const lose = document.getElementById('lose')
const score = document.getElementById('score')
const avgScore = document.getElementById('avgScore')

for(let i = 0; i < attempts; i++){
    table[i] = new Array(letters)
    let row = document.createElement('div');
    row.setAttribute('id', 'row'+i)
    row.setAttribute('class', 'row')
    for(let j = 0; j < letters; j++){
        table[i][j] = null
        let cell = document.createElement('div');
        cell.setAttribute('id', 'cell'+j)
        cell.setAttribute('class', 'cell')
        let p = document.createElement('p')
        p.setAttribute('id', 'text')
        p.setAttribute('class', 'blank')
        cell.appendChild(p).innerHTML = "X"
        row.appendChild(cell)
    }
    game.appendChild(row)
}

let row = 0
const addLetter = (e) => {
    e.preventDefault()
    const letter = e.key
    if(chars.includes(letter)){
        if(letter == 'Backspace'){
            if(table[row][0] == null){
                console.log('Cannot remove 0 characters')
                return
            } else {
                for(let i = letters; i >= 0; i--){
                    if(table[row][i] != null){
                        table[row][i] = null
                        document.getElementById("row"+row).childNodes[i].childNodes[0].setAttribute('class', 'blank')
                        break
                    }
                }
            }
        }
        else{
            for(let j = 0; j < letters; j++){
                if(table[row][j] == null && table[row][letters-1] == null && letter != 'Enter'){
                    table[row][j] = letter.toUpperCase()
                    document.getElementById("row"+row).childNodes[j].childNodes[0].innerHTML = letter.toUpperCase()
                    document.getElementById("row"+row).childNodes[j].childNodes[0].setAttribute('class', 'show')
                    return
                }
                if(table[row][letters-1] != null){
                    switch(letter){
                        case 'Enter':
                            submitWord(row)
                            row++
                            break
                        default:
                            console.log('Nothing happened')
                            break
                    }
                }
            }
        }
    } else {
        alert('Not A Valid Character')
    }
}

const submitWord = (_row) => {
    let value = table[_row]
    let guess = new Array(letters)
    let correct = 0
    for(let i = 0; i < value.length; i++){
        if(word.includes(value[i])){
            if(word[i] == value[i]){
                guess[i] = [value[i], 2]
                correct++
            } else {
                let temp = value[i]
                console.log(word.filter(item => item == value[i]).length)
                if(guess.some(item => item.includes(temp)) && word.filter(item => item == value[i]).length <= 1){
                    guess[i] = [value[i], 0]
                } else {
                    guess[i] = [value[i], 1]
                }
            }
        } else {
            guess[i] = [value[i], 0]
        }
    }
    if(correct == letters){
        for(let i = 0; i < guess.length; i++){
            if(guess[i][1] == 2){
                document.getElementById("row"+_row).childNodes[i].setAttribute('class', 'cell green')
                document.getElementById("row"+_row).childNodes[i].childNodes[0].setAttribute('class', 'blank')
            }
        }
        gameover.style.display = 'block'
        win.style.display = 'block'
        playerScore.push(_row + 1)
        score.innerHTML = 'Score: ' + playerScore[playerScore.length-1]
        avgScore.innerHTML = 'Average Score: ' + (playerScore.reduce(function(a, b) { return a + b; }, 0)/playerScore.length).toFixed(2)
    } else {
        if(_row == 4){
            gameover.style.display = 'block'
            lose.style.display = 'block'
            playerScore.push(_row + 1)
            avgScore.innerHTML = 'Average Score: ' + (playerScore.reduce(function(a, b) { return a + b; }, 0)/playerScore.lengths).toFixed(2)
        }
        for(let i = 0; i < guess.length; i++){
            if(guess[i][1] == 2){
                document.getElementById("row"+_row).childNodes[i].setAttribute('class', 'cell green')
                document.getElementById("row"+_row).childNodes[i].childNodes[0].setAttribute('class', 'blank')
            }
            else if(guess[i][1] == 1){
                document.getElementById("row"+_row).childNodes[i].setAttribute('class', 'cell orange')
                document.getElementById("row"+_row).childNodes[i].childNodes[0].setAttribute('class', 'blank')
            } else {
                document.getElementById("row"+_row).childNodes[i].setAttribute('class', 'cell grey')
                document.getElementById("row"+_row).childNodes[i].childNodes[0].setAttribute('class', 'blank')
            }
        }
    }
}

const playAgain = () => {
    row = 0
    for(let i = 0; i < table.length; i++){
        for(let j = 0; j < letters; j++){
            table[i][j] = null
            document.getElementById("row"+i).childNodes[j].childNodes[0].innerHTML = 'X'
            document.getElementById("row"+i).childNodes[j].childNodes[0].setAttribute('class', 'blank')
            document.getElementById("row"+i).childNodes[j].setAttribute('class', 'cell')
        }
    }
}

document.addEventListener('keydown', () => addLetter(event))
