export const handleError = (err, req, res, next) => {

    let statusCode = err?.statusCode || 500;
    let pagetitle = '| Erreur';
    let message = 'Une erreur est survenue.'

    if (err?.type === 'BOOK_NOT_FOUND') {
        statusCode = 404;
        pagetitle = '| Livre introuvable';
        message = 'Le livre que vous cherchez est introuvable.'
    }

    else if (err?.type === 'AUTHOR_NOT_FOUND') {
        statusCode = 404;
        pagetitle = '| Auteur introuvable';
        message = `L'auteur que vous cherchez est introuvable.`
    }

    else if (err?.type === 'PAGE_NOT_FOUND') {
        statusCode = 404;
        pagetitle = '| Page introuvable';
        message = `La page que vous cherchez n'existe pas.`
    }

    else if (err?.type === 'SERVER_ERROR') {
        statusCode = 500;
        pagetitle = '| Erreur serveur';
        message = `Le serveur rencontre un problème.`
    }

    res.status(statusCode).render('error', {pagetitle, statusCode, message})
    ;
};