// ===== 彩虹顏色清單（大家共用） =====
const colors = ["#ff3b3b", "#ff9f1a", "#ffe600", "#3ddc84", "#2fa8ff", "#9b5cff"];


// ===== 1. 滑鼠移動時冒出小星星 =====
document.addEventListener("mousemove", function (e) {
  // 不要每次都產生，隨機跳過一些，避免太多
  if (Math.random() > 0.3) return;

  const star = document.createElement("div");
  star.className = "sparkle";
  star.textContent = "✨";
  star.style.left = e.clientX + "px";
  star.style.top = e.clientY + "px";
  document.body.appendChild(star);

  // 0.8 秒動畫結束後，把星星從畫面上移除（只是移除網頁元素，不是刪檔案）
  setTimeout(function () {
    star.remove();
  }, 800);
});


// ===== 2. 主圖 3D 傾斜效果 =====
const tiltBox = document.getElementById("tilt-box");

tiltBox.addEventListener("mousemove", function (e) {
  // 算出滑鼠在圖片裡的位置（0 ~ 1）
  const rect = tiltBox.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;

  // 換算成傾斜角度（-15 度 ~ 15 度）
  const rotateY = (x - 0.5) * 30;
  const rotateX = (0.5 - y) * 30;

  tiltBox.style.transform = "perspective(800px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
});

// 滑鼠離開時回正
tiltBox.addEventListener("mouseleave", function () {
  tiltBox.style.transform = "";
});


// ===== 3. 噴彩色碎紙 =====
function shootConfetti(x, y) {
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.background = colors[i % colors.length];
    piece.style.left = x + "px";
    piece.style.top = y + "px";
    document.body.appendChild(piece);

    // 隨機決定飛出去的方向和距離
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 150;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    // 用瀏覽器內建的動畫功能讓碎紙飛出去並淡出
    piece.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        { transform: "translate(" + dx + "px, " + (dy + 100) + "px) rotate(720deg)", opacity: 0 }
      ],
      { duration: 1000, easing: "ease-out" }
    );

    // 動畫結束後移除碎紙元素
    setTimeout(function () {
      piece.remove();
    }, 1000);
  }
}


// ===== 4. 購物車計數 =====
let cartCount = 0;
const cartNumber = document.getElementById("cart-count");

function addToCart(e) {
  cartCount = cartCount + 1;
  cartNumber.textContent = cartCount;

  // 讓數字跳一下：先拿掉 class，再加回去，動畫才會重播
  cartNumber.classList.remove("bump");
  void cartNumber.offsetWidth;
  cartNumber.classList.add("bump");

  // 在按鈕位置噴碎紙
  shootConfetti(e.clientX, e.clientY);
}

// 幫所有「加入購物車」按鈕綁定點擊
const addButtons = document.querySelectorAll(".add-btn");
addButtons.forEach(function (btn) {
  btn.addEventListener("click", addToCart);
});

// 主視覺的大按鈕也可以加入購物車
document.getElementById("hero-btn").addEventListener("click", addToCart);
