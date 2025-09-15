<?php
require_once 'config.php';

$message = '';
$error = '';

if ($_POST) {
    $nom = trim($_POST['nom'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $sujet = trim($_POST['sujet'] ?? '');
    $messageContent = trim($_POST['message'] ?? '');
    
    // Validation
    if (empty($nom) || empty($email) || empty($sujet) || empty($messageContent)) {
        $error = 'Tous les champs sont obligatoires.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'L\'email n\'est pas valide.';
    } else {
        // Envoyer l'email (ici on simule)
        $success = true; // Dans la vraie version, on utiliserait mail() ou une API
        
        if ($success) {
            $message = 'Votre message a été envoyé avec succès !';
            // Reset form
            $nom = $email = $sujet = $messageContent = '';
        } else {
            $error = 'Erreur lors de l\'envoi du message.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact - Guide de Lyon</title>
    <meta name="description" content="Contactez l'équipe du Guide de Lyon pour toute question ou suggestion.">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <a href="/" class="nav-logo">
                    <h1>Guide de Lyon</h1>
                </a>
                <div class="nav-menu">
                    <a href="/annuaire" class="nav-link">Annuaire</a>
                    <a href="/evenements" class="nav-link">Événements</a>
                    <a href="/tarifs" class="nav-link">Tarifs</a>
                    <a href="/contact" class="nav-link">Contact</a>
                </div>
            </div>
        </nav>
    </header>

    <!-- Page Header -->
    <section class="hero">
        <div class="hero-content">
            <h1 class="hero-title">Contactez-nous</h1>
            <p class="hero-subtitle">Nous sommes à votre écoute pour toute question ou suggestion</p>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="section">
        <div class="container">
            <div class="contact-grid">
                <!-- Contact Info -->
                <div class="contact-info">
                    <h2>Informations de contact</h2>
                    
                    <div class="contact-item">
                        <h3>📧 Email</h3>
                        <p>contact@guide-de-lyon.fr</p>
                    </div>
                    
                    <div class="contact-item">
                        <h3>📞 Téléphone</h3>
                        <p>04 XX XX XX XX</p>
                    </div>
                    
                    <div class="contact-item">
                        <h3>📍 Adresse</h3>
                        <p>Lyon, Rhône-Alpes<br>France</p>
                    </div>
                    
                    <div class="contact-item">
                        <h3>🕒 Horaires</h3>
                        <p>Lundi - Vendredi : 9h - 18h<br>
                        Réponse sous 24h maximum</p>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="contact-form">
                    <h2>Envoyez-nous un message</h2>
                    
                    <?php if ($message): ?>
                        <div class="alert alert-success">
                            <?= htmlspecialchars($message) ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($error): ?>
                        <div class="alert alert-error">
                            <?= htmlspecialchars($error) ?>
                        </div>
                    <?php endif; ?>
                    
                    <form method="POST" class="form">
                        <div class="form-group">
                            <label for="nom">Nom complet *</label>
                            <input type="text" id="nom" name="nom" value="<?= htmlspecialchars($nom ?? '') ?>" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="email">Email *</label>
                            <input type="email" id="email" name="email" value="<?= htmlspecialchars($email ?? '') ?>" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="sujet">Sujet *</label>
                            <select id="sujet" name="sujet" required>
                                <option value="">Choisissez un sujet</option>
                                <option value="Question générale" <?= ($sujet ?? '') === 'Question générale' ? 'selected' : '' ?>>Question générale</option>
                                <option value="Ajout entreprise" <?= ($sujet ?? '') === 'Ajout entreprise' ? 'selected' : '' ?>>Ajouter mon entreprise</option>
                                <option value="Modification fiche" <?= ($sujet ?? '') === 'Modification fiche' ? 'selected' : '' ?>>Modifier une fiche</option>
                                <option value="Partenariat" <?= ($sujet ?? '') === 'Partenariat' ? 'selected' : '' ?>>Partenariat</option>
                                <option value="Problème technique" <?= ($sujet ?? '') === 'Problème technique' ? 'selected' : '' ?>>Problème technique</option>
                                <option value="Autre" <?= ($sujet ?? '') === 'Autre' ? 'selected' : '' ?>>Autre</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="message">Message *</label>
                            <textarea id="message" name="message" rows="6" required placeholder="Décrivez votre demande en détail..."><?= htmlspecialchars($messageContent ?? '') ?></textarea>
                        </div>
                        
                        <button type="submit" class="btn-primary">Envoyer le message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Guide de Lyon</h3>
                    <p>Votre guide complet pour découvrir Lyon et ses environs.</p>
                </div>
                <div class="footer-section">
                    <h4>Navigation</h4>
                    <ul>
                        <li><a href="/annuaire">Annuaire</a></li>
                        <li><a href="/evenements">Événements</a></li>
                        <li><a href="/tarifs">Tarifs</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contact</h4>
                    <p>Email: contact@guide-de-lyon.fr</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Guide de Lyon. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
    
    <!-- Search JavaScript -->
    <script src="/js/search.js"></script>
</body>
</html>