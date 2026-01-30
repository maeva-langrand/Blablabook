// Validation en temps réel du mot de passe côté client

const passwordInput = document.getElementById("register_password"); 
const verifyPasswordInput = document.getElementById("register_verify_password"); 

if (passwordInput && verifyPasswordInput) {
  // Créer un conteneur pour les indicateurs de force du mot de passe
const strengthIndicator = document.createElement("div"); 
strengthIndicator.className = "password-strength";
passwordInput.closest(".inputbox").insertAdjacentElement("afterend", strengthIndicator);

// Créer un indicateur de correspondance
const matchIndicator = document.createElement("div"); 
matchIndicator.className = "password-match";
verifyPasswordInput.closest(".inputbox").insertAdjacentElement("afterend", matchIndicator);

// Fonction utilitaire pour valider les critères du mot de passe
function validatePassword(password) {
  return {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
  };
}

// Fonction utilitaire pour vérifier si tous les critères sont valides
function isPasswordValid(checks) {
  return Object.values(checks).every(val => val === true);
}

// Fonction pour masquer les indicateurs après un délai
function hideIndicatorsAfterDelay() {
  setTimeout(() => {
    strengthIndicator.style.display = "none";
    matchIndicator.style.display = "none";
  }, 2000);
}

// Validation du mot de passe en temps réel
passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;

  if (password.length === 0) {
    strengthIndicator.style.display = "none";
    return;
  }

  const checks = validatePassword(password);
  strengthIndicator.style.display = "block";

  let html = "<ul>";
  html += `<li class="${checks.length ? "check-valid" : "check-invalid"}">
    ${checks.length ? "✓" : "✗"} Au moins 8 caractères
  </li>`;
  html += `<li class="${checks.lowercase ? "check-valid" : "check-invalid"}">
    ${checks.lowercase ? "✓" : "✗"} Au moins une minuscule
  </li>`;
  html += `<li class="${checks.uppercase ? "check-valid" : "check-invalid"}">
    ${checks.uppercase ? "✓" : "✗"} Au moins une majuscule
  </li>`;
  html += `<li class="${checks.number ? "check-valid" : "check-invalid"}">
    ${checks.number ? "✓" : "✗"} Au moins un chiffre
  </li>`;
  html += `<li class="${checks.special ? "check-valid" : "check-invalid"}">
    ${checks.special ? "✓" : "✗"} Au moins un caractère spécial
  </li>`;
  html += "</ul>";

  strengthIndicator.innerHTML = html;

  // Si tous les critères sont valides, cacher après 2 secondes
  if (isPasswordValid(checks)) {
    hideIndicatorsAfterDelay();
  }

  // Vérifier la correspondance si le second champ est rempli
  if (verifyPasswordInput.value) {
    checkPasswordMatch();
  }
});

// Cacher le message quand on quitte le champ
passwordInput.addEventListener('blur', () => {
  strengthIndicator.style.display = 'none';
});

// Validation de la correspondance des mots de passe
verifyPasswordInput.addEventListener('input', checkPasswordMatch);

// Cacher le message quand on quitte le champ
verifyPasswordInput.addEventListener('blur', () => {
  matchIndicator.style.display = 'none';
});

function checkPasswordMatch() {
  const password = passwordInput.value;
  const verifyPassword = verifyPasswordInput.value;

  if (verifyPassword.length === 0) {
    matchIndicator.style.display = "none";
    return;
  }

  matchIndicator.style.display = "block";

  if (password === verifyPassword) {
    matchIndicator.innerHTML = '<span class="check-valid">✓ Les mots de passe correspondent</span>';
    
    // Si tout est valide (mot de passe fort + correspondance), cacher après 2 secondes
    if (isPasswordValid(validatePassword(password))) {
      hideIndicatorsAfterDelay();
    }
  } else {
    matchIndicator.innerHTML = '<span class="check-invalid">✗ Les mots de passe ne correspondent pas</span>';
  }
}

// Validation avant soumission du formulaire
const registerForm = document.querySelector(".section_register_form");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    const password = passwordInput.value;
    const verifyPassword = verifyPasswordInput.value;
    const checks = validatePassword(password);

    if (!isPasswordValid(checks) || password !== verifyPassword) {
      e.preventDefault();
      alert("Veuillez corriger les erreurs dans le formulaire avant de continuer.");
    }
  });
}
}