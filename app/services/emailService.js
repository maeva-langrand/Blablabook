import nodemailer from "nodemailer";

// Créer un transporteur email avec Gmail OAuth2
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.EMAIL_CLIENT_ID,
    clientSecret: process.env.EMAIL_CLIENT_SECRET,
    refreshToken: process.env.EMAIL_REFRESH_TOKEN,
  },
});

/**
 * Envoyer un email de réinitialisation de mot de passe
 * @param {string} email - L'adresse email du destinataire
 * @param {string} resetLink - Le lien de réinitialisation avec le token
 * @returns {Promise}
 */
export async function sendPasswordResetEmail(email, resetLink) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "Réinitialisation de votre mot de passe - BlablaBook",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #D97C6D;">Réinitialisation de votre mot de passe</h2>
        
        <p>Bonjour,</p>
        
        <p>Vous avez demandé une réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour continuer :</p>
        
        <p style="text-align: center; margin: 2rem 0;">
          <a href="${resetLink}" style="background-color: #D97C6D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        
        <p>Ou copiez ce lien dans votre navigateur :</p>
        <p style="word-break: break-all; color: #666;">${resetLink}</p>
        
        <p style="color: #999; font-size: 0.9rem;">
          Ce lien expirera dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 2rem 0;">
        <p style="color: #999; font-size: 0.85rem; text-align: center;">
          BlablaBook - Votre plateforme de gestion de livres
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email envoyé avec succès" };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw new Error("Impossible d'envoyer l'email de réinitialisation");
  }
};
