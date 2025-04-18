let radio; // 用於選項的 radio 物件
let input; // 用於填空題的文字輸入框
let button; // 用於送出的按鈕
let result = ""; // 用於顯示結果的文字
let table; // 用於存放 CSV 資料
let currentQuestion = 0; // 當前題目的索引
let correctCount = 0; // 答對的題數
let wrongCount = 0; // 答錯的題數

function preload() {
  // 載入 CSV 檔案
  table = loadTable("questions.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#bde0fe");

  if (!table) {
    console.error("CSV 檔案未正確載入");
    noLoop();
    return;
  }
  console.log("CSV 檔案載入成功");

  // 建立選項 (多選題)
  radio = createRadio();
  radio.style('width', '200px');
  radio.style('font-size', '35px');
  radio.style('color', '#03045e');
  radio.position(windowWidth / 2 - 100, windowHeight / 2 - 50);

  // 建立文字輸入框 (填空題)
  input = createInput();
  input.style('font-size', '20px');
  input.position(windowWidth / 2 - 100, windowHeight / 2 - 50);
  input.hide(); // 預設隱藏，只有填空題時顯示

  // 建立按鈕
  button = createButton('下一題');
  button.style('font-size', '20px');
  button.position(windowWidth / 2 - 50, windowHeight / 2 + 50);
  button.mousePressed(nextQuestion);

  // 顯示第一題
  loadQuestion(currentQuestion);
}

function draw() {
  background("#bde0fe");

  // 繪製視窗框
  fill("#ffd6ff");
  noStroke();
  let rectWidth = windowWidth / 2;
  let rectHeight = windowHeight / 2;
  let rectX = (windowWidth - rectWidth) / 2;
  let rectY = (windowHeight - rectHeight) / 2;
  rect(rectX, rectY, rectWidth, rectHeight);

  // 顯示題目或測驗結果
  textSize(35);
  fill(0);
  textAlign(CENTER, CENTER);
  if (currentQuestion < table.getRowCount()) {
    let question = table.getString(currentQuestion, "question");
    text(question, rectX + rectWidth / 2, rectY + rectHeight / 4);
  } else {
    // 清空選項，避免顯示多餘的內容
    radio.html("");
    input.hide();

    // 顯示測驗結果
    text(`測驗結束！`, rectX + rectWidth / 2, rectY + rectHeight / 4);
    text(`答對題數: ${correctCount}`, rectX + rectWidth / 2, rectY + rectHeight / 2 - 20);
    text(`答錯題數: ${wrongCount}`, rectX + rectWidth / 2, rectY + rectHeight / 2 + 20);
  }
}

function loadQuestion(index) {
  // 清空選項
  radio.html("");
  input.hide(); // 預設隱藏文字框

  // 從 CSV 中載入題目和選項
  let question = table.getString(index, "question");
  let option1 = table.getString(index, "option1");
  let option2 = table.getString(index, "option2");
  let option3 = table.getString(index, "option3");
  let option4 = table.getString(index, "option4");

  // 判斷是否為填空題
  if (option1 === "" && option2 === "" && option3 === "" && option4 === "") {
    // 填空題
    input.show();
    input.value(""); // 清空輸入框
  } else {
    // 多選題
    input.hide();
    radio.option(option1, option1);
    radio.option(option2, option2);
    radio.option(option3, option3);
    radio.option(option4, option4);
  }
}

function nextQuestion() {
  if (currentQuestion < table.getRowCount()) {
    let correctAnswer = table.getString(currentQuestion, "answer"); // 從 CSV 中獲取正確答案

    if (input.elt.style.display !== "none") {
      // 填空題檢查答案
      let userAnswer = input.value().trim();
      if (userAnswer === correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
      input.value(""); // 清空輸入框
    } else {
      // 多選題檢查答案
      let selected = radio.value();
      if (selected === correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }

    // 前往下一題
    currentQuestion++;

    if (currentQuestion < table.getRowCount()) {
      loadQuestion(currentQuestion);
    } else {
      // 測驗結束，更新按鈕文字
      button.html("再試一次");
      button.mousePressed(restartQuiz);
    }
  }
}

function restartQuiz() {
  // 重置測驗
  currentQuestion = 0;
  correctCount = 0;
  wrongCount = 0;
  button.html("下一題");
  button.mousePressed(nextQuestion);
  loadQuestion(currentQuestion);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  radio.position(windowWidth / 2 - 100, windowHeight / 2 - 50);
  input.position(windowWidth / 2 - 100, windowHeight / 2 - 50);
  button.position(windowWidth / 2 - 50, windowHeight / 2 + 50);
}