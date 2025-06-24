const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('itens');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('show');
});