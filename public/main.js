'use strict';

{
  //メニューバー
  const menuBtn = document.getElementById('menu-btn');
  const menuBar = document.getElementById('menu-bar');
  const menuClose = document.getElementById('menu-close');

  menuBtn.addEventListener('click', () => {
    menuBar.classList.remove('hidden');
  });

  menuClose.addEventListener('click', () => {
    menuBar.classList.add('hidden');
    menuBtn.classList.remove('hidden');
  });


  //スクロール画像
  const scrollImg = document.getElementById('scrollImg');
  scrollImg.src = '/images/tonakai.PNG';

  //時間での画像切り替え
  (function changeStand() {
    scrollImg.classList.toggle('scale');
    setTimeout(changeStand, 1000);
  })();
  
  //スクロールでの画像切り替え
  function changeWork() {
    scrollImg.classList.toggle('left');
    scrollImg.classList.toggle('right');
  }

  let count = 0;
  const scrollPostion = 10;

  window.addEventListener('scroll', e => {
    count++;
    if(count >= scrollPostion) {
      changeWork();
      count = 0;
    }
  });
}