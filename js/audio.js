console.log(allRecord[1]);
// var
// for show table records br arrow
const player = document.querySelector(".player");
const arrowDown = document.querySelector(".cursore");
//
const audio = document.querySelector(".audio audio");
let h3 = document.querySelector(".record h3");
let range = document.querySelector(".record input");
let pauseBtn = document.querySelector(".play-pause");
let nextBtn = document.getElementById("next");
let prevBtn = document.getElementById("prev");

// rules
let index = 0;
let audioPlay = false;
// giv src and name
window.addEventListener("load", loadMusic);
//
pauseBtn.addEventListener("click", playing);
//
nextBtn.addEventListener("click", () => {
  nextRecord();
  // playing();
  pauseBtn.click();
});
//
prevBtn.addEventListener("click", () => {
  prevRecord();
  // playing();
  pauseBtn.click();
});

function loadMusic() {
  audio.src = allRecord[index].src;
  h3.innerHTML = allRecord[index].name;
}
//
function playing() {
  if (!audioPlay) {
    audio.play();
    pauseBtn.querySelector("i").innerHTML = "pause";
    audioPlay = true;
  } else {
    audio.pause();
    pauseBtn.querySelector("i").innerHTML = "play_arrow";
    audioPlay = false;
  }
  console.log(audioPlay);
}

function nextRecord() {
  index++;
  index > allRecord.length - 1 ? (index = 0) : (index = index);
  loadMusic();
  console.log(index);
  audioPlay = true;
  playing();
}

function prevRecord() {
  index--;
  index < 0 ? (index = allRecord.length - 1) : (index = index);
  loadMusic();
  audioPlay = true;
  playing();
}

console.log(index);

// // Time
audio.addEventListener("timeupdate", (e) => {
  const initialTime = e.target.currentTime;
  const finalTime = e.target.duration;

  if (!isNaN(finalTime)) {
    // تحقق من أن finalTime ليس NaN
    let barWidth = (initialTime / finalTime) * 100;
    range.value = barWidth;
  }
  audio.addEventListener("loadeddata", timer());
});

// range
range.addEventListener("input", (el) => {
  // تحويل قيمة شريط التمرير من نسبة مئوية إلى ثوانٍ
  const percent = el.target.value; // قيمة الشريط (من 0 إلى 100)
  audio.currentTime = (percent / 100) * audio.duration; // تعيين الوقت الحالي بناءً على النسبة المئوية
});

function timer() {
  let Timer = document.querySelector(".currentTime");
  let duration = audio.duration;

  if (!isNaN(duration)) {
    let finalHours = Math.floor(duration / 3600);
    let finalMinutes = Math.floor(duration / 60);
    let finalSeconds = Math.floor(duration % 60);
    if (finalSeconds < 10) {
      finalSeconds = "0" + finalSeconds;
    }

    if (finalMinutes < 10) {
      finalMinutes = "0" + finalMinutes;
    }

    // Timer.innerText = finalMinutes + ":" + finalSeconds;
    Timer.innerText = `${
      finalHours > 0 ? finalHours + ":" : ""
    }${finalMinutes}:${finalSeconds}`;

    // Update current duration
    let currentTime = document.querySelector(".duration");
    let current = audio.currentTime;
    let currentHours = Math.floor(current / 3600);
    let currentMinutes = Math.floor(current / 60);
    let currentSeconds = Math.floor(current % 60);
    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }

    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }

    // currentTime.innerText = currentMinutes + ":" + currentSeconds;
    currentTime.innerText = `${
      currentHours > 0 ? currentHours + ":" : ""
    }${currentMinutes}:${currentSeconds}`;
  }
}

// Ai
audio.addEventListener("ended", () => {
  console.log("ended");
  nextBtn.click();
});

//

//  audio control
// const audio = document.getElementById("myAudio");
const speedControl = document.getElementById("speedControl");

speedControl.addEventListener("change", function () {
  audio.playbackRate = parseFloat(this.value);
  console.log(parseFloat(this.value));
  console.log(audio.playbackRate);
});

audio.addEventListener("contextmenu", (e) => {
  e.preventDefault(); // منع قائمة السياق
});

// new
// arrow showing recoeds table [arrowDown , player]

arrowDown.addEventListener("click", controlSize);

let down = false;
function controlSize() {
  if (down === false) {
    player.classList = "player smallPlayer";
    down = true;
  } else {
    player.classList = "player";
    down = false;
  }
}
