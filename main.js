//List of valid keys
const chars = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Enter', 'Backspace']
//Player score kept in array to calc avg score
let playerScore = []
//Game params
let date = new Date()
//Set seed for random number bases on date string
let seedString = "" + date.getDay() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ""
let seedSize = new Math.seedrandom(seedString)
let seedIndex = new Math.seedrandom(seedString)

let size = (Math.floor(seedSize()  * (7 - 3 + 1) + 3))
const letters = size
const attempts =  size
//Get random number and get set from game params

//USE THIS FOR CUSTOM WORDS
let index = Math.floor((seedIndex() * customWords[letters][1].length) + 0)
const set = customWords[letters][1]

//USE THIS FOR COMMON WORDS (include custom words here?)
// let index = Math.floor((seedIndex() * (commonWords.filter(_word => _word.length == size).length - 1)) + 0)
// const set = commonWords.filter(_word => _word.length == size)

//Randomly chose a word from the set
let word = [...set[index]]
word = word.map(_word => _word = _word.toUpperCase())

//Create empty table
const table = new Array(attempts)
//Select game div
const game = document.getElementById('game')
//End game selectors
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

//Create board based on game params
for(let i = 0; i < attempts; i++){
    //Set columns based on the number of letters
    table[i] = new Array(letters)
    //Create rows vased on the number of attempts
    let row = document.createElement('div');
    row.setAttribute('id', 'row'+i)
    row.setAttribute('class', 'row')
    //Create each cell in each col/row
    for(let j = 0; j < letters; j++){
        table[i][j] = null
        //Cell selectors
        let cell = document.createElement('div');
        cell.setAttribute('id', 'cell'+j)
        cell.setAttribute('class', 'cell')
        let p = document.createElement('p')
        p.setAttribute('id', 'text')
        p.setAttribute('class', 'blank')
        cell.appendChild(p).innerHTML = "X"
        row.appendChild(cell)
    }
    //Append each row as its created
    game.appendChild(row)
}

//Keep track of row for submission and player score
let row = 0

//Function to add letters to the guess
//Buttons will submit letters from the HTML side
const addLetter = (e) => {
    //Stop borwser from doing weird things
    e.preventDefault()
    //Get event key (works for button due to clever format)
    const letter = e.key
    //Check if letter/key is valid for submission
    if(chars.includes(letter)){
        //Handle backspace first for error handling
        if(letter == 'Backspace'){
            //If first cell/letter is empty
            if(table[row][0] == null){
                return
            } else {
                //Reset cell to appear as a char/letter delete
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
            //Check for empty cell to place letter
            for(let i = 0; i < letters; i++){
                //Make sure that a letter can be placed first
                if(table[row][i] == null && table[row][letters-1] == null && letter != 'Enter'){
                    //Add char/letter to cell/table
                    table[row][i] = letter.toUpperCase()
                    document.getElementById("row"+row).childNodes[i].childNodes[0].innerHTML = letter.toUpperCase()
                    document.getElementById("row"+row).childNodes[i].childNodes[0].setAttribute('class', 'show')
                    return
                }
                //Only if the last cell/letter is placed
                if(table[row][letters-1] != null){
                    switch(letter){
                        case 'Enter':
                            submitWord(row)
                            break
                        default:
                            break
                    }
                }
            }
        }
    } 
    //If letter/key is not valid
    else {
        alert('Not A Valid Character')
    }
}

//Function to submit guess
const submitWord = (_row) => {
    //Get the word/value that was guess
    let value = table[_row]
    //Create a new array to store each letter of the submitted word/guess for checking
    let guess = new Array(letters)
    //Compare correct letters to total letters for fast win detection
    let correct = 0
    //Only if a word is listed can it be checked to avoid wasteful guessing
    //Listed words include custom words and common English words
    if(set.includes(value.join('')) || commonWords.includes(value.join('').toLowerCase())){
        //Increase the overal row to start guessing in next row
        //Not to be confused with _row, which is the previous row
        row++
        //Check each letter fom the submission/guess
        for(let i = 0; i < value.length; i++){
            //Store values in temp for easier coding
            let temp = value[i]
            //If the word to guess does include the letter being guessed
            if(word.includes(temp)){
                //If the current position and letter match
                if(word[i] == temp){
                    //Add the letter to the guess and show it correct
                    guess[i] = [temp, 2]
                    document.getElementById('btn'+temp).style.backgroundColor = 'green'
                    correct++ //For the fast win detection
                    //If the letter is correct, but the same letter was guessed in the wrong position, remove the highlight
                    if(guess.filter(item => item.includes(temp)).length > 1 && word.filter(item => item == temp).length == 1){
                        let a = guess.filter(item => item.includes(temp) && item.includes(1))
                        guess[guess.indexOf(a[0])] = [temp, 0]
                    }
                } else {
                    //If there are more than 1 of that letter in the word to guess
                    if(word.some(item => item.includes(temp)) && word.filter(item => item == temp).length > 1){
                        guess[i] = [temp, 1]
                        document.getElementById('btn'+temp).style.backgroundColor = 'orange'
                    } 
                    //If there is only 1 of that letter in the word to guess
                    if(word.some(item => item.includes(temp)) && word.filter(item => item == temp).length == 1){
                        if(guess.some(item => item.includes(temp))){
                            guess[i] = [temp, 0]
                        } else {
                            guess[i] = [temp, 1]
                            document.getElementById('btn'+temp).style.backgroundColor = 'orange'
                        }
                    } 
                    
                    if(word.some(item => item.includes(temp)) && word.filter(item => item == temp).length <= 0){
                        //If that letter is not in the word to guess but somehow made it past the first if
                        guess[i] = [temp, 0]
                    }
                    


                }
            } else {
                //If that letter is not in the word to guess
                guess[i] = [temp, 0]
                document.getElementById('btn'+temp).style.backgroundColor = 'grey'
            }
        }
        //Fast win detection
        if(correct == letters){
            for(let i = 0; i < guess.length; i++){
                //Make sure all words are correct then highlight
                if(guess[i][1] == 2){
                    document.getElementById("row"+_row).childNodes[i].setAttribute('class', 'cell green')
                    document.getElementById("row"+_row).childNodes[i].childNodes[0].setAttribute('class', 'blank')
                }
            }
            //Show win game screen
            playerScore.push(_row + 1)
            gameover.style.display = 'block'
            win.style.display = 'block'
            score.innerHTML = 'Score: ' + playerScore[playerScore.length-1]
            avgScoreW.innerHTML = 'Average Score: ' + (playerScore.reduce(function(a, b) { return a + b; }, 0)/playerScore.length).toFixed(2)
        } else {
            //If the submission was on the last row but did not win
            if(_row == (attempts - 1)){
                //Show lose game screen
                playerScore.push(_row + 1)
                gameover.style.display = 'block'
                lose.style.display = 'block'
                displayWord.innerHTML = 'Word: ' + word.join('')
                avgScoreL.innerHTML = 'Average Score: ' + (playerScore.reduce(function(a, b) { return a + b; }, 0)/playerScore.length).toFixed(2)
            }
            //If the submission did not work, highlight all the letteres to reflect the guess
            for(let i = 0; i < guess.length; i++){
                //Correct
                if(guess[i][1] == 2){
                    document.getElementById("row"+_row).childNodes[i].setAttribute('class', 'cell green')
                    document.getElementById("row"+_row).childNodes[i].childNodes[0].setAttribute('class', 'blank')
                }
                //Is in the word but no correct
                else if(guess[i][1] == 1){
                    document.getElementById("row"+_row).childNodes[i].setAttribute('class', 'cell orange')
                    document.getElementById("row"+_row).childNodes[i].childNodes[0].setAttribute('class', 'blank')
                } 
                //Is not in the word
                else {
                    document.getElementById("row"+_row).childNodes[i].setAttribute('class', 'cell grey')
                    document.getElementById("row"+_row).childNodes[i].childNodes[0].setAttribute('class', 'blank')
                }
            }
        }
    } else {
        //If the submission/guess was not found in the custom/common list
        const naw = document.getElementById('naw')
        naw.style.visibility = 'visible'
        naw.style.animationDuration = '1.5s'
        naw.style.animationName = 'slidein'
        setTimeout(()=>{
            naw.style.visibility = 'hidden'
            naw.style.animationDuration = '0s'
            naw.style.animationName = ''
        }, 1499)
    }
}

//Function to restart game and keep track of score
const playAgain = () => {
    //Reset game params
    row = 0

    //USE THIS FOR CUSTOM WORDS 
    // index = Math.floor((Math.random() * customWords[letters][1].length) + 0)
    // const newSet = customWords[letters][1]

    //USE THIS FOR COMMON WORDS (include custom words here?)
    index = Math.floor((Math.random() * (commonWords.filter(_word => _word.length == size).length - 1)) + 0)
    const newSet = commonWords.filter(_word => _word.length == size)

    word = [...newSet[index]]
    word = word.map(_word => _word = _word.toUpperCase())
    //Change visuals back to initial values
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

//Capture key events
document.addEventListener('keydown', () => addLetter(event))
