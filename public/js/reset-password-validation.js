// Validation client pour le formulaire de réinitialisation de mot de passe

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('.forgot_password_form');
  if (!form) return;

  const passwordInput = form.querySelector('#password');
  const verifyInput = form.querySelector('#verify_password');
  const passwordError = document.getElementById('password-error');
  const confirmError = document.getElementById('confirm-error');
  const clientError = document.getElementById('reset-client-error');

  const isStrongPassword = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pwd);
  };

  // Validation en temps réel pendant la saisie
  passwordInput.addEventListener('input', () => {
    const pwd = passwordInput.value.trim();
    const errors = [];

    if (pwd.length === 0) {
      passwordError.classList.remove('show', 'valid', 'invalid');
      return;
    }

    if (pwd.length < 8) {
      errors.push('Min 8 caractères');
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('1 majuscule');
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('1 minuscule');
    }
    if (!/\d/.test(pwd)) {
      errors.push('1 chiffre');
    }
    if (!/[@$!%*?&]/.test(pwd)) {
      errors.push('1 caractère spécial (@$!%*?&)');
    }

    if (errors.length > 0) {
      passwordError.textContent = 'Manquant: ' + errors.join(', ');
      passwordError.classList.add('show', 'invalid');
      passwordError.classList.remove('valid');
    } else {
      passwordError.textContent = '✓ Mot de passe valide';
      passwordError.classList.add('show', 'valid');
      passwordError.classList.remove('invalid');
    }

    // Mettre à jour le message de confirmation si le confirm a du texte
    if (verifyInput.value.trim().length > 0) {
      checkPasswordMatch();
    }
  });

  // Vérification correspondance en temps réel
  const checkPasswordMatch = () => {
    const pwd = passwordInput.value.trim();
    const confirm = verifyInput.value.trim();

    if (confirm.length === 0) {
      confirmError.classList.remove('show', 'valid', 'invalid');
      return;
    }

    if (pwd === confirm) {
      confirmError.textContent = '✓ Correspond';
      confirmError.classList.add('show', 'valid');
      confirmError.classList.remove('invalid');
    } else {
      confirmError.textContent = '✗ Ne correspond pas';
      confirmError.classList.add('show', 'invalid');
      confirmError.classList.remove('valid');
    }
  };

  verifyInput.addEventListener('input', checkPasswordMatch);

  // Vérification correspondance au submit
  form.addEventListener('submit', (e) => {
    if (!passwordInput || !verifyInput) return;

    const pwd = passwordInput.value.trim();
    const confirm = verifyInput.value.trim();
    const errors = [];

    if (!isStrongPassword(pwd)) {
      errors.push("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&).");
    }

    if (pwd !== confirm) {
      errors.push("Les mots de passe ne correspondent pas.");
    }

    if (errors.length > 0) {
      e.preventDefault();
      if (clientError) {
        clientError.textContent = errors.join(' ');
        clientError.style.display = 'block';
      } else {
        alert(errors.join('\n'));
      }
    } else if (clientError) {
      clientError.textContent = '';
      clientError.style.display = 'none';
    }
  });
});
