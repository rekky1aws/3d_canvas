const showMenuBtn = document.querySelector('#ctrl-btn');
const controlMenu = document.querySelector('#ctrl-menu');
const menuTitle = document.querySelector('.menu-title')

console.log(controlMenu);
console.log(showMenuBtn);

function showMenu () {
	controlMenu.classList.add('visible-menu');
}

function hideMenu () {
	controlMenu.classList.remove('visible-menu');
}

showMenuBtn.addEventListener('click', showMenu);
menuTitle.addEventListener('click', hideMenu);