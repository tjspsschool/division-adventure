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
    if (n === 0) animateComic(); // 播放漫畫動畫
    if (n === 2) runMagicAnimation(); // 執行分堆魔法動畫
    if (n === 4) initStep1(); // 具象分配第一步
    if (n === 6) initPractice(); // 練習題
    if (n === 7) {
        setTimeout(initGameCanvas, 50); // 確保 Canvas 尺寸正確
    }
}

function runMagicAnimation() {
    const cookieContainer = document.getElementById('anim-cookies-container');
    const blockContainer = document.getElementById('anim-blocks-container');
    const msg = document.getElementById('anim-msg');
    const btn = document.getElementById('btn-anim-next');
    
    cookieContainer.innerHTML = '';
    blockContainer.innerHTML = '';
    msg.innerText = '準備好了嗎？魔法開始囉！';
    btn.classList.add('hidden');

    // 生成 42 個小圓點 (餅乾)
    for (let i = 0; i < 42; i++) {
        const c = document.createElement('div');
        c.className = 'block-1';
        c.style.position = 'absolute';
        c.style.left = Math.random() * 80 + 10 + '%';
        c.style.top = Math.random() * 60 + 10 + '%';
        c.style.transition = 'all 0.8s ease-in-out';
        cookieContainer.appendChild(c);
    }

    // 1秒後開始聚集
    setTimeout(() => {
        msg.innerText = '1, 2, 3... 嘿！把 10 個餅乾綑在一起！';
        const cookies = cookieContainer.querySelectorAll('.block-1');
        
        // 變出 4 個大積木 (10)
        for (let j = 0; j < 4; j++) {
            setTimeout(() => {
                const b10 = document.createElement('div');
                b10.className = 'block-10';
                b10.style.opacity = '0';
                b10.style.transition = 'opacity 0.5s';
                blockContainer.appendChild(b10);
                setTimeout(() => b10.style.opacity = '1', 50);

                // 讓 10 個小餅乾飛過去消失
                for (let k = 0; k < 10; k++) {
                    const idx = j * 10 + k;
                    cookies[idx].style.left = (40 + j * 5) + '%';
                    cookies[idx].style.top = '80%';
                    cookies[idx].style.opacity = '0';
                }
            }, j * 600);
        }

        // 剩下的 2 個
        setTimeout(() => {
            msg.innerText = '剩下的 2 個太小了，不用綑！';
            cookies[40].style.left = '65%';
            cookies[41].style.left = '70%';
            cookies[40].style.top = '70%';
            cookies[41].style.top = '70%';
            
            setTimeout(() => {
                msg.innerHTML = "✨ 魔法完成！我們現在有 <b style='color:var(--primary)'>4 個「10」</b> 和 <b style='color:var(--primary)'>2 個「1」</b> 了！";
                btn.classList.remove('hidden');
            }, 800);
        }, 2500);

    }, 1000);
}

function animateComic() {
    const panels = ['p1', 'p2', 'p3', 'p4'];
    panels.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('show');
            setTimeout(() => {
                el.classList.add('show');
            }, i * 800);
        }
    });
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
let pQ = { dividend: 0, divisor: 0, q: 0, r: 0 };
let practiceCount = 0;
let isAnswerCorrect = false;
const TOTAL_PRACTICE = 5;

function initPractice() {
    console.log("Initializing practice...");
    practiceCount = 0;
    isAnswerCorrect = false;
    nextPractice();
}

function nextPractice() {
    practiceCount++;
    isAnswerCorrect = false;
    console.log("Next practice:", practiceCount);
    
    const titleEl = document.getElementById('practice-title');
    const progressEl = document.getElementById('practice-progress');
    const qEl = document.getElementById('practice-q');
    const inputQ = document.getElementById('input-q');
    const inputR = document.getElementById('input-r');
    const btnCheck = document.getElementById('btn-check-answer');
    const btnGame = document.getElementById('btn-to-game');
    const spanRemainder = document.querySelector('#screen-4 span');

    if (practiceCount > TOTAL_PRACTICE) {
        titleEl.innerText = "🎉 挑戰成功！";
        progressEl.innerText = "你已經連續答對 5 題，是除法小達人！";
        qEl.innerHTML = "<div style='font-size: 6rem;'>🏆</div>";
        inputQ.classList.add('hidden');
        inputR.classList.add('hidden');
        if (spanRemainder) spanRemainder.classList.add('hidden');
        btnGame.classList.remove('hidden');
        btnCheck.classList.add('hidden');
        return;
    }

    progressEl.innerText = `第 ${practiceCount} / ${TOTAL_PRACTICE} 題`;
    const d1 = Math.floor(Math.random() * 8) + 2; 
    const d2 = (Math.floor(Math.random() * 5) + 1) * 10 + Math.floor(Math.random() * 9); 
    pQ = { dividend: d2, divisor: d1, q: Math.floor(d2/d1), r: d2 % d1 };
    
    qEl.innerText = `${pQ.dividend} ÷ ${pQ.divisor} = ?`;
    inputQ.value = '';
    inputR.value = '';
    
    inputQ.classList.remove('hidden');
    inputR.classList.remove('hidden');
    if (spanRemainder) spanRemainder.classList.remove('hidden');
    btnCheck.classList.remove('hidden');
    
    btnCheck.innerText = "檢查答案";
    btnCheck.classList.remove('btn-next-pulse');
    document.getElementById('practice-feedback').classList.add('hidden');
    btnGame.classList.add('hidden');
}

function handlePracticeButtonClick() {
    console.log("Button clicked, correct state:", isAnswerCorrect);
    if (isAnswerCorrect) {
        document.getElementById('practice-feedback').classList.add('hidden');
        nextPractice();
    } else {
        checkPractice();
    }
}

function checkPractice() {
    const inputQ = document.getElementById('input-q');
    const inputR = document.getElementById('input-r');
    const qVal = inputQ.value.trim();
    const rVal = inputR.value.trim();
    
    const f = document.getElementById('practice-feedback');
    f.classList.remove('hidden');

    if (qVal === "") {
        f.className = "feedback-bubble feedback-wrong";
        f.innerText = "請輸入答案喔！";
        return;
    }

    const uQ = parseInt(qVal);
    const uR = parseInt(rVal) || 0;

    if (uQ === pQ.q && uR === pQ.r) {
        isAnswerCorrect = true;
        f.className = "feedback-bubble feedback-correct";
        f.innerText = "太棒了！完全正確！✨";
        
        const btn = document.getElementById('btn-check-answer');
        btn.innerText = (practiceCount < TOTAL_PRACTICE) ? "挑戰下一題 ➜" : "查看總結 ➜";
        btn.classList.add('btn-next-pulse');
    } else {
        isAnswerCorrect = false;
        f.className = "feedback-bubble feedback-wrong";
        f.innerText = `不對喔。提示：${pQ.divisor} 乘以 ${uQ} 是 ${pQ.divisor * uQ}，離 ${pQ.dividend} 還差一點。`;
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
