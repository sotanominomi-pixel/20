const clockDisplay = document.getElementById('clockDisplay');
const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const alarmSection = document.getElementById('alarmSection');
const alarmList = document.getElementById('alarmList');
const langSelect = document.getElementById('langSelect');

let isRunning = false;
let swStartTime, swInterval;
let alarms = [];
let language = "ja";

// 言語定義
const text = {
  ja: ["時計", "ストップウォッチ", "アラーム", "＋ アラーム追加"],
  en: ["Clock", "Stopwatch", "Alarm", "+ Add Alarm"]
};

// 言語切替
langSelect.addEventListener("change", () => {
  language = langSelect.value;
  document.getElementById("clockBtn").innerText = text[language][0];
  document.getElementById("stopwatchBtn").innerText = text[language][1];
  document.getElementById("alarmBtn").innerText = text[language][2];
  document.getElementById("addAlarmBtn").innerText = text[language][3];
});

// 時計
setInterval(() => {
  const now = new Date();
  clockDisplay.textContent = now.toLocaleTimeString(language === "ja" ? "ja-JP" : "en-US");
  checkAlarms();
}, 200);

// ストップウォッチ
document.getElementById('stopwatchBtn').addEventListener('click', () => {
  if (!isRunning) {
    isRunning = true;
    swStartTime = Date.now();
    stopwatchDisplay.style.display = "block";
    clockDisplay.style.display = "none";
    alarmSection.style.display = "none";
    document.querySelectorAll(".controls button").forEach(btn => btn.classList.remove("active"));
    stopwatchBtn.classList.add("active");

    swInterval = setInterval(() => {
      const elapsed = (Date.now() - swStartTime) / 1000;
      const min = Math.floor(elapsed / 60);
      const sec = Math.floor(elapsed % 60);
      const ms = Math.floor((elapsed % 1) * 10);
      stopwatchDisplay.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${ms}`;
    }, 100);
  }
});

// 時計ボタン
clockBtn.addEventListener('click', () => {
  isRunning = false;
  clearInterval(swInterval);
  stopwatchDisplay.style.display = "none";
  alarmSection.style.display = "none";
  clockDisplay.style.display = "block";
  setActive(clockBtn);
});

// アラームボタン
alarmBtn.addEventListener('click', () => {
  isRunning = false;
  clearInterval(swInterval);
  stopwatchDisplay.style.display = "none";
  clockDisplay.style.display = "none";
  alarmSection.style.display = "block";
  setActive(alarmBtn);
});

// アラーム追加
addAlarmBtn.addEventListener("click", () => {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  alarms.push({ time, active: true });
  renderAlarms();
});

// アラーム更新
function renderAlarms() {
  alarmList.innerHTML = "";
  alarms.forEach((alarm, i) => {
    const li = document.createElement("li");
    li.classList.add("alarm-item");

    li.innerHTML = `
      <span>${alarm.time}</span>
      <div class="switch ${alarm.active ? "on" : ""}" onclick="toggleAlarm(${i})">
        <div class="switch-circle"></div>
      </div>
    `;
    alarmList.appendChild(li);
  });
}

// アラームON/OFF
function toggleAlarm(i) {
  alarms[i].active = !alarms[i].active;
  renderAlarms();
}

// 発火判定
function checkAlarms() {
  const now = new Date();
  const current = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  alarms.forEach(a => {
    if (a.active && a.time === current) {
      alert(language === "ja" ? "アラーム！" : "Alarm!");
      a.active = false;
      renderAlarms();
    }
  });
}

// ボタン見た目
function setActive(btn) {
  document.querySelectorAll(".controls button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}
