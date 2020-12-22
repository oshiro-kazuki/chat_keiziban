'use strict';

{
  const body = document.querySelector('body');

  //雪が降るアニメーション
  //material-icons
  function animTimer() {
    const ANIMTIMER = 3; //秒指定
    const timeRom = Math.floor((Math.random() * ANIMTIMER)); //animation-deray
    return timeRom;
  }

  const WINDIOWPDDING = 50; //表示させる余白
  
  //降らせる横座標
  function animAreaRow() {
    const windowW = window.innerWidth; //幅最大値
    const animAreaRight = windowW - WINDIOWPDDING;
    const yukiAnimRow = Math.random() * ((animAreaRight - WINDIOWPDDING) - WINDIOWPDDING);
    console.log(`row:  ${yukiAnimRow}`);
    return yukiAnimRow;
  }

  //降らせる縦座標
  function animAreaCol() {
    const windowH = window.innerHeight; //高さ最大値
    const animAreaBottom = windowH - WINDIOWPDDING;
    const yukiAnimCol = Math.random() * ((animAreaBottom - WINDIOWPDDING) - WINDIOWPDDING);
    console.log(`col:  ${yukiAnimCol}`);
    return yukiAnimCol;
  }

  const num = 15; //降らせる個数

  //降らせる設定
  for(let i = 1; i <= num; i++) {
    const span = document.createElement('span');
    span.classList.add(`material-icons`);
    span.classList.add(`yuki`);
    span.textContent = 'ac_unit';
    span.style = `animation-delay: ${animTimer()}s`;
    span.style.left = `${animAreaRow()}px`;
    span.style .top= `${animAreaCol()}px`;
    span.style.fontSize = '40px';
    body.appendChild(span);
  }


  //背景画像
  const backImage = ['/images/ad.PNG', '/images/aa.JPG', '/images/ac.PNG'];
  
  let index = 0;
  body.style.backgroundImage = `url(${backImage[index]})`;
  
  // function nextImage() {
  //   body.classList.remove('fadeIn');
  //   if(index === backImage.length -1) {
  //     index = 0;
  //   } else {
  //     index++;
  //   }
  //   body.style.backgroundImage = `url(${backImage[index]})`;
  //   body.classList.add('fadeIn');
  // }
  
  // setInterval(() => {
  //   nextImage();
  // }, 2000);


}