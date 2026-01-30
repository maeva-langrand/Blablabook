import { ContactMessage } from "../../models/index.js";

export function showContactPage(req, res) {
    const success = req.query?.success ? "Votre message a été envoyé avec succès !" : null; // Message de succès 
    
    res.render("contact", {
        pagetitle: "| Contact", 
        success, // Message de succès ou null
        error: null, // Pas d'erreur initialement
        name: "", 
        email: "",
        message: ""
    });
}

export async function submitContactForm(req, res) {
    try {
        const { name, email, message } = req.validatedData; // Données validées par le middleware

        await ContactMessage.create({ name, email, message }); // Persister le message dans la base de données

/*         console.log("📧 Message de contact reçu:");
        console.log("Nom:", name);
        console.log("Email:", email);
        console.log("Message:", message); */

        return res.redirect("/contact?success=true"); // Rediriger avec un indicateur de succès
    } catch (error) {
        console.error("Erreur lors de la persistance du message:", error); 
        return res.status(500).render("contact", { // Rendre la page de contact avec une erreur
            pagetitle: "| Contact",
            success: null, // Pas de message de succès
            error: "Une erreur est survenue. Veuillez réessayer.", // Message d'erreur
            name: req.body.name || "", // Récupérer les valeurs soumises
            email: req.body.email || "", // Récupérer les valeurs soumises
            message: req.body.message || "" // Récupérer les valeurs soumises
        });
    }
}
