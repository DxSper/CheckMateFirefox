<div align="center">
  <img src="icons/icon128.png" alt="CheckMate logo" width="96" />
  <h1>CheckMate</h1>
  <p><strong>Extension Firefox qui automatise le pointage de présence sur CESAR Emineo.<br>Un clic suffit - connexion, signature et validation sont faites pour vous.</strong></p>

![Version](https://img.shields.io/github/v/release/DxSper/CheckMateFirefox?label=version&color=4f46e5)
![Manifest](https://img.shields.io/badge/Manifest-v3-blue)
![Firefox](https://img.shields.io/badge/Firefox-compatible-brightgreen?logo=firefox&logoColor=white)
![Licence](https://img.shields.io/badge/licence-MIT-gray)

</div>

---

## Sommaire

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Mises à jour](#mises-à-jour)
- [Confidentialité](#confidentialité)
- [Compatibilité](#compatibilité)

---

## Présentation

CheckMate est une extension Firefox conçue pour les apprenants et formateurs utilisant la plateforme **CESAR Emineo**. Elle automatise entièrement le processus de pointage : ouverture de la session, connexion, recherche du bouton de signature, reproduction fidèle de votre signature manuscrite et validation.

> Une fois configurée, il suffit d'un seul clic pour pointer sa présence.

---

## Fonctionnalités

| Fonctionnalité            | Détail                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Connexion automatique** | Se connecte avec vos identifiants si la session est expirée. Détecte automatiquement si vous êtes déjà connecté. |
| **Signature automatique** | Rejoue votre signature manuscrite sur le canvas du site, avec centrage et mise à l'échelle automatiques.         |
| **Journal d'exécution**   | Chaque étape est horodatée et affichée dans le popup pour faciliter le diagnostic.                               |

---

## Installation

> CheckMate n'est pas _encore_ disponible sur le Firefox Add-ons Store. L'installation se fait manuellement en mode développeur, la procédure prend moins d'une minute.

### Étape 1 - Télécharger l'extension

Téléchargez le fichier **`CheckMateFirefox.xpi`** ou clonez ce dépôt, puis conservez les fichiers dans un dossier.

> 💡 Ne supprimez pas ce dossier après l'installation - Firefox en a besoin pour charger l'extension.

---

### Étape 2 - Ouvrir la page des extensions Firefox

Dans la barre d'adresse de Firefox, saisissez :

```
about:debugging#/runtime/this-firefox
```

Ou accédez à **Menu > Extensions et thèmes** (`Ctrl+Shift+A` / `Cmd+Shift+A`).

---

### Étape 3 - Activer le mode développeur

Dans la page des extensions, cliquez sur **"Déboguer les extensions"** ou activez le **Mode développeur**.

---

### Étape 4 - Charger l'extension temporairement (recommandé pour le développement)

1. Cliquez sur **"Charger un module complémentaire temporaire..."**
2. Sélectionnez le fichier `manifest.json` dans le dossier CheckMate Firefox

> Cette méthode est idéale pour le développement et les tests. L'extension sera chargée temporairement et disparaîtra à la fermeture de Firefox.

---

### Étape 5 - Installation permanente (optionnel)

Pour une installation permanente :

1. zippez tous les fichiers de l'extension (manifest.json, background.js, content.js, popup.html, popup.js, popup.css, et le dossier icons/)
2. Renommez le `.zip` en `.xpi`
3. Dans Firefox, allez dans `about:addons`
4. Cliquez sur l'engrenage > "Installer depuis un fichier..."
5. Sélectionnez votre fichier `.xpi`

> ⚠️ Pour une installation permanente depuis un fichier `.xpi`, vous devrez signer l'extension sur [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/) ou désactiver la vérification de signature via `about:config` (`xpinstall.signatures.required = false` en développement).

---

### Étape 6 - Vérifier l'installation

CheckMate apparaît dans la liste des extensions avec son logo. Épinglez-la dans la barre d'outils Firefox pour y accéder facilement.

---

## Configuration

Avant le premier pointage, vous devez configurer vos identifiants et votre signature. Cliquez sur l'icône CheckMate dans la barre d'outils pour ouvrir le popup.

### 1. Dérouler le panneau de configuration

Cliquez sur **« Configuration »** en bas du popup pour afficher les champs.

---

### 2. Saisir vos identifiants CESAR

Renseignez votre **identifiant** et votre **mot de passe** CESAR dans les champs prévus.

> Vos identifiants sont stockés localement dans `browser.storage.local`, uniquement sur votre machine. Ils ne sont jamais envoyés à un serveur tiers.

---

### 3. Dessiner votre signature

Dans la zone de dessin, tracez votre **signature manuscrite** à la souris ou au stylet. Cette signature sera reproduite automatiquement sur le canvas CESAR à chaque pointage.

- Cliquez sur **« Effacer »** pour recommencer.
- La signature est mise à l'échelle et centrée automatiquement - inutile de la faire exactement à la même taille que sur le site.

---

### 4. Sauvegarder

Cliquez sur **« Sauvegarder »**. Le statut passe à **« Configuré »** et le bouton principal devient actif.

---

## Utilisation

Une fois configurée, l'utilisation se résume à **un seul clic**.

1. Cliquez sur l'icône CheckMate dans la barre d'outils.
2. Cliquez sur **« Pointer ma présence »**.
3. Un onglet CESAR s'ouvre. L'extension gère toutes les étapes automatiquement.
4. Une notification Firefox vous informe du résultat.

### Suivi en temps réel

Le **journal d'exécution** dans le popup affiche chaque étape horodatée : ouverture de la page, connexion, recherche du bouton, replay de la signature, confirmation. En cas d'échec, le message d'erreur y apparaît pour faciliter le diagnostic.

---

## Mises à jour

CheckMate vérifie automatiquement sa version à chaque pointage en interrogeant les releases GitHub.

**Si votre extension est à jour** - rien ne se passe, la signature s'effectue normalement.

**Si une version plus récente est disponible** - une **fenêtre modale bloquante** s'affiche dans la page CESAR dès son ouverture, avant toute tentative de signature :

| Bouton                       | Action                                                        |
| ---------------------------- | ------------------------------------------------------------- |
| **Mettre à jour maintenant** | Ouvre la page de téléchargement de la nouvelle version        |
| **Continuer quand même**     | Ignore l'avertissement et lance la signature (non recommandé) |
| **Annuler la signature**     | Ferme l'onglet CESAR et arrête le processus                   |

> ⚠️ Utiliser une version obsolète peut provoquer des erreurs de signature ou un pointage invalide si le site CESAR a évolué.

### Comment mettre à jour

1. Téléchargez la nouvelle version depuis ce dépôt.
2. Remplacez le contenu du dossier existant par les nouveaux fichiers.
3. Dans `about:debugging#/runtime/this-firefox`, cliquez sur le bouton **↻ Recharger** sur la carte CheckMate.

> Vos identifiants et votre signature sont conservés dans `browser.storage.local` - ils ne sont **pas** supprimés lors d'une mise à jour.

---

## Confidentialité

- **Identifiants** : stockés localement via `browser.storage.local`, uniquement sur votre machine.
- **Signature** : stockée localement sous forme de coordonnées de tracé, uniquement sur votre machine.
- **Aucune donnée** n'est transmise à un serveur externe. La seule requête réseau initiée par l'extension (hors navigation CESAR) est un appel en lecture seule à l'API publique GitHub pour vérifier la dernière version disponible.

---

## Compatibilité

| Navigateur             | Support                      | Moteur   |
| ---------------------- | ---------------------------- | -------- |
| Firefox                | ✅ Supporté                  | Gecko    |
| Firefox pour Android   | ✅ Compatible                | Gecko    |
| Google Chrome          | ❌ Non supporté              | Chromium |
| Microsoft Edge         | ❌ Non supporté              | Chromium |
| Safari                 | ❌ Non supporté              | WebKit   |
| Safari iOS             | ❌ Non supporté              | WebKit   |

> **Vous utilisez Chrome ou un autre navigateur ?**
> Une version compatible Chrome peut être développée. [👉 Ouvrez une issue GitHub](https://github.com/DxSper/CheckMateFirefox/issues/new?title=Support+Chrome&body=Je+souhaite+une+version+compatible+Chrome.) pour voter pour cette fonctionnalité.

---

## Développement

### Prérequis

- Firefox 109+ (pour le support MV3 complet)
- Node.js 18+ (optionnel, pour les tests automatisés)

### Structure du projet

```
CheckMateFirefox/
├── manifest.json       # Manifest de l'extension Firefox (MV3)
├── background.js       # Script de fond (service worker)
├── content.js          # Script de contenu (injecté dans CESAR)
├── popup.html          # Interface du popup
├── popup.js            # Logique du popup
├── popup.css           # Styles du popup
├── icons/              # Icônes de l'extension
└── README.md           # Ce fichier
```

### API WebExtension

Cette extension utilise l'API WebExtension standard (`browser.*`) au lieu de l'API Chrome (`chrome.*`), ce qui assure la compatibilité avec Firefox et les navigateurs basés sur Gecko.

### Tester l'extension

1. Clonez ce dépôt
2. Ouvrez Firefox et allez sur `about:debugging#/runtime/this-firefox`
3. Cliquez sur **"Charger un module complémentaire temporaire..."**
4. Sélectionnez le fichier `manifest.json`

### Publier sur Firefox Add-ons

1. Créez un compte sur [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)
2. Créez un fichier `.zip` de l'extension (sans le dossier `.git`)
3. Soumettez le fichier `.zip` pour révision
4. Une fois signé par Mozilla, l'extension sera disponible sur le Firefox Add-ons Store

---

<div align="center">
  <sub>Fait avec ♟️ par <a href="https://github.com/DxSper">DxSper</a></sub>
</div>
