
const login_section = document.getElementById("login-section");
const register_section = document.getElementById("register-section");

const login_switch = document.querySelector(".section_login_switch");
const register_switch = document.querySelector(".section_register_switch");

const login_title = document.querySelector('.section_login_h1');
const register_title = document.querySelector('.section_register_h1');


function showLogin(){
    register_section.style.display="none";
    register_title.style.display = "none";

    login_section.style.display="flex";
    login_title.style.display ="";

};

function showSignup(){
    login_section.style.display="none";
    login_title.style.display = "none";

    register_section.style.display="flex";
    register_title.style.display ="";
};

register_switch.addEventListener('click', (e)=>{
e.preventDefault();
showLogin();
});

login_switch.addEventListener('click', (e)=>{
e.preventDefault();
showSignup();
});

// Obtenir le type de formulaire depuis la variable globale
const formType = window.formType || 'login';

// Afficher le bon formulaire selon le type du serveur
if (formType === 'register') {
    showSignup();
} else {
    showLogin();
}