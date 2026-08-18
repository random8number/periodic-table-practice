const elements = [
  [1,"H","Hydrogen",1,1],[2,"He","Helium",18,1],
  [3,"Li","Lithium",1,2],[4,"Be","Beryllium",2,2],[5,"B","Boron",13,2],[6,"C","Carbon",14,2],[7,"N","Nitrogen",15,2],[8,"O","Oxygen",16,2],[9,"F","Fluorine",17,2],[10,"Ne","Neon",18,2],
  [11,"Na","Sodium",1,3],[12,"Mg","Magnesium",2,3],[13,"Al","Aluminium",13,3],[14,"Si","Silicon",14,3],[15,"P","Phosphorus",15,3],[16,"S","Sulfur",16,3],[17,"Cl","Chlorine",17,3],[18,"Ar","Argon",18,3],
  [19,"K","Potassium",1,4],[20,"Ca","Calcium",2,4],[21,"Sc","Scandium",3,4],[22,"Ti","Titanium",4,4],[23,"V","Vanadium",5,4],[24,"Cr","Chromium",6,4],[25,"Mn","Manganese",7,4],[26,"Fe","Iron",8,4],[27,"Co","Cobalt",9,4],[28,"Ni","Nickel",10,4],[29,"Cu","Copper",11,4],[30,"Zn","Zinc",12,4],[31,"Ga","Gallium",13,4],[32,"Ge","Germanium",14,4],[33,"As","Arsenic",15,4],[34,"Se","Selenium",16,4],[35,"Br","Bromine",17,4],[36,"Kr","Krypton",18,4],
  [37,"Rb","Rubidium",1,5],[38,"Sr","Strontium",2,5],[39,"Y","Yttrium",3,5],[40,"Zr","Zirconium",4,5],[41,"Nb","Niobium",5,5],[42,"Mo","Molybdenum",6,5],[43,"Tc","Technetium",7,5],[44,"Ru","Ruthenium",8,5],[45,"Rh","Rhodium",9,5],[46,"Pd","Palladium",10,5],[47,"Ag","Silver",11,5],[48,"Cd","Cadmium",12,5],[49,"In","Indium",13,5],[50,"Sn","Tin",14,5],[51,"Sb","Antimony",15,5],[52,"Te","Tellurium",16,5],[53,"I","Iodine",17,5],[54,"Xe","Xenon",18,5],
  [55,"Cs","Caesium",1,6],[56,"Ba","Barium",2,6],[57,"La","Lanthanum",1,8],[58,"Ce","Cerium",2,8],[59,"Pr","Praseodymium",3,8],[60,"Nd","Neodymium",4,8],[61,"Pm","Promethium",5,8],[62,"Sm","Samarium",6,8],[63,"Eu","Europium",7,8],[64,"Gd","Gadolinium",8,8],[65,"Tb","Terbium",9,8],[66,"Dy","Dysprosium",10,8],[67,"Ho","Holmium",11,8],[68,"Er","Erbium",12,8],[69,"Tm","Thulium",13,8],[70,"Yb","Ytterbium",14,8],[71,"Lu","Lutetium",15,8],
  [72,"Hf","Hafnium",4,6],[73,"Ta","Tantalum",5,6],[74,"W","Tungsten",6,6],[75,"Re","Rhenium",7,6],[76,"Os","Osmium",8,6],[77,"Ir","Iridium",9,6],[78,"Pt","Platinum",10,6],[79,"Au","Gold",11,6],[80,"Hg","Mercury",12,6],[81,"Tl","Thallium",13,6],[82,"Pb","Lead",14,6],[83,"Bi","Bismuth",15,6],[84,"Po","Polonium",16,6],[85,"At","Astatine",17,6],[86,"Rn","Radon",18,6],
  [87,"Fr","Francium",1,7],[88,"Ra","Radium",2,7],[89,"Ac","Actinium",1,9],[90,"Th","Thorium",2,9],[91,"Pa","Protactinium",3,9],[92,"U","Uranium",4,9],[93,"Np","Neptunium",5,9],[94,"Pu","Plutonium",6,9],[95,"Am","Americium",7,9],[96,"Cm","Curium",8,9],[97,"Bk","Berkelium",9,9],[98,"Cf","Californium",10,9],[99,"Es","Einsteinium",11,9],[100,"Fm","Fermium",12,9],[101,"Md","Mendelevium",13,9],[102,"No","Nobelium",14,9],[103,"Lr","Lawrencium",15,9],
  [104,"Rf","Rutherfordium",4,7],[105,"Db","Dubnium",5,7],[106,"Sg","Seaborgium",6,7],[107,"Bh","Bohrium",7,7],[108,"Hs","Hassium",8,7],[109,"Mt","Meitnerium",9,7],[110,"Ds","Darmstadtium",10,7],[111,"Rg","Roentgenium",11,7],[112,"Cn","Copernicium",12,7],[113,"Nh","Nihonium",13,7],[114,"Fl","Flerovium",14,7],[115,"Mc","Moscovium",15,7],[116,"Lv","Livermorium",16,7],[117,"Ts","Tennessine",17,7],[118,"Og","Oganesson",18,7]
];

const categoryOrder = [
  "Alkali metals","Alkaline earth metals","Transition metals","Post-transition metals",
  "Metalloids","Reactive non-metals","Halogens","Noble gases","Lanthanides","Actinides"
];

let currentSort = "alpha";
let tableColours = true;
let elementColours = true;
let placedColours = true;
let atomicNumbers = true;
let tooltipsEnabled = true;

const DEFAULT_MODE_CONFIG = {
  beginner: {
    tableColours: true,
    elementColours: true,
    atomicNumbers: true,
    tooltips: true,
    lockControls: true
  },
  intermediate: {
    tableColours: true,
    elementColours: false,
    atomicNumbers: true,
    tooltips: true,
    lockControls: true
  },
  advanced: {
    tableColours: false,
    elementColours: false,
    atomicNumbers: false,
    tooltips: false,
    lockControls: true
  },
  customDefaults: {
    tableColours: true,
    elementColours: true,
    atomicNumbers: false,
    tooltips: true,
    lockControls: false
  },
  multiplayer: {
    defaultElementSet: 20,
    streakPoints: [10, 12, 14, 16, 18]
  }
};

let modeConfig = DEFAULT_MODE_CONFIG;

let playMode = "single";
let localGame = null;

const main = document.getElementById("periodic-table");
const lower = document.getElementById("lower-table");
const elementPanel = document.getElementById("element-panel");
const list = document.getElementById("element-list");
const score = document.getElementById("score");


function isLocalMultiplayerActive() {
  return playMode === "local" && localGame && localGame.status === "playing";
}

function getPlayableElements() {
  if (!isLocalMultiplayerActive()) return elements;

  const limit = localGame.elementLimit;
  return elements.filter(el => el[0] <= limit);
}

function getMultiplayerStreakPoints() {
  const configured = modeConfig.multiplayer && Array.isArray(modeConfig.multiplayer.streakPoints)
    ? modeConfig.multiplayer.streakPoints
    : DEFAULT_MODE_CONFIG.multiplayer.streakPoints;

  return configured.length ? configured : [10, 12, 14, 16, 18];
}

function pointsForStreak(streak) {
  const points = getMultiplayerStreakPoints();
  const index = Math.max(0, Math.min(points.length - 1, streak - 1));
  return Number(points[index]) || 0;
}

function activePlayer() {
  if (!localGame) return null;
  return localGame.players[localGame.currentPlayer];
}

function setTurnFeedback(message, type = "") {
  const feedback = document.getElementById("turnFeedback");
  if (!feedback) return;

  feedback.textContent = message;
  feedback.classList.remove("good", "bad");
  if (type) feedback.classList.add(type);
}

function updateMultiplayerStatus() {
  const panel = document.getElementById("multiplayerStatus");
  if (!panel) return;

  const active = isLocalMultiplayerActive();
  panel.hidden = !active;

  if (!active) {
    requestAnimationFrame(fitLayoutToViewport);
    return;
  }

  localGame.players.forEach((player, index) => {
    document.getElementById(`playerName${index}`).textContent = player.name;
    document.getElementById(`playerScore${index}`).textContent = `${player.score} pts`;
    document.getElementById(`playerStreak${index}`).textContent = `Streak ${player.streak}`;

    document.getElementById(`playerCard${index}`).classList.toggle(
      "active-player",
      index === localGame.currentPlayer
    );
  });

  document.getElementById("turnLabel").textContent =
    `${localGame.players[localGame.currentPlayer].name}'s turn`;

  requestAnimationFrame(fitLayoutToViewport);
}

function setMultiplayerControls(active) {
  const checkButton = document.getElementById("checkAnswersButton");
  const hintButton = document.getElementById("hintButton");
  const showButton = document.getElementById("showAnswersButton");
  const modeSelect = document.getElementById("modeSelect");
  const sortGroup = document.getElementById("sortControlsGroup");

  if (checkButton) {
    checkButton.disabled = active;
    checkButton.title = active ? "Answers are checked immediately in multiplayer." : "";
  }
  if (hintButton) {
    hintButton.disabled = active;
    hintButton.title = active ? "Hints are disabled in competitive multiplayer." : "";
  }
  if (showButton) {
    showButton.disabled = active;
    showButton.title = active ? "Show Answers is disabled in competitive multiplayer." : "";
  }

  if (modeSelect) modeSelect.disabled = active;

  document.querySelectorAll(".sort-button").forEach(button => {
    button.disabled = active;
  });

  if (sortGroup) sortGroup.classList.toggle("locked-option", active);

  if (active) {
    setOptionControlsLocked(true);
  } else {
    const selectedMode = document.getElementById("modeSelect").value;
    const preset = selectedMode === "custom"
      ? modeConfig.customDefaults
      : (modeConfig[selectedMode] || DEFAULT_MODE_CONFIG[selectedMode]);

    setOptionControlsLocked(Boolean(preset && preset.lockControls));
  }
}

function applyActiveGameSlots() {
  const active = isLocalMultiplayerActive();
  const limit = active ? localGame.elementLimit : 118;

  document.querySelectorAll(".slot").forEach(slot => {
    const number = Number(slot.dataset.number);
    const inactive = active && number > limit;

    slot.classList.toggle("inactive-game-slot", inactive);

    if (inactive) {
      slot.draggable = false;
    } else if (slot.dataset.locked !== "true") {
      slot.draggable = true;
    }
  });
}

function clearMultiplayerLocks() {
  document.querySelectorAll(".slot").forEach(slot => {
    slot.dataset.locked = "false";
    slot.classList.remove("multiplayer-locked", "inactive-game-slot");
    slot.draggable = true;
  });
}

function shuffledSymbolsForLimit(limit) {
  return elements
    .filter(el => el[0] <= limit)
    .map(el => el[1])
    .sort(() => Math.random() - 0.5);
}

function resetLocalGameState() {
  if (!localGame) return;

  localGame.currentPlayer = 0;
  localGame.processing = false;
  localGame.completedSymbols = [];
  localGame.elementOrder = shuffledSymbolsForLimit(localGame.elementLimit);

  localGame.players.forEach(player => {
    player.score = 0;
    player.streak = 0;
    player.bestStreak = 0;
    player.correct = 0;
    player.attempts = 0;
  });

  document.body.classList.remove("multiplayer-processing");
  document.querySelectorAll(".slot").forEach(slot => setSlotContent(slot, ""));
  clearMultiplayerLocks();
  applyActiveGameSlots();

  currentSort = "game";
  buildList(currentSort);
  updateMultiplayerStatus();
  setTurnFeedback("Place an element.");
}

function startLocalMultiplayer() {
  const player1 = document.getElementById("player1Input").value.trim() || "Player 1";
  const player2 = document.getElementById("player2Input").value.trim() || "Player 2";
  const difficulty = document.getElementById("localDifficultySelect").value;
  const elementLimit = Number(document.getElementById("localElementSetSelect").value) || 20;

  document.getElementById("modeSelect").value = difficulty;
  setMode(difficulty);

  playMode = "local";
  localGame = {
    status: "playing",
    elementLimit,
    difficulty,
    currentPlayer: 0,
    processing: false,
    completedSymbols: [],
    elementOrder: shuffledSymbolsForLimit(elementLimit),
    players: [
      { name: player1, score: 0, streak: 0, bestStreak: 0, correct: 0, attempts: 0 },
      { name: player2, score: 0, streak: 0, bestStreak: 0, correct: 0, attempts: 0 }
    ]
  };

  document.getElementById("playModeSelect").value = "local";
  document.getElementById("localMultiplayerDialog").close();

  document.querySelectorAll(".slot").forEach(slot => setSlotContent(slot, ""));
  clearMultiplayerLocks();
  applyActiveGameSlots();

  currentSort = "game";
  buildList(currentSort);
  setMultiplayerControls(true);
  updateMultiplayerStatus();
  setTurnFeedback("Place an element.");
  requestAnimationFrame(fitLayoutToViewport);
}

function endLocalMultiplayer(resetTableAfter = true) {
  playMode = "single";
  if (localGame) localGame.status = "ended";

  document.body.classList.remove("multiplayer-processing");
  clearMultiplayerLocks();

  if (resetTableAfter) {
    document.querySelectorAll(".slot").forEach(slot => setSlotContent(slot, ""));
  }

  localGame = null;
  currentSort = "alpha";

  document.getElementById("playModeSelect").value = "single";
  setMultiplayerControls(false);
  applyActiveGameSlots();
  buildList(currentSort);
  updateMultiplayerStatus();
  requestAnimationFrame(fitLayoutToViewport);
}

function setPlayMode(mode) {
  if (mode === "single") {
    if (isLocalMultiplayerActive()) {
      const leave = window.confirm("End the current local multiplayer game and return to single player?");
      if (!leave) {
        document.getElementById("playModeSelect").value = "local";
        return;
      }
      endLocalMultiplayer(true);
    }
    return;
  }

  if (mode === "local") {
    const dialog = document.getElementById("localMultiplayerDialog");
    document.getElementById("localDifficultySelect").value =
      document.getElementById("modeSelect").value;

    const defaultSet = modeConfig.multiplayer && modeConfig.multiplayer.defaultElementSet
      ? String(modeConfig.multiplayer.defaultElementSet)
      : "20";

    document.getElementById("localElementSetSelect").value =
      ["20", "118"].includes(defaultSet) ? defaultSet : "20";

    dialog.showModal();
  }
}

function finishLocalGame() {
  if (!localGame) return;

  localGame.status = "finished";
  localGame.processing = false;
  document.body.classList.remove("multiplayer-processing");
  setMultiplayerControls(true);

  const [p1, p2] = localGame.players;
  const title = p1.score === p2.score
    ? "Draw"
    : `${p1.score > p2.score ? p1.name : p2.name} wins!`;

  document.getElementById("resultsTitle").textContent = "Game complete";
  document.getElementById("resultsSummary").textContent =
    `${title} Final score: ${p1.score} – ${p2.score}`;

  localGame.players.forEach((player, index) => {
    const accuracy = player.attempts
      ? Math.round((player.correct / player.attempts) * 100)
      : 0;

    document.getElementById(`resultName${index}`).textContent = player.name;
    document.getElementById(`resultScore${index}`).textContent = player.score;
    document.getElementById(`resultCorrect${index}`).textContent =
      `${player.correct} correct placement${player.correct === 1 ? "" : "s"}`;
    document.getElementById(`resultAccuracy${index}`).textContent =
      `${accuracy}% accuracy`;
    document.getElementById(`resultStreak${index}`).textContent =
      `Best streak: ${player.bestStreak}`;
  });

  updateMultiplayerStatus();
  setTurnFeedback("Game complete.");
  document.getElementById("localResultsDialog").showModal();
}

function handleMultiplayerDrop(slot, symbol) {
  if (!isLocalMultiplayerActive() || localGame.processing) return;
  if (!symbol) return;
  if (slot.classList.contains("inactive-game-slot")) return;
  if (slot.dataset.locked === "true") return;
  if (!getPlayableElements().some(el => el[1] === symbol)) return;
  if (localGame.completedSymbols.includes(symbol)) return;

  const player = activePlayer();
  player.attempts += 1;

  if (slot.dataset.answer === symbol) {
    player.streak += 1;
    player.bestStreak = Math.max(player.bestStreak, player.streak);
    player.correct += 1;

    const points = pointsForStreak(player.streak);
    player.score += points;

    setSlotContent(slot, symbol);
    slot.dataset.locked = "true";
    slot.draggable = false;
    slot.classList.add("multiplayer-locked", "correct");

    localGame.completedSymbols.push(symbol);

    setTurnFeedback(
      `Correct — +${points} points. ${player.name} keeps the turn.`,
      "good"
    );

    updateMultiplayerStatus();
    buildList(currentSort);

    window.setTimeout(() => slot.classList.remove("correct"), 650);

    if (localGame.completedSymbols.length >= localGame.elementLimit) {
      window.setTimeout(finishLocalGame, 700);
    }
    return;
  }

  localGame.processing = true;
  document.body.classList.add("multiplayer-processing");
  setSlotContent(slot, symbol);
  slot.classList.add("wrong");

  setTurnFeedback(
    `Incorrect — ${player.name}'s streak ends. Turn passes.`,
    "bad"
  );
  updateMultiplayerStatus();

  window.setTimeout(() => {
    setSlotContent(slot, "");
    slot.classList.remove("wrong");

    player.streak = 0;
    localGame.currentPlayer = localGame.currentPlayer === 0 ? 1 : 0;
    localGame.processing = false;
    document.body.classList.remove("multiplayer-processing");

    buildList(currentSort);
    updateMultiplayerStatus();
    setTurnFeedback("Place an element.");
  }, 850);
}

function getCategory(number, symbol, group, period) {
  const noble = ["He","Ne","Ar","Kr","Xe","Rn","Og"];
  const halogens = ["F","Cl","Br","I","At","Ts"];
  const metalloids = ["B","Si","Ge","As","Sb","Te","Po"];
  const nonMetals = ["H","C","N","O","P","S","Se"];
  const post = ["Al","Ga","In","Sn","Tl","Pb","Bi","Nh","Fl","Mc","Lv"];

  if (noble.includes(symbol)) return "Noble gases";
  if (halogens.includes(symbol)) return "Halogens";
  if (group === 1 && symbol !== "H") return "Alkali metals";
  if (group === 2 && period < 8) return "Alkaline earth metals";
  if (period === 8) return "Lanthanides";
  if (period === 9) return "Actinides";
  if (group >= 3 && group <= 12) return "Transition metals";
  if (metalloids.includes(symbol)) return "Metalloids";
  if (nonMetals.includes(symbol)) return "Reactive non-metals";
  if (post.includes(symbol)) return "Post-transition metals";
  return "Other";
}

function categoryClass(category) {
  return "cat-" + category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getElement(symbol) {
  return elements.find(e => e[1] === symbol);
}

function getPlacedSymbols() {
  return [...document.querySelectorAll(".slot")]
    .map(s => s.dataset.placed)
    .filter(Boolean);
}

function clearPlacedCategory(slot) {
  [...slot.classList].forEach(c => {
    if (c.startsWith("placed-cat-")) slot.classList.remove(c);
  });
}

function updateSlotTitle(slot) {
  if (!tooltipsEnabled) {
    slot.removeAttribute("title");
    return;
  }

  const answerText = `${slot.dataset.name} (${slot.dataset.answer})\nAtomic number: ${slot.dataset.number}\nCategory: ${slot.dataset.category}\nGroup: ${slot.dataset.group}\nPeriod: ${slot.dataset.period}`;

  if (!slot.dataset.placed) {
    slot.title = answerText;
    return;
  }

  const placed = getElement(slot.dataset.placed);
  const placedCategory = getCategory(placed[0], placed[1], placed[3], placed[4]);
  slot.title = `Placed: ${placed[2]} (${placed[1]})\nAtomic number: ${placed[0]}\nCategory: ${placedCategory}\n\nCorrect position: ${answerText}`;
}

function refreshTooltips() {
  document.querySelectorAll(".slot").forEach(updateSlotTitle);
  document.querySelectorAll(".element-tile").forEach(tile => {
    if (!tooltipsEnabled) {
      tile.removeAttribute("title");
      return;
    }
    const el = getElement(tile.dataset.symbol);
    const category = getCategory(el[0], el[1], el[3], el[4]);
    tile.title = `${el[2]} (${el[1]})\nAtomic number: ${el[0]}\nCategory: ${category}\nGroup: ${el[3]}\nPeriod: ${el[4]}`;
  });
}

function setSlotContent(slot, symbol) {
  clearPlacedCategory(slot);

  const num = slot.querySelector(".atomic-number");
  const sym = slot.querySelector(".symbol");

  if (!symbol) {
    slot.dataset.placed = "";
    sym.textContent = "";
    if (slot.dataset.locked !== "true") {
      slot.classList.remove("multiplayer-locked");
    }
    slot.classList.remove("filled", "correct", "wrong");
    updateSlotTitle(slot);
    return;
  }

  const el = getElement(symbol);
  const category = getCategory(el[0], el[1], el[3], el[4]);

  slot.dataset.placed = symbol;
  sym.textContent = symbol;
  slot.classList.add("filled", "placed-" + categoryClass(category));
  slot.classList.remove("correct", "wrong");
  updateSlotTitle(slot);
}

function makeSlot(el, table, lowerTable = false) {
  const [number, symbol, name, group, period] = el;
  const category = getCategory(number, symbol, group, period);

  const slot = document.createElement("div");
  slot.className = "slot " + categoryClass(category);
  slot.dataset.answer = symbol;
  slot.dataset.placed = "";
  slot.dataset.locked = "false";
  slot.dataset.name = name;
  slot.dataset.number = number;
  slot.dataset.category = category;
  slot.dataset.group = group;
  slot.dataset.period = period;
  slot.title = `${name} (${symbol})\nAtomic number: ${number}\nCategory: ${category}\nGroup: ${group}\nPeriod: ${period}`;
  slot.draggable = true;

  if (lowerTable) {
    slot.style.gridColumn = group + 1;
    slot.style.gridRow = period === 8 ? 1 : 2;
  } else {
    slot.style.gridColumn = group;
    slot.style.gridRow = period;
  }

  const showGroupNumber =
    (period === 1 && (group === 1 || group === 18)) ||
    (period === 2 && group >= 13 && group <= 17) ||
    (period === 4 && group >= 3 && group <= 12);

  const groupNum = showGroupNumber ? `<div class="group-number">${group}</div>` : "";

  slot.innerHTML = `${groupNum}<div class="atomic-number">${number}</div><div class="symbol"></div>`;
  slot.addEventListener("dragover", e => e.preventDefault());
  slot.addEventListener("drop", dropOnSlot);
  slot.addEventListener("dragstart", dragFromSlot);
  table.appendChild(slot);
}


function fitLayoutToViewport() {
  const mainLayout = document.getElementById("mainLayout");
  const tablePanel = document.getElementById("tablePanel");
  const topPanel = document.querySelector(".top-panel");
  const legend = document.getElementById("legend");
  const infoPanel = document.querySelector(".info-panel");

  if (!mainLayout || !tablePanel || window.innerWidth <= 980) {
    document.documentElement.style.removeProperty("--available-main-height");
    return;
  }

  const viewportHeight = window.innerHeight;
  const mainTop = mainLayout.getBoundingClientRect().top;
  const bottomPadding = 14;
  const availableMainHeight = Math.max(180, viewportHeight - mainTop - bottomPadding);

  document.documentElement.style.setProperty(
    "--available-main-height",
    `${availableMainHeight}px`
  );

  // Height available for the periodic table itself.
  const panelStyle = getComputedStyle(tablePanel);
  const verticalPadding =
    parseFloat(panelStyle.paddingTop) + parseFloat(panelStyle.paddingBottom);

  const legendHeight = legend && getComputedStyle(legend).display !== "none"
    ? legend.getBoundingClientRect().height + 10
    : 0;

  const infoHeight = infoPanel && getComputedStyle(infoPanel).display !== "none"
    ? infoPanel.getBoundingClientRect().height + 12
    : 0;

  const usableHeight = Math.max(
    140,
    availableMainHeight - verticalPadding - legendHeight - infoHeight
  );

  // Width available for the main 18-column table.
  const panelWidth = tablePanel.clientWidth - 32;

  // Table structure is effectively 7 main rows + gap + 2 lower rows.
  const gap = Math.max(1, Math.min(6, panelWidth / 210));
  const lowerGap = Math.max(6, Math.min(22, usableHeight * 0.03));

  const cellByWidth = (panelWidth - (17 * gap)) / 18;
  const cellByHeight = (usableHeight - lowerGap - (7 * gap) - gap) / 9;

  const cellSize = Math.max(14, Math.min(58, cellByWidth, cellByHeight));
  const lowerLabelWidth = Math.max(38, Math.min(105, cellSize * 1.7));

  document.querySelectorAll(".table-grid").forEach(grid => {
    grid.style.setProperty("--cell-size", `${cellSize}px`);
    grid.style.setProperty("--cell-gap", `${gap}px`);
    grid.style.setProperty("--lower-gap", `${lowerGap}px`);
    grid.style.setProperty("--lower-label-width", `${lowerLabelWidth}px`);
  });
}

let splitterDragging = false;

function setupPanelSplitter() {
  const splitter = document.getElementById("panelSplitter");
  const mainLayout = document.getElementById("mainLayout");

  if (!splitter || !mainLayout) return;

  splitter.addEventListener("pointerdown", event => {
    if (window.innerWidth <= 980) return;

    splitterDragging = true;
    splitter.classList.add("dragging");
    splitter.setPointerCapture(event.pointerId);
    document.body.style.userSelect = "none";
  });

  splitter.addEventListener("pointermove", event => {
    if (!splitterDragging || window.innerWidth <= 980) return;

    const rect = mainLayout.getBoundingClientRect();
    const pointerFromRight = rect.right - event.clientX;

    const minSidebar = 220;
    const maxSidebar = Math.min(520, rect.width * 0.45);
    const newSidebar = Math.max(minSidebar, Math.min(maxSidebar, pointerFromRight));

    mainLayout.style.setProperty("--sidebar-width", `${newSidebar}px`);

    try {
      localStorage.setItem("periodicTableSidebarWidth", String(newSidebar));
    } catch (error) {}

    requestAnimationFrame(fitLayoutToViewport);
  });

  const stopDragging = event => {
    if (!splitterDragging) return;
    splitterDragging = false;
    splitter.classList.remove("dragging");
    document.body.style.userSelect = "";
    try {
      splitter.releasePointerCapture(event.pointerId);
    } catch (error) {}
  };

  splitter.addEventListener("pointerup", stopDragging);
  splitter.addEventListener("pointercancel", stopDragging);

  try {
    const savedWidth = parseFloat(localStorage.getItem("periodicTableSidebarWidth"));
    if (Number.isFinite(savedWidth)) {
      mainLayout.style.setProperty("--sidebar-width", `${savedWidth}px`);
    }
  } catch (error) {}
}

function buildTable() {
  main.innerHTML = "";
  lower.innerHTML = "";

  elements.forEach(el => {
    if (el[4] <= 7) makeSlot(el, main, false);
  });

  const lanthLabel = document.createElement("div");
  lanthLabel.className = "lanth-label";
  lanthLabel.textContent = "Lanthanides";
  lanthLabel.style.gridColumn = 1;
  lanthLabel.style.gridRow = 1;
  lower.appendChild(lanthLabel);

  const actLabel = document.createElement("div");
  actLabel.className = "lanth-label";
  actLabel.textContent = "Actinides";
  actLabel.style.gridColumn = 1;
  actLabel.style.gridRow = 2;
  lower.appendChild(actLabel);

  elements.forEach(el => {
    if (el[4] >= 8) makeSlot(el, lower, true);
  });

  applyActiveGameSlots();
}

function makeElementTile(el) {
  const [number, symbol, name, group, period] = el;
  const category = getCategory(number, symbol, group, period);
  const tile = document.createElement("div");
  tile.className = "element-tile " + categoryClass(category);
  tile.draggable = true;
  tile.dataset.symbol = symbol;
  if (tooltipsEnabled) {
    tile.title = `${name} (${symbol})\nAtomic number: ${number}\nCategory: ${category}\nGroup: ${group}\nPeriod: ${period}`;
  }
  tile.innerHTML = `<span class="mini-number">${number}</span><span class="mini-symbol">${symbol}</span>`;
  tile.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", symbol);
    e.dataTransfer.setData("source", "list");
  });

  const used = isLocalMultiplayerActive()
    ? localGame.completedSymbols.includes(symbol)
    : getPlacedSymbols().includes(symbol);

  if (used) tile.classList.add("used");
  return tile;
}

function buildList(sortMode = currentSort) {
  currentSort = sortMode;
  list.innerHTML = "";

  document.querySelectorAll(".sort-button").forEach(b => {
    b.classList.toggle("active", b.dataset.sort === sortMode);
  });

  let sorted = [...getPlayableElements()];

  if (sortMode === "game" && isLocalMultiplayerActive()) {
    const position = new Map(localGame.elementOrder.map((symbol, index) => [symbol, index]));
    sorted.sort((a, b) => (position.get(a[1]) ?? 999) - (position.get(b[1]) ?? 999));
  } else if (sortMode === "alpha") sorted.sort((a,b) => a[1].localeCompare(b[1]));
  if (sortMode === "atomic") sorted.sort((a,b) => a[0] - b[0]);
  if (sortMode === "random") sorted.sort(() => Math.random() - 0.5);
  if (sortMode === "category") {
    const grouped = new Map(categoryOrder.map(category => [category, []]));
    sorted.forEach(el => {
      const category = getCategory(el[0], el[1], el[3], el[4]);
      if (!grouped.has(category)) grouped.set(category, []);
      grouped.get(category).push(el);
    });
    sorted = [];
    grouped.forEach(group => {
      group.sort(() => Math.random() - 0.5);
      sorted.push(...group);
    });
  }

  let lastCategory = "";
  sorted.forEach(el => {
    const category = getCategory(el[0], el[1], el[3], el[4]);
    if (sortMode === "category" && category !== lastCategory) {
      const heading = document.createElement("div");
      heading.className = "category-heading";
      heading.textContent = category;
      list.appendChild(heading);
      lastCategory = category;
    }
    list.appendChild(makeElementTile(el));
  });

  document.getElementById("elementsTitle").textContent =
    sortMode === "game" ? `Elements (${localGame.elementLimit})` :
    sortMode === "alpha" ? "Elements (A–Z)" :
    sortMode === "atomic" ? "Elements (Atomic No.)" :
    sortMode === "category" ? "Elements (Category)" : "Elements (Shuffled)";

  updateScore();
  refreshTooltips();
  requestAnimationFrame(fitLayoutToViewport);
}

function dropOnSlot(e) {
  e.preventDefault();
  const symbol = e.dataTransfer.getData("text/plain");
  if (!symbol) return;

  if (isLocalMultiplayerActive()) {
    handleMultiplayerDrop(this, symbol);
    return;
  }

  // Single player: remove this element from any old position first.
  document.querySelectorAll(".slot").forEach(slot => {
    if (slot.dataset.placed === symbol) setSlotContent(slot, "");
  });

  setSlotContent(this, symbol);
  buildList(currentSort);
}

function dragFromSlot(e) {
  if (isLocalMultiplayerActive()) {
    e.preventDefault();
    return;
  }

  const symbol = this.dataset.placed;
  if (!symbol) {
    e.preventDefault();
    return;
  }

  e.dataTransfer.setData("text/plain", symbol);
  e.dataTransfer.setData("source", "slot");

  setTimeout(() => {
    setSlotContent(this, "");
    buildList(currentSort);
  }, 0);
}

function sortElements(mode) {
  if (isLocalMultiplayerActive()) return;
  buildList(mode);
}

function setTableColours(on) {
  tableColours = on;
  document.querySelector(".table-panel").classList.toggle("colour-table", on);
  document.getElementById("tableOn").classList.toggle("active", on);
  document.getElementById("tableOff").classList.toggle("active", !on);
}

function setElementColours(on) {
  elementColours = on;
  placedColours = on;
  elementPanel.classList.toggle("colour-elements", on);
  document.querySelector(".table-panel").classList.toggle("colour-placed", on);
  document.getElementById("elementsOn").classList.toggle("active", on);
  document.getElementById("elementsOff").classList.toggle("active", !on);
}

function setAtomicNumbers(on) {
  atomicNumbers = on;
  document.body.classList.toggle("hide-atomic-numbers", !on);
  document.getElementById("atomicOn").classList.toggle("active", on);
  document.getElementById("atomicOff").classList.toggle("active", !on);
}

function setTooltips(on) {
  tooltipsEnabled = on;

  const tooltipControl = document.getElementById("tooltipsEnabled");
  if (tooltipControl) tooltipControl.checked = on;

  refreshTooltips();
}

function applyModeSettings(settings) {
  setTableColours(Boolean(settings.tableColours));
  setElementColours(Boolean(settings.elementColours));
  setAtomicNumbers(Boolean(settings.atomicNumbers));
  setTooltips(Boolean(settings.tooltips));
}

function setOptionControlsLocked(locked) {
  [
    "tableOn", "tableOff",
    "elementsOn", "elementsOff",
    "atomicOn", "atomicOff"
  ].forEach(id => {
    const control = document.getElementById(id);
    if (control) control.disabled = locked;
  });

  const tooltipCheckbox = document.getElementById("tooltipsEnabled");
  if (tooltipCheckbox) tooltipCheckbox.disabled = locked;

  [
    "tableColourGroup",
    "elementColourGroup",
    "atomicNumberGroup",
    "tooltipControlGroup"
  ].forEach(id => {
    const group = document.getElementById(id);
    if (!group) return;

    group.classList.toggle("locked-option", locked);

    if (locked) {
      group.title = "This option is fixed by the selected mode in settings.json. Select Custom to change it.";
    } else {
      group.removeAttribute("title");
    }
  });
}

function setMode(mode) {
  if (mode === "custom") {
    const defaults = modeConfig.customDefaults || DEFAULT_MODE_CONFIG.customDefaults;
    applyModeSettings(defaults);
    setOptionControlsLocked(Boolean(defaults.lockControls));
    return;
  }

  const preset = modeConfig[mode] || DEFAULT_MODE_CONFIG[mode];
  applyModeSettings(preset);
  setOptionControlsLocked(Boolean(preset.lockControls));
}

function checkAnswers() {
  if (isLocalMultiplayerActive()) return;

  let correct = 0;
  let wrong = 0;

  document.querySelectorAll(".slot").forEach(slot => {
    slot.classList.remove("correct", "wrong");
    if (!slot.dataset.placed) return;

    if (slot.dataset.placed === slot.dataset.answer) {
      slot.classList.add("correct");
      correct++;
    } else {
      slot.classList.add("wrong");
      wrong++;
    }
  });

  updateScore(correct, wrong);
}

function showAnswers() {
  if (isLocalMultiplayerActive()) return;

  document.querySelectorAll(".slot").forEach(slot => {
    setSlotContent(slot, slot.dataset.answer);
    slot.classList.add("correct");
  });
  buildList(currentSort);
}

function resetTable() {
  if (isLocalMultiplayerActive()) {
    if (window.confirm("Restart this local multiplayer game? Scores and streaks will return to zero.")) {
      resetLocalGameState();
    }
    return;
  }

  document.querySelectorAll(".slot").forEach(slot => setSlotContent(slot, ""));
  buildList(currentSort);
}

function hint() {
  if (isLocalMultiplayerActive()) return;

  const emptyWrong = [...document.querySelectorAll(".slot")]
    .filter(slot => slot.dataset.placed !== slot.dataset.answer);

  if (emptyWrong.length === 0) return;

  const slot = emptyWrong[Math.floor(Math.random() * emptyWrong.length)];
  const answer = slot.dataset.answer;

  document.querySelectorAll(".slot").forEach(s => {
    if (s.dataset.placed === answer) setSlotContent(s, "");
  });

  setSlotContent(slot, answer);
  slot.classList.add("correct");
  buildList(currentSort);
}

function updateScore(correct = null, wrong = null) {
  if (isLocalMultiplayerActive()) {
    const placed = localGame.completedSymbols.length;
    score.textContent = `${placed} of ${localGame.elementLimit} completed • ${localGame.elementLimit - placed} remaining`;
    return;
  }

  const placed = getPlacedSymbols().length;
  if (correct === null) {
    score.textContent = `${placed} of 118 placed`;
  } else {
    score.textContent = `${placed} of 118 placed. Correct: ${correct}. Mistakes: ${wrong}.`;
  }
}

function buildLegend() {
  const legend = document.getElementById("legend");
  legend.innerHTML = "";
  categoryOrder.forEach(cat => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `<span class="swatch ${categoryClass(cat)}"></span>${cat}`;
    legend.appendChild(item);
  });

  // The swatches need colour even when table colour is off.
  document.querySelectorAll(".swatch").forEach(s => {
    const cls = [...s.classList].find(c => c.startsWith("cat-"));
    const dummy = document.createElement("span");
  });
}

function normaliseModeConfig(loaded) {
  return {
    ...DEFAULT_MODE_CONFIG,
    ...loaded,
    beginner: {
      ...DEFAULT_MODE_CONFIG.beginner,
      ...((loaded && loaded.beginner) || {})
    },
    intermediate: {
      ...DEFAULT_MODE_CONFIG.intermediate,
      ...((loaded && loaded.intermediate) || {})
    },
    advanced: {
      ...DEFAULT_MODE_CONFIG.advanced,
      ...((loaded && loaded.advanced) || {})
    },
    customDefaults: {
      ...DEFAULT_MODE_CONFIG.customDefaults,
      ...((loaded && loaded.customDefaults) || {})
    },
    multiplayer: {
      ...DEFAULT_MODE_CONFIG.multiplayer,
      ...((loaded && loaded.multiplayer) || {})
    }
  };
}

function setSettingsStatus(text) {
  const status = document.getElementById("settingsStatus");
  if (status) status.textContent = text;
}

function saveConfigToBrowser(config, filename = "Loaded JSON settings") {
  try {
    localStorage.setItem("periodicTableModeConfig", JSON.stringify(config));
    localStorage.setItem("periodicTableModeConfigName", filename);
  } catch (error) {
    // The current browser may block storage for local files.
  }
}

function clearSavedConfig() {
  try {
    localStorage.removeItem("periodicTableModeConfig");
    localStorage.removeItem("periodicTableModeConfigName");
  } catch (error) {
    // Ignore storage failures.
  }
}

function loadSavedConfig() {
  try {
    const saved = localStorage.getItem("periodicTableModeConfig");
    if (!saved) return null;

    return {
      config: JSON.parse(saved),
      name: localStorage.getItem("periodicTableModeConfigName") || "Saved JSON settings"
    };
  } catch (error) {
    return null;
  }
}

async function tryLoadNeighbouringJson() {
  if (location.protocol === "file:") return null;

  try {
    const response = await fetch("settings.json", { cache: "no-store" });
    if (!response.ok) return null;

    return {
      config: await response.json(),
      name: "settings.json"
    };
  } catch (error) {
    return null;
  }
}

async function loadModeConfig() {
  const saved = loadSavedConfig();

  if (saved) {
    modeConfig = normaliseModeConfig(saved.config);
    setSettingsStatus(`Using saved settings: ${saved.name}`);
    return;
  }

  const neighbouring = await tryLoadNeighbouringJson();

  if (neighbouring) {
    modeConfig = normaliseModeConfig(neighbouring.config);
    setSettingsStatus(`Using settings: ${neighbouring.name}`);
    return;
  }

  modeConfig = normaliseModeConfig(DEFAULT_MODE_CONFIG);
  setSettingsStatus("Built-in settings");
}

function reapplyCurrentMode() {
  const selectedMode = document.getElementById("modeSelect").value;
  setMode(selectedMode);
}

let legendDisplay = "compact";

function setLegendDisplay(mode) {
  legendDisplay = mode;
  document.body.classList.toggle("compact-legend", mode === "compact");
  document.body.classList.toggle("hide-legend", mode === "hidden");

  document.getElementById("legendNormal").classList.toggle("active", mode === "normal");
  document.getElementById("legendCompact").classList.toggle("active", mode === "compact");
  document.getElementById("legendHidden").classList.toggle("active", mode === "hidden");

  try {
    localStorage.setItem("periodicTableLegendDisplay", mode);
  } catch (error) {}

  requestAnimationFrame(fitLayoutToViewport);
}

function loadLegendDisplay() {
  let saved = "compact";
  try {
    saved = localStorage.getItem("periodicTableLegendDisplay") || "compact";
  } catch (error) {}

  if (!["normal", "compact", "hidden"].includes(saved)) saved = "compact";
  setLegendDisplay(saved);
}

document.getElementById("legendNormal").addEventListener("click", () => setLegendDisplay("normal"));
document.getElementById("legendCompact").addEventListener("click", () => setLegendDisplay("compact"));
document.getElementById("legendHidden").addEventListener("click", () => setLegendDisplay("hidden"));

let infoBarVisible = false;

function setInfoBarVisible(visible) {
  infoBarVisible = visible;
  document.body.classList.toggle("hide-info-panel", !visible);

  document.getElementById("infoBarShow").classList.toggle("active", visible);
  document.getElementById("infoBarHide").classList.toggle("active", !visible);

  try {
    localStorage.setItem("periodicTableInfoBarVisible", visible ? "true" : "false");
  } catch (error) {}

  requestAnimationFrame(fitLayoutToViewport);
}

function loadInfoBarVisibility() {
  let visible = false;
  try {
    const saved = localStorage.getItem("periodicTableInfoBarVisible");
    if (saved !== null) visible = saved === "true";
  } catch (error) {}

  setInfoBarVisible(visible);
}

document.getElementById("infoBarShow").addEventListener("click", () => setInfoBarVisible(true));
document.getElementById("infoBarHide").addEventListener("click", () => setInfoBarVisible(false));

let actionDisplay = "normal";

function setActionDisplay(mode) {
  actionDisplay = mode;
  document.body.classList.toggle("compact-actions", mode === "compact");
  document.body.classList.toggle("hide-actions", mode === "hidden");

  document.getElementById("actionsNormal").classList.toggle("active", mode === "normal");
  document.getElementById("actionsCompact").classList.toggle("active", mode === "compact");
  document.getElementById("actionsHidden").classList.toggle("active", mode === "hidden");

  try {
    localStorage.setItem("periodicTableActionDisplay", mode);
  } catch (error) {}
}

["actionsNormal", "actionsCompact", "actionsHidden"].forEach(id => {
  document.getElementById(id).addEventListener("click", () => {
    const mode = id === "actionsNormal" ? "normal" : id === "actionsCompact" ? "compact" : "hidden";
    setActionDisplay(mode);
  });
});

function loadActionDisplay() {
  let saved = "normal";
  try {
    saved = localStorage.getItem("periodicTableActionDisplay") || "normal";
  } catch (error) {}
  if (!["normal", "compact", "hidden"].includes(saved)) saved = "normal";
  setActionDisplay(saved);
}

document.getElementById("loadSettingsButton").addEventListener("click", () => {
  document.getElementById("settingsFileInput").click();
});

document.getElementById("settingsFileInput").addEventListener("change", async event => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const loaded = JSON.parse(text);

    modeConfig = normaliseModeConfig(loaded);
    saveConfigToBrowser(loaded, file.name);
    setSettingsStatus(`Using saved settings: ${file.name}`);
    reapplyCurrentMode();
    document.getElementById("burgerMenu").removeAttribute("open");
  } catch (error) {
    alert(`Could not load the settings file: ${error.message}`);
  } finally {
    event.target.value = "";
  }
});

document.getElementById("clearSettingsButton").addEventListener("click", () => {
  clearSavedConfig();
  modeConfig = normaliseModeConfig(DEFAULT_MODE_CONFIG);
  setSettingsStatus("Built-in settings");
  reapplyCurrentMode();
  document.getElementById("burgerMenu").removeAttribute("open");
});

document.addEventListener("click", event => {
  const menu = document.getElementById("burgerMenu");
  if (menu && menu.open && !menu.contains(event.target)) {
    menu.removeAttribute("open");
  }
});

document.getElementById("tooltipsEnabled").addEventListener("change", event => {
  if (!event.target.disabled) {
    setTooltips(event.target.checked);
  }
});



document.getElementById("startLocalGameButton").addEventListener("click", startLocalMultiplayer);

document.getElementById("cancelLocalGameButton").addEventListener("click", () => {
  document.getElementById("localMultiplayerDialog").close();
  document.getElementById("playModeSelect").value = isLocalMultiplayerActive() ? "local" : "single";
});

document.getElementById("localMultiplayerDialog").addEventListener("cancel", event => {
  event.preventDefault();
  document.getElementById("localMultiplayerDialog").close();
  document.getElementById("playModeSelect").value = isLocalMultiplayerActive() ? "local" : "single";
});

document.getElementById("endLocalGameButton").addEventListener("click", () => {
  if (window.confirm("End this local multiplayer game?")) {
    endLocalMultiplayer(true);
  }
});

document.getElementById("playAgainButton").addEventListener("click", () => {
  document.getElementById("localResultsDialog").close();

  if (localGame) {
    localGame.status = "playing";
    resetLocalGameState();
    setMultiplayerControls(true);
  }
});

document.getElementById("returnSingleButton").addEventListener("click", () => {
  document.getElementById("localResultsDialog").close();
  endLocalMultiplayer(true);
});

window.addEventListener("resize", () => {
  requestAnimationFrame(fitLayoutToViewport);
});

document.getElementById("burgerMenu").addEventListener("toggle", () => {
  requestAnimationFrame(fitLayoutToViewport);
});

(async function initialise() {
  await loadModeConfig();
  loadLegendDisplay();
  loadInfoBarVisibility();
  loadActionDisplay();
  setupPanelSplitter();
  buildTable();
  buildLegend();
  buildList(currentSort);
  document.getElementById("playModeSelect").value = "single";
  updateMultiplayerStatus();
  document.getElementById("modeSelect").value = "beginner";
  setMode("beginner");
  requestAnimationFrame(fitLayoutToViewport);
})();