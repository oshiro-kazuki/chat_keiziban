'use strict';

{
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const signupBtn = document.getElementById('signup-btn');
  const loginbackBtn = document.getElementById('loginback-btn');
  
  signupBtn.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    signupBtn.classList.add('hidden');
    signupForm.classList.remove('hidden');
    signupForm.classList.add('open');
    loginbackBtn.classList.remove('hidden');
  });

  loginbackBtn.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    signupBtn.classList.remove('hidden');
    signupForm.classList.add('hidden');
    signupForm.classList.remove('open');
    loginbackBtn.classList.add('hidden');
  });

  

}