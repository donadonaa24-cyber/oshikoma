// 推し駒battle 紹介ページの動き。JavaScriptがなくても内容はすべて読める（ここは演出と絞り込みだけ）。
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // テロップ：ゲーム画面の上で操作のヒントを順番に出す。
  function setupTelop() {
    var box = document.querySelector('[data-telop]');
    if (!box || reduceMotion) return;
    var items = box.querySelectorAll('.telop-item');
    var index = 0;
    setInterval(function () {
      items[index].classList.remove('is-on');
      index = (index + 1) % items.length;
      items[index].classList.add('is-on');
    }, 2400);
  }

  // スクロールの進み具合を「第N/10階」で表示。最後まで読んだら「突破」。
  function setupFloorMeter() {
    var meter = document.querySelector('.floor-meter');
    var floorEl = document.querySelector('[data-floor]');
    var bar = document.querySelector('[data-floor-bar]');
    if (!meter || !floorEl || !bar) return;
    var ticking = false;
    function update() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      var floor = Math.min(10, 1 + Math.floor(ratio * 10));
      var clear = ratio > 0.985;
      floorEl.textContent = clear ? '突破' : String(floor);
      meter.classList.toggle('is-clear', clear);
      bar.style.width = (ratio * 100).toFixed(1) + '%';
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // 数字タイル：画面に入ったら0から数え上げる。
  function setupCountUp() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length || reduceMotion || !('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        var el = entry.target;
        var goal = Number(el.getAttribute('data-count'));
        var start = null;
        function step(time) {
          if (start === null) start = time;
          var t = Math.min(1, (time - start) / 700);
          el.textContent = String(Math.round(goal * (1 - Math.pow(1 - t, 3))));
          if (t < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { observer.observe(el); });
  }

  // 推し駒図鑑の絞り込み。
  function setupFilters() {
    var buttons = document.querySelectorAll('.filter');
    var cards = document.querySelectorAll('.oshi-card');
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-filter');
        buttons.forEach(function (b) {
          var on = b === button;
          b.classList.toggle('is-on', on);
          b.setAttribute('aria-pressed', String(on));
        });
        cards.forEach(function (card) {
          card.hidden = value !== 'all' && card.getAttribute('data-group') !== value;
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupTelop();
    setupFloorMeter();
    setupCountUp();
    setupFilters();
  });
})();
