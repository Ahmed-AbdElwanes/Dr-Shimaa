function all() {
  function blockDevTool() {
    // block dev tools
    document.addEventListener("contextmenu", function (event) {
      event.preventDefault(); // منع القائمة الافتراضية من الظهور
      alert("الضغط بالزر الأيمن ممنوع!"); // رسالة اختيارية
    });
    document.addEventListener("keydown", function (event) {
      // منع Ctrl + Shift + I
      if (event.ctrlKey && event.shiftKey && event.key === "I") {
        event.preventDefault();
        alert("فتح أدوات المطورين ممنوع!");
      }

      // منع Ctrl + Shift + C
      if (event.ctrlKey && event.shiftKey && event.key === "C") {
        event.preventDefault();
        alert("فحص العناصر ممنوع!");
      }

      // منع Ctrl + Shift + J
      if (event.ctrlKey && event.shiftKey && event.key === "J") {
        event.preventDefault();
        alert("فتح وحدة التحكم ممنوع!");
      }

      // منع F12
      if (event.key === "F12") {
        event.preventDefault();
        alert("فتح أدوات المطورين ممنوع!");
      }

      // منع Cmd + Option + I (لنظام Mac)
      if (event.metaKey && event.altKey && event.key === "i") {
        event.preventDefault();
        alert("فتح أدوات المطورين ممنوع!");
      }

      // منع Cmd + Option + C (لنظام Mac)
      if (event.metaKey && event.altKey && event.key === "c") {
        event.preventDefault();
        alert("فحص العناصر ممنوع!");
      }
    });
    // block dev tools
  }
  blockDevTool();

  // var
  const player = document.querySelector(".player");
  const arrowDown = document.querySelector(".cursore");
  const audio = document.querySelector(".audio audio");
  const selectTeam = document.querySelector(".team select");
  let h3 = document.querySelector(".record h3");
  let range = document.querySelector(".record input");
  let pauseBtn = document.querySelector(".play-pause");
  let nextBtn = document.getElementById("next");
  let prevBtn = document.getElementById("prev");
  let allRecord = [];
  let index = 0;
  let audioPlay = false;
  let teamNum = 1;

  // Pattern for extracting Arabic letters
  const arabicPattern = /[\u0600-\u06FF]+/g; // for characters
  const arabicPattern2 = /[\u0600-\u065F\u066E-\u06FF]+/g; // without nums

  // get team
  selectTeam.addEventListener("input", function () {
    console.log(selectTeam.value);
    teamNum = selectTeam.value;
    getRecords();
  });

  // contact with Api to get records data
  async function getRecords() {
    try {
      const response = await fetch(
        `https://apidemo.runasp.net/api/Upload/${teamNum}`,
        {
          method: "GET"
        }
      );
      console.log(teamNum);

      if (!response.ok) {
        throw new Error("فشل الطلب");
      }

      const data = await response.json();
      console.log("النتيجة:", data);
      allRecord = data;
      await loadDurations(); // تحميل مدة التسجيلات
      loadMusic();
      loadTable(data);
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
      h3.innerHTML = "لا يوجد تسجيلات";
    }
  }

  // load aduio Duration
  async function loadDurations() {
    for (let i = 0; i < allRecord.length; i++) {
      if (allRecord[i].fileLink) {
        try {
          const duration = await getAudioDuration(allRecord[i].fileLink);
          allRecord[i].duration = duration; // تخزين المدة في allRecord
        } catch (error) {
          console.error(`خطأ في تحميل مدة التسجيل ${i}:`, error);
          allRecord[i].duration = null; // في حالة الفشل
        }
      }
    }
  }

  // get Audio Duration
  function getAudioDuration(url) {
    return new Promise((resolve, reject) => {
      const tempAudio = new Audio(url);
      tempAudio.addEventListener("loadedmetadata", () => {
        const duration = tempAudio.duration;
        tempAudio.remove(); // إزالة العنصر بعد الاستخدام
        resolve(duration);
      });
      tempAudio.addEventListener("error", () => {
        reject(new Error("فشل تحميل الملف الصوتي"));
      });
    });
  }

  // تنسيق المدة إلى صيغة mm:ss أو hh:mm:ss
  function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return "--:--";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const paddedMinutes = minutes < 10 ? "0" + minutes : minutes;
    const paddedSeconds = secs < 10 ? "0" + secs : secs;
    return hours > 0
      ? `${hours}:${paddedMinutes}:${paddedSeconds}`
      : `${paddedMinutes}:${paddedSeconds}`;
  }

  // load Music
  function loadMusic() {
    if (allRecord && allRecord[index] && allRecord[index].fileLink) {
      audio.src = allRecord[index].fileLink;
      const namFromLink = allRecord[index].fileLink;
      const arabicWords = namFromLink.match(arabicPattern);
      h3.innerHTML = arabicWords ? arabicWords.join(" ") : "تسجيل بدون اسم";
      audio.load();
      updateTableActiveRow();
    } else {
      console.error("رابط الملف غير متاح");
      h3.innerHTML = "رابط غير متاح";
    }
  }

  // play/stop audio
  function playing() {
    if (!audioPlay) {
      audio
        .play()
        .then(() => {
          pauseBtn.querySelector("i").innerHTML = "pause";
          audioPlay = true;
          updateTablePlayButtons();
        })
        .catch((error) => {
          console.error("خطأ في تشغيل الصوت:", error);
        });
    } else {
      audio.pause();
      pauseBtn.querySelector("i").innerHTML = "play_arrow";
      audioPlay = false;
      updateTablePlayButtons();
    }
  }

  //  next Record
  function nextRecord() {
    index = index >= allRecord.length - 1 ? 0 : index + 1;
    loadMusic();
    audioPlay = false;
    playing();
  }

  // previes Record
  function prevRecord() {
    index = index <= 0 ? allRecord.length - 1 : index - 1;
    loadMusic();
    audioPlay = false;
    playing();
  }

  //  load Table
  function loadTable(records) {
    let tbody = document.querySelector(".table tbody");
    tbody.innerHTML = ""; // إفراغ الجدول قبل التحميل
    let subjecName = document.createElement("p");
    subjecName.className = "subjecName";
    let arabicWords = records[0].fileLink.match(arabicPattern2);
    subjecName.innerText = arabicWords
      ? arabicWords.join(" ")
      : "تسجيل بدون اسم";
    // subjecName.innerText = "بحري وجوي";
    tbody.appendChild(subjecName);

    records.forEach((rec, i) => {
      let tr = document.createElement("tr");
      tr.dataset.index = i; // تخزين الفهرس في الصف
      let tdRec = document.createElement("td");
      let tdName = document.createElement("td");
      let tdPlay = document.createElement("td"); // عمود زر التشغيل
      let tdDuration = document.createElement("td"); // عمود المدة
      let tdAnimation = document.createElement("td"); // عمود الأنيميشن

      tdRec.innerText = "Dr.Shimaa";
      let arabicWords = rec.fileLink.match(arabicPattern);
      tdName.innerText = arabicWords ? arabicWords.join(" ") : "تسجيل بدون اسم";

      // play/stop audio in table
      const playButton = document.createElement("i");
      playButton.className = "material-icons";
      playButton.innerText = i === index && audioPlay ? "pause" : "play_arrow";
      playButton.dataset.index = i;
      tdPlay.appendChild(playButton);

      // مدة التسجيل
      tdDuration.innerText = rec.duration
        ? formatDuration(rec.duration)
        : "--:--";

      // أنيميشن موجات صوتية
      const animationDiv = document.createElement("div");
      animationDiv.className = "wave-animation";
      animationDiv.style.display = i === index && audioPlay ? "block" : "none";
      for (let j = 0; j < 3; j++) {
        const bar = document.createElement("span");
        animationDiv.appendChild(bar);
      }
      tdAnimation.appendChild(animationDiv);

      tr.appendChild(tdRec);
      tr.appendChild(tdName);
      tr.appendChild(tdPlay);
      tr.appendChild(tdDuration);
      tr.appendChild(tdAnimation);
      if (i === index) tr.classList.add("active"); // تمييز الصف الحالي
      tbody.appendChild(tr);
    });

    // Click listener for rows
    tbody.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      if (row && row.dataset.index !== undefined && !e.target.closest("i")) {
        index = parseInt(row.dataset.index);
        loadMusic();
        audioPlay = false;
        playing();
      }
    });

    // Click listener for play buttons
    tbody.addEventListener("click", (e) => {
      if (e.target.tagName === "I" && e.target.dataset.index !== undefined) {
        const buttonIndex = parseInt(e.target.dataset.index);
        if (buttonIndex === index) {
          playing();
        } else {
          index = buttonIndex;
          loadMusic();
          audioPlay = false;
          playing();
        }
      }
    });
  }

  // Update the active row in the table
  function updateTableActiveRow() {
    const rows = document.querySelectorAll(".table tbody tr");
    rows.forEach((row, i) => {
      row.classList.toggle("active", parseInt(row.dataset.index) === index);
    });
    updateTablePlayButtons();
    updateTableAnimations();
  }

  // update Table Play Buttons
  function updateTablePlayButtons() {
    const playButtons = document.querySelectorAll(".table tbody i");
    playButtons.forEach((button) => {
      const buttonIndex = parseInt(button.dataset.index);
      button.innerText =
        buttonIndex === index && audioPlay ? "pause" : "play_arrow";
    });
  }

  // ubdate animation
  function updateTableAnimations() {
    const animations = document.querySelectorAll(
      ".table tbody .wave-animation"
    );
    animations.forEach((animation, i) => {
      animation.style.display = i === index && audioPlay ? "block" : "none";
    });
  }

  // Setting up events
  window.addEventListener("load", getRecords);
  pauseBtn.addEventListener("click", playing);
  nextBtn.addEventListener("click", nextRecord);
  prevBtn.addEventListener("click", prevRecord);

  // Update progress bar
  audio.addEventListener("timeupdate", (e) => {
    const initialTime = e.target.currentTime;
    const finalTime = e.target.duration;
    if (!isNaN(finalTime)) {
      let barWidth = (initialTime / finalTime) * 100;
      range.value = barWidth;
    }
    // ubdate time in win timeupdate
    audio.addEventListener("loadeddata", timer());
  });
  // listener loadeddata
  audio.addEventListener("loadeddata", timer()); // to add current time aut first

  // range tape
  range.addEventListener("input", (el) => {
    const percent = el.target.value;
    audio.currentTime = (percent / 100) * audio.duration;
  });

  // Timer
  function timer() {
    let Timer = document.querySelector(".currentTime");
    let duration = audio.duration;
    if (!isNaN(duration)) {
      let finalHours = Math.floor(duration / 3600);
      let finalMinutes = Math.floor(duration / 60);
      let finalSeconds = Math.floor(duration % 60);
      if (finalSeconds < 10) finalSeconds = "0" + finalSeconds;
      if (finalMinutes < 10) finalMinutes = "0" + finalMinutes;
      Timer.innerText = `${
        finalHours > 0 ? finalHours + ":" : ""
      }${finalMinutes}:${finalSeconds}`;

      let currentTime = document.querySelector(".duration");
      let current = audio.currentTime;
      let currentHours = Math.floor(current / 3600);
      let currentMinutes = Math.floor(current / 60);
      let currentSeconds = Math.floor(current % 60);
      if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
      if (currentMinutes < 10) currentMinutes = "0" + currentMinutes;
      currentTime.innerText = `${
        currentHours > 0 ? currentHours + ":" : ""
      }${currentMinutes}:${currentSeconds}`;
    }
  }

  // الانتقال إلى التسجيل التالي عند انتهاء الصوت
  audio.addEventListener("ended", () => {
    console.log("انتهى التسجيل");
    nextBtn.click();
  });

  // التحكم في سرعة التشغيل
  const speedControl = document.getElementById("speedControl");
  speedControl.addEventListener("change", function () {
    audio.playbackRate = parseFloat(this.value);
    console.log("سرعة التشغيل:", audio.playbackRate);
  });

  // منع قائمة السياق
  audio.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // التحكم في حجم المشغل
  let down = false;
  arrowDown.addEventListener("click", controlSize);
  function controlSize() {
    player.classList = down ? "player" : "player smallPlayer";
    down = !down;
  }
}
all();
