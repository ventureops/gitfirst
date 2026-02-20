(function () {
  'use strict';

  const TRANSFER_SCREEN = 'transfer-screen';
  const PROGRESS_SCREEN = 'progress-screen';
  const COMPLETE_SCREEN = 'complete-screen';

  const INITIAL_BALANCE = 30.44;
  const INITIAL_AMOUNT = 12.25;

  let currentAmount = INITIAL_AMOUNT;
  let currentBalance = INITIAL_BALANCE;

  const elements = {
    transferScreen: document.getElementById(TRANSFER_SCREEN),
    progressScreen: document.getElementById(PROGRESS_SCREEN),
    completeScreen: document.getElementById(COMPLETE_SCREEN),
    amountValue: document.getElementById('amount-value'),
    balanceValue: document.getElementById('balance-value'),
    progressAmount: document.getElementById('progress-amount'),
    completeAmount: document.getElementById('complete-amount'),
    progressBar: document.getElementById('progress-bar'),
    sendBtn: document.getElementById('send-btn'),
    doneBtn: document.getElementById('done-btn'),
  };

  const CIRCLE_LENGTH = 2 * Math.PI * 45; // r=45

  function showScreen(screenId) {
    [elements.transferScreen, elements.progressScreen, elements.completeScreen].forEach(function (el) {
      el.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
  }

  function updateAmountDisplay() {
    elements.amountValue.textContent = currentAmount.toFixed(2);
  }

  function updateBalanceDisplay() {
    elements.balanceValue.textContent = currentBalance.toFixed(2);
  }

  function initKeypad() {
    document.querySelectorAll('.key').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const key = btn.dataset.key;
        if (key === 'back') {
          var str = String(currentAmount);
          if (str.length <= 1 || parseFloat(str) === 0) {
            currentAmount = 0;
          } else {
            currentAmount = parseFloat(str.slice(0, -1)) || 0;
          }
        } else if (key === '.') {
          if (!String(currentAmount).includes('.')) {
            currentAmount = parseFloat(String(currentAmount) + '.') || currentAmount;
          }
        } else {
          var num = String(currentAmount);
          if (num === '0' && key !== '.') {
            currentAmount = parseFloat(key);
          } else {
            currentAmount = parseFloat(num + key) || currentAmount;
          }
        }
        updateAmountDisplay();
      });
    });
  }

  function initQuickAdd() {
    document.querySelectorAll('.quick-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var add = parseInt(btn.dataset.add, 10);
        currentAmount = Math.round((currentAmount + add) * 100) / 100;
        updateAmountDisplay();
      });
    });
  }

  function runProgressAnimation() {
    elements.progressAmount.textContent = currentAmount.toFixed(2);
    elements.progressBar.style.strokeDashoffset = CIRCLE_LENGTH;
    elements.progressBar.style.strokeDasharray = CIRCLE_LENGTH;

    requestAnimationFrame(function () {
      elements.progressBar.style.transition = 'stroke-dashoffset 2s ease-out';
      elements.progressBar.style.strokeDashoffset = 0;
    });
  }

  function handleSend() {
    if (currentAmount <= 0 || currentAmount > currentBalance) return;

    showScreen(PROGRESS_SCREEN);
    runProgressAnimation();

    setTimeout(function () {
      currentBalance = Math.round((currentBalance - currentAmount) * 100) / 100;
      elements.completeAmount.textContent = currentAmount.toFixed(2);
      showScreen(COMPLETE_SCREEN);
    }, 2200);
  }

  function handleDone() {
    currentAmount = INITIAL_AMOUNT;
    currentBalance = INITIAL_BALANCE;
    updateAmountDisplay();
    updateBalanceDisplay();
    showScreen(TRANSFER_SCREEN);
    elements.progressBar.style.strokeDashoffset = CIRCLE_LENGTH;
  }

  function init() {
    updateAmountDisplay();
    updateBalanceDisplay();

    initKeypad();
    initQuickAdd();

    elements.sendBtn.addEventListener('click', handleSend);
    elements.doneBtn.addEventListener('click', handleDone);
  }

  init();
})();
