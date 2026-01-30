import crypto from "crypto";

/**
 * Générer un token aléatoire sécurisé pour la réinitialisation de mot de passe
 * @returns {string} Le token généré (32 bytes en hexadécimal)
 */
export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Générer une date d'expiration pour le token (15 minutes par défaut)
 * @returns {Date} La date d'expiration
 */
export function generateTokenExpiration() {
  const expirationMinutes = parseInt(process.env.RESET_TOKEN_EXPIRATION) || 15;
  return new Date(Date.now() + expirationMinutes * 60 * 1000);
}

