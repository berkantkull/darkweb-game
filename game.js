(() => {
  "use strict";

  const STORAGE_KEY = "nullGameV6";
  const PREFS_KEY = "nullGamePrefsV1";
  const characters = window.GAME_CHARACTERS || [];
  const missions = window.GAME_MISSIONS || [];
  const cableLevels = window.CABLE_LEVELS || [];
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const defaultState = () => ({
    alias: "",
    characterId: null,
    started: false,
    currentMission: 1,
    completed: [],
    trace: 0,
    trust: 50,
    timeLeft: 720,
    maxTime: 720,
    binarySolved: false,
    cableLevel: 1,
    cableX: 0,
    cableY: 2,
    cablePath: [[0, 2]],
    bartenderUsed: false,
    geographerUsed: false,
    over: false
  });

  let state = defaultState();
  let selectedCharacterId = null;
  let timerId = null;
  let toastTimer = null;
  let audioContext = null;
  let prefs = loadPrefs();

  function character() {
    return characters.find((item) => item.id === state.characterId) || characters.find((item) => item.id === selectedCharacterId);
  }

  function loadPrefs() {
    try { return { sound: false, reducedMotion: false, ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") }; }
    catch { return { sound: false, reducedMotion: false }; }
  }

  function savePrefs() {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    document.body.classList.toggle("reduced-motion", prefs.reducedMotion);
  }

  function saveGame() {
    if (state.started && !state.over) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getSavedGame() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); }
    catch { return null; }
  }

  function playTone(type = "success") {
    if (!prefs.sound) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = type === "error" ? "sawtooth" : "sine";
      oscillator.frequency.value = type === "error" ? 155 : type === "step" ? 330 : 520;
      gain.gain.setValueAtTime(.05, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .16);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(); oscillator.stop(audioContext.currentTime + .17);
    } catch { /* Ses desteği yoksa oyun sessiz devam eder. */ }
  }

  function showToast(message, type = "success") {
    const toast = $("#toast");
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.style.borderColor = type === "error" ? "var(--danger)" : type === "info" ? "var(--info)" : "var(--accent)";
    toast.classList.remove("hidden");
    toastTimer = setTimeout(() => toast.classList.add("hidden"), 3200);
  }

  function showFeedback(message, type = "info") {
    const box = $("#missionFeedback");
    box.textContent = message;
    box.className = `feedback ${type}`;
  }

  function clearFeedback() {
    const box = $("#missionFeedback");
    box.textContent = "";
    box.className = "feedback hidden";
  }

  function renderCharacters() {
    const grid = $("#characterGrid");
    $("#characterCount").textContent = `${characters.length} OPERATÖR`;
    grid.innerHTML = characters.map((item) => `
      <button class="character-card ${selectedCharacterId === item.id ? "selected" : ""}" type="button" role="radio"
        aria-checked="${selectedCharacterId === item.id}" data-character="${item.id}">
        <span class="character-icon">${item.icon}</span>
        <span><strong>${item.name}</strong><small>${item.abilityName}</small><p>${item.abilityText}</p></span>
      </button>`).join("");

    $$("[data-character]").forEach((button) => button.addEventListener("click", () => selectCharacter(button.dataset.character)));
  }

  function selectCharacter(id) {
    selectedCharacterId = id;
    const item = characters.find((entry) => entry.id === id);
    renderCharacters();
    $("#selectedCharacter").innerHTML = `
      <span class="selected-icon">${item.icon}</span>
      <div><small>SEÇİLEN OPERATÖR</small><strong>${item.name}</strong><p><b>${item.abilityName}:</b> ${item.abilityText}</p></div>`;
    $("#startButton").disabled = false;
    playTone("step");
  }

  function startNewGame() {
    const item = characters.find((entry) => entry.id === selectedCharacterId);
    if (!item) return;
    state = defaultState();
    state.alias = $("#aliasInput").value.trim() || "İsimsiz";
    state.characterId = item.id;
    state.started = true;
    if (item.id === "hotelier") state.timeLeft = state.maxTime = 840;
    if (item.id === "wholesaler") state.trust = 65;
    saveGame();
    enterGame();
  }

  function continueGame() {
    const saved = getSavedGame();
    if (!saved) return;
    state = { ...defaultState(), ...saved };
    enterGame();
  }

  function enterGame() {
    const item = character();
    $("#setupScreen").classList.add("hidden");
    $("#gameScreen").classList.remove("hidden");
    $("#hud").classList.remove("hidden");
    $("#missionBadge").classList.remove("hidden");
    $("#mobileNav").classList.remove("hidden");
    $("#hudAvatar").textContent = item.icon;
    $("#abilitySummary").innerHTML = `<strong>${item.abilityName}</strong><br>${item.abilityText}`;
    updateHUD();
    renderProgress();
    renderMission();
    startTimer();
  }

  function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(() => {
      if (state.over) return;
      state.timeLeft = Math.max(0, state.timeLeft - 1);
      updateHUD();
      saveGame();
      if (state.timeLeft === 0) endGame("SÜRE DOLDU", "Sunucu kapandı. NIGHTFALL karanlıkta kaldı.", "SON: Kayıp Sinyal", "error");
    }, 1000);
  }

  function updateHUD() {
    const item = character();
    const minutes = String(Math.floor(state.timeLeft / 60)).padStart(2, "0");
    const seconds = String(state.timeLeft % 60).padStart(2, "0");
    $("#hudIdentity").textContent = `${state.alias} / ${item?.name || "Bilinmiyor"}`;
    $("#timeText").textContent = `${minutes}:${seconds}`;
    $("#traceText").textContent = `%${state.trace}`;
    $("#trustText").textContent = `%${state.trust}`;
    $("#timeBar").style.width = `${Math.max(0, state.timeLeft / state.maxTime * 100)}%`;
    $("#traceBar").style.width = `${state.trace}%`;
    $("#trustBar").style.width = `${state.trust}%`;
    $("#timeText").style.color = state.timeLeft <= 60 ? "var(--danger)" : "";
  }

  function renderProgress() {
    const list = $("#missionProgress");
    list.innerHTML = missions.map((mission) => {
      const done = state.completed.includes(mission.id);
      const active = state.currentMission === mission.id && !state.over;
      return `<li class="${done ? "done" : active ? "active" : ""}"><span class="step-dot">${done ? "✓" : String(mission.id).padStart(2, "0")}</span><span><strong>${mission.title}</strong><small>${done ? "TAMAMLANDI" : active ? "AKTİF" : "KİLİTLİ"}</small></span></li>`;
    }).join("");
    renderMobileStatus();
  }

  function renderMobileStatus() {
    const item = character();
    if (!item) return;
    $("#mobileStatusContent").innerHTML = `
      <div class="selected-character"><span class="selected-icon">${item.icon}</span><div><small>${state.alias}</small><strong>${item.name}</strong><p>${item.abilityName}: ${item.abilityText}</p></div></div>
      <ol class="mission-progress">${missions.map((m) => `<li class="${state.completed.includes(m.id) ? "done" : state.currentMission === m.id ? "active" : ""}"><span class="step-dot">${state.completed.includes(m.id) ? "✓" : String(m.id).padStart(2, "0")}</span><span><strong>${m.title}</strong><small>${state.completed.includes(m.id) ? "TAMAMLANDI" : state.currentMission === m.id ? "AKTİF" : "KİLİTLİ"}</small></span></li>`).join("")}</ol>`;
  }

  function renderMission() {
    if (state.over) return;
    const mission = missions[state.currentMission - 1];
    $("#missionCounter").textContent = `${String(mission.id).padStart(2, "0")} / ${String(missions.length).padStart(2, "0")}`;
    $("#missionBadgeTitle").textContent = mission.title;
    $("#missionKicker").textContent = `GÖREV ${String(mission.id).padStart(2, "0")}`;
    $("#missionTitle").textContent = mission.title;
    $("#missionDescription").textContent = mission.description;
    $("#storyBox").innerHTML = mission.id === 1 ? `${mission.story}<br><br><strong>${character().name}:</strong> ${character().intro}` : mission.story;
    $("#missionStatus").textContent = "AKTİF";
    clearFeedback();
    const renderers = [renderMissionOne, renderMissionTwo, renderMissionThree, renderMissionFour, renderMissionFive];
    renderers[mission.id - 1]();
    updateHUD(); renderProgress(); saveGame();
    $("#missionPanel").focus({ preventScroll: true });
  }

  function transitionToMission(nextMission) {
    const panel = $("#missionPanel");
    panel.classList.add("switching");
    setTimeout(() => {
      state.currentMission = nextMission;
      panel.classList.remove("switching");
      renderMission();
    }, prefs.reducedMotion ? 20 : 430);
  }

  function addTrace(amount) {
    const item = character();
    const gain = item.id === "hacker" ? Math.ceil(amount / 2) : amount;
    state.trace = Math.min(100, Math.max(0, state.trace + gain));

    if (state.trace >= 90 && item.id === "bartender" && !state.bartenderUsed) {
      state.bartenderUsed = true;
      state.trace = 70;
      showToast("🍸 SON ÇAĞRI — Ata güvenliğe bir içki ısmarladı. İz %70’e düştü.");
      playTone("success");
      updateHUD(); saveGame();
      return false;
    }
    updateHUD(); saveGame();
    if (state.trace >= 90) {
      endGame("YAKALANDIN", "İz seviyen %90’a ulaştı. Sistem bağlantını tespit etti.", "SON: Açığa Çıkan Kimlik", "error");
      return true;
    }
    return false;
  }

  function addTrust(amount) {
    state.trust = Math.max(0, Math.min(100, state.trust + amount));
    updateHUD(); saveGame();
  }

  function applyMissionReward() {
    if (character().id === "activist") {
      state.trace = Math.max(0, state.trace - 5);
      showToast("✊ DAYANIŞMA AĞI — Alkım kalabalığa karıştı. İz %5 azaldı.");
      updateHUD();
    }
  }

  function completeMission(id, traceGain, trustGain) {
    if (state.completed.includes(id)) return;
    if (addTrace(traceGain)) return;
    addTrust(trustGain);
    state.completed.push(id);
    applyMissionReward();
    playTone("success");
    showFeedback("Görev tamamlandı. Sonraki katman açılıyor…", "success");
    saveGame(); renderProgress();
    if (id < missions.length) setTimeout(() => transitionToMission(id + 1), prefs.reducedMotion ? 100 : 900);
    else setTimeout(renderFinalChoice, prefs.reducedMotion ? 100 : 700);
  }

  function renderMissionOne() {
    $("#missionContent").innerHTML = `
      <div class="code-block">PKIJVHÇOO</div>
      <p class="hint">Türk alfabesinde her harfi üç sıra geriye kaydır. I ve İ farklı harflerdir.</p>
      <p class="hint">A B C Ç D E F G Ğ H I İ J K L M N O Ö P R S Ş T U Ü V Y Z</p>
      <div class="action-row"><input id="cipherAnswer" class="text-input" autocomplete="off" placeholder="ERİŞİM ANAHTARI"><button id="solveCipher" class="primary-button">DOĞRULA <span>→</span></button></div>`;
    $("#solveCipher").addEventListener("click", () => {
      const answer = $("#cipherAnswer").value.trim().toLocaleUpperCase("tr-TR");
      if (answer === "NIGHTFALL") completeMission(1, 10, 8);
      else {
        if (addTrace(character().id === "historian" ? 8 : 18)) return;
        playTone("error");
        showFeedback(character().id === "historian" ? "Yanlış. Tarihçi ipucu: P harfinden üç geri gidince N gelir." : "Anahtar yanlış. İz seviyesi yükseldi.", "error");
      }
    });
    $("#cipherAnswer").addEventListener("keydown", (event) => { if (event.key === "Enter") $("#solveCipher").click(); });
  }

  function renderMissionTwo() {
    $("#missionContent").innerHTML = `
      <div class="code-block">01001000 01000101 01011000</div>
      <div class="inline-tool"><h3>BINARY → METİN</h3><p>Her 8 bitlik grup bir ASCII harfidir.</p><input id="binaryInput" class="text-input" value="01001000 01000101 01011000"><button id="decodeBinary" class="secondary-button">BINARY ÇÖZ</button><div id="binaryOutput" class="tool-output">Sonuç burada görünecek.</div></div>
      <div id="hexStage" class="inline-tool ${state.binarySolved ? "" : "hidden"}"><h3>İKİNCİ KATMAN // HEX → METİN</h3><div class="code-block">4B 41 50 49</div><input id="hexInput" class="text-input" value="4B 41 50 49"><button id="decodeHex" class="primary-button">HEX ÇÖZ VE DEVAM ET <span>→</span></button><div id="hexOutput" class="tool-output">Sonuç burada görünecek.</div></div>`;
    $("#decodeBinary").addEventListener("click", decodeBinary);
    if (state.binarySolved) $("#decodeHex").addEventListener("click", decodeHex);
  }

  function decodeBinary() {
    const groups = $("#binaryInput").value.trim().split(/\s+/);
    if (!groups.length || groups.some((value) => !/^[01]{8}$/.test(value))) {
      playTone("error"); showFeedback("Her grup sekiz adet 0 veya 1 içermeli.", "error"); return;
    }
    const result = groups.map((value) => String.fromCharCode(parseInt(value, 2))).join("");
    $("#binaryOutput").textContent = `SONUÇ: ${result}`;
    if (result === "HEX") {
      state.binarySolved = true; saveGame(); playTone("step");
      $("#hexStage").classList.remove("hidden");
      $("#decodeHex").addEventListener("click", decodeHex);
      showFeedback("Doğru. HEX çözücü aynı ekranda açıldı.", "info");
    }
  }

  function decodeHex() {
    const groups = $("#hexInput").value.trim().split(/\s+/);
    if (!groups.length || groups.some((value) => !/^[0-9A-Fa-f]{2}$/.test(value))) {
      playTone("error"); showFeedback("Her grup iki Hex karakteri içermeli.", "error"); return;
    }
    const result = groups.map((value) => String.fromCharCode(parseInt(value, 16))).join("");
    $("#hexOutput").textContent = `SONUÇ: ${result}`;
    if (result === "KAPI") completeMission(2, 8, 8);
    else { if (!addTrace(10)) { playTone("error"); showFeedback("Sonuç doğru anahtar değil.", "error"); } }
  }

  function renderMissionThree() {
    const options = [
      "[02:12] NODE 185.77.12.44 // REDDEDİLDİ",
      "[02:17] NODE 91.204.18.73 // KABUL",
      "[02:17] NODE 185.77.12.44 // KABUL"
    ];
    $("#missionContent").innerHTML = `<div class="option-list">${options.map((text, index) => `<button class="option-button" data-log="${index}">${text}</button>`).join("")}</div>`;
    $$('[data-log]').forEach((button) => button.addEventListener("click", () => {
      if (button.dataset.log === "2") completeMission(3, 10, 8);
      else {
        button.disabled = true;
        if (character().id === "geographer" && !state.geographerUsed) {
          state.geographerUsed = true; saveGame(); playTone("step");
          showFeedback("🧭 Kestirme Rota: Ömer yanlış yolu haritadan sildi. İz artmadı.", "info");
          return;
        }
        if (!addTrace(20)) { playTone("error"); showFeedback("Yanlış kayıt. Güvenlik taraması başladı.", "error"); }
      }
    }));
  }

  function renderMissionFour() {
    $("#missionContent").innerHTML = `
      <div class="cable-stage">
        <div class="cable-meta"><strong id="cableLevelText">SEVİYE ${state.cableLevel} / 3</strong><div class="level-dots">${[1,2,3].map((level) => `<i class="${level < state.cableLevel ? "done" : level === state.cableLevel ? "active" : ""}"></i>`).join("")}</div></div>
        <canvas id="cableCanvas" width="600" height="600" aria-label="Kablo bağlantı oyun alanı"></canvas>
        <div class="cable-controls"><button data-move="up" aria-label="Yukarı">▲</button><button data-move="left" aria-label="Sol">◀</button><button data-move="down" aria-label="Aşağı">▼</button><button data-move="right" aria-label="Sağ">▶</button></div>
        <button id="resetCable" class="secondary-button">BU SEVİYEYİ SIFIRLA</button>
        <p class="hint">Bilgisayar: yön tuşları · Telefon: oyun alanında kaydır</p>
      </div>`;
    drawCable();
    $$('[data-move]').forEach((button) => button.addEventListener("click", () => moveCable(button.dataset.move)));
    $("#resetCable").addEventListener("click", () => { resetCable(); drawCable(); showFeedback("Bu seviye başlangıç noktasına döndü.", "info"); });
    bindCableTouch();
  }

  function cableConfig() { return cableLevels[state.cableLevel - 1]; }
  function resetCable() {
    const [x, y] = cableConfig().start;
    state.cableX = x; state.cableY = y; state.cablePath = [[x, y]]; saveGame();
  }

  function drawCable() {
    const canvas = $("#cableCanvas");
    if (!canvas) return;
    const config = cableConfig();
    const blocks = new Set(config.blocks);
    const context = canvas.getContext("2d");
    const cell = canvas.width / 6;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#183328"; context.lineWidth = 2;
    for (let index = 0; index <= 6; index++) {
      context.beginPath(); context.moveTo(index * cell, 0); context.lineTo(index * cell, canvas.height); context.stroke();
      context.beginPath(); context.moveTo(0, index * cell); context.lineTo(canvas.width, index * cell); context.stroke();
    }
    context.fillStyle = "#9a303a";
    blocks.forEach((key) => { const [x, y] = key.split(",").map(Number); context.fillRect(x * cell + 13, y * cell + 13, cell - 26, cell - 26); });
    context.fillStyle = "#ffc857"; context.beginPath(); context.arc((config.end[0] + .5) * cell, (config.end[1] + .5) * cell, 25, 0, Math.PI * 2); context.fill();
    context.strokeStyle = "#55f59a"; context.lineWidth = 16; context.lineCap = "round"; context.lineJoin = "round"; context.beginPath();
    state.cablePath.forEach(([x, y], index) => { const px = (x + .5) * cell, py = (y + .5) * cell; index ? context.lineTo(px, py) : context.moveTo(px, py); }); context.stroke();
    context.fillStyle = "#55f59a"; context.beginPath(); context.arc((state.cableX + .5) * cell, (state.cableY + .5) * cell, 20, 0, Math.PI * 2); context.fill();
  }

  function moveCable(direction) {
    if (state.currentMission !== 4 || state.over) return;
    const config = cableConfig();
    const blocks = new Set(config.blocks);
    const [dx, dy] = { up: [0,-1], down: [0,1], left: [-1,0], right: [1,0] }[direction];
    const nextX = state.cableX + dx, nextY = state.cableY + dy;
    if (nextX < 0 || nextX > 5 || nextY < 0 || nextY > 5 || blocks.has(`${nextX},${nextY}`)) {
      if (!addTrace(5)) {
        playTone("error"); showFeedback("Kablo kırmızı devreye çarptı. İz +5.", "error");
        const canvas = $("#cableCanvas"); canvas.classList.remove("shake"); void canvas.offsetWidth; canvas.classList.add("shake");
      }
      return;
    }
    state.cableX = nextX; state.cableY = nextY; state.cablePath.push([nextX, nextY]);
    playTone("step"); drawCable(); saveGame();
    if (nextX === config.end[0] && nextY === config.end[1]) {
      if (state.cableLevel < 3) {
        state.cableLevel += 1; resetCable(); playTone("success");
        showToast(`HAT ${state.cableLevel - 1} BAĞLANDI — Yeni devre yüklendi.`);
        renderMissionFour();
      } else completeMission(4, 5, 8);
    }
  }

  function bindCableTouch() {
    const canvas = $("#cableCanvas");
    let start = null;
    canvas.addEventListener("touchstart", (event) => { event.preventDefault(); const touch = event.changedTouches[0]; start = [touch.clientX, touch.clientY]; }, { passive: false });
    canvas.addEventListener("touchend", (event) => {
      event.preventDefault(); if (!start) return;
      const touch = event.changedTouches[0]; const dx = touch.clientX - start[0], dy = touch.clientY - start[1]; start = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      moveCable(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
    }, { passive: false });
  }

  function renderMissionFive() {
    const files = ["1987.LOG", "NIGHTFALL.dat", "MIRROR.exe"];
    $("#missionContent").innerHTML = `<div class="option-list">${files.map((file) => `<button class="option-button" data-file="${file}">▸ ${file}</button>`).join("")}</div>`;
    $$('[data-file]').forEach((button) => button.addEventListener("click", () => {
      if (button.dataset.file === "NIGHTFALL.dat") completeMission(5, 10, 10);
      else { button.disabled = true; if (!addTrace(25)) { playTone("error"); showFeedback("Sahte dosya. Alarm yükseldi.", "error"); } }
    }));
  }

  function renderFinalChoice() {
    state.currentMission = 5; saveGame();
    $("#missionKicker").textContent = "SON KARAR";
    $("#missionTitle").textContent = "NIGHTFALL bulundu";
    $("#missionDescription").textContent = "Dosya, şehirde kaybolan insanların gizli listesini içeriyor.";
    $("#storyBox").innerHTML = "<strong>ghost_17:</strong> Artık gerçeği biliyorsun. Ama bundan sonra ne olacağına sen karar vereceksin.";
    $("#missionStatus").textContent = "KARAR";
    $("#missionContent").innerHTML = `<div class="final-card"><h2>Dosyayla ne yapacaksın?</h2><div class="option-list"><button class="option-button" data-ending="publish">◉ Halka açıkla</button><button class="option-button" data-ending="ghost">◇ ghost_17’ye gönder</button><button class="option-button" data-ending="erase">× Dosyayı tamamen sil</button></div></div>`;
    clearFeedback();
    $$('[data-ending]').forEach((button) => button.addEventListener("click", () => resolveEnding(button.dataset.ending)));
  }

  function resolveEnding(choice) {
    const item = character();
    let title, intro, endingKey, label;
    if (choice === "publish") { title = "GERÇEK ORTAYA ÇIKTI"; intro = "NIGHTFALL listesini güvenli biçimde yayımladın."; endingKey = "publish"; label = "SON: Muhbir"; }
    else if (choice === "erase") { title = "SESSİZ ÇIKIŞ"; intro = "Dosyayı sildin ve bağlantıyı kapattın."; endingKey = "erase"; label = "SON: Sessizlik"; }
    else if (state.trust >= 65) { title = "GİZLİ SON"; intro = "ghost_17 gerçek kimliğini açıkladı ve dosyayı teslim aldı."; endingKey = "ghost"; label = "SON: Gölgedeki Müttefik"; }
    else { title = "İHANET"; intro = "ghost_17 dosyayı aldı ve seni sistemde yalnız bıraktı."; endingKey = "betray"; label = "SON: Satılmış Kimlik"; }
    endGame(title, `${intro}<br><br>${item.endings[endingKey]}`, label, endingKey === "betray" ? "error" : "success");
  }

  function endGame(title, text, label, tone) {
    state.over = true; clearInterval(timerId); localStorage.removeItem(STORAGE_KEY);
    $("#missionKicker").textContent = "OPERASYON TAMAMLANDI";
    $("#missionTitle").textContent = title;
    $("#missionDescription").textContent = "";
    $("#storyBox").classList.add("hidden");
    $("#missionStatus").textContent = label;
    $("#missionContent").innerHTML = `<div class="ending-box"><h2>${label}</h2><p>${text}</p><button id="playAgain" class="primary-button">YENİDEN OYNA <span>↻</span></button></div>`;
    clearFeedback(); playTone(tone); renderProgress();
    $("#playAgain").addEventListener("click", resetImmediately);
  }

  function resetImmediately() {
    clearInterval(timerId); localStorage.removeItem(STORAGE_KEY); location.reload();
  }

  function openDialog(dialog) { if (!dialog.open) dialog.showModal(); }
  function bindGlobalEvents() {
    $("#startButton").addEventListener("click", startNewGame);
    $("#continueButton").addEventListener("click", continueGame);
    $("#settingsButton").addEventListener("click", () => openDialog($("#settingsDialog")));
    $("#restartButton").addEventListener("click", () => openDialog($("#confirmDialog")));
    $("#cancelRestart").addEventListener("click", () => $("#confirmDialog").close());
    $("#confirmRestart").addEventListener("click", resetImmediately);
    $$('[data-close-dialog]').forEach((button) => button.addEventListener("click", () => $(`#${button.dataset.closeDialog}`).close()));
    $("#soundToggle").checked = prefs.sound;
    $("#motionToggle").checked = prefs.reducedMotion;
    $("#soundToggle").addEventListener("change", (event) => { prefs.sound = event.target.checked; savePrefs(); playTone("success"); });
    $("#motionToggle").addEventListener("change", (event) => { prefs.reducedMotion = event.target.checked; savePrefs(); });
    $$('[data-mobile-action]').forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.mobileAction;
      if (action === "mission") $("#missionPanel").scrollIntoView({ behavior: prefs.reducedMotion ? "auto" : "smooth" });
      if (action === "status") { renderMobileStatus(); openDialog($("#statusDialog")); }
      if (action === "settings") openDialog($("#settingsDialog"));
    }));
    window.addEventListener("keydown", (event) => {
      if (state.currentMission !== 4 || state.over) return;
      const direction = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" }[event.key];
      if (direction) { event.preventDefault(); moveCable(direction); }
    });
  }

  function init() {
    savePrefs(); renderCharacters(); bindGlobalEvents();
    const saved = getSavedGame();
    if (saved) $("#continueButton").classList.remove("hidden");
    setInterval(() => $("#clock").textContent = new Date().toLocaleTimeString("tr-TR"), 1000);
  }

  init();
})();
