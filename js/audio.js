function all() {
  // Variables
  const player = document.querySelector(".player");
  const arrowDown = document.querySelector(".cursore");
  const audio = document.querySelector(".audio audio");
  const selectTeam = document.querySelector(".team select");
  let h3 = document.querySelector(".record h3");
  let range = document.querySelector(".record input");
  let pauseBtn = document.querySelector(".play-pause");
  let nextBtn = document.getElementById("next");
  let prevBtn = document.getElementById("prev");

  // rules
  let allRecord = [];
  let index = 0;
  let audioPlay = false;
  let teamNum = 4;

  // Pattern for extracting Arabic letters
  const arabicPattern = /[\u0600-\u06FF]+/g; // for characters
  const arabicPattern2 = /[\u0600-\u065F\u066E-\u06FF]+/g; // without nums

  // Get team and reset state
  selectTeam.addEventListener("input", function () {
    teamNum = selectTeam.value;
    index = 0; // Reset index when team changes
    audioPlay = false; // Reset play state
    audio.pause(); // Stop any playing audio
    pauseBtn.querySelector("i").className = "fa-solid fa-play";
    getRecords();
  });

  // Fetch records from API
  async function getRecords() {
    try {
      const response = await fetch(
        `https://apidemo.runasp.net/api/Upload/${teamNum}`,
        { method: "GET" }
      );
      if (!response.ok) throw new Error("فشل الطلب");
      const data = await response.json();
      allRecord = data;
      await loadDurations();
      loadMusic();
      loadTable(data);
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
      h3.innerHTML = "لا يوجد تسجيلات";
      allRecord = [];
      loadTable([]);
    }
  }

  // Load audio durations
  async function loadDurations() {
    for (let i = 0; i < allRecord.length; i++) {
      if (allRecord[i].fileLink) {
        try {
          const duration = await getAudioDuration(allRecord[i].fileLink);
          allRecord[i].duration = duration;
        } catch (error) {
          console.error(`خطأ في تحميل مدة التسجيل ${i}:`, error);
          allRecord[i].duration = null;
        }
      }
    }
  }

  // Get audio duration
  function getAudioDuration(url) {
    return new Promise((resolve, reject) => {
      const tempAudio = new Audio(url);
      tempAudio.addEventListener("loadedmetadata", () => {
        resolve(tempAudio.duration);
        tempAudio.remove();
      });
      tempAudio.addEventListener("error", () => {
        reject(new Error("فشل تحميل الملف الصوتي"));
      });
    });
  }

  // Format duration to mm:ss or hh:mm:ss
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

  // Load music
  function loadMusic() {
    if (allRecord && allRecord[index] && allRecord[index].fileLink) {
      audio.src = allRecord[index].fileLink;
      const arabicWords = allRecord[index].fileLink.match(arabicPattern);
      h3.innerHTML = arabicWords ? arabicWords.join(" ") : "تسجيل بدون اسم";
      audio.load();
      updateTableActiveRow();
    } else {
      console.error("رابط الملف غير متاح");
      h3.innerHTML = "رابط غير متاح";
    }
  }

  // Play/pause audio
  function playing() {
    if (!audioPlay) {
      audio
        .play()
        .then(() => {
          pauseBtn.querySelector("i").className = "fa-solid fa-pause";
          audioPlay = true;
          updateTablePlayButtons();
          updateTableAnimations();
        })
        .catch((error) => {
          console.error("خطأ في تشغيل الصوت:", error);
        });
    } else {
      audio.pause();
      pauseBtn.querySelector("i").className = "fa-solid fa-play";
      audioPlay = false;
      updateTablePlayButtons();
      updateTableAnimations();
    }
  }

  // Next record
  function nextRecord() {
    index = index >= allRecord.length - 1 ? 0 : index + 1;
    loadMusic();
    audioPlay = false;
    playing();
  }

  // Previous record
  function prevRecord() {
    index = index <= 0 ? allRecord.length - 1 : index - 1;
    loadMusic();
    audioPlay = false;
    playing();
  }

  // Load table
  function loadTable(records) {
    let tbody = document.querySelector(".table tbody");
    tbody.innerHTML = "";
    if (records.length > 0) {
      let subjecName = document.createElement("p");
      subjecName.className = "subjecName";
      let arabicWords = records[0].fileLink.match(arabicPattern2);
      subjecName.innerText = arabicWords
        ? arabicWords.join(" ")
        : "تسجيل بدون اسم";
      tbody.appendChild(subjecName);
    }

    records.forEach((rec, i) => {
      let tr = document.createElement("tr");
      tr.dataset.index = i;
      let tdRec = document.createElement("td");
      let tdName = document.createElement("td");
      let tdPlay = document.createElement("td");
      let tdDuration = document.createElement("td");
      let tdAnimation = document.createElement("td");

      tdRec.innerText = "Dr.Shimaa";
      let arabicWords = rec.fileLink.match(arabicPattern);
      tdName.innerText = arabicWords ? arabicWords.join(" ") : "تسجيل بدون اسم";

      const playButton = document.createElement("i");
      playButton.className = "material-icons";
      playButton.innerText = i === index && audioPlay ? "pause" : "play_arrow";
      playButton.dataset.index = i;
      tdPlay.appendChild(playButton);

      tdDuration.innerText = rec.duration
        ? formatDuration(rec.duration)
        : "--:--";

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
      if (i === index) tr.classList.add("active");
      tbody.appendChild(tr);
    });

    // Remove previous event listeners to prevent duplicates
    const newTbody = tbody.cloneNode(true);
    tbody.parentNode.replaceChild(newTbody, tbody);
    tbody = newTbody;

    // Click listener for rows (excluding play button)
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

  // Update active row in table
  function updateTableActiveRow() {
    const rows = document.querySelectorAll(".table tbody tr");
    rows.forEach((row) => {
      row.classList.toggle("active", parseInt(row.dataset.index) === index);
    });
    updateTablePlayButtons();
    updateTableAnimations();
  }

  // Update table play buttons
  function updateTablePlayButtons() {
    const playButtons = document.querySelectorAll(".table tbody i");
    playButtons.forEach((button) => {
      const buttonIndex = parseInt(button.dataset.index);
      button.innerText =
        buttonIndex === index && audioPlay ? "pause" : "play_arrow";
    });
  }

  // Update table animations
  function updateTableAnimations() {
    const animations = document.querySelectorAll(
      ".table tbody .wave-animation"
    );
    animations.forEach((animation, i) => {
      animation.style.display = i === index && audioPlay ? "block" : "none";
    });
  }

  // Event listeners
  window.addEventListener("load", getRecords);
  pauseBtn.addEventListener("click", playing);
  nextBtn.addEventListener("click", nextRecord);
  prevBtn.addEventListener("click", prevRecord);

  // Update progress bar
  audio.addEventListener("timeupdate", () => {
    const initialTime = audio.currentTime;
    const finalTime = audio.duration;
    if (!isNaN(finalTime)) {
      range.value = (initialTime / finalTime) * 100;
    }
    timer();
  });

  // Range input for seeking
  range.addEventListener("input", (el) => {
    const percent = el.target.value;
    audio.currentTime = (percent / 100) * audio.duration;
  });

  // Timer update
  function timer() {
    let timer = document.querySelector(".currentTime");
    let currentTime = document.querySelector(".duration");
    let duration = audio.duration;
    let current = audio.currentTime;

    if (!isNaN(duration)) {
      let finalHours = Math.floor(duration / 3600);
      let finalMinutes = Math.floor((duration % 3600) / 60);
      let finalSeconds = Math.floor(duration % 60);
      if (finalSeconds < 10) finalSeconds = "0" + finalSeconds;
      if (finalMinutes < 10) finalMinutes = "0" + finalMinutes;
      timer.innerText = `${
        finalHours > 0 ? finalHours + ":" : ""
      }${finalMinutes}:${finalSeconds}`;

      let currentHours = Math.floor(current / 3600);
      let currentMinutes = Math.floor((current % 3600) / 60);
      let currentSeconds = Math.floor(current % 60);
      if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
      if (currentMinutes < 10) currentMinutes = "0" + currentMinutes;
      currentTime.innerText = `${
        currentHours > 0 ? currentHours + ":" : ""
      }${currentMinutes}:${currentSeconds}`;
    }
  }

  // Auto-play next record when current ends
  audio.addEventListener("ended", nextRecord);

  // Playback speed control
  const speedControl = document.getElementById("speedControl");
  speedControl.addEventListener("change", function () {
    audio.playbackRate = parseFloat(this.value);
  });

  // Prevent context menu on audio
  audio.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // Toggle player size
  let down = false;
  arrowDown.addEventListener("click", () => {
    player.classList = down ? "player" : "player smallPlayer";
    down = !down;
  });
}
all();

// Device detection
navigator.mediaDevices.enumerateDevices().then((devices) => {
  console.log(devices);
  console.log("devices--------");
});

navigator.mediaDevices.addEventListener("devicechange", () => {
  console.log("devicechange");
});
