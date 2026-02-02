let currentScreen = 0;

function updateNav() {
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentScreen);
    });
}

function showScreen(n) {
    document.querySelectorAll('.screen').forEach((s, i) => {
        s.classList.toggle('hidden', i !== n);
    });
    currentScreen = n;
    updateNav();
    if (n === 2) initStep1(); // 具象分配第一步
    if (n === 4) initPractice(); // 練習題
    if (n === 5) {
        setTimeout(initGameCanvas, 50); // 確保 Canvas 尺寸正確
    }
}

function nextScreen() {
    showScreen(currentScreen + 1);
}

function jumpTo(n) {
    showScreen(n);
}

// --- 具象化操作：十位數分配 (42 / 3) ---
let step1Blocks = 4;
let step1Divided = [0, 0, 0];
function initStep1() {
    const container = document.getElementById('blocks-10-container');
    container.innerHTML = '';
    step1Blocks = 4;
    step1Divided = [0, 0, 0];
    for (let i = 0; i < 4; i++) {
        const b = document.createElement('div');
        b.className = 'block-10';
        b.onclick = () => divide10(b);
        container.appendChild(b);
    }
    for (let i = 0; i < 3; i++) {
        const bin = document.getElementById(`target-${i}`);
        let content = bin.querySelector('.bin-content');
        if (!content) {
            content = document.createElement('div');
            content.className = 'bin-content';
            bin.appendChild(content);
        }
        content.innerHTML = '';
    }
    document.getElementById('step1-msg').innerText = "點擊「10」的積木，分給三位小朋友。";
    document.getElementById('btn-break').classList.add('hidden');
}

function divide10(element) {
    let min = Math.min(...step1Divided);
    if (min >= 1 && step1Blocks > 1) { 
        // 每個都分到一個了，剩下的不夠分
    }
    
    let targetIdx = step1Divided.indexOf(min);
    if (step1Divided[targetIdx] >= 1) {
        document.getElementById('step1-msg').innerText = "剩下的不夠分給 3 個人了！我們要把剩下的 10 拆開。";
        document.getElementById('btn-break').classList.remove('hidden');
        return;
    }

    step1Divided[targetIdx]++;
    step1Blocks--;

    const targetBin = document.getElementById(`target-${targetIdx}`).querySelector('.bin-content');
    element.onclick = null;
    targetBin.appendChild(element);

    if (step1Blocks < 3) {
        document.getElementById('step1-msg').innerText = "剩下的不夠分給 3 個人了！我們要把剩下的 10 拆開。";
        document.getElementById('btn-break').classList.remove('hidden');
    }
}

function breakAndProceed() {
    nextScreen();
    initStep2();
}

// --- 具象化操作：個位數分配 ---
let step2Blocks = 12;
let step2Divided = [0, 0, 0];
function initStep2() {
    const container = document.getElementById('blocks-1-container');
    container.innerHTML = '';
    step2Blocks = 12;
    step2Divided = [0, 0, 0];
    for (let i = 0; i < 12; i++) {
        const b = document.createElement('div');
        b.className = 'block-1';
        b.onclick = () => divide1(b);
        container.appendChild(b);
    }
    for (let i = 0; i < 3; i++) {
        const bin = document.getElementById(`final-${i}`);
        let content = bin.querySelector('.bin-content');
        if (!content) {
            content = document.createElement('div');
            content.className = 'bin-content';
            bin.appendChild(content);
        }
        content.innerHTML = '';
        const b10 = document.createElement('div');
        b10.className = 'block-10';
        content.appendChild(b10);
    }
    document.getElementById('step2-msg').innerText = "點擊「1」的積木，分給小朋友。";
    document.getElementById('btn-practice').classList.add('hidden');
}

function divide1(el) {
    let min = Math.min(...step2Divided);
    let targetIdx = step2Divided.indexOf(min);
    step2Divided[targetIdx]++;
    step2Blocks--;

    const targetBin = document.getElementById(`final-${targetIdx}`).querySelector('.bin-content');
    el.onclick = null;
    targetBin.appendChild(el);

    if (step2Blocks === 0) {
        document.getElementById('step2-msg').innerHTML = "<b style='color:green'>分完了！每個人拿到 1 個十和 4 個一，答案是 14！</b>";
        document.getElementById('btn-practice').classList.remove('hidden');
    }
}

// --- 練習題 ---
let pQ = {};
function initPractice() {
    const d1 = Math.floor(Math.random() * 8) + 2; 
    const d2 = (Math.floor(Math.random() * 5) + 1) * 10 + Math.floor(Math.random() * 9); 
    pQ = { dividend: d2, divisor: d1, q: Math.floor(d2/d1), r: d2 % d1 };
    document.getElementById('practice-q').innerText = `${pQ.dividend} ÷ ${pQ.divisor} = ?`;
    document.getElementById('input-q').value = '';
    document.getElementById('input-r').value = '';
    document.getElementById('practice-feedback').classList.add('hidden');
    document.getElementById('btn-to-game').classList.add('hidden');
}

function checkPractice() {
    const uQ = parseInt(document.getElementById('input-q').value);
    const uR = parseInt(document.getElementById('input-r').value) || 0;
    const f = document.getElementById('practice-feedback');
    f.classList.remove('hidden');

    if (uQ === pQ.q && uR === pQ.r) {
        f.className = "feedback-bubble feedback-correct";
        f.innerText = "太棒了！完全正確！✨";
        document.getElementById('btn-to-game').classList.remove('hidden');
    } else {
        f.className = "feedback-bubble feedback-wrong";
        f.innerText = `不對喔。提示：${pQ.divisor} 乘以 ${uQ || 0} 是 ${pQ.divisor * (uQ||0)}，離 ${pQ.dividend} 還差一點。`;
    }
}

// --- 遊戲邏輯 ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let gameActive = false;
let score = 0;
let lives = 3;
let question = "";
let answer = 0;
let items = [];
let animId;

function initGameCanvas() {
    const container = document.getElementById('game-container');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}

function startGame() {
    document.getElementById('game-overlay').style.display = 'none';
    gameActive = true;
    score = 0;
    lives = 3;
    items = [];
    newGameQuest();
    if (animId) cancelAnimationFrame(animId);
    gameLoop();
}

function newGameQuest() {
    const div = Math.floor(Math.random() * 5) + 2;
    const dend = (Math.floor(Math.random() * 4) + 1) * 10;
    question = `${dend} ÷ ${div} = ?`;
    answer = Math.floor(dend / div);
    updateGameUI();
}

function spawnItem() {
    const isCorrect = Math.random() > 0.6;
    let val = isCorrect ? answer : Math.floor(Math.random() * 20);
    if (!isCorrect && val === answer) val++;
    items.push({
        x: Math.random() * (canvas.width - 80) + 40,
        y: -40,
        val: val,
        isCorrect: val === answer,
        speed: 1.0,
        radius: 35
    });
}

function gameLoop() {
    if (!gameActive) return;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "left";
    ctx.fillText(question, 20, 50);

    if (Math.random() < 0.015) spawnItem();

    for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.speed;

        ctx.beginPath();
        ctx.arc(it.x, it.y, it.radius, 0, Math.PI*2);
        ctx.fillStyle = "#4f46e5";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(it.val, it.x, it.y);

        if (it.y > canvas.height + it.radius) {
            if (it.isCorrect) {
                lives--;
                updateGameUI();
            }
            items.splice(i, 1);
        }
    }

    if (lives <= 0) {
        gameActive = false;
        document.getElementById('game-overlay').style.display = 'flex';
        document.getElementById('game-status').innerText = `分數: ${score}。加油，再試一次！`;
    } else {
        animId = requestAnimationFrame(gameLoop);
    }
}

function updateGameUI() {
    document.getElementById('game-score').innerText = score;
    document.getElementById('game-lives').innerText = lives;
}

canvas.addEventListener('mousedown', (e) => {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        const d = Math.sqrt((mx-it.x)**2 + (my-it.y)**2);
        if (d < it.radius + 10) {
            if (it.isCorrect) {
                score += 10;
                newGameQuest();
                items = [];
            } else {
                lives--;
            }
            updateGameUI();
            break;
        }
    }
});

window.onload = () => {
    initGameCanvas();
    showScreen(0);
};
