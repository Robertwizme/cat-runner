const scoreNode = document.getElementById("score");
const levelNameNode = document.getElementById("levelName");
const themeNameNode = document.getElementById("themeName");
const bossHud = document.getElementById("bossHud");
const bossNameNode = document.getElementById("bossName");
const bossHealthTextNode = document.getElementById("bossHealthText");
const bossHealthFillNode = document.getElementById("bossHealthFill");
const player = document.getElementById("player");
const overlay = document.getElementById("overlay");
const gameArea = document.getElementById("gameArea");
const world = document.getElementById("world");

const baseGroundHeight = 110;
const gravity = 0.9;
const baseJumpStrength = 17.5;
const baseMoveSpeed = 6;
const worldWidth = 3400;
const playerWidth = 60;
const playerHeight = 54;
const crumbleDelay = 420;
const crumbleRespawn = 1800;
const trapDelay = 260;

const shopItems = {
  jump: { label: "弹跳靴", cost: 10, description: "跳得更高" },
  speed: { label: "疾风铃", cost: 12, description: "跑得更快" },
  shield: { label: "护身叶", cost: 8, description: "抵挡一次伤害" }
};

shopItems.blaster = { label: "Blaster+", cost: 15, description: "子弹伤害 +1" };
shopItems.bundle = { label: "Supply Box", cost: 18, description: "加速、加跳和护盾" };

shopItems.blaster.label = "强力枪芯";
shopItems.blaster.description = "子弹伤害 +1";
shopItems.bundle.label = "冒险补给";
shopItems.bundle.description = "加速、加跳和护盾";

player.innerHTML = `
  <div class="cat-head">
    <div class="cat-face">
      <div class="cat-mask"></div>
      <div class="cat-eye left"></div>
      <div class="cat-eye right"></div>
      <div class="cat-nose"></div>
      <div class="cat-mouth"></div>
    </div>
  </div>
  <div class="cat-body"></div>
  <div class="cat-tail"></div>
`;

const basePatterns = [
  {
    playerStart: { x: 120, y: 110 },
    platforms: [
      { x: 0, y: 0, width: 600, height: 110, type: "solid" },
      { x: 760, y: 0, width: 520, height: 110, type: "solid" },
      { x: 1420, y: 90, width: 180, height: 24, type: "solid" },
      { x: 1730, y: 0, width: 880, height: 110, type: "solid" }
    ],
    hazards: [
      { x: 620, y: 0, width: 100, height: 44 },
      { x: 1300, y: 0, width: 90, height: 44 }
    ],
    springs: [
      { x: 1490, y: 114, width: 52, height: 22, boost: 23 }
    ],
    coins: [
      { x: 860, y: 150 },
      { x: 1130, y: 150 },
      { x: 1495, y: 160 },
      { x: 1910, y: 150 }
    ],
    enemyAnchor: { x: 820, y: 110 },
    goal: { x: 2470, y: 110, width: 22, height: 130 }
  },
  {
    playerStart: { x: 120, y: 110 },
    platforms: [
      { x: 0, y: 0, width: 360, height: 110, type: "solid" },
      { x: 500, y: 100, width: 170, height: 24, type: "solid" },
      { x: 710, y: 100, width: 86, height: 24, type: "solid" },
      { x: 820, y: 180, width: 170, height: 24, type: "solid" },
      { x: 1150, y: 260, width: 180, height: 24, type: "solid" },
      { x: 1520, y: 180, width: 180, height: 24, type: "solid" },
      { x: 1870, y: 90, width: 200, height: 24, type: "solid" },
      { x: 2210, y: 0, width: 520, height: 110, type: "solid" }
    ],
    hazards: [
      { x: 380, y: 0, width: 90, height: 44 },
      { x: 690, y: 0, width: 90, height: 44 },
      { x: 732, y: 128, width: 42, height: 42, type: "saw", range: 58, speed: 0.0024 },
      { x: 1020, y: 0, width: 90, height: 44 },
      { x: 1360, y: 0, width: 100, height: 44 },
      { x: 1730, y: 0, width: 100, height: 44 },
      { x: 2090, y: 0, width: 90, height: 44 }
    ],
    springs: [],
    coins: [
      { x: 560, y: 160 },
      { x: 880, y: 240 },
      { x: 1220, y: 320 },
      { x: 1585, y: 240 },
      { x: 1940, y: 150 }
    ],
    enemyAnchor: { x: 560, y: 124 },
    goal: { x: 2580, y: 110, width: 22, height: 130 }
  },
  {
    playerStart: { x: 120, y: 110 },
    platforms: [
      { x: 0, y: 0, width: 500, height: 110, type: "solid" },
      { x: 660, y: 0, width: 210, height: 110, type: "moving", axis: "y", range: 90, speed: 0.0018, phase: 0 },
      { x: 1010, y: 120, width: 180, height: 24, type: "moving", axis: "x", range: 110, speed: 0.0015, phase: 400 },
      { x: 1370, y: 210, width: 180, height: 24, type: "moving", axis: "x", range: 130, speed: 0.0017, phase: 900 },
      { x: 1780, y: 120, width: 180, height: 24, type: "moving", axis: "y", range: 80, speed: 0.0021, phase: 500 },
      { x: 2140, y: 0, width: 260, height: 110, type: "solid" },
      { x: 2480, y: 250, width: 260, height: 24, type: "solid" }
    ],
    hazards: [
      { x: 525, y: 0, width: 100, height: 44 },
      { x: 902, y: 0, width: 80, height: 44 },
      { x: 1245, y: 0, width: 90, height: 44 },
      { x: 1620, y: 0, width: 90, height: 44 },
      { x: 1990, y: 0, width: 90, height: 44 },
      { x: 2420, y: 0, width: 120, height: 44 }
    ],
    springs: [
      { x: 2310, y: 110, width: 52, height: 22, boost: 28 }
    ],
    coins: [
      { x: 720, y: 210 },
      { x: 1080, y: 190 },
      { x: 1450, y: 280 },
      { x: 1850, y: 220 },
      { x: 2325, y: 155 },
      { x: 2570, y: 320 }
    ],
    enemyAnchor: { x: 1060, y: 144 },
    goal: { x: 2640, y: 274, width: 22, height: 130 }
  },
  {
    playerStart: { x: 120, y: 110 },
    platforms: [
      { x: 0, y: 0, width: 380, height: 110, type: "solid" },
      { x: 530, y: 130, width: 180, height: 24, type: "crumble" },
      { x: 780, y: 150, width: 90, height: 24, type: "solid" },
      { x: 870, y: 200, width: 180, height: 24, type: "crumble" },
      { x: 1210, y: 130, width: 180, height: 24, type: "crumble" },
      { x: 1540, y: 210, width: 190, height: 24, type: "crumble" },
      { x: 1920, y: 120, width: 220, height: 24, type: "solid" },
      { x: 2280, y: 0, width: 480, height: 110, type: "solid" }
    ],
    hazards: [
      { x: 400, y: 0, width: 100, height: 44 },
      { x: 740, y: 0, width: 95, height: 44 },
      { x: 804, y: 178, width: 42, height: 42, type: "saw", range: 64, speed: 0.0021 },
      { x: 1090, y: 0, width: 95, height: 44 },
      { x: 1430, y: 0, width: 95, height: 44 },
      { x: 1780, y: 0, width: 110, height: 44 },
      { x: 2170, y: 0, width: 90, height: 44 }
    ],
    springs: [],
    coins: [
      { x: 600, y: 190 },
      { x: 940, y: 260 },
      { x: 1280, y: 190 },
      { x: 1600, y: 270 },
      { x: 1980, y: 180 }
    ],
    enemyAnchor: { x: 560, y: 154 },
    goal: { x: 2540, y: 110, width: 22, height: 130 }
  },
  {
    playerStart: { x: 120, y: 110 },
    platforms: [
      { x: 0, y: 0, width: 340, height: 110, type: "solid" },
      { x: 470, y: 90, width: 150, height: 24, type: "moving", axis: "x", range: 80, speed: 0.0017, phase: 200 },
      { x: 740, y: 170, width: 150, height: 24, type: "crumble" },
      { x: 1020, y: 250, width: 160, height: 24, type: "moving", axis: "y", range: 70, speed: 0.0022, phase: 420 },
      { x: 1330, y: 140, width: 170, height: 24, type: "crumble" },
      { x: 1640, y: 220, width: 180, height: 24, type: "moving", axis: "x", range: 90, speed: 0.0019, phase: 700 },
      { x: 1980, y: 110, width: 180, height: 24, type: "solid" },
      { x: 2300, y: 0, width: 520, height: 110, type: "solid" }
    ],
    hazards: [
      { x: 360, y: 0, width: 90, height: 44 },
      { x: 640, y: 0, width: 80, height: 44 },
      { x: 910, y: 0, width: 85, height: 44 },
      { x: 1210, y: 0, width: 90, height: 44 },
      { x: 1540, y: 0, width: 90, height: 44 },
      { x: 1860, y: 0, width: 90, height: 44 },
      { x: 2190, y: 0, width: 80, height: 44 }
    ],
    springs: [
      { x: 2060, y: 134, width: 52, height: 22, boost: 27 }
    ],
    coins: [
      { x: 520, y: 150 },
      { x: 790, y: 230 },
      { x: 1080, y: 330 },
      { x: 1390, y: 200 },
      { x: 1705, y: 300 },
      { x: 2075, y: 185 }
    ],
    enemyAnchor: { x: 760, y: 194 },
    goal: { x: 2660, y: 110, width: 22, height: 130 }
  }
];

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function getThemeEnemy(theme, x, y) {
  if (theme === "desert") {
    return { type: "snake", x, y, width: 60, height: 26, range: 110, speed: 0.0022, phase: 100 };
  }

  if (theme === "snow") {
    return { type: "bear", x, y, width: 74, height: 60, range: 90, speed: 0.0014, phase: 250 };
  }

  return { type: "monkey", x, y, width: 62, height: 48, range: 90, speed: 0.002, phase: 180 };
}

function getBossEnemy(theme, x, y) {
  if (theme === "desert") {
    return { type: "boss-snake", x, y, width: 92, height: 38, range: 150, speed: 0.003, phase: 0, boss: true, maxHealth: 25 };
  }

  if (theme === "snow") {
    return { type: "boss-bear", x, y, width: 108, height: 84, range: 135, speed: 0.0019, phase: 260, boss: true, maxHealth: 25 };
  }

  return { type: "boss-monkey", x, y, width: 90, height: 72, range: 145, speed: 0.0025, phase: 200, boss: true, maxHealth: 25 };
}

function buildBossArena(theme, chapterIndex, chapter) {
  const playerStart = { x: 140, y: 110 };
  const bossX = 760 + chapterIndex * 30;
  const arena = {
    playerStart,
    platforms: [
      { x: 0, y: 0, width: 520, height: 110, type: "solid" },
      { x: 620, y: 0, width: 520, height: 110, type: "solid" },
      { x: 1220, y: 0, width: 520, height: 110, type: "solid" },
      { x: 620, y: 150, width: 140, height: 24, type: theme === "desert" ? "moving" : "solid", axis: "x", range: 40, speed: 0.0016, phase: 140 },
      { x: 930, y: theme === "snow" ? 200 : 176, width: 150, height: 24, type: theme === "jungle" ? "crumble" : "solid" }
    ],
    hazards: [
      { x: 540, y: 0, width: 60, height: 50 + chapter.hazardBoost },
      { x: 1160, y: 0, width: 40, height: 54 + chapter.hazardBoost }
    ],
    springs: [
      { x: 1000, y: 110, width: 52, height: 22, boost: theme === "snow" ? 26 : 24 }
    ],
    coins: [
      { x: 470, y: 165 },
      { x: 700, y: 230 },
      { x: 1010, y: theme === "snow" ? 250 : 226 }
    ],
    guns: [
      { x: 280, y: 145 }
    ],
    enemies: [getBossEnemy(theme, bossX, 110)],
    goal: { x: 1540, y: 110, width: 22, height: 130 }
  };

  if (theme === "snow") {
    arena.platforms[3] = { x: 650, y: 190, width: 130, height: 24, type: "solid" };
    arena.hazards.push({ x: 820, y: 0, width: 70, height: 58 + chapter.hazardBoost });
    arena.goal.y = 110;
  }

  if (theme === "jungle") {
    arena.platforms.push({ x: 430, y: 180, width: 120, height: 24, type: "crumble" });
    arena.hazards.push({ x: 890, y: 0, width: 70, height: 64 + chapter.hazardBoost });
  }

  return arena;
}

function remixLevel(level, chapter, chapterIndex, patternIndex) {
  if (chapter.theme === "desert") {
    level.playerStart.x += patternIndex * 8;
    if (patternIndex % 2 === 0) {
      level.springs.push({ x: 900 + patternIndex * 120, y: 110, width: 52, height: 22, boost: 24 + chapterIndex });
    } else {
      level.hazards.push({ x: 1460 + patternIndex * 90, y: 0, width: 78, height: 52 + chapter.hazardBoost });
    }
    return;
  }

  if (chapter.theme === "snow") {
    level.platforms.push({
      x: 680 + patternIndex * 90,
      y: 220 - patternIndex * 18,
      width: 140,
      height: 24,
      type: patternIndex % 2 === 0 ? "moving" : "solid",
      axis: "x",
      range: 54,
      speed: 0.0015 + patternIndex * 0.00008,
      phase: 150 + patternIndex * 60
    });
    level.coins.push({ x: 740 + patternIndex * 90, y: 280 - patternIndex * 12 });
    return;
  }

  level.platforms.push({
    x: 560 + patternIndex * 110,
    y: 170 + (patternIndex % 2) * 36,
    width: 120,
    height: 24,
    type: patternIndex % 2 === 0 ? "crumble" : "solid"
  });
  level.hazards.push({ x: 930 + patternIndex * 120, y: 0, width: 84, height: 64 + chapter.hazardBoost });
  if (patternIndex % 2 === 1) {
    level.hazards.push({
      x: 598 + patternIndex * 110,
      y: 198 + (patternIndex % 2) * 36,
      width: 42,
      height: 42,
      type: "saw",
      range: 64,
      speed: 0.0023
    });
  }
  level.coins.push({ x: 610 + patternIndex * 110, y: 250 + (patternIndex % 2) * 24 });
}

function applyBossReward(levelIndex) {
  const bossNumber = Math.floor((levelIndex + 1) / 5);
  const rewardCoins = 6 + bossNumber * 2;
  setScore(score + rewardCoins);
  shieldCharges += 1;
  jumpUpgrade += 0.4;
  speedUpgrade += 0.25;
  return `Boss 奖励：+${rewardCoins} 金币、+1 护盾，还有一点速度和跳跃。`;
}

function buildCampaign() {
  const chapters = [
    { theme: "desert", label: "沙漠", hazardBoost: 0, enemyBoost: 0 },
    { theme: "snow", label: "雪原", hazardBoost: 12, enemyBoost: 0.0002 },
    { theme: "jungle", label: "雨林", hazardBoost: 24, enemyBoost: 0.0004 }
  ];

  const campaign = [];

  chapters.forEach((chapter, chapterIndex) => {
    basePatterns.forEach((pattern, patternIndex) => {
      const level = patternIndex === 4 ? buildBossArena(chapter.theme, chapterIndex, chapter) : clone(pattern);
      const number = chapterIndex * 5 + patternIndex + 1;
      const isBoss = patternIndex === 4;

      level.name = `${number} / 15`;
      level.theme = chapter.theme;
      level.themeLabel = isBoss ? `${chapter.label}Boss` : chapter.label;
      if (!isBoss) {
        remixLevel(level, chapter, chapterIndex, patternIndex);
        level.platforms.push({
          x: level.goal.x + 120,
          y: level.goal.y === 110 ? 0 : Math.max(0, level.goal.y - 24),
          width: 230,
          height: level.goal.y === 110 ? 110 : 24,
          type: patternIndex % 2 === 0 ? "solid" : "moving",
          axis: "x",
          range: patternIndex % 2 === 0 ? 0 : 50,
          speed: 0.0016 + patternIndex * 0.00008,
          phase: 500 + chapterIndex * 80
        });
        level.hazards.push({
          x: level.goal.x + 72,
          y: level.goal.y === 110 ? 110 : level.goal.y,
          width: 42,
          height: 42,
          type: "saw",
          range: 74,
          speed: 0.002 + chapterIndex * 0.0001
        });
        level.coins.push({ x: level.goal.x + 170, y: level.goal.y + 110 });
        level.goal = { ...level.goal, x: level.goal.x + 320 };
      }
      level.hazards = level.hazards.map((hazard, index) => ({
        ...hazard,
        height: hazard.height + chapter.hazardBoost,
        width: hazard.width + (chapterIndex > 0 && index % 2 === 0 ? 12 : 0)
      }));

      if (!isBoss) {
        const enemy = getThemeEnemy(chapter.theme, level.enemyAnchor.x, level.enemyAnchor.y);
        enemy.range += chapterIndex * 18;
        enemy.speed += chapter.enemyBoost;
        enemy.phase += chapterIndex * 120 + patternIndex * 40;
        level.enemies = [enemy];
      }

      campaign.push(level);
    });
  });

  return campaign;
}

const levels = buildCampaign();

let isRunning = false;
let isGameOver = false;
let score = 0;
let animationFrameId = null;
let currentLevelIndex = 0;
let currentLevel = null;
let platformData = [];
let hazardData = [];
let springData = [];
let coinData = [];
let gunData = [];
let enemyData = [];
let projectileData = [];
let goalData = null;
let resetRunOnStart = true;
let lastFrameTime = 0;
let jumpUpgrade = 0;
let speedUpgrade = 0;
let shieldCharges = 0;
let pendingNextLevelIndex = null;
let invincibleUntil = 0;
let hasBlaster = false;
let lastShotAt = 0;
let facingDirection = 1;
let dangerZoneData = [];
let blasterDamageBonus = 0;
let shotCooldownReduction = 0;

const keys = { left: false, right: false };

const playerState = {
  x: 0,
  y: 0,
  velocityX: 0,
  velocityY: 0,
  onGround: false,
  support: null
};

function getJumpPower() {
  return baseJumpStrength + jumpUpgrade;
}

function getMoveVelocity() {
  return baseMoveSpeed + speedUpgrade;
}

function createEntity(className, x, y, width, height, extraClass = "") {
  const node = document.createElement("div");
  node.className = `${className} ${extraClass}`.trim();
  node.style.left = `${x}px`;
  node.style.bottom = `${baseGroundHeight + y}px`;
  node.style.width = `${width}px`;
  node.style.height = `${height}px`;
  world.appendChild(node);
  return node;
}

function syncBounds(entity) {
  entity.left = entity.x;
  entity.right = entity.x + entity.width;
  entity.bottom = entity.y;
  entity.top = entity.y + entity.height;
}

function updateNodePosition(entity) {
  entity.node.style.left = `${entity.x}px`;
  entity.node.style.bottom = `${baseGroundHeight + entity.y}px`;
}

function isPlatformActive(platform) {
  return platform.type !== "crumble" || platform.active;
}

function findSupportPlatformAt(centerX, preferredY = 0) {
  let best = null;

  for (const platform of platformData) {
    if (!isPlatformActive(platform)) {
      continue;
    }

    if (centerX >= platform.left + 12 && centerX <= platform.right - 12) {
      if (!best || (platform.top >= best.top && platform.top <= preferredY + 160)) {
        best = platform;
      }
    }
  }

  return best;
}

function setScore(value) {
  score = value;
  scoreNode.textContent = String(score);
}

function getBossLabel(type) {
  if (type.includes("snake")) {
    return "沙海毒牙";
  }

  if (type.includes("bear")) {
    return "冰原巨掌";
  }

  return "雨林暴君";
}

function getActiveBoss() {
  return enemyData.find((enemy) => enemy.boss && !enemy.defeated) ?? null;
}

function updateBossHud() {
  const boss = getActiveBoss();
  if (!boss) {
    bossHud.classList.add("hidden");
    bossHealthFillNode.style.width = "0%";
    bossHealthTextNode.textContent = "0 / 0";
    return;
  }

  const ratio = Math.max(0, boss.health / boss.maxHealth);
  bossHud.classList.remove("hidden");
  bossNameNode.textContent = getBossLabel(boss.type);
  bossHealthTextNode.textContent = `${boss.health} / ${boss.maxHealth}`;
  bossHealthFillNode.style.width = `${ratio * 100}%`;
}

function spawnDangerZone({ x, y, width, height, type, duration = 900, damageAt = 650 }) {
  const now = performance.now();
  const zone = {
    x,
    y,
    width,
    height,
    type,
    createdAt: now,
    expiresAt: now + duration,
    damageAt: now + damageAt,
    triggered: false,
    node: createEntity("zone", x, y, width, height, type)
  };
  syncBounds(zone);
  dangerZoneData.push(zone);
}

function showOverlay(title, description, buttons) {
  overlay.classList.remove("hidden");
  overlay.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
    <div class="overlay-actions">
      ${buttons.map((button) => `<button type="button" data-action="${button.action}">${button.label}</button>`).join("")}
    </div>
  `;
}

function hideOverlay() {
  overlay.classList.add("hidden");
}

function jump(force = null) {
  if (!isRunning || isGameOver) {
    return;
  }

  if (playerState.onGround) {
    playerState.velocityY = force ?? getJumpPower();
    playerState.onGround = false;
    playerState.support = null;
  }
}

function getPlayerRect(nextX = playerState.x, nextY = playerState.y) {
  return {
    left: nextX,
    right: nextX + playerWidth,
    bottom: nextY,
    top: nextY + playerHeight
  };
}

function intersects(a, b) {
  return a.left < b.right && a.right > b.left && a.bottom < b.top && a.top > b.bottom;
}

function clearWorld() {
  for (const node of world.querySelectorAll(".platform, .hazard, .coin, .goal, .spring, .enemy, .projectile, .gun, .zone")) {
    node.remove();
  }
}

function buildPlatform(platform) {
  const item = {
    ...platform,
    baseX: platform.x,
    baseY: platform.y,
    prevX: platform.x,
    prevY: platform.y,
    deltaX: 0,
      deltaY: 0,
      active: true,
      crumbleTimer: 0,
      trapTimer: 0,
      respawnAt: 0,
      node: createEntity("platform", platform.x, platform.y, platform.width, platform.height, platform.type)
    };
  if (platform.type === "trap") {
    item.trapHazard = {
      x: platform.x,
      y: 0,
      width: platform.width,
      height: 42,
      armed: false,
      node: createEntity("hazard", platform.x, 0, platform.width, 42, "hidden")
    };
    syncBounds(item.trapHazard);
  }
  syncBounds(item);
  return item;
}

function loadLevel(index) {
  currentLevelIndex = index;
  currentLevel = levels[index];
  levelNameNode.textContent = currentLevel.name;
  themeNameNode.textContent = currentLevel.themeLabel;
  document.body.dataset.theme = currentLevel.theme;
  world.style.width = `${worldWidth}px`;
  clearWorld();

  platformData = currentLevel.platforms.map(buildPlatform);
  hazardData = currentLevel.hazards.map((hazard) => {
    const item = {
      ...hazard,
      baseX: hazard.x,
      baseY: hazard.y,
      phase: hazard.phase ?? 0,
      node: createEntity("hazard", hazard.x, hazard.y, hazard.width, hazard.height, hazard.type ?? "")
    };
    syncBounds(item);
    return item;
  });
  springData = currentLevel.springs.map((spring) => {
    const item = { ...spring, node: createEntity("spring", spring.x, spring.y, spring.width, spring.height) };
    syncBounds(item);
    return item;
  });
  gunData = (currentLevel.guns ?? []).map((gun) => {
    const item = {
      ...gun,
      width: 34,
      height: 18,
      collected: false,
      node: createEntity("gun", gun.x, gun.y, 34, 18)
    };
    syncBounds(item);
    return item;
  });
  coinData = currentLevel.coins.map((coin) => {
    const item = {
      ...coin,
      width: 24,
      height: 24,
      collected: false,
      node: createEntity("coin", coin.x, coin.y, 24, 24)
    };
    syncBounds(item);
    return item;
  });
  dangerZoneData = [];
  projectileData = [];
  enemyData = currentLevel.enemies.map((enemy) => {
    const item = {
      ...enemy,
      baseX: enemy.x,
      baseY: enemy.y,
      health: enemy.maxHealth ?? 1,
      maxHealth: enemy.maxHealth ?? 1,
      attackShift: 0,
      dashDirection: 0,
      dashUntil: 0,
      cooldownUntil: 0,
      specialCooldownUntil: 0,
      globalCooldownUntil: 0,
      rageUntil: 0,
      hurtUntil: 0,
      node: createEntity("enemy", enemy.x, enemy.y, enemy.width, enemy.height, `${enemy.type}${enemy.boss ? " boss" : ""}`)
    };
    const centerX = item.x + item.width / 2;
    item.supportPlatform = findSupportPlatformAt(centerX, item.baseY);
    item.y = item.supportPlatform ? item.supportPlatform.top : 0;
    syncBounds(item);
    updateNodePosition(item);
    return item;
  });
  for (const platform of platformData) {
    if (platform.trapHazard) {
      hazardData.push(platform.trapHazard);
    }
  }

  goalData = {
    ...currentLevel.goal,
    node: createEntity("goal", currentLevel.goal.x, currentLevel.goal.y, currentLevel.goal.width, currentLevel.goal.height)
  };
  syncBounds(goalData);
  goalData.right += 42;

  playerState.x = currentLevel.playerStart.x;
  playerState.y = currentLevel.playerStart.y;
  playerState.velocityX = 0;
  playerState.velocityY = 0;
  playerState.onGround = true;
  playerState.support = null;
  hasBlaster = false;
  lastShotAt = 0;
  facingDirection = 1;
  updateBossHud();
  updateCamera();
  renderPlayer();
}

function resetLevel() {
  isGameOver = false;
  loadLevel(currentLevelIndex);
}

function updateCamera() {
  const isMobileViewport = window.innerWidth <= 960;
  const isLandscapeViewport = window.innerWidth > window.innerHeight;
  const cameraScale = !isMobileViewport ? 1 : isLandscapeViewport ? 0.76 : 0.88;
  const viewportWidth = gameArea.clientWidth / cameraScale;
  const leadDistance = viewportWidth * (isMobileViewport ? 0.42 : 0.35);
  const maxTarget = Math.max(0, worldWidth - viewportWidth);
  const target = Math.max(0, Math.min(maxTarget, playerState.x - leadDistance));
  world.style.transform = `translateX(${-target}px) scale(${cameraScale})`;
}

function renderPlayer() {
  player.style.left = `${playerState.x - 10}px`;
  player.style.bottom = `${baseGroundHeight + playerState.y - 8}px`;
  player.classList.toggle("jumping", !playerState.onGround);
  player.classList.toggle("running", playerState.onGround && Math.abs(playerState.velocityX) > 0.5);
  player.classList.toggle("armed", hasBlaster);
  player.classList.toggle("facing-left", facingDirection < 0);
}

function updatePlatforms(now, deltaMs) {
  for (const platform of platformData) {
    platform.prevX = platform.x;
    platform.prevY = platform.y;

    if (platform.type === "moving") {
      const offset = Math.sin(now * platform.speed + platform.phase) * platform.range;
      platform.x = platform.axis === "x" ? platform.baseX + offset : platform.baseX;
      platform.y = platform.axis === "y" ? platform.baseY + offset : platform.baseY;
    }

      if (platform.type === "crumble") {
      if (platform.active && playerState.support === platform && playerState.onGround) {
        platform.crumbleTimer += deltaMs;
        if (platform.crumbleTimer >= crumbleDelay) {
          platform.active = false;
          platform.respawnAt = now + crumbleRespawn;
          playerState.support = null;
          playerState.onGround = false;
          platform.node.classList.add("hidden");
        }
      } else if (platform.active) {
        platform.crumbleTimer = 0;
      }

      if (!platform.active && now >= platform.respawnAt) {
        platform.active = true;
        platform.crumbleTimer = 0;
        platform.node.classList.remove("hidden");
      }
      }

      if (platform.type === "trap") {
        if (platform.active && playerState.support === platform && playerState.onGround) {
          platform.trapTimer += deltaMs;
          if (platform.trapTimer >= trapDelay) {
            platform.active = false;
            platform.respawnAt = now + crumbleRespawn;
            playerState.support = null;
            playerState.onGround = false;
            platform.node.classList.add("hidden");
            platform.trapHazard.armed = true;
            platform.trapHazard.node.classList.remove("hidden");
          }
        } else if (platform.active) {
          platform.trapTimer = 0;
        }

        if (!platform.active && now >= platform.respawnAt) {
          platform.active = true;
          platform.trapTimer = 0;
          platform.node.classList.remove("hidden");
          platform.trapHazard.armed = false;
          platform.trapHazard.node.classList.add("hidden");
        }
      }

      platform.deltaX = platform.x - platform.prevX;
      platform.deltaY = platform.y - platform.prevY;
      syncBounds(platform);
      updateNodePosition(platform);
      if (platform.trapHazard) {
        platform.trapHazard.x = platform.x;
        platform.trapHazard.y = 0;
        syncBounds(platform.trapHazard);
        updateNodePosition(platform.trapHazard);
      }
    }
  }

function spawnProjectile({ x, y, width, height, velocityX, velocityY, type, gravityScale = 0.24, owner = "enemy", damage = 1 }) {
  const projectile = {
    x,
    y,
    width,
    height,
    velocityX,
    velocityY,
    gravityScale,
    owner,
    damage,
    node: createEntity("projectile", x, y, width, height, type)
  };
  syncBounds(projectile);
  projectileData.push(projectile);
}

function spawnBanana(enemy, direction = Math.sign(playerState.x - enemy.x) || 1, velocityY = 3.5) {
  spawnProjectile({
    x: enemy.x + enemy.width / 2,
    y: enemy.y + enemy.height - 8,
    width: 24,
    height: 14,
    velocityX: direction * 5.2,
    velocityY,
    type: "banana"
  });
}

function spawnVenomVolley(enemy) {
  const direction = Math.sign(playerState.x - enemy.x) || 1;
  [-0.8, 0, 0.8].forEach((arc) => {
    spawnProjectile({
      x: enemy.x + enemy.width / 2,
      y: enemy.y + enemy.height - 2,
      width: 16,
      height: 16,
      velocityX: direction * (4.8 + Math.abs(arc)),
      velocityY: 3.2 + arc,
      type: "venom"
    });
  });
}

function spawnIceBurst(enemy) {
  [-2.6, 0, 2.6].forEach((vx) => {
    spawnProjectile({
      x: enemy.x + enemy.width / 2,
      y: enemy.y + enemy.height - 8,
      width: 16,
      height: 24,
      velocityX: vx,
      velocityY: 5.4,
      type: "ice"
    });
  });
}

function spawnShockwave(enemy) {
  [-1, 1].forEach((direction) => {
    spawnProjectile({
      x: enemy.x + enemy.width / 2 + direction * 18,
      y: enemy.y + 6,
      width: 34,
      height: 16,
      velocityX: direction * 4.4,
      velocityY: 0,
      type: "shockwave",
      gravityScale: 0
    });
  });
}

function spawnBananaRain(enemy) {
  const center = Math.max(140, Math.min(worldWidth - 140, playerState.x + playerWidth / 2));
  [-80, -25, 30, 85].forEach((offset) => {
    spawnProjectile({
      x: center + offset,
      y: enemy.y + 220,
      width: 24,
      height: 14,
      velocityX: offset * 0.02,
      velocityY: -1.2,
      type: "banana",
      gravityScale: 0.2
    });
  });
}

function spawnBossGlobalAttack(enemy) {
  if (enemy.type.includes("snake")) {
    spawnDangerZone({ x: 180, y: 0, width: 180, height: 150, type: "venom-rain", duration: 1100, damageAt: 760 });
    spawnDangerZone({ x: 720, y: 0, width: 180, height: 150, type: "venom-rain", duration: 1100, damageAt: 760 });
    spawnDangerZone({ x: 1260, y: 0, width: 180, height: 150, type: "venom-rain", duration: 1100, damageAt: 760 });
    return;
  }

  if (enemy.type.includes("bear")) {
    spawnDangerZone({ x: 0, y: 0, width: 540, height: 118, type: "ice-wave", duration: 1200, damageAt: 820 });
    spawnDangerZone({ x: 620, y: 0, width: 520, height: 118, type: "ice-wave", duration: 1200, damageAt: 820 });
    spawnDangerZone({ x: 1220, y: 0, width: 520, height: 118, type: "ice-wave", duration: 1200, damageAt: 820 });
    return;
  }

  spawnDangerZone({ x: 260, y: 0, width: 200, height: 340, type: "banana-storm", duration: 1000, damageAt: 700 });
  spawnDangerZone({ x: 760, y: 0, width: 200, height: 340, type: "banana-storm", duration: 1000, damageAt: 700 });
  spawnDangerZone({ x: 1260, y: 0, width: 200, height: 340, type: "banana-storm", duration: 1000, damageAt: 700 });
}

function shootBlaster() {
  if (!isRunning || isGameOver || !hasBlaster) {
    return;
  }

  const now = performance.now();
  if (now - lastShotAt < Math.max(110, 220 - shotCooldownReduction)) {
    return;
  }

  lastShotAt = now;
  spawnProjectile({
    x: playerState.x + (facingDirection > 0 ? playerWidth - 4 : -10),
    y: playerState.y + 26,
    width: 18,
    height: 8,
    velocityX: facingDirection * 10.5,
    velocityY: 0,
    type: "cat-bullet",
    gravityScale: 0,
    owner: "player",
    damage: 1 + blasterDamageBonus
  });
}

function updateEnemies(now, deltaMs) {
  for (const enemy of enemyData) {
    if (enemy.defeated) {
      continue;
    }

    const playerNear = Math.abs(playerState.x - enemy.x) < (enemy.boss ? 380 : 260);
    const direction = Math.sign(playerState.x - enemy.x) || 1;

    if (enemy.type.includes("snake") && playerNear && now > enemy.cooldownUntil) {
      enemy.dashDirection = direction;
      enemy.dashUntil = now + (enemy.boss ? 900 : 650);
      enemy.cooldownUntil = now + (enemy.boss ? 1500 : 2200);
    }

    if (enemy.type.includes("bear") && playerNear && now > enemy.cooldownUntil) {
      enemy.dashDirection = direction;
      enemy.dashUntil = now + (enemy.boss ? 1200 : 950);
      enemy.cooldownUntil = now + (enemy.boss ? 1700 : 2600);
    }

    if (enemy.type.includes("monkey") && playerNear && now > enemy.cooldownUntil) {
      if (enemy.boss) {
        spawnBanana(enemy, direction, 4.2);
        spawnBanana(enemy, direction * 0.8, 5.1);
      } else {
        spawnBanana(enemy);
      }
      enemy.cooldownUntil = now + (enemy.boss ? 1500 : 2400);
    }

    if (enemy.boss && playerNear && now > enemy.specialCooldownUntil) {
      if (enemy.type.includes("snake")) {
        spawnVenomVolley(enemy);
        enemy.specialCooldownUntil = now + 2400;
      } else if (enemy.type.includes("bear")) {
        spawnIceBurst(enemy);
        spawnShockwave(enemy);
        enemy.specialCooldownUntil = now + 2800;
      } else if (enemy.type.includes("monkey")) {
        spawnBananaRain(enemy);
        enemy.specialCooldownUntil = now + 2600;
      }
    }

    if (enemy.boss && playerNear && now > (enemy.globalCooldownUntil ?? 0)) {
      spawnBossGlobalAttack(enemy);
      enemy.globalCooldownUntil = now + 4200;
    }

    const offset = Math.sin(now * enemy.speed + enemy.phase) * enemy.range;
    const supportPlatform = enemy.supportPlatform;
    const leftBound = supportPlatform ? supportPlatform.left + 8 : enemy.baseX - enemy.range;
    const rightBound = supportPlatform ? supportPlatform.right - enemy.width - 8 : enemy.baseX + enemy.range;

    if (now < enemy.dashUntil) {
      const dashSpeed = enemy.type.includes("bear")
        ? (enemy.boss ? 3.1 : 2.3)
        : (enemy.boss ? 4.5 : 3.6);
      enemy.attackShift += enemy.dashDirection * dashSpeed * (deltaMs / 16);
    } else {
      enemy.attackShift *= 0.84;
    }

    enemy.x = Math.max(leftBound, Math.min(rightBound, enemy.baseX + offset + enemy.attackShift));
    enemy.y = supportPlatform ? supportPlatform.top : 0;
    syncBounds(enemy);
    updateNodePosition(enemy);
    enemy.node.classList.toggle("hurt", now < enemy.hurtUntil);
  }

  updateBossHud();
}

function updateProjectiles(deltaMs) {
  const nextProjectiles = [];

  for (const projectile of projectileData) {
    projectile.x += projectile.velocityX * (deltaMs / 16);
    projectile.y += projectile.velocityY * (deltaMs / 16);
    projectile.velocityY -= (projectile.gravityScale ?? 0.24) * (deltaMs / 16);
    syncBounds(projectile);
    updateNodePosition(projectile);

    if (projectile.owner === "player") {
      let hitBoss = false;
      for (const enemy of enemyData) {
        if (!enemy.boss || enemy.defeated) {
          continue;
        }

        if (intersects(projectile, enemy)) {
          projectile.node.remove();
          damageBoss(enemy, projectile.damage ?? 1);
          hitBoss = true;
          break;
        }
      }

      if (hitBoss) {
        continue;
      }
    }

    if (projectile.y < -40 || projectile.x < -80 || projectile.x > worldWidth + 80) {
      projectile.node.remove();
      continue;
    }

    nextProjectiles.push(projectile);
  }

  projectileData = nextProjectiles;
}

function updateDangerZones() {
  const now = performance.now();
  const nextZones = [];
  const playerRect = getPlayerRect();

  for (const zone of dangerZoneData) {
    const armed = now >= zone.damageAt;
    zone.node.classList.toggle("armed", armed);

    if (!zone.triggered && armed && intersects(playerRect, zone)) {
      zone.triggered = true;
      endGame();
    }

    if (now >= zone.expiresAt) {
      zone.node.remove();
      continue;
    }

    nextZones.push(zone);
  }

  dangerZoneData = nextZones;
}

function updateHazards(now) {
  for (const hazard of hazardData) {
    if (hazard.type !== "saw") {
      continue;
    }

    const offset = Math.sin(now * hazard.speed + hazard.phase) * (hazard.range ?? 0);
    hazard.x = hazard.baseX + offset;
    hazard.y = hazard.baseY;
    syncBounds(hazard);
    updateNodePosition(hazard);
  }
}

function carryPlayerByPlatform() {
  if (!playerState.onGround || !playerState.support || !isPlatformActive(playerState.support)) {
    return;
  }

  playerState.x += playerState.support.deltaX;
  playerState.y += playerState.support.deltaY;
}

function applyHorizontalMovement() {
  if (keys.left === keys.right) {
    playerState.velocityX = 0;
  } else if (keys.left) {
    playerState.velocityX = -getMoveVelocity();
  } else if (keys.right) {
    playerState.velocityX = getMoveVelocity();
  }

  const nextX = Math.max(0, Math.min(worldWidth - playerWidth, playerState.x + playerState.velocityX));
  const nextRect = getPlayerRect(nextX, playerState.y);

  for (const platform of platformData) {
    if (!isPlatformActive(platform) || !intersects(nextRect, platform)) {
      continue;
    }

    const playerBottom = playerState.y;
    const playerTop = playerState.y + playerHeight;
    if (playerBottom >= platform.top - 14 || playerTop > platform.top + 20) {
      continue;
    }

    if (playerState.velocityX > 0) {
      playerState.x = platform.left - playerWidth;
      return;
    }

    if (playerState.velocityX < 0) {
      playerState.x = platform.right;
      return;
    }
  }

  for (const spring of springData) {
    const overlapsVertically =
      playerState.y < spring.top &&
      playerState.y + playerHeight > spring.bottom + 6;

    if (!overlapsVertically) {
      continue;
    }

    if (nextRect.right > spring.left && nextRect.left < spring.right) {
      if (playerState.velocityX > 0) {
        playerState.x = spring.left - playerWidth;
        return;
      }

      if (playerState.velocityX < 0) {
        playerState.x = spring.right;
        return;
      }
    }
  }

  playerState.x = nextX;
}

function applyVerticalMovement() {
  playerState.velocityY -= gravity;
  const nextY = playerState.y + playerState.velocityY;
  const nextRect = getPlayerRect(playerState.x, nextY);
  playerState.onGround = false;
  playerState.support = null;

  for (const platform of platformData) {
    if (!isPlatformActive(platform)) {
      continue;
    }

    const overlapsHorizontally = nextRect.right > platform.left && nextRect.left < platform.right;
    if (!overlapsHorizontally) {
      continue;
    }

    const standingOnPlatform =
      playerState.velocityY <= 0 &&
      playerState.y >= platform.top - 18 &&
      nextY <= platform.top;
    const hittingPlatformBottom =
      playerState.y + playerHeight <= platform.bottom &&
      nextY + playerHeight >= platform.bottom;

    if (standingOnPlatform) {
      playerState.y = platform.top;
      playerState.velocityY = 0;
      playerState.onGround = true;
      playerState.support = platform;
      return;
    }

    if (hittingPlatformBottom) {
      playerState.y = platform.bottom - playerHeight;
      playerState.velocityY = 0;
      return;
    }
  }

  if (nextY <= 0) {
    playerState.y = 0;
    playerState.velocityY = 0;
    playerState.onGround = true;
    return;
  }

  playerState.y = nextY;
}

function handleSprings() {
  const playerRect = getPlayerRect();
  for (const spring of springData) {
    const landingOnSpring =
      playerRect.right > spring.left &&
      playerRect.left < spring.right &&
      Math.abs(playerRect.bottom - spring.top) < 12 &&
      playerState.velocityY <= 0;

    if (landingOnSpring) {
      playerState.y = spring.top;
      playerState.onGround = true;
      jump(spring.boost);
      return;
    }
  }
}

function collectCoins() {
  const playerRect = getPlayerRect();
  for (const coin of coinData) {
    if (coin.collected || !intersects(playerRect, coin)) {
      continue;
    }
    coin.collected = true;
    coin.node.remove();
    setScore(score + 1);
  }
}

function collectGuns() {
  const playerRect = getPlayerRect();
  for (const gun of gunData) {
    if (gun.collected || !intersects(playerRect, gun)) {
      continue;
    }

    gun.collected = true;
    gun.node.remove();
    hasBlaster = true;
    renderPlayer();
  }
}

function damageBoss(enemy, damage) {
  const now = performance.now();
  if (now < enemy.hurtUntil) {
    return false;
  }

  enemy.health -= damage;
  enemy.hurtUntil = now + 140;
  enemy.cooldownUntil = Math.min(enemy.cooldownUntil, now + 180);
  enemy.specialCooldownUntil = Math.min(enemy.specialCooldownUntil, now + 280);
  updateBossHud();

  if (enemy.health > 0) {
    return false;
  }

  enemy.defeated = true;
  enemy.node.remove();
  setScore(score + (enemy.boss ? 12 : 3));
  updateBossHud();
  return true;
}

function defeatEnemy(enemy) {
  if (enemy.boss) {
    playerState.velocityY = getJumpPower() * 0.72;
    playerState.onGround = false;
    playerState.support = null;
    return;
  }

  enemy.defeated = true;
  enemy.node.remove();
  setScore(score + 3);
  playerState.velocityY = getJumpPower() * 0.55;
  playerState.onGround = false;
  playerState.support = null;
}

function endGame() {
  if (performance.now() < invincibleUntil) {
    return;
  }

  if (shieldCharges > 0) {
    const touchingEnemy = enemyData.find((enemy) => !enemy.defeated && intersects(getPlayerRect(), enemy));
    const knockDirection = touchingEnemy ? Math.sign(playerState.x - touchingEnemy.x) || -1 : -1;
    shieldCharges -= 1;
    invincibleUntil = performance.now() + 900;
    playerState.x = Math.max(0, Math.min(worldWidth - playerWidth, playerState.x + knockDirection * 92));
    playerState.velocityY = getJumpPower() * 0.65;
    playerState.velocityX = knockDirection * getMoveVelocity() * 0.9;
    playerState.onGround = false;
    playerState.support = null;
    return;
  }

  isGameOver = true;
  isRunning = false;
  cancelAnimationFrame(animationFrameId);
  showOverlay("本关失败", "这关机关比较多，按 R 或按钮重新挑战。", [
    { action: "restart", label: "重开本关" }
  ]);
}

function checkEnemies() {
  if (performance.now() < invincibleUntil) {
    return false;
  }

  const playerRect = getPlayerRect();

  for (const projectile of projectileData) {
    if (projectile.owner === "player") {
      continue;
    }
    if (intersects(playerRect, projectile)) {
      projectile.node.remove();
      projectileData = projectileData.filter((item) => item !== projectile);
      endGame();
      return true;
    }
  }

  for (const enemy of enemyData) {
    if (enemy.defeated) {
      continue;
    }

    const stomped =
      playerState.velocityY < 0 &&
      playerRect.bottom <= enemy.top + 14 &&
      playerRect.bottom >= enemy.top - 10 &&
      playerRect.right > enemy.left + 8 &&
      playerRect.left < enemy.right - 8;

    if (stomped) {
      defeatEnemy(enemy);
      return false;
    }

    if (intersects(playerRect, enemy)) {
      endGame();
      return true;
    }
  }
  return false;
}

function showShop(message = "打完 Boss 了，花金币买点道具再继续。") {
  showOverlay("Boss 商店", `${message} 你现在有 ${score} 金币。`, [
    { action: "buy-jump", label: `${shopItems.jump.label} - ${shopItems.jump.cost}` },
    { action: "buy-speed", label: `${shopItems.speed.label} - ${shopItems.speed.cost}` },
    { action: "buy-shield", label: `${shopItems.shield.label} - ${shopItems.shield.cost}` },
    { action: "next", label: "继续冒险" }
  ]);
  const actions = overlay.querySelector(".overlay-actions");
  if (actions) {
    actions.insertAdjacentHTML(
      "afterbegin",
      `<button type="button" data-action="buy-bundle">${shopItems.bundle.label} - ${shopItems.bundle.cost}</button>`
    );
    actions.insertAdjacentHTML(
      "beforeend",
      `<button type="button" data-action="buy-blaster">${shopItems.blaster.label} - ${shopItems.blaster.cost}</button>`
    );
  }
}

function buyShopItem(itemKey) {
  const item = shopItems[itemKey];
  if (!item) {
    return;
  }

  if (score < item.cost) {
    showShop("金币不够，再去多收集一些。");
    return;
  }

  setScore(score - item.cost);

  if (itemKey === "jump") {
    jumpUpgrade += 1.5;
  } else if (itemKey === "speed") {
    speedUpgrade += 0.7;
  } else if (itemKey === "shield") {
    shieldCharges += 1;
  } else if (itemKey === "blaster") {
    blasterDamageBonus += 1;
    shotCooldownReduction += 18;
  } else if (itemKey === "bundle") {
    jumpUpgrade += 0.9;
    speedUpgrade += 0.45;
    shieldCharges += 1;
  }

  showShop(`已购买 ${item.label}。`);
}

function finishLevel() {
  cancelAnimationFrame(animationFrameId);
  isRunning = false;

  const isBossLevel = (currentLevelIndex + 1) % 5 === 0;

  if (currentLevelIndex === levels.length - 1) {
    showOverlay("全部通关", `你一共收集了 ${score} 枚金币。按按钮重新挑战全部关卡。`, [
      { action: "start", label: "重新开始" }
    ]);
    currentLevelIndex = 0;
    resetRunOnStart = true;
    return;
  }

  if (isBossLevel) {
    pendingNextLevelIndex = currentLevelIndex + 1;
    showShop(applyBossReward(currentLevelIndex));
    return;
  }

  currentLevelIndex += 1;
  showOverlay("过关了", "继续前进，下一关会更难一些。", [
    { action: "start", label: "进入下一关" }
  ]);
}

function checkHazardsAndGoal() {
  const playerRect = getPlayerRect();

  for (const hazard of hazardData) {
    if (hazard.armed === false) {
      continue;
    }
    if (intersects(playerRect, hazard)) {
      endGame();
      return;
    }
  }

  if (goalData && intersects(playerRect, goalData)) {
    if (getActiveBoss()) {
      return;
    }
    finishLevel();
  }
}

function gameLoop(now) {
  if (!lastFrameTime) {
    lastFrameTime = now;
  }

  const deltaMs = Math.min(32, now - lastFrameTime);
  lastFrameTime = now;

  updatePlatforms(now, deltaMs);
  updateHazards(now);
  updateEnemies(now, deltaMs);
  updateProjectiles(deltaMs);
  updateDangerZones();
  carryPlayerByPlatform();
  applyHorizontalMovement();
  applyVerticalMovement();
  handleSprings();
  collectCoins();
  collectGuns();
  if (checkEnemies()) {
    renderPlayer();
    updateCamera();
    return;
  }
  checkHazardsAndGoal();
  renderPlayer();
  updateCamera();

  if (isRunning && !isGameOver) {
    animationFrameId = requestAnimationFrame(gameLoop);
  }
}

function startGame() {
  if (resetRunOnStart) {
    setScore(0);
    resetRunOnStart = false;
    jumpUpgrade = 0;
    speedUpgrade = 0;
    shieldCharges = 0;
    blasterDamageBonus = 0;
    shotCooldownReduction = 0;
  }

  hideOverlay();
  resetLevel();
  lastFrameTime = 0;
  isRunning = true;
  animationFrameId = requestAnimationFrame(gameLoop);
}

function restartLevel() {
  hideOverlay();
  resetLevel();
  lastFrameTime = 0;
  isRunning = true;
  cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(gameLoop);
}

function handleKeyDown(event) {
  if (event.code === "KeyA" || event.code === "ArrowLeft") {
    keys.left = true;
    facingDirection = -1;
  }

  if (event.code === "KeyD" || event.code === "ArrowRight") {
    keys.right = true;
    facingDirection = 1;
  }

  if (event.code === "Space" || event.code === "ArrowUp" || event.code === "KeyW") {
    event.preventDefault();
    jump();
  }

  if (event.code === "KeyR") {
    shootBlaster();
  }

  if (event.code === "KeyT") {
    restartLevel();
  }
}

function handleKeyUp(event) {
  if (event.code === "KeyA" || event.code === "ArrowLeft") {
    keys.left = false;
  }

  if (event.code === "KeyD" || event.code === "ArrowRight") {
    keys.right = false;
  }
}

function handleTouchControlPress(control) {
  if (control === "left") {
    keys.left = true;
    facingDirection = -1;
    return;
  }

  if (control === "right") {
    keys.right = true;
    facingDirection = 1;
    return;
  }

  if (control === "jump") {
    jump();
    return;
  }

  if (control === "shoot") {
    shootBlaster();
    return;
  }

  if (control === "restart") {
    restartLevel();
  }
}

function handleTouchControlRelease(control) {
  if (control === "left") {
    keys.left = false;
  }

  if (control === "right") {
    keys.right = false;
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
window.addEventListener("resize", updateCamera);

for (const button of document.querySelectorAll("[data-control]")) {
  const control = button.dataset.control;
  const press = (event) => {
    event.preventDefault();
    handleTouchControlPress(control);
  };
  const release = (event) => {
    if (event) {
      event.preventDefault();
    }
    handleTouchControlRelease(control);
  };

  button.addEventListener("pointerdown", press);
  button.addEventListener("touchstart", press, { passive: false });
  button.addEventListener("mousedown", press);

  button.addEventListener("pointerup", release);
  button.addEventListener("touchend", release, { passive: false });
  button.addEventListener("mouseup", release);

  button.addEventListener("pointercancel", release);
  button.addEventListener("touchcancel", release, { passive: false });

  button.addEventListener("pointerleave", release);
  button.addEventListener("mouseleave", release);

  button.addEventListener("click", (event) => {
    if (control === "jump" || control === "shoot" || control === "restart") {
      event.preventDefault();
      handleTouchControlPress(control);
    }
  });
}

overlay.addEventListener("click", (event) => {
  if (event.target.tagName !== "BUTTON") {
    return;
  }

  const action = event.target.dataset.action;

  if (action === "start" || action === "next") {
    if (pendingNextLevelIndex !== null) {
      currentLevelIndex = pendingNextLevelIndex;
      pendingNextLevelIndex = null;
    }
    startGame();
    return;
  }

  if (action === "restart") {
    restartLevel();
    return;
  }

  if (action === "buy-jump") {
    buyShopItem("jump");
    return;
  }

  if (action === "buy-speed") {
    buyShopItem("speed");
    return;
  }

  if (action === "buy-shield") {
    buyShopItem("shield");
    return;
  }

  if (action === "buy-blaster") {
    buyShopItem("blaster");
    return;
  }

  if (action === "buy-bundle") {
    buyShopItem("bundle");
  }
});

setScore(0);
loadLevel(0);
