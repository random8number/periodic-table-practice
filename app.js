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

let firebaseOnline = {
  ready: false,
  error: null,
  api: null,
  auth: null,
  user: null
};

const ONLINE_SESSION_KEY = "periodicTableOnlineSession-v21.4-online-polish";

let onlineRoom = null;
let onlineRoomUnsubscribe = null;
let onlineConnectionUnsubscribe = null;
let onlineFeedbackTimer = null;
let onlinePresenceHeartbeatTimer = null;
let onlineExpiryRefreshTimer = null;
let onlineGraceRefreshTimer = null;

const ONLINE_DISCONNECT_GRACE_MS = 30 * 1000;
const ONLINE_ROOM_TTL_MS = 24 * 60 * 60 * 1000;
const ONLINE_FINISHED_TTL_MS = 60 * 60 * 1000;
const ONLINE_PRESENCE_HEARTBEAT_MS = 30 * 1000;
const ONLINE_EXPIRY_TOUCH_MS = 5 * 60 * 1000;

const main = document.getElementById("periodic-table");
const lower = document.getElementById("lower-table");
const elementPanel = document.getElementById("element-panel");
const list = document.getElementById("element-list");
const score = document.getElementById("score");



function isOnlineRoomActive() {
  return playMode === "online" && onlineRoom && Boolean(onlineRoom.code);
}

function randomRoomCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function makeClientId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function cleanPlayerName(value, fallback) {
  const cleaned = String(value || "").trim().replace(/\s+/g, " ").slice(0, 24);
  return cleaned || fallback;
}

function normaliseRoomCode(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
}

function blankOnlineStats() {
  return { score: 0, streak: 0, bestStreak: 0, correct: 0, attempts: 0 };
}

function getOnlineRoomData() {
  return isOnlineRoomActive() ? (onlineRoom.lastData || null) : null;
}

function getOnlineGame() {
  const data = getOnlineRoomData();
  return data && data.game ? data.game : null;
}

function getOnlineElementLimit() {
  const data = getOnlineRoomData();
  return data && data.settings && Number(data.settings.elementLimit)
    ? Number(data.settings.elementLimit)
    : 118;
}

function getOnlineCompletedSymbols() {
  const game = getOnlineGame();
  const log = game && typeof game.completedLog === "string"
    ? game.completedLog
    : "|";

  return log
    .split("|")
    .filter(Boolean);
}

function getOnlineCompleted() {
  const completed = {};
  getOnlineCompletedSymbols().forEach(symbol => {
    completed[symbol] = true;
  });
  return completed;
}

function onlineGameIsPlaying() {
  const data = getOnlineRoomData();
  return Boolean(data && data.host && data.guest && data.game && data.game.status === "playing");
}

function onlineMyTurn() {
  const game = getOnlineGame();
  return Boolean(
    onlineGameIsPlaying() &&
    onlineRoom &&
    onlineRoom.firebaseConnected !== false &&
    onlineBothPlayersAvailable() &&
    game.currentTurn === onlineRoom.role
  );
}

function onlineRoleName(role, data = getOnlineRoomData()) {
  if (!data) return role === "host" ? "Player 1" : "Player 2";
  if (role === "host") return data.host && data.host.name ? data.host.name : "Player 1";
  return data.guest && data.guest.name ? data.guest.name : "Player 2";
}

function setOnlineSetupMessage(message, isError = false) {
  const el = document.getElementById("onlineSetupMessage");
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("error", isError);
}

function setOnlineTurnFeedback(message, type = "", autoResetMs = 0) {
  const el = document.getElementById("onlineTurnFeedback");
  if (!el) return;

  if (onlineFeedbackTimer) {
    window.clearTimeout(onlineFeedbackTimer);
    onlineFeedbackTimer = null;
  }

  el.textContent = message;
  el.classList.remove("good", "bad");
  if (type) el.classList.add(type);

  if (autoResetMs > 0) {
    onlineFeedbackTimer = window.setTimeout(() => {
      onlineFeedbackTimer = null;
      setDefaultOnlineTurnFeedback();
    }, autoResetMs);
  }
}

function setDefaultOnlineTurnFeedback() {
  if (!isOnlineRoomActive()) return;

  const data = getOnlineRoomData();
  const game = getOnlineGame();

  if (!data || !data.guest) {
    setOnlineTurnFeedback("Share the room code with Player 2.");
    return;
  }

  if (onlineRoom && onlineRoom.firebaseConnected === false) {
    setOnlineTurnFeedback("Connection lost — reconnecting…", "bad");
    return;
  }

  const reconnectingRole = onlineReconnectingRole(data);
  if (reconnectingRole) {
    const seconds = reconnectGraceSeconds(reconnectingRole, data);
    setOnlineTurnFeedback(
      `${onlineRoleName(reconnectingRole, data)} is reconnecting… ${seconds}s grace.`
    );
    return;
  }

  const disconnectedRole = onlineDisconnectedRole(data);
  if (disconnectedRole) {
    setOnlineTurnFeedback(
      `Game paused — waiting for ${onlineRoleName(disconnectedRole, data)} to reconnect.`
    );
    return;
  }

  if (game && game.status === "finished") {
    setOnlineTurnFeedback("Game complete.");
    return;
  }

  if (onlineMyTurn()) {
    if (onlineRoom.selectedSymbol) {
      const el = getElement(onlineRoom.selectedSymbol);
      setOnlineTurnFeedback(`Tap the table position for ${el ? el[2] : onlineRoom.selectedSymbol}.`);
    } else {
      setOnlineTurnFeedback("Your turn — tap an element, then tap its position.");
    }
    return;
  }

  const currentRole = game && game.currentTurn ? game.currentTurn : "host";
  setOnlineTurnFeedback(`Waiting for ${onlineRoleName(currentRole)}.`);
}

function updateFirebaseLoadStatus() {
  const el = document.getElementById("firebaseLoadStatus");
  if (!el) return;

  el.classList.remove("ready", "error");

  if (firebaseOnline.ready) {
    const uid = firebaseOnline.user && firebaseOnline.user.uid
      ? firebaseOnline.user.uid.slice(0, 8)
      : "unknown";
    el.textContent = `Firebase connected securely (anonymous session ${uid}…). Ready to create or join a room.`;
    el.classList.add("ready");
  } else if (firebaseOnline.error) {
    el.textContent = `Firebase could not load: ${firebaseOnline.error}`;
    el.classList.add("error");
  } else {
    el.textContent = "Connecting to Firebase…";
  }

  const disabled = !firebaseOnline.ready;
  document.getElementById("createOnlineRoomButton").disabled = disabled;
  document.getElementById("joinOnlineRoomButton").disabled = disabled;
}

function setOnlineRoomControls(active) {
  ["checkAnswersButton", "hintButton", "showAnswersButton", "resetButton"].forEach(id => {
    const button = document.getElementById(id);
    if (button) button.disabled = active;
  });

  const modeSelect = document.getElementById("modeSelect");
  if (modeSelect) modeSelect.disabled = active;

  document.querySelectorAll(".sort-button").forEach(button => {
    button.disabled = active;
  });

  document.body.classList.toggle("online-room-mode", active);

  if (active) setOptionControlsLocked(true);
  else setMultiplayerControls(false);
}

function updateOnlineInteractionClasses() {
  const data = getOnlineRoomData();
  const game = getOnlineGame();
  const waiting = !data || !data.guest || !game || game.status === "waiting";
  const finished = Boolean(game && game.status === "finished");
  const localDisconnected = Boolean(
    isOnlineRoomActive() &&
    onlineRoom.firebaseConnected === false
  );

  const remoteExpiredDisconnect = Boolean(
    isOnlineRoomActive() &&
    data &&
    data.guest &&
    onlineDisconnectedRole(data)
  );

  const paused = localDisconnected || remoteExpiredDisconnect;
  const notMyTurn = !waiting && !finished && !paused && !onlineMyTurn();

  document.body.classList.toggle("online-waiting", Boolean(isOnlineRoomActive() && waiting));
  document.body.classList.toggle("online-finished", Boolean(isOnlineRoomActive() && finished));
  document.body.classList.toggle("online-paused", remoteExpiredDisconnect);
  document.body.classList.toggle("online-local-reconnecting", localDisconnected);
  document.body.classList.toggle("online-not-my-turn", Boolean(isOnlineRoomActive() && notMyTurn));
  document.body.classList.toggle(
    "online-element-selected",
    Boolean(isOnlineRoomActive() && onlineRoom.selectedSymbol)
  );
}

function renderOnlineSelectionState() {
  const el = document.getElementById("onlineSelectionState");
  if (!el) return;

  if (!isOnlineRoomActive()) {
    el.textContent = "No element selected";
    return;
  }

  if (!onlineRoom.selectedSymbol) {
    el.textContent = onlineMyTurn() ? "No element selected" : "Selection locked until your turn";
    return;
  }

  const element = getElement(onlineRoom.selectedSymbol);
  el.textContent = element
    ? `Selected: ${element[1]} — ${element[2]}`
    : `Selected: ${onlineRoom.selectedSymbol}`;
}

function renderPresenceBadge(role, roomData) {
  const badge = document.getElementById(
    role === "host" ? "onlineHostPresence" : "onlineGuestPresence"
  );
  if (!badge) return;

  badge.classList.remove("online", "offline", "waiting", "reconnecting");

  const player = role === "host" ? roomData.host : roomData.guest;

  if (!player) {
    badge.textContent = "Waiting";
    badge.classList.add("waiting");
    return;
  }

  const connectionState = onlineRoleConnectionState(role, roomData);

  if (connectionState === "online") {
    badge.textContent = "Online";
    badge.classList.add("online");
  } else if (connectionState === "reconnecting") {
    badge.textContent = "Reconnecting";
    badge.classList.add("reconnecting");
  } else {
    badge.textContent = "Offline";
    badge.classList.add("offline");
  }
}

function formatRoomExpiry(expiresAt) {
  const remaining = Number(expiresAt || 0) - Date.now();
  if (remaining <= 0) return "expired";

  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.max(0, Math.floor((remaining % 3600000) / 60000));

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function renderOnlineRoomStatus(roomData = null) {
  const panel = document.getElementById("onlineRoomStatus");
  if (!panel) return;

  if (!isOnlineRoomActive()) {
    panel.hidden = true;
    requestAnimationFrame(fitLayoutToViewport);
    return;
  }

  const data = roomData || getOnlineRoomData() || {};
  const game = data.game || {};
  const players = game.players || {};
  const hostStats = players.host || blankOnlineStats();
  const guestStats = players.guest || blankOnlineStats();

  panel.hidden = false;
  document.getElementById("onlineRoomCode").textContent = onlineRoom.code;
  document.getElementById("onlineHostName").textContent =
    data.host && data.host.name ? data.host.name : "Player 1";
  document.getElementById("onlineGuestName").textContent =
    data.guest && data.guest.name ? data.guest.name : "Waiting for Player 2…";

  renderPresenceBadge("host", data);
  renderPresenceBadge("guest", data);

  const expiryEl = document.getElementById("onlineRoomExpiry");
  if (expiryEl) {
    expiryEl.textContent = `Room expiry: ${formatRoomExpiry(data.expiresAt)}`;
  }

  const settingsEl = document.getElementById("onlineGameSettings");
  if (settingsEl) {
    const difficultyName = data.settings && data.settings.difficulty
      ? data.settings.difficulty.charAt(0).toUpperCase() + data.settings.difficulty.slice(1)
      : "—";
    const elementLimit = data.settings && Number(data.settings.elementLimit)
      ? Number(data.settings.elementLimit)
      : 118;

    settingsEl.textContent =
      `Game settings: ${difficultyName} • ${elementLimit === 118 ? "All 118" : `First ${elementLimit}`}`;
  }

  document.getElementById("onlineHostScore").textContent = `${hostStats.score || 0} pts`;
  document.getElementById("onlineHostStreak").textContent = `Streak ${hostStats.streak || 0}`;
  document.getElementById("onlineGuestScore").textContent = `${guestStats.score || 0} pts`;
  document.getElementById("onlineGuestStreak").textContent = `Streak ${guestStats.streak || 0}`;

  const hostCard = document.getElementById("onlinePlayerCardHost");
  const guestCard = document.getElementById("onlinePlayerCardGuest");
  hostCard.classList.toggle("active-player", game.status === "playing" && game.currentTurn === "host");
  guestCard.classList.toggle("active-player", game.status === "playing" && game.currentTurn === "guest");
  hostCard.classList.toggle("me-player", onlineRoom.role === "host");
  guestCard.classList.toggle("me-player", onlineRoom.role === "guest");

  const turnLabel = document.getElementById("onlineTurnLabel");
  if (!data.guest) turnLabel.textContent = "Waiting for Player 2…";
  else if (game.status === "finished") turnLabel.textContent = "Game complete";
  else if (game.currentTurn === onlineRoom.role) turnLabel.textContent = "Your turn";
  else turnLabel.textContent = `${onlineRoleName(game.currentTurn || "host", data)}'s turn`;

  const state = document.getElementById("onlineConnectionState");
  state.classList.remove("connected", "waiting", "error");
  state.classList.remove("paused", "reconnecting");

  if (onlineRoom && onlineRoom.firebaseConnected === false) {
    state.textContent = "Connection lost — reconnecting";
    state.classList.add("reconnecting");
  } else if (!data.guest) {
    state.textContent = "Waiting for Player 2 to join";
    state.classList.add("waiting");
  } else if (onlineReconnectingRole(data)) {
    const role = onlineReconnectingRole(data);
    const seconds = reconnectGraceSeconds(role, data);
    state.textContent =
      `${onlineRoleName(role, data)} reconnecting — ${seconds}s before pause`;
    state.classList.add("reconnecting");
  } else if (onlineDisconnectedRole(data)) {
    const role = onlineDisconnectedRole(data);
    state.textContent = `Paused — ${onlineRoleName(role, data)} is offline`;
    state.classList.add("paused");
  } else {
    state.textContent = game.status === "finished"
      ? "Connected — game finished"
      : "Connected — both players online";
    state.classList.add("connected");
  }

  updateGraceRefreshTimer(data);
  renderOnlineSelectionState();
  updateOnlineInteractionClasses();
  requestAnimationFrame(fitLayoutToViewport);
}


function getInviteRoomCodeFromUrl() {
  try {
    const url = new URL(window.location.href);
    const code = normaliseRoomCode(url.searchParams.get("room") || "");
    return code.length === 6 ? code : "";
  } catch (error) {
    return "";
  }
}

function clearInviteRoomFromUrl() {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("room")) return;

    url.searchParams.delete("room");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  } catch (error) {
    console.debug("Could not clean invite URL:", error);
  }
}

function buildOnlineInviteUrl(code) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("room", normaliseRoomCode(code));
  return url.toString();
}

function isLoopbackInviteUrl(urlString) {
  try {
    const host = new URL(urlString).hostname.toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch (error) {
    return false;
  }
}

async function copyOnlineInviteLink() {
  if (!onlineRoom) return;

  const link = buildOnlineInviteUrl(onlineRoom.code);

  if (isLoopbackInviteUrl(link)) {
    window.prompt(
      "This local test page is using localhost. Replace localhost with this PC's LAN IPv4 address before opening the link on another device:",
      link
    );
    return;
  }

  try {
    await navigator.clipboard.writeText(link);

    const button = document.getElementById("copyInviteLinkButton");
    const oldText = button.textContent;
    button.textContent = "Invite copied";

    window.setTimeout(() => {
      button.textContent = oldText;
    }, 1200);
  } catch (error) {
    window.prompt("Copy this invite link:", link);
  }
}

function showInviteInOnlineDialog(code) {
  const roomCode = normaliseRoomCode(code);
  const notice = document.getElementById("onlineInviteNotice");
  const joinCard = document.getElementById("onlineJoinCard");
  const input = document.getElementById("onlineRoomCodeInput");

  if (roomCode.length === 6) {
    input.value = roomCode;
    notice.textContent = `You've been invited to room ${roomCode}. Enter your name and press Join room.`;
    notice.hidden = false;
    joinCard.classList.add("invite-highlight");
    document.getElementById("playModeSelect").value = "online";
  } else {
    notice.textContent = "";
    notice.hidden = true;
    joinCard.classList.remove("invite-highlight");
  }
}

function maybeOpenOnlineInvite() {
  if (isOnlineRoomActive()) return false;

  const code = getInviteRoomCodeFromUrl();
  if (!code) return false;

  openOnlineDialog(code);
  return true;
}

async function initialiseFirebaseOnline() {
  updateFirebaseLoadStatus();

  try {
    if (!window.PERIODIC_TABLE_FIREBASE_CONFIG) {
      throw new Error("firebase-config.js is missing");
    }

    const version = "12.17.1";
    const appModule = await import(`https://www.gstatic.com/firebasejs/${version}/firebase-app.js`);
    const authModule = await import(`https://www.gstatic.com/firebasejs/${version}/firebase-auth.js`);
    const dbModule = await import(`https://www.gstatic.com/firebasejs/${version}/firebase-database.js`);

    const app = appModule.initializeApp(window.PERIODIC_TABLE_FIREBASE_CONFIG);
    const auth = authModule.getAuth(app);

    if (typeof auth.authStateReady === "function") {
      await auth.authStateReady();
    }

    if (!auth.currentUser) {
      await authModule.signInAnonymously(auth);
    }

    if (!auth.currentUser) {
      throw new Error("Anonymous Firebase sign-in did not complete.");
    }

    const database = dbModule.getDatabase(app);

    firebaseOnline.auth = auth;
    firebaseOnline.user = auth.currentUser;
    firebaseOnline.api = {
      database,
      ref: dbModule.ref,
      get: dbModule.get,
      set: dbModule.set,
      update: dbModule.update,
      remove: dbModule.remove,
      runTransaction: dbModule.runTransaction,
      onValue: dbModule.onValue,
      onDisconnect: dbModule.onDisconnect,
      serverTimestamp: dbModule.serverTimestamp,
      query: dbModule.query,
      orderByChild: dbModule.orderByChild,
      endAt: dbModule.endAt,
      limitToFirst: dbModule.limitToFirst
    };

    firebaseOnline.ready = true;
    firebaseOnline.error = null;

    await cleanupExpiredRooms();
    const restored = await restoreOnlineSession();

    if (!restored) {
      maybeOpenOnlineInvite();
    }
  } catch (error) {
    firebaseOnline.ready = false;
    firebaseOnline.error = error && error.message ? error.message : String(error);
    console.error("Firebase online setup failed:", error);
  }

  updateFirebaseLoadStatus();
}

function saveOnlineSession() {
  if (!onlineRoom || !onlineRoom.code || !onlineRoom.role) return;

  localStorage.setItem(
    ONLINE_SESSION_KEY,
    JSON.stringify({
      code: onlineRoom.code,
      role: onlineRoom.role
    })
  );
}

function clearOnlineSession() {
  localStorage.removeItem(ONLINE_SESSION_KEY);
}

function loadOnlineSession() {
  try {
    const raw = localStorage.getItem(ONLINE_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.code || !["host", "guest"].includes(parsed.role)) {
      clearOnlineSession();
      return null;
    }

    return {
      code: normaliseRoomCode(parsed.code),
      role: parsed.role
    };
  } catch (error) {
    clearOnlineSession();
    return null;
  }
}

function onlinePresenceForRole(role, roomData = getOnlineRoomData()) {
  if (!roomData) return null;

  const player = role === "host" ? roomData.host : roomData.guest;
  if (!player || !player.uid) return null;

  return roomData.presence && roomData.presence[player.uid]
    ? roomData.presence[player.uid]
    : null;
}

function onlineRoleConnectionState(role, roomData = getOnlineRoomData()) {
  if (!roomData) return "offline";

  const player = role === "host" ? roomData.host : roomData.guest;
  if (!player || !player.uid) return "waiting";

  const presence = onlinePresenceForRole(role, roomData);

  if (presence && presence.online === true) {
    return "online";
  }

  const lastSeen = Number(presence && presence.lastSeen ? presence.lastSeen : 0);

  if (lastSeen > 0 && Date.now() - lastSeen < ONLINE_DISCONNECT_GRACE_MS) {
    return "reconnecting";
  }

  return "offline";
}

function onlineRoleIsConnected(role, roomData = getOnlineRoomData()) {
  return onlineRoleConnectionState(role, roomData) === "online";
}

function onlineRoleIsAvailable(role, roomData = getOnlineRoomData()) {
  const state = onlineRoleConnectionState(role, roomData);
  return state === "online" || state === "reconnecting";
}

function onlineBothPlayersAvailable(roomData = getOnlineRoomData()) {
  return Boolean(
    roomData &&
    roomData.host &&
    roomData.guest &&
    onlineRoleIsAvailable("host", roomData) &&
    onlineRoleIsAvailable("guest", roomData)
  );
}

function onlineBothPlayersConnected(roomData = getOnlineRoomData()) {
  return Boolean(
    roomData &&
    roomData.host &&
    roomData.guest &&
    onlineRoleIsConnected("host", roomData) &&
    onlineRoleIsConnected("guest", roomData)
  );
}

function onlineReconnectingRole(roomData = getOnlineRoomData()) {
  if (!roomData || !roomData.guest) return null;

  if (onlineRoleConnectionState("host", roomData) === "reconnecting") return "host";
  if (onlineRoleConnectionState("guest", roomData) === "reconnecting") return "guest";

  return null;
}

function onlineDisconnectedRole(roomData = getOnlineRoomData()) {
  if (!roomData || !roomData.guest) return null;

  if (onlineRoleConnectionState("host", roomData) === "offline") return "host";
  if (onlineRoleConnectionState("guest", roomData) === "offline") return "guest";

  return null;
}

function reconnectGraceSeconds(role, roomData = getOnlineRoomData()) {
  const presence = onlinePresenceForRole(role, roomData);
  const lastSeen = Number(presence && presence.lastSeen ? presence.lastSeen : 0);

  if (!lastSeen) return 0;

  return Math.max(
    0,
    Math.ceil((ONLINE_DISCONNECT_GRACE_MS - (Date.now() - lastSeen)) / 1000)
  );
}

function stopGraceRefreshTimer() {
  if (onlineGraceRefreshTimer) {
    clearInterval(onlineGraceRefreshTimer);
    onlineGraceRefreshTimer = null;
  }
}

function updateGraceRefreshTimer(roomData = getOnlineRoomData()) {
  if (!onlineReconnectingRole(roomData)) {
    stopGraceRefreshTimer();
    return;
  }

  if (onlineGraceRefreshTimer) return;

  onlineGraceRefreshTimer = setInterval(() => {
    if (!isOnlineRoomActive()) {
      stopGraceRefreshTimer();
      return;
    }

    updateOnlineInteractionClasses();
    renderOnlineRoomStatus(getOnlineRoomData());
    setDefaultOnlineTurnFeedback();
  }, 1000);
}

function stopPresenceTimers() {
  stopGraceRefreshTimer();

  if (onlinePresenceHeartbeatTimer) {
    clearInterval(onlinePresenceHeartbeatTimer);
    onlinePresenceHeartbeatTimer = null;
  }

  if (onlineExpiryRefreshTimer) {
    clearInterval(onlineExpiryRefreshTimer);
    onlineExpiryRefreshTimer = null;
  }
}

async function writeOnlinePresence(online = true) {
  if (!isOnlineRoomActive() || !firebaseOnline.ready || !firebaseOnline.user) return;

  const api = firebaseOnline.api;
  const uid = firebaseOnline.user.uid;

  await api.set(
    api.ref(api.database, `rooms/${onlineRoom.code}/presence/${uid}`),
    {
      role: onlineRoom.role,
      online,
      lastSeen: api.serverTimestamp()
    }
  );
}

async function touchOnlineRoom(ttlMs = ONLINE_ROOM_TTL_MS) {
  if (!isOnlineRoomActive() || !firebaseOnline.ready || !firebaseOnline.user) return;

  const api = firebaseOnline.api;
  const code = onlineRoom.code;
  const expiry = Date.now() + ttlMs;

  try {
    await api.set(
      api.ref(api.database, `rooms/${code}/lastActivityAt`),
      api.serverTimestamp()
    );
    await api.set(
      api.ref(api.database, `rooms/${code}/expiresAt`),
      expiry
    );
    await api.set(
      api.ref(api.database, `cleanupQueue/${code}`),
      { expiresAt: expiry }
    );
  } catch (error) {
    console.warn("Could not refresh room expiry:", error);
  }
}

async function cleanupExpiredRooms() {
  if (!firebaseOnline.ready || !firebaseOnline.user || !firebaseOnline.api) return;

  const api = firebaseOnline.api;

  try {
    const expiredQuery = api.query(
      api.ref(api.database, "cleanupQueue"),
      api.orderByChild("expiresAt"),
      api.endAt(Date.now()),
      api.limitToFirst(20)
    );

    const snapshot = await api.get(expiredQuery);
    if (!snapshot.exists()) return;

    for (const [code, entry] of Object.entries(snapshot.val() || {})) {
      if (!entry || Number(entry.expiresAt || 0) > Date.now()) continue;

      try {
        await api.remove(api.ref(api.database, `rooms/${code}`));
        await api.remove(api.ref(api.database, `cleanupQueue/${code}`));
      } catch (error) {
        console.debug(`Cleanup skipped ${code}:`, error.message || error);
      }
    }
  } catch (error) {
    console.warn("Expired-room cleanup query failed:", error);
  }
}

async function registerOnlinePresence() {
  if (!isOnlineRoomActive() || !firebaseOnline.ready || !firebaseOnline.user) return;

  stopPresenceTimers();

  const api = firebaseOnline.api;
  const uid = firebaseOnline.user.uid;
  const presenceRef = api.ref(api.database, `rooms/${onlineRoom.code}/presence/${uid}`);
  const connectedRef = api.ref(api.database, ".info/connected");

  if (typeof onlineConnectionUnsubscribe === "function") {
    onlineConnectionUnsubscribe();
  }
  onlineConnectionUnsubscribe = null;

  onlineConnectionUnsubscribe = api.onValue(connectedRef, async snapshot => {
    if (!onlineRoom) return;

    const connected = snapshot.val() === true;
    onlineRoom.firebaseConnected = connected;

    if (!connected) {
      updateOnlineInteractionClasses();
      renderOnlineRoomStatus(getOnlineRoomData());
      setOnlineTurnFeedback("Connection lost — reconnecting…", "bad");
      return;
    }

    try {
      await api.onDisconnect(presenceRef).set({
        role: onlineRoom.role,
        online: false,
        lastSeen: api.serverTimestamp()
      });

      await writeOnlinePresence(true);
      await touchOnlineRoom();

      stopPresenceTimers();

      onlinePresenceHeartbeatTimer = setInterval(async () => {
        if (!isOnlineRoomActive() || !onlineRoom.firebaseConnected) return;

        try {
          await writeOnlinePresence(true);
        } catch (error) {
          console.debug("Presence heartbeat failed:", error);
        }
      }, ONLINE_PRESENCE_HEARTBEAT_MS);

      onlineExpiryRefreshTimer = setInterval(async () => {
        if (!isOnlineRoomActive() || !onlineRoom.firebaseConnected) return;
        await touchOnlineRoom();
      }, ONLINE_EXPIRY_TOUCH_MS);

      updateOnlineInteractionClasses();
      renderOnlineRoomStatus(getOnlineRoomData());
    } catch (error) {
      console.warn("Could not register online presence:", error);
    }
  });
}


async function restoreOnlineSession() {
  const session = loadOnlineSession();
  if (!session || !firebaseOnline.ready || !firebaseOnline.user) return false;

  try {
    const api = firebaseOnline.api;
    const roomRef = api.ref(api.database, `rooms/${session.code}`);
    const snapshot = await api.get(roomRef);

    if (!snapshot.exists()) {
      clearOnlineSession();
      return false;
    }

    const roomData = snapshot.val();
    const uid = firebaseOnline.user.uid;

    const belongsToHost =
      session.role === "host" &&
      roomData.host &&
      roomData.host.uid === uid;

    const belongsToGuest =
      session.role === "guest" &&
      roomData.guest &&
      roomData.guest.uid === uid;

    if (!belongsToHost && !belongsToGuest) {
      clearOnlineSession();
      return false;
    }

    if (roomData.version !== "21.4-online-polish") {
      clearOnlineSession();
      return false;
    }

    if (Number(roomData.expiresAt || 0) <= Date.now()) {
      clearOnlineSession();

      try {
        await api.remove(roomRef);
      } catch (error) {
        console.debug("Expired restored room could not be removed:", error);
      }

      return false;
    }

    onlineRoom = {
      code: session.code,
      role: session.role,
      uid,
      selectedSymbol: "",
      lastData: roomData,
      lastMoveNumber: Number(roomData && roomData.game && roomData.game.moveNumber || 0),
      syncedOnce: false,
      resultsShown: false,
      processing: false,
      firebaseConnected: true
    };

    playMode = "online";
    document.getElementById("playModeSelect").value = "online";

    document.querySelectorAll(".slot").forEach(slot => setSlotContent(slot, ""));
    clearMultiplayerLocks();
    setOnlineRoomControls(true);
    applyOnlineRoomSnapshot(roomData);
    listenToOnlineRoom();
    saveOnlineSession();
    await registerOnlinePresence();

    setOnlineTurnFeedback(
      "Online room restored after refresh/reconnect.",
      "good",
      1800
    );

    return true;
  } catch (error) {
    console.warn("Could not restore online session:", error);
    return false;
  }
}

async function findUnusedRoomCode(maxAttempts = 12) {
  const api = firebaseOnline.api;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const code = randomRoomCode();
    const roomRef = api.ref(api.database, `rooms/${code}`);
    const snapshot = await api.get(roomRef);
    if (!snapshot.exists()) return code;
  }
  throw new Error("Could not generate an unused room code. Please try again.");
}

function stopOnlineRoomListener() {
  if (typeof onlineRoomUnsubscribe === "function") onlineRoomUnsubscribe();
  onlineRoomUnsubscribe = null;

  if (typeof onlineConnectionUnsubscribe === "function") {
    onlineConnectionUnsubscribe();
  }
  onlineConnectionUnsubscribe = null;

  stopPresenceTimers();
}

function syncOnlineCompletedToTable(roomData) {
  const log = roomData && roomData.game && typeof roomData.game.completedLog === "string"
    ? roomData.game.completedLog
    : "|";

  const completed = {};
  log.split("|").filter(Boolean).forEach(symbol => {
    completed[symbol] = true;
  });

  document.querySelectorAll(".slot").forEach(slot => {
    const symbol = slot.dataset.answer;
    const isCompleted = Boolean(completed[symbol]);

    if (isCompleted) {
      if (slot.dataset.placed !== symbol) setSlotContent(slot, symbol);
      slot.dataset.locked = "true";
      slot.draggable = false;
      slot.classList.add("multiplayer-locked");
      slot.classList.remove("online-wrong-flash", "wrong");
    } else {
      if (!slot.classList.contains("online-wrong-flash")) setSlotContent(slot, "");
      slot.dataset.locked = "false";
      slot.classList.remove("multiplayer-locked");
    }
  });
}

function flashOnlineWrongMove(move) {
  if (!move || move.correct || !move.targetNumber) return;

  const slot = [...document.querySelectorAll(".slot")]
    .find(s => Number(s.dataset.number) === Number(move.targetNumber));

  if (!slot || slot.dataset.locked === "true") return;

  setSlotContent(slot, move.symbol);
  slot.classList.add("wrong", "online-wrong-flash");

  window.setTimeout(() => {
    if (!isOnlineRoomActive()) return;
    const completed = getOnlineCompleted();

    if (completed[slot.dataset.answer]) {
      setSlotContent(slot, slot.dataset.answer);
      slot.dataset.locked = "true";
      slot.classList.add("multiplayer-locked");
    } else {
      setSlotContent(slot, "");
    }

    slot.classList.remove("wrong", "online-wrong-flash");
  }, 760);
}

function showOnlineMoveFeedback(move, roomData) {
  if (!move) return;
  const playerName = onlineRoleName(move.by, roomData);

  if (move.correct) {
    setOnlineTurnFeedback(
      `${playerName}: correct — +${move.points || 0} points and keeps the turn.`,
      "good",
      1800
    );
  } else {
    setOnlineTurnFeedback(
      `${playerName}: incorrect — streak reset and turn passes.`,
      "bad",
      1800
    );
    flashOnlineWrongMove(move);
  }
}

function onlineAccuracy(stats) {
  const attempts = Number(stats && stats.attempts) || 0;
  const correct = Number(stats && stats.correct) || 0;
  return attempts ? Math.round((correct / attempts) * 100) : 0;
}

function showOnlineResults(roomData) {
  if (!onlineRoom || onlineRoom.resultsShown) return;
  const game = roomData && roomData.game ? roomData.game : null;
  if (!game || game.status !== "finished") return;

  onlineRoom.resultsShown = true;

  const hostStats = game.players && game.players.host ? game.players.host : blankOnlineStats();
  const guestStats = game.players && game.players.guest ? game.players.guest : blankOnlineStats();
  const hostName = onlineRoleName("host", roomData);
  const guestName = onlineRoleName("guest", roomData);

  const summary = (hostStats.score || 0) === (guestStats.score || 0)
    ? `Draw — ${hostStats.score || 0} points each`
    : `${(hostStats.score || 0) > (guestStats.score || 0) ? hostName : guestName} wins! Final score: ${hostStats.score || 0} – ${guestStats.score || 0}`;

  document.getElementById("onlineResultsSummary").textContent = summary;

  const rematchButton = document.getElementById("onlineRematchButton");
  const rematchStatus = document.getElementById("onlineRematchStatus");

  if (onlineRoom.role === "host") {
    rematchButton.disabled = false;
    rematchButton.textContent = "Play again";
    rematchStatus.textContent = "Host can start a rematch with new settings.";
  } else {
    rematchButton.disabled = true;
    rematchButton.textContent = "Waiting for host";
    rematchStatus.textContent = "Waiting for the host to start a rematch.";
  }

  [["Host", hostName, hostStats], ["Guest", guestName, guestStats]].forEach(([suffix, name, stats]) => {
    document.getElementById(`onlineResultName${suffix}`).textContent = name;
    document.getElementById(`onlineResultScore${suffix}`).textContent = stats.score || 0;
    document.getElementById(`onlineResultCorrect${suffix}`).textContent =
      `${stats.correct || 0} correct placement${Number(stats.correct || 0) === 1 ? "" : "s"}`;
    document.getElementById(`onlineResultAccuracy${suffix}`).textContent =
      `${onlineAccuracy(stats)}% accuracy`;
    document.getElementById(`onlineResultStreak${suffix}`).textContent =
      `Best streak: ${stats.bestStreak || 0}`;
  });

  const dialog = document.getElementById("onlineResultsDialog");
  if (!dialog.open) dialog.showModal();
}

function applyOnlineRoomSnapshot(roomData) {
  if (!isOnlineRoomActive()) return;

  const previousMoveNumber = Number(onlineRoom.lastMoveNumber || 0);
  const previousRoomData = onlineRoom.lastData || null;
  const previousGameStatus =
    previousRoomData && previousRoomData.game ? previousRoomData.game.status : null;

  onlineRoom.lastData = roomData;

  const difficulty = roomData && roomData.settings ? roomData.settings.difficulty : null;
  if (difficulty && onlineRoom.appliedDifficulty !== difficulty) {
    onlineRoom.appliedDifficulty = difficulty;
    document.getElementById("modeSelect").value = difficulty;
    setMode(difficulty);
    setOnlineRoomControls(true);
  }

  syncOnlineCompletedToTable(roomData);
  applyActiveGameSlots();

  currentSort = "game";
  const oldScroll = list.scrollTop;
  buildList(currentSort);
  list.scrollTop = oldScroll;

  renderOnlineRoomStatus(roomData);

  const game = roomData && roomData.game ? roomData.game : null;
  const moveNumber = Number(game && game.moveNumber ? game.moveNumber : 0);

  const rematchStarted = Boolean(
    game &&
    game.status === "playing" &&
    moveNumber === 0 &&
    previousGameStatus === "finished"
  );

  if (rematchStarted) {
    onlineRoom.resultsShown = false;
    onlineRoom.syncedOnce = true;
    onlineRoom.lastMoveNumber = 0;
    onlineRoom.selectedSymbol = "";

    const resultsDialog = document.getElementById("onlineResultsDialog");
    if (resultsDialog.open) resultsDialog.close();

    const rematchDialog = document.getElementById("onlineRematchDialog");
    if (rematchDialog.open) rematchDialog.close();

    renderOnlineSelectionState();
    updateOnlineInteractionClasses();
    setOnlineTurnFeedback("Rematch started — fresh board, scores reset.", "good", 1800);
  } else if (!onlineRoom.syncedOnce) {
    onlineRoom.syncedOnce = true;
    onlineRoom.lastMoveNumber = moveNumber;
    setDefaultOnlineTurnFeedback();
  } else if (moveNumber > previousMoveNumber) {
    onlineRoom.lastMoveNumber = moveNumber;
    onlineRoom.selectedSymbol = "";
    renderOnlineSelectionState();
    updateOnlineInteractionClasses();
    showOnlineMoveFeedback(game.lastMove, roomData);
  } else if (!onlineFeedbackTimer) {
    setDefaultOnlineTurnFeedback();
  }

  if (game && game.status === "finished") showOnlineResults(roomData);
}

function listenToOnlineRoom() {
  stopOnlineRoomListener();
  if (!isOnlineRoomActive()) return;

  const api = firebaseOnline.api;
  const roomRef = api.ref(api.database, `rooms/${onlineRoom.code}`);

  onlineRoomUnsubscribe = api.onValue(
    roomRef,
    snapshot => {
      if (!isOnlineRoomActive()) return;

      if (!snapshot.exists()) {
        const state = document.getElementById("onlineConnectionState");
        if (state) {
          state.textContent = "Room closed";
          state.className = "online-connection-state error";
        }

        if (onlineRoom.role === "guest") {
          window.setTimeout(() => {
            alert("The host has closed this room.");
            leaveOnlineRoom(false);
          }, 50);
        }
        return;
      }

      applyOnlineRoomSnapshot(snapshot.val());
    },
    error => {
      const state = document.getElementById("onlineConnectionState");
      if (state) {
        state.textContent = `Connection error: ${error.message}`;
        state.className = "online-connection-state error";
      }
    }
  );
}

function createInitialOnlineGame(elementLimit) {
  return {
    status: "waiting",
    currentTurn: "host",
    elementLimit,
    elementOrder: shuffledSymbolsForLimit(elementLimit),
    moveNumber: 0,
    completedLog: "|",
    completedCount: 0,
    players: {
      host: blankOnlineStats(),
      guest: blankOnlineStats()
    }
  };
}

async function createOnlineRoom() {
  if (!firebaseOnline.ready) {
    setOnlineSetupMessage("Firebase is not ready yet.", true);
    return;
  }

  const hostName = cleanPlayerName(document.getElementById("onlineHostNameInput").value, "Player 1");
  const difficulty = document.getElementById("onlineDifficultySelect").value;
  const elementLimit = Number(document.getElementById("onlineElementSetSelect").value) || 20;
  setOnlineSetupMessage("Creating room…");

  try {
    const api = firebaseOnline.api;
    const code = await findUnusedRoomCode();
    const uid = firebaseOnline.user.uid;
    const roomRef = api.ref(api.database, `rooms/${code}`);

    const roomData = {
      version: "21.4-online-polish",
      status: "waiting",
      createdAt: api.serverTimestamp(),
      lastActivityAt: api.serverTimestamp(),
      expiresAt: Date.now() + ONLINE_ROOM_TTL_MS,
      host: { uid, name: hostName },
      settings: { difficulty, elementLimit },
      game: createInitialOnlineGame(elementLimit)
    };

    await api.set(roomRef, roomData);


    const serverRoom = (await api.get(roomRef)).val();

    onlineRoom = {
      code,
      role: "host",
      uid,
      hostName,
      selectedSymbol: "",
      lastData: serverRoom,
      lastMoveNumber: 0,
      syncedOnce: false,
      resultsShown: false,
      processing: false
    };

    playMode = "online";
    document.getElementById("playModeSelect").value = "online";
    document.getElementById("onlineMultiplayerDialog").close();
    clearInviteRoomFromUrl();

    document.querySelectorAll(".slot").forEach(slot => setSlotContent(slot, ""));
    clearMultiplayerLocks();
    setOnlineRoomControls(true);
    applyOnlineRoomSnapshot(serverRoom);
    listenToOnlineRoom();
    saveOnlineSession();

    try {
      await api.set(
        api.ref(api.database, `cleanupQueue/${code}`),
        { expiresAt: Number(serverRoom.expiresAt) }
      );
    } catch (error) {
      console.warn("Could not register room cleanup entry:", error);
    }

    await registerOnlinePresence();
  } catch (error) {
    console.error(error);
    setOnlineSetupMessage(error.message || String(error), true);
  }
}

async function joinOnlineRoom() {
  if (!firebaseOnline.ready) {
    setOnlineSetupMessage("Firebase is not ready yet.", true);
    return;
  }

  const guestName = cleanPlayerName(document.getElementById("onlineGuestNameInput").value, "Player 2");
  const code = normaliseRoomCode(document.getElementById("onlineRoomCodeInput").value);

  if (code.length !== 6) {
    setOnlineSetupMessage("Enter the 6-character room code.", true);
    return;
  }

  setOnlineSetupMessage("Joining room…");

  try {
    const api = firebaseOnline.api;
    const roomRef = api.ref(api.database, `rooms/${code}`);
    const guestRef = api.ref(api.database, `rooms/${code}/guest`);
    const statusRef = api.ref(api.database, `rooms/${code}/status`);
    const uid = firebaseOnline.user.uid;

    const roomSnapshot = await api.get(roomRef);
    if (!roomSnapshot.exists()) throw new Error("Room not found. Check the code and try again.");

    const existingRoom = roomSnapshot.val();
    if (!existingRoom.host) throw new Error("This room is invalid because it has no host.");
    if (existingRoom.version !== "21.4-online-polish") {
      throw new Error("This room was created by a different development version. Create a new Security 1 room.");
    }
    if (Number(existingRoom.expiresAt || 0) <= Date.now()) {
      throw new Error("That room has expired. Ask the host to create a new room.");
    }

    if (existingRoom.game && existingRoom.game.status === "finished") {
      throw new Error("That game has already finished.");
    }

    const guestResult = await api.runTransaction(guestRef, currentGuest => {
      if (currentGuest === null) return { uid, name: guestName };

      if (currentGuest.uid === uid) {
        return { uid, name: guestName };
      }

      return;
    });

    if (!guestResult.committed) {
      const latestRoom = await api.get(roomRef);
      if (!latestRoom.exists()) throw new Error("The room was closed before you could join.");

      const latestData = latestRoom.val();
      const existingGuestName =
        latestData && latestData.guest && latestData.guest.name ? latestData.guest.name : "";

      throw new Error(
        existingGuestName
          ? `That room already has Player 2 (${existingGuestName}).`
          : "That room already has two players."
      );
    }

    await api.set(statusRef, "playing");
    await api.set(api.ref(api.database, `rooms/${code}/game/status`), "playing");


    const roomData = (await api.get(roomRef)).val();

    onlineRoom = {
      code,
      role: "guest",
      uid,
      hostName: roomData && roomData.host ? roomData.host.name : "Player 1",
      selectedSymbol: "",
      lastData: roomData,
      lastMoveNumber: Number(roomData && roomData.game && roomData.game.moveNumber || 0),
      syncedOnce: false,
      resultsShown: false,
      processing: false
    };

    playMode = "online";
    document.getElementById("playModeSelect").value = "online";
    document.getElementById("onlineMultiplayerDialog").close();
    clearInviteRoomFromUrl();

    document.querySelectorAll(".slot").forEach(slot => setSlotContent(slot, ""));
    clearMultiplayerLocks();
    setOnlineRoomControls(true);
    applyOnlineRoomSnapshot(roomData);
    listenToOnlineRoom();
    saveOnlineSession();
    await registerOnlinePresence();
    await touchOnlineRoom();
  } catch (error) {
    console.error("Join room failed:", error);
    setOnlineSetupMessage(error.message || String(error), true);
  }
}

function selectOnlineElement(symbol) {
  if (!isOnlineRoomActive()) return;

  if (!onlineGameIsPlaying()) {
    setOnlineTurnFeedback("Wait for Player 2 to join.");
    return;
  }

  if (!onlineBothPlayersAvailable()) {
    const disconnectedRole = onlineDisconnectedRole();
    setOnlineTurnFeedback(
      disconnectedRole
        ? `Game paused — waiting for ${onlineRoleName(disconnectedRole)} to reconnect.`
        : "Game paused — waiting for both players."
    );
    return;
  }

  if (!onlineMyTurn()) {
    setOnlineTurnFeedback(`It is ${onlineRoleName(getOnlineGame().currentTurn)}'s turn.`);
    return;
  }

  if (getOnlineCompleted()[symbol]) return;
  if (!getPlayableElements().some(el => el[1] === symbol)) return;

  onlineRoom.selectedSymbol = onlineRoom.selectedSymbol === symbol ? "" : symbol;

  document.querySelectorAll(".element-tile").forEach(tile => {
    tile.classList.toggle("selected-element", tile.dataset.symbol === onlineRoom.selectedSymbol);
  });

  renderOnlineSelectionState();
  updateOnlineInteractionClasses();
  setDefaultOnlineTurnFeedback();

  if (onlineRoom.selectedSymbol && window.innerWidth <= 980) {
    const panel = document.getElementById("tablePanel");
    if (panel) {
      window.setTimeout(() => panel.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    }
  }
}

async function attemptOnlinePlacement(slot, symbol) {
  if (!isOnlineRoomActive() || !symbol || !slot || onlineRoom.processing) return;

  if (!onlineGameIsPlaying()) {
    setOnlineTurnFeedback("Wait for both players before placing elements.");
    return;
  }

  if (!onlineBothPlayersAvailable()) {
    const disconnectedRole = onlineDisconnectedRole();
    setOnlineTurnFeedback(
      disconnectedRole
        ? `Game paused — waiting for ${onlineRoleName(disconnectedRole)} to reconnect.`
        : "Game paused — waiting for both players."
    );
    return;
  }

  if (!onlineMyTurn()) {
    setOnlineTurnFeedback(`It is ${onlineRoleName(getOnlineGame().currentTurn)}'s turn.`);
    return;
  }

  if (slot.classList.contains("inactive-game-slot") || slot.dataset.locked === "true") return;
  if (getOnlineCompleted()[symbol]) return;
  if (!getPlayableElements().some(el => el[1] === symbol)) return;

  onlineRoom.processing = true;

  try {
    const api = firebaseOnline.api;
    const gameRef = api.ref(api.database, `rooms/${onlineRoom.code}/game`);
    const roomStatusRef = api.ref(api.database, `rooms/${onlineRoom.code}/status`);
    const roomRef = api.ref(api.database, `rooms/${onlineRoom.code}`);

    // Warm the local transaction cache before starting, just as in the
    // earlier join fix.
    await api.get(gameRef);

    const role = onlineRoom.role;
    const targetNumber = Number(slot.dataset.number);
    const localElement = getElement(symbol);
    const isCorrect = Boolean(localElement && Number(localElement[0]) === targetNumber);
    const elementLimit = getOnlineElementLimit();

    const result = await api.runTransaction(gameRef, currentGame => {
      if (!currentGame || currentGame.status !== "playing") return;
      if (currentGame.currentTurn !== role) return;

      const completedLog = typeof currentGame.completedLog === "string"
        ? currentGame.completedLog
        : "|";
      const token = `|${symbol}|`;

      if (completedLog.includes(token)) return;

      const players = currentGame.players || {};
      const player = { ...blankOnlineStats(), ...(players[role] || {}) };

      player.attempts = Number(player.attempts || 0) + 1;

      let points = 0;

      if (isCorrect) {
        player.streak = Number(player.streak || 0) + 1;
        player.bestStreak = Math.max(Number(player.bestStreak || 0), player.streak);
        player.correct = Number(player.correct || 0) + 1;
        points = pointsForStreak(player.streak);
        player.score = Number(player.score || 0) + points;

        currentGame.completedLog = `${completedLog}${symbol}|`;
        currentGame.completedCount = Number(currentGame.completedCount || 0) + 1;
      } else {
        player.streak = 0;
        currentGame.currentTurn = role === "host" ? "guest" : "host";
        currentGame.completedLog = completedLog;
        currentGame.completedCount = Number(currentGame.completedCount || 0);
      }

      currentGame.players = {
        host: { ...blankOnlineStats(), ...(players.host || {}) },
        guest: { ...blankOnlineStats(), ...(players.guest || {}) },
        [role]: player
      };

      currentGame.moveNumber = Number(currentGame.moveNumber || 0) + 1;
      currentGame.lastMove = {
        number: currentGame.moveNumber,
        by: role,
        symbol,
        targetNumber,
        correct: isCorrect,
        points,
        streakAfter: player.streak,
        at: Date.now()
      };

      if (isCorrect && Number(currentGame.completedCount || 0) >= elementLimit) {
        currentGame.status = "finished";
        currentGame.finishedAt = Date.now();

        const hostScore = Number(currentGame.players.host.score || 0);
        const guestScore = Number(currentGame.players.guest.score || 0);
        currentGame.winner =
          hostScore === guestScore ? "draw" : (hostScore > guestScore ? "host" : "guest");
      }

      return currentGame;
    });

    if (!result.committed) {
      const latest = await api.get(roomRef);
      if (latest.exists()) applyOnlineRoomSnapshot(latest.val());

      setOnlineTurnFeedback(
        "Firebase rejected that move or the game state changed. The board has been refreshed.",
        "bad",
        1800
      );
      return;
    }

    if (result.snapshot && result.snapshot.val() && result.snapshot.val().status === "finished") {
      try {
        await api.set(roomStatusRef, "finished");
      } catch (error) {
        console.warn("Could not update room finished status:", error);
      }

      await touchOnlineRoom(ONLINE_FINISHED_TTL_MS);
    } else {
      await touchOnlineRoom();
    }

    onlineRoom.selectedSymbol = "";
    renderOnlineSelectionState();
    updateOnlineInteractionClasses();
  } catch (error) {
    console.error("Online placement failed:", error);
    setOnlineTurnFeedback(`Move rejected: ${error.message || error}`, "bad", 2400);
  } finally {
    onlineRoom.processing = false;
  }
}
function handleSlotTap(event) {
  if (!isOnlineRoomActive()) return;

  if (!onlineRoom.selectedSymbol) {
    if (onlineMyTurn()) setOnlineTurnFeedback("Tap an element from the list first.");
    return;
  }

  attemptOnlinePlacement(event.currentTarget, onlineRoom.selectedSymbol);
}


function setOnlineRematchSetupMessage(message = "", isError = false) {
  const el = document.getElementById("onlineRematchSetupMessage");
  if (!el) return;

  el.textContent = message;
  el.classList.toggle("error", Boolean(isError));
}

function openOnlineRematchDialog() {
  if (!isOnlineRoomActive() || onlineRoom.role !== "host") return;

  const data = getOnlineRoomData();
  const game = data && data.game ? data.game : null;

  if (!game || game.status !== "finished") return;

  const difficulty =
    data.settings && data.settings.difficulty
      ? data.settings.difficulty
      : "beginner";

  const elementLimit =
    data.settings && Number(data.settings.elementLimit)
      ? String(Number(data.settings.elementLimit))
      : "20";

  document.getElementById("onlineRematchDifficultySelect").value = difficulty;
  document.getElementById("onlineRematchElementSetSelect").value =
    ["20", "118"].includes(elementLimit) ? elementLimit : "20";

  setOnlineRematchSetupMessage("");

  const resultsDialog = document.getElementById("onlineResultsDialog");
  if (resultsDialog.open) resultsDialog.close();

  document.getElementById("onlineRematchDialog").showModal();
}

async function startOnlineRematch() {
  if (!isOnlineRoomActive() || onlineRoom.role !== "host") return;

  const data = getOnlineRoomData();
  const game = data && data.game ? data.game : null;

  if (!data || !data.guest || !game || game.status !== "finished") {
    setOnlineRematchSetupMessage(
      "The previous game must be finished and both players must still be in the room.",
      true
    );
    return;
  }

  if (!onlineBothPlayersAvailable(data)) {
    setOnlineRematchSetupMessage(
      "Wait for both players to reconnect before starting the rematch.",
      true
    );
    return;
  }

  const difficulty =
    document.getElementById("onlineRematchDifficultySelect").value;

  const elementLimit =
    Number(document.getElementById("onlineRematchElementSetSelect").value) || 20;

  setOnlineRematchSetupMessage("Starting rematch…");

  try {
    const api = firebaseOnline.api;
    const code = onlineRoom.code;

    const settingsRef =
      api.ref(api.database, `rooms/${code}/settings`);

    const gameRef =
      api.ref(api.database, `rooms/${code}/game`);

    const statusRef =
      api.ref(api.database, `rooms/${code}/status`);

    // The v21.4 rules permit the host to update rematch settings only
    // after the previous game has finished.
    await api.set(settingsRef, {
      difficulty,
      elementLimit
    });

    const newGame = createInitialOnlineGame(elementLimit);
    newGame.status = "playing";

    await api.set(gameRef, newGame);
    await api.set(statusRef, "playing");

    onlineRoom.resultsShown = false;
    onlineRoom.selectedSymbol = "";
    onlineRoom.lastMoveNumber = 0;
    onlineRoom.syncedOnce = false;
    onlineRoom.appliedDifficulty = null;

    await touchOnlineRoom();

    const rematchDialog = document.getElementById("onlineRematchDialog");
    if (rematchDialog.open) rematchDialog.close();
  } catch (error) {
    console.error("Could not start online rematch:", error);
    setOnlineRematchSetupMessage(
      error && error.message ? error.message : String(error),
      true
    );
  }
}

async function leaveOnlineRoom(removeFromDatabase = true) {
  if (!onlineRoom) {
    playMode = "single";
    document.getElementById("playModeSelect").value = "single";
    setOnlineRoomControls(false);
    renderOnlineRoomStatus();
    return;
  }

  const leavingRoom = onlineRoom;
  stopOnlineRoomListener();
  clearOnlineSession();

  if (onlineFeedbackTimer) {
    window.clearTimeout(onlineFeedbackTimer);
    onlineFeedbackTimer = null;
  }

  if (removeFromDatabase && firebaseOnline.ready) {
    try {
      const api = firebaseOnline.api;
      const uid = firebaseOnline.user && firebaseOnline.user.uid
        ? firebaseOnline.user.uid
        : leavingRoom.uid;

      if (uid) {
        try {
          await api.remove(api.ref(api.database, `rooms/${leavingRoom.code}/presence/${uid}`));
        } catch (presenceError) {
          console.warn("Could not remove presence record:", presenceError);
        }
      }

      if (leavingRoom.role === "host") {
        try {
          await api.remove(api.ref(api.database, `cleanupQueue/${leavingRoom.code}`));
        } catch (cleanupError) {
          console.warn("Could not remove cleanup queue entry:", cleanupError);
        }

        await api.remove(api.ref(api.database, `rooms/${leavingRoom.code}`));
      } else {
        await api.set(
          api.ref(api.database, `rooms/${leavingRoom.code}/game/status`),
          "waiting"
        );
        await api.set(
          api.ref(api.database, `rooms/${leavingRoom.code}/status`),
          "waiting"
        );
        await api.remove(
          api.ref(api.database, `rooms/${leavingRoom.code}/guest`)
        );
      }
    } catch (error) {
      console.warn("Could not clean up Firebase room:", error);
    }
  }

  onlineRoom = null;
  playMode = "single";

  document.body.classList.remove(
    "online-room-mode",
    "online-not-my-turn",
    "online-waiting",
    "online-finished",
    "online-paused",
    "online-local-reconnecting",
    "online-element-selected"
  );

  document.querySelectorAll(".slot").forEach(slot => setSlotContent(slot, ""));
  clearMultiplayerLocks();

  currentSort = "alpha";
  document.getElementById("playModeSelect").value = "single";
  setOnlineRoomControls(false);
  applyActiveGameSlots();
  buildList(currentSort);
  renderOnlineRoomStatus();
  updateScore();
  requestAnimationFrame(fitLayoutToViewport);
}

function openOnlineDialog(inviteCode = "") {
  document.getElementById("onlineDifficultySelect").value =
    document.getElementById("modeSelect").value;

  const defaultSet = modeConfig.multiplayer && modeConfig.multiplayer.defaultElementSet
    ? String(modeConfig.multiplayer.defaultElementSet)
    : "20";

  document.getElementById("onlineElementSetSelect").value =
    ["20", "118"].includes(defaultSet) ? defaultSet : "20";

  const code = normaliseRoomCode(inviteCode);
  document.getElementById("onlineRoomCodeInput").value =
    code.length === 6 ? code : "";

  showInviteInOnlineDialog(code);

  setOnlineSetupMessage(
    code.length === 6
      ? "Invite ready — enter your player name and join."
      : ""
  );

  updateFirebaseLoadStatus();

  const dialog = document.getElementById("onlineMultiplayerDialog");
  if (!dialog.open) dialog.showModal();

  if (code.length === 6) {
    window.setTimeout(() => {
      document.getElementById("onlineGuestNameInput").focus();
      document.getElementById("onlineGuestNameInput").select();
    }, 50);
  }
}

function isLocalMultiplayerActive() {
  return playMode === "local" && localGame && localGame.status === "playing";
}

function getPlayableElements() {
  if (isLocalMultiplayerActive()) {
    return elements.filter(el => el[0] <= localGame.elementLimit);
  }

  if (isOnlineRoomActive()) {
    return elements.filter(el => el[0] <= getOnlineElementLimit());
  }

  return elements;
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
  const localActive = isLocalMultiplayerActive();
  const onlineActive = isOnlineRoomActive();
  const active = localActive || onlineActive;

  const limit = localActive
    ? localGame.elementLimit
    : (onlineActive ? getOnlineElementLimit() : 118);

  document.querySelectorAll(".slot").forEach(slot => {
    const number = Number(slot.dataset.number);
    const inactive = active && number > limit;

    slot.classList.toggle("inactive-game-slot", inactive);

    if (inactive) {
      slot.draggable = false;
    } else if (slot.dataset.locked !== "true") {
      slot.draggable = !onlineActive;
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
      return;
    }

    if (isOnlineRoomActive()) {
      const leave = window.confirm("Leave the current online room and return to single player?");
      if (!leave) {
        document.getElementById("playModeSelect").value = "online";
        return;
      }
      leaveOnlineRoom(true);
      return;
    }

    playMode = "single";
    return;
  }

  if (mode === "local") {
    if (isOnlineRoomActive()) {
      document.getElementById("playModeSelect").value = "online";
      alert("Leave the online room before starting a local multiplayer game.");
      return;
    }

    const dialog = document.getElementById("localMultiplayerDialog");
    document.getElementById("localDifficultySelect").value =
      document.getElementById("modeSelect").value;

    const defaultSet = modeConfig.multiplayer && modeConfig.multiplayer.defaultElementSet
      ? String(modeConfig.multiplayer.defaultElementSet)
      : "20";

    document.getElementById("localElementSetSelect").value =
      ["20", "118"].includes(defaultSet) ? defaultSet : "20";

    dialog.showModal();
    return;
  }

  if (mode === "online") {
    if (isLocalMultiplayerActive()) {
      document.getElementById("playModeSelect").value = "local";
      alert("End the local multiplayer game before opening an online room.");
      return;
    }

    if (isOnlineRoomActive()) {
      document.getElementById("playModeSelect").value = "online";
      return;
    }

    openOnlineDialog();
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
  slot.addEventListener("click", handleSlotTap);
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
  tile.dataset.symbol = symbol;

  if (tooltipsEnabled) {
    tile.title = `${name} (${symbol})\nAtomic number: ${number}\nCategory: ${category}\nGroup: ${group}\nPeriod: ${period}`;
  }

  tile.innerHTML = `<span class="mini-number">${number}</span><span class="mini-symbol">${symbol}</span>`;

  const localUsed = isLocalMultiplayerActive() && localGame.completedSymbols.includes(symbol);
  const onlineUsed = isOnlineRoomActive() && Boolean(getOnlineCompleted()[symbol]);
  const singleUsed = !isLocalMultiplayerActive() && !isOnlineRoomActive() && getPlacedSymbols().includes(symbol);
  const used = localUsed || onlineUsed || singleUsed;

  tile.draggable = !used && (!isOnlineRoomActive() || onlineMyTurn());

  tile.addEventListener("dragstart", e => {
    if (isOnlineRoomActive() && !onlineMyTurn()) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", symbol);
    e.dataTransfer.setData("source", "list");
  });

  tile.addEventListener("click", () => {
    if (isOnlineRoomActive()) selectOnlineElement(symbol);
  });

  if (used) tile.classList.add("used");
  if (isOnlineRoomActive() && onlineRoom.selectedSymbol === symbol) {
    tile.classList.add("selected-element");
  }

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
  } else if (sortMode === "game" && isOnlineRoomActive()) {
    const game = getOnlineGame();
    const order = game && Array.isArray(game.elementOrder)
      ? game.elementOrder
      : sorted.map(el => el[1]);
    const position = new Map(order.map((symbol, index) => [symbol, index]));
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

  const gameLimit = isLocalMultiplayerActive()
    ? localGame.elementLimit
    : (isOnlineRoomActive() ? getOnlineElementLimit() : 118);

  document.getElementById("elementsTitle").textContent =
    sortMode === "game" ? `Elements (${gameLimit})` :
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

  if (isOnlineRoomActive()) {
    attemptOnlinePlacement(this, symbol);
    return;
  }

  if (isLocalMultiplayerActive()) {
    handleMultiplayerDrop(this, symbol);
    return;
  }

  document.querySelectorAll(".slot").forEach(slot => {
    if (slot.dataset.placed === symbol) setSlotContent(slot, "");
  });

  setSlotContent(this, symbol);
  buildList(currentSort);
}

function dragFromSlot(e) {
  if (isOnlineRoomActive()) {
    e.preventDefault();
    return;
  }

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
  if (isLocalMultiplayerActive() || isOnlineRoomActive()) return;
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
  if (isLocalMultiplayerActive() || isOnlineRoomActive()) return;

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
  if (isLocalMultiplayerActive() || isOnlineRoomActive()) return;

  document.querySelectorAll(".slot").forEach(slot => {
    setSlotContent(slot, slot.dataset.answer);
    slot.classList.add("correct");
  });
  buildList(currentSort);
}

function resetTable() {
  if (isOnlineRoomActive()) return;

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
  if (isLocalMultiplayerActive() || isOnlineRoomActive()) return;

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

  if (isOnlineRoomActive()) {
    const placed = getOnlineCompletedSymbols().length;
    const limit = getOnlineElementLimit();
    score.textContent = `${placed} of ${limit} completed • ${Math.max(0, limit - placed)} remaining`;
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




document.getElementById("closeOnlineResultsButton").addEventListener("click", () => {
  document.getElementById("onlineResultsDialog").close();
});


document.getElementById("onlineRematchButton").addEventListener(
  "click",
  openOnlineRematchDialog
);

document.getElementById("startOnlineRematchButton").addEventListener(
  "click",
  startOnlineRematch
);

document.getElementById("cancelOnlineRematchButton").addEventListener(
  "click",
  () => {
    document.getElementById("onlineRematchDialog").close();

    if (
      isOnlineRoomActive() &&
      getOnlineGame() &&
      getOnlineGame().status === "finished"
    ) {
      document.getElementById("onlineResultsDialog").showModal();
    }
  }
);

document.getElementById("onlineRematchDialog").addEventListener(
  "cancel",
  event => {
    event.preventDefault();
    document.getElementById("cancelOnlineRematchButton").click();
  }
);

document.getElementById("leaveAfterOnlineGameButton").addEventListener("click", async () => {
  document.getElementById("onlineResultsDialog").close();
  await leaveOnlineRoom(true);
});

document.getElementById("createOnlineRoomButton").addEventListener("click", createOnlineRoom);
document.getElementById("joinOnlineRoomButton").addEventListener("click", joinOnlineRoom);

document.getElementById("onlineRoomCodeInput").addEventListener("input", event => {
  event.target.value = normaliseRoomCode(event.target.value);
});

document.getElementById("cancelOnlineGameButton").addEventListener("click", () => {
  document.getElementById("onlineMultiplayerDialog").close();
  clearInviteRoomFromUrl();
  showInviteInOnlineDialog("");
  document.getElementById("playModeSelect").value = isOnlineRoomActive() ? "online" : "single";
});

document.getElementById("onlineMultiplayerDialog").addEventListener("cancel", event => {
  event.preventDefault();
  document.getElementById("cancelOnlineGameButton").click();
});


document.getElementById("copyInviteLinkButton").addEventListener(
  "click",
  copyOnlineInviteLink
);

document.getElementById("copyRoomCodeButton").addEventListener("click", async () => {
  if (!onlineRoom) return;

  try {
    await navigator.clipboard.writeText(onlineRoom.code);
    const button = document.getElementById("copyRoomCodeButton");
    const oldText = button.textContent;
    button.textContent = "Copied";
    window.setTimeout(() => {
      button.textContent = oldText;
    }, 1000);
  } catch (error) {
    window.prompt("Copy this room code:", onlineRoom.code);
  }
});

document.getElementById("leaveOnlineRoomButton").addEventListener("click", () => {
  if (window.confirm("Leave this online room?")) {
    leaveOnlineRoom(true);
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
  renderOnlineRoomStatus();
  updateFirebaseLoadStatus();
  initialiseFirebaseOnline();
  requestAnimationFrame(fitLayoutToViewport);
})();