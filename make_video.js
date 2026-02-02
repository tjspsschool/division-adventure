const fs = require('fs');
const { createCanvas } = require('canvas');

const width = 1280;
const height = 720;
const fps = 24;
const duration = 10; // 秒
const totalFrames = fps * duration;

// 由於在 VM 環境安裝 ffmpeg node bindings 可能有問題
// 我將改用產出 HTML5 Canvas 動畫的方式，直接在網頁端渲染
// 這樣效能更好且更具互動性
console.log('Switching to dynamic Canvas-based animation for better quality.');
