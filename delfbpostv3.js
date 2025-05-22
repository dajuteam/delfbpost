
// === 設定保險機制：確保設定不會被其他頁面 reload 清掉 ===
if (!localStorage.getItem("憲哥刪除延遲秒數")) {
  localStorage.setItem("憲哥刪除延遲秒數", "3");
}
if (!localStorage.getItem("fbRefreshCount")) {
  localStorage.setItem("fbRefreshCount", "10");
}


// === 初始化設定：從 localStorage 載入，設定預設值 ===
window.deleteDelaySeconds = parseInt(localStorage.getItem("憲哥刪除延遲秒數") || "3");
window.refreshCount = parseInt(localStorage.getItem("fbRefreshCount") || "10");

// === 動態同步設定：當右下控制區的 UI 輸入變更時，自動更新變數與 localStorage ===
function setupSettingSyncUI() {
  setTimeout(() => {
    const delayInput = document.querySelector("#delay-control input[type='number'][placeholder='自訂秒數']");
    const countInput = document.getElementById("refresh-count");

    if (delayInput) {
      delayInput.value = window.deleteDelaySeconds;
      delayInput.addEventListener("change", () => {
        const val = parseInt(delayInput.value) || 3;
        localStorage.setItem("憲哥刪除延遲秒數", val);
        window.deleteDelaySeconds = val;
      });
    }

    if (countInput) {
      countInput.value = window.refreshCount;
      countInput.addEventListener("change", () => {
        const val = parseInt(countInput.value) || 10;
        localStorage.setItem("fbRefreshCount", val);
        window.refreshCount = val;

        const status = document.getElementById("refresh-count-status");
        if (status) status.textContent = val;
      });
    }
  }, 1000);
}

setupSettingSyncUI();



function createDelayControlUI() {
  if (document.getElementById("delay-control")) return;

  const control = document.createElement("div");
  control.id = "delay-control";
  control.style = `
    position: fixed;
    bottom: 200px;
    right: 20px;
    background: rgba(0,0,0,0.9);
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 14px;
    font-family: sans-serif;
    color: #fff;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
  `;

  const message = document.createElement("div");
  message.id = "delay-message";
  message.style = "color: #00ff88; font-weight: bold;";
  message.textContent = `目前延遲設定為 ${window.deleteDelaySeconds} 秒`;
  control.appendChild(message);

  
  setTimeout(() => {
    const input = document.getElementById("refresh-count");
    const status = document.getElementById("refresh-count-status");
    if (input && status) {
      input.addEventListener("change", () => {
        localStorage.setItem("fbRefreshCount", input.value);
        status.textContent = input.value;
      });
    }
  }, 100);



  
  const refreshSettingRow = document.createElement("div");
  refreshSettingRow.style = "color: white;";
  refreshSettingRow.innerHTML = `
    每刪除 <input type="number" id="refresh-count" value="${localStorage.getItem('fbRefreshCount') || 10}" min="1" style="width: 50px;"> 篇會重新整理
    <span style="margin-left: 8px;">目前設定：<span id="refresh-count-status">${localStorage.getItem('fbRefreshCount') || 10}</span> 篇</span>
  `;
  control.appendChild(refreshSettingRow);


  const buttonRow = document.createElement("div");
  buttonRow.style = "display: flex; gap: 6px; flex-wrap: wrap;";

  const createBtn = (sec, highlight) => {
    const btn = document.createElement("button");
    btn.textContent = `${sec}秒`;
    btn.style.cssText = `
      background: ${highlight ? '#00ff88' : '#ffcc00'};
      color: #000;
      border: none;
      border-radius: 6px;
      padding: 4px 10px;
      cursor: pointer;
      font-weight: bold;
    `;
    btn.onclick = () => {
      window.deleteDelaySeconds = sec;
      localStorage.setItem("憲哥刪除延遲秒數", sec);
      message.textContent = `✅ 已設定延遲為 ${sec} 秒`;
      document.querySelectorAll("#delay-control button").forEach(b => {
        if (b.textContent.includes("秒")) {
          b.style.background = '#ffcc00';
        }
      });
      btn.style.background = '#00ff88';
    };
    return btn;
  };

  [3, 4, 5].forEach(sec => {
    const btn = createBtn(sec, window.deleteDelaySeconds === sec);
    buttonRow.appendChild(btn);
  });

  const input = document.createElement("input");
  input.type = "number";
  input.placeholder = "自訂秒數";
  input.style.cssText = "width: 60px; padding: 2px 4px; border-radius: 4px; border: 1px solid #ccc;";
  buttonRow.appendChild(input);

  const customBtn = document.createElement("button");
  customBtn.textContent = "自訂";
  customBtn.style.cssText = "background: #00bcd4; color: #fff; border: none; border-radius: 6px; padding: 4px 10px; cursor: pointer;";
  customBtn.onclick = () => {
    const sec = parseInt(input.value);
    if (!isNaN(sec) && sec > 0) {
      window.deleteDelaySeconds = sec;
      localStorage.setItem("憲哥刪除延遲秒數", sec);
      message.textContent = `✅ 已設定延遲為 ${sec} 秒`;
      document.querySelectorAll("#delay-control button").forEach(b => {
        if (b.textContent.includes("秒")) {
          b.style.background = '#ffcc00';
        }
      });
    }
  };
  buttonRow.appendChild(customBtn);

  const stopBtn = document.createElement("button");
  stopBtn.textContent = "⏸️ 暫停";
  stopBtn.style.cssText = "background: #ff4444; color: #fff; border: none; border-radius: 6px; padding: 4px 10px; cursor: pointer;";
  stopBtn.onclick = () => {
    window.stopDeleting = true;
    message.textContent = "⛔ 已暫停刪除程序";
  };
  buttonRow.appendChild(stopBtn);
  const reloadBtn = document.createElement("button");
  reloadBtn.textContent = "🔄 重新整理";
  reloadBtn.style.cssText = "background: #888; color: #fff; border: none; border-radius: 6px; padding: 4px 10px; cursor: pointer;";
  reloadBtn.onclick = () => {
    location.reload();
  };
  buttonRow.appendChild(reloadBtn);


  control.appendChild(buttonRow);
  document.body.appendChild(control);
}


window.deleteDelaySeconds = parseInt(localStorage.getItem('憲哥刪除延遲秒數')) || 3;


(async () => {
  console.log("🚀 自動啟動：等待畫面符合條件...");



window.deleteDelaySeconds = parseInt(localStorage.getItem("憲哥刪除延遲秒數")) || 3;



window.deleteDelaySeconds = parseInt(localStorage.getItem("憲哥刪除延遲秒數")) || 3;



window.deleteDelaySeconds = parseInt(localStorage.getItem("憲哥刪除延遲秒數")) || 3;




window.deleteDelaySeconds = parseInt(localStorage.getItem("憲哥刪除延遲秒數")) || 3;


  const delay = ms => new Promise(r => setTimeout(r, ms));

  function checkH2Condition() {
    const h2s = Array.from(document.querySelectorAll("h2"));
    return h2s.some(h => h.textContent.includes("社團貼文和留言"));
  }

  function observeAndStart() {
    const observer = new MutationObserver(() => {
      if (checkH2Condition()) {
        console.log("✅ 偵測到『社團貼文和留言』頁面，開始執行刪除程式");
        observer.disconnect();
        startAutoDelete();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function startAutoDelete() {
  createDelayControlUI();
  createDelayControlUI();
  createDelayControlUI();
  createDelayControlUI();
    (async () => {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const originalURL = window.location.href;
  const excludedGroupIds = ['1720947084815617'];

  
function getTopVisibleDate() {
  const h2s = Array.from(document.querySelectorAll('h2 span'));
  for (const span of h2s) {
    const text = span.innerText || '';
    if (/\d{4}年\d{1,2}月\d{1,2}日/.test(text)) {
      return text;
    }
  }
  return null;
}

function updateStatus(msg) {

    let box = document.getElementById('fb-delete-status');
    if (!box) {
      box = document.createElement('div');
      box.id = 'fb-delete-status';
      box.style = `
        position: fixed; bottom: 20px; right: 20px;
        background: rgba(0, 0, 0, 0.85);
        color: #ffcc00;
        border-radius: 10px;
        padding: 14px 18px;
        z-index: 9999;
        font-family: 'Segoe UI', sans-serif;
        font-size: 18px;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        max-width: 300px;
        line-height: 1.8;
      `;
      document.body.appendChild(box);
    }
    const dateText = getTopVisibleDate();
  const dateLine = dateText ? `<div style="font-size: 14px; color: #cccccc;">📅 畫面最上日期：${dateText}</div>` : '';
  box.innerHTML = `<b>憲哥提醒您：</b><br>${msg}${dateLine}`;
  }

  async function waitForPageStable(timeout = 7000, stableDuration = 1500) {
    return new Promise(resolve => {
      let timer;
      const observer = new MutationObserver(() => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          observer.disconnect();
          resolve();
        }, stableDuration);
      });
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
      setTimeout(() => {
        observer.disconnect();
        resolve();
      }, timeout);
    });
  }

  function getMenuButtons() {
    return Array.from(document.querySelectorAll('div[aria-label="動作選項"][role="button"]'))
      .filter(el => el.offsetParent !== null);
  }

  function isInExcludedGroup(menuBtn) {
    try {
      const container = menuBtn.closest('div[data-visualcompletion]');
      if (!container) return false;
      const groupLink = container.querySelector('a[href*="/groups/"]');
      if (!groupLink) return false;
      return excludedGroupIds.some(id => groupLink.href.includes(`/groups/${id}`));
    } catch (e) {
      return false;
    }
  }

  async function clickDeleteOption(menuBtn) {
    for (let attempt = 0; attempt < 3; attempt++) {
      menuBtn.click();
      await delay(400);
      let deleteBtn = Array.from(document.querySelectorAll('div[role="menu"] [role="menuitem"], ul[role="menu"] li'))
        .find(el => el.textContent.includes('刪除'));
      if (deleteBtn) {
        deleteBtn.click();
        await delay(400);
        return true;
      }
      await delay(500);
    }
    return false;
  }

  
let deletedCount = 0;

async function confirmDelete() {
    const confirmBtn = Array.from(document.querySelectorAll('div[role="dialog"] button, div[role="dialog"] [role="button"]'))
      .find(el => el.textContent.includes('刪除'));
    if (!confirmBtn) throw new Error('找不到刪除確認按鈕');
    confirmBtn.click();
    await delay(400);
    deletedCount++;
    console.log("🗑️ 成功刪除第", deletedCount, "篇");

    const refreshCount = window.refreshCount;
    if (deletedCount >= refreshCount && !window._refreshing) {
      window._refreshing = true;
      updateStatus("🔁 已刪除 10 篇，準備重新整理頁面...");
      localStorage.setItem('fbAutoReload', '1');
      setTimeout(() => {
  localStorage.setItem("憲哥刪除延遲秒數", window.deleteDelaySeconds);
  localStorage.setItem("fbRefreshCount", window.refreshCount);
  location.reload();
}, 1200);
    }
}


  async function navigateBackToOriginal() {
    if (window.location.href !== originalURL) {
      updateStatus('偵測到跳轉，正在返回刪除頁面...');
      window.location.href = originalURL;
      await waitForPageStable(10000, 1500);
      updateStatus('已返回刪除頁面，繼續刪除...');
      await delay(1000);
    }
  }

  async function deletePost(index) {
    await navigateBackToOriginal();
    if (window.stopDeleting) return false;

    let menuBtns = getMenuButtons();
    if (menuBtns.length === 0) {
      updateStatus('找不到動作選單按鈕，繼續嘗試中...');
      await delay(3000);
      return true;
    }

    let btn = null;
    for (let b of menuBtns) {
      if (!isInExcludedGroup(b)) {
        btn = b;
        break;
      }
    }

    if (!btn) {
      updateStatus('目前畫面上的貼文都來自排除的社團，將略過...');
      await delay(2000);
      return true;
    }

    btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    btn.style.outline = '3px solid red';
    btn.style.backgroundColor = 'yellow';
    btn.title = '🔴 正在刪除這篇貼文';

    try {
      updateStatus(`正在刪除第 ${index + 1} 篇貼文...`);
      const clicked = await clickDeleteOption(btn);
      if (!clicked) throw new Error('找不到刪除選項');
      await confirmDelete();

      for (let sec = window.deleteDelaySeconds; sec > 0; sec--) {
        updateStatus(`第 ${index + 1} 篇刪除成功 🎉<br>🚦 ${sec} 秒後返回刪除頁面...`);
        await delay(1000);
      }
      updateStatus('⏳ 返回中...');
      return true;
    } catch (e) {
      updateStatus(`第 ${index + 1} 篇刪除失敗：${e.message}，跳過...`);
      await delay(1000);
      return true;
    }
  }

  async function main() {
    updateStatus('準備開始刪除...');
    let count = 0;
    while (!window.stopDeleting) {
      const cont = await deletePost(count);
      if (!cont) break;
      count++;
    }
    updateStatus(`刪除結束，共刪除約 ${count} 篇貼文`);
  }

  main();
})();
  }

  // 初步延遲觀察啟動
  setTimeout(() => {
    if (checkH2Condition()) {
      console.log("✅ 初始載入時即符合條件，開始刪除");
      startAutoDelete();
    } else {
      console.log("⌛ 尚未符合條件，啟動觀察器...");
      observeAndStart();
    }
  }, 1000);
})();
