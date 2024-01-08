const GAME_LENGTH = 10;
const MAIN_POKEMON_LIST = ['小智', '比克提尼', '水箭龜', '代歐奇希斯', '巨鉗蟹', '甲賀忍蛙', '皮卡丘',
    '阿爾宙斯', '洛奇亞', '哲爾尼亞斯', '烈空坐', '捷克羅姆', '萊希拉姆', '超夢', '滑滑小子', '路卡利歐',
    '達克萊伊', '雷吉奇卡斯', '噴火龍', '霹靂電球'
];
const TARGET_SECONDS = 10;

let currentQuestionIndex = 0;
let currentAns;
let currentQuestionChoices;
let timerId;
let score = 0;
let correctAnswersList = generateShuffleList(GAME_LENGTH);

innitGame();

function innitGame() {
    score = 0;
    currentQuestionIndex = 0;
    correctAnswersList = generateShuffleList(GAME_LENGTH);
    console.log(correctAnswersList);
    currentAns = correctAnswersList[currentQuestionIndex];
    currentQuestionChoices = pickFalseAns(currentAns);

    document.getElementById("game-container").style.display = "block";
    document.getElementById("end-game-message").style.display = "none";
    showButtons();
    hideAnswer();
    let answerMessage = document.getElementById("answer-message");
    answerMessage.innerText = "";
    updateImage(currentAns);
    updateButton(currentQuestionChoices);
    startTimer();
}

function updateAll() {
    let answerMessage = document.getElementById("answer-message");
    answerMessage.innerText = "";

    currentAns = correctAnswersList[currentQuestionIndex];
    currentQuestionChoices = pickFalseAns(currentAns);
    updateImage(currentAns);
    updateButton(currentQuestionChoices);
    startTimer();
}

function updateImage(pokemonName, showAnsImage) {
    let imageElement = document.getElementById("outputImage");

    if (showAnsImage) {
        imageElement.src = "assets/" + pokemonName + "_ans.png";
    } else {
        imageElement.src = "assets/" + pokemonName + ".png";
    }
}

function updateButton(currentQuestionChoices) {
    document.getElementById("button1").innerHTML = currentQuestionChoices[0];
    document.getElementById("button2").innerHTML = currentQuestionChoices[1];
    document.getElementById("button3").innerHTML = currentQuestionChoices[2];
}

function startTimer() {
    clearInterval(timerId);
    let startTime = new Date().getTime();
    timerId = setInterval(function () {
        timer(startTime);
    }, 1000);
}

function timer(startTime) {
    let currentTime = new Date().getTime();
    let diffSec = Math.round((currentTime - startTime) / 1000);
    let remainingTime = TARGET_SECONDS - diffSec;
    updateTimerDisplay(remainingTime);

    if (remainingTime <= 0) {
        clearInterval(timerId);
        updateTimerDisplay(0);
        checkAnswer(-1);
    }
}

function endTimer() {
    clearInterval(timerId);
    updateTimerDisplay(0);
}

function checkAnswer(selectedOption) {
    let answerMessage = document.getElementById("answer-message");
    let answerDisplay = document.getElementById("answer-display");
    let correctMessage = document.getElementById("correct-message");
    let incorrectMessage = document.getElementById("incorrect-message");

    if (selectedOption >= 0 && currentAns === currentQuestionChoices[selectedOption]) {
        correctMessage.innerText = "正確";
        correctMessage.style.color = "green";
        answerDisplay.style.color = "green";
        score += 10;
    } else {
        incorrectMessage.innerText = "錯誤";
        incorrectMessage.style.color = "red";
        answerDisplay.style.color = "red";
    }
    document.getElementById("score").innerText = score;
    transitionBetweenQuestions();
}

function transitionBetweenQuestions() {
    endTimer();
    setTimeout(function () {
        updateImage(currentAns, true);
        hideButtons();
        displayAnswer();
        updatePokemonName(currentAns);
    }, 0);
    updateProgressBar();
    setTimeout(function () {
        clearAnswerMessages(); // Clear and hide correct/incorrect messages
        nextQuestion();
    }, 2000);
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progress = ((currentQuestionIndex + 1) / GAME_LENGTH) * 100;
    progressBar.style.width = progress + '%';
}

function nextQuestion() {
    let answerMessage = document.getElementById("answer-message");
    answerMessage.innerText = "";

    currentQuestionIndex++;
    if (currentQuestionIndex >= GAME_LENGTH) {
        endGame();
    } else {
        showButtons();
        clearAnswerDisplay();
        updateAll();
    }
}

function endGame() {
    endTimer();
    hideGameContainer();
    displayEndMessage();
}

function displayEndMessage() {
    document.getElementById("end-game-message").style.display = "block";
    let endScore = document.getElementById("end-score");
    endScore.innerHTML = "本輪得分:" + score;
}

function hideGameContainer() {
    gameBody = document.getElementById("game-container");
    gameBody.style.display = "none";
}

function generateShuffleList() {
    let arrCopy = [...MAIN_POKEMON_LIST];
    shuffle(arrCopy);
    let sliced = arrCopy.slice(0, GAME_LENGTH);
    return sliced;
}

function pickFalseAns(currentAns) {
    let arrCopy = [...MAIN_POKEMON_LIST];
    let index = arrCopy.indexOf(currentAns);
    if (index > -1) {
        arrCopy.splice(index, 1);
    }
    shuffle(arrCopy);
    let sliced = arrCopy.slice(0, 2);
    let currentQuestionChoices = [currentAns, ...sliced];
    shuffle(currentQuestionChoices);
    return currentQuestionChoices;
}

function shuffle(arr) {
    let j, x, index;
    for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    }
    return arr;
}

function hideButtons() {
    document.getElementById("button1").style.display = "none";
    document.getElementById("button2").style.display = "none";
    document.getElementById("button3").style.display = "none";
}

function showButtons() {
    document.getElementById("button1").style.display = "block";
    document.getElementById("button2").style.display = "block";
    document.getElementById("button3").style.display = "block";
}

function displayAnswer() {
    let answerDisplay = document.getElementById("answer-display");
    answerDisplay.style.display = "block";
    answerDisplay.innerText = currentAns;
    answerDisplay.classList.add("error");
}

function hideAnswer() {
    let answerDisplay = document.getElementById("answer-display");
    answerDisplay.style.display = "none";
}

function clearAnswerDisplay() {
    let answerDisplay = document.getElementById("answer-display");
    answerDisplay.innerText = "";
}

function clearAnswerMessages() {
    let correctMessage = document.getElementById("correct-message");
    let incorrectMessage = document.getElementById("incorrect-message");

    correctMessage.innerText = "";
    incorrectMessage.innerText = "";

    correctMessage.style.color = "";
    incorrectMessage.style.color = "";
}

function updateTimerDisplay(seconds) {
    barRenderer(seconds);
    textRenderer(seconds);
}

function barRenderer(seconds) {
    let percent = (seconds / TARGET_SECONDS) * 100;
    $(".bar").css("width", percent + "%");
}

function textRenderer(seconds) {
    let sec = seconds % 60;
    let min = Math.floor(seconds / 60);
    min = min.toString().padStart(2, '0');
    sec = sec.toString().padStart(2, '0');
    $(".text").text(min + ":" + sec);
}
