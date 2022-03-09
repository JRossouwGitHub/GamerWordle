const chars = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Enter', 'Backspace']
let playerScore = []
const letters = 10
const attempts = 5
let index = Math.floor((Math.random() * words[letters][1].length) + 0)
const set = words[letters][1]
let word = [...set[index]]
const table = new Array(attempts)
const game = document.getElementById('game')
const gameover = document.getElementById('gameover')
gameover.addEventListener('click', function(){
    gameover.style.display = 'none'
    win.style.display = 'none'
    lose.style.display = 'none'
})
const win = document.getElementById('win')
const lose = document.getElementById('lose')
const score = document.getElementById('score')
const avgScoreW = document.getElementById('avgScoreW')
const avgScoreL = document.getElementById('avgScoreL')
const displayWord = document.getElementById('word')

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
                document.getElementById('btn'+value[i]).style.backgroundColor = 'green'
                correct++
            } else {
                // let temp = value[i]
                // if(guess.some(item => item.includes(temp)) && word.filter(item => item == temp).length <= 1){
                //     guess[i] = [temp, 0]
                // } else {
                //     guess[i] = [temp, 1]
                //     document.getElementById('btn'+temp).style.backgroundColor = 'orange'
                // }
                let temp = value[i]
                if(word.some(item => item.includes(temp)) && word.filter(item => item == temp).length > 1){
                    guess[i] = [temp, 1]
                    document.getElementById('btn'+temp).style.backgroundColor = 'orange'
                } else {
                    guess[i] = [temp, 0]
                }
            }
        } else {
            guess[i] = [value[i], 0]
            document.getElementById('btn'+value[i]).style.backgroundColor = 'grey'
        }
    }
    if(correct == letters){
        for(let i = 0; i < guess.length; i++){
            if(guess[i][1] == 2){
                document.getElementById("row"+_row).childNodes[i].setAttribute('class', 'cell green')
                document.getElementById("row"+_row).childNodes[i].childNodes[0].setAttribute('class', 'blank')
            }
        }
        playerScore.push(_row + 1)
        gameover.style.display = 'block'
        win.style.display = 'block'
        score.innerHTML = 'Score: ' + playerScore[playerScore.length-1]
        avgScoreW.innerHTML = 'Average Score: ' + (playerScore.reduce(function(a, b) { return a + b; }, 0)/playerScore.length).toFixed(2)
    } else {
        if(_row == 4){
            playerScore.push(_row + 1)
            gameover.style.display = 'block'
            lose.style.display = 'block'
            displayWord.innerHTML = 'Word: ' + word.join('')
            avgScoreL.innerHTML = 'Average Score: ' + (playerScore.reduce(function(a, b) { return a + b; }, 0)/playerScore.length).toFixed(2)
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
    index = Math.floor((Math.random() * words[letters][1].length) + 0)
    const newSet = words[letters][1]
    word = [...newSet[index]]
    for(let i = 0; i < table.length; i++){
        for(let j = 0; j < letters; j++){
            try{
                document.getElementById('btn'+table[i][j]).style.backgroundColor = 'white'
            } catch(e){
                null
            }
            table[i][j] = null
            document.getElementById("row"+i).childNodes[j].childNodes[0].innerHTML = 'X'
            document.getElementById("row"+i).childNodes[j].childNodes[0].setAttribute('class', 'blank')
            document.getElementById("row"+i).childNodes[j].setAttribute('class', 'cell')
        }
    }
}

document.addEventListener('keydown', () => addLetter(event))
