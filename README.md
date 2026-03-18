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

CheckMate est une extension Firefox forkée depuis [MattiaPARRINELLO/CheckMate](https://github.com/MattiaPARRINELLO/CheckMate), initialement conçue pour Chrome. Elle a été adaptée pour Firefox afin de répondre aux besoins des utilisateurs de ce navigateur.

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

> ⚠️ Firefox exige que les extensions soient signées numériquement par Mozilla. Cette page explique les différentes méthodes d'installation.

---

### Méthode 1 : Mode développeur temporaire (la plus simple)

Cette méthode charge l'extension sans l'installer définitivement. Idéale pour tester.

1. Ouvrez Firefox et allez dans la barre d'adresse :
   ```
   about:debugging#/runtime/this-firefox
   ```

2. Dans le menu Firefox (☰), cliquez sur **Modules complémentaires et thèmes**
   - Ou appuyez sur `Ctrl+Shift+A` (Linux/Windows) / `Cmd+Shift+A` (Mac)

3. Cliquez sur **"Déboguer les modules complémentaires"**

4. Cliquez sur **"Charger un module complémentaire temporaire..."**

5. Sélectionnez le fichier `manifest.json` de ce dossier

> ✅ L'extension sera active tant que Firefox reste ouvert. Elle disparaîtra à la fermeture.

---

### Méthode 2 : Installation permanente (avec signature désactivée)

Pour une installation qui persiste après le redémarrage de Firefox, vous devez désactiver la vérification de signature :

1. **Désactiver la vérification de signature :**
   - Dans la barre d'adresse, tapez `about:config` et appuyez sur Entrée
   - Cliquez sur **"Accepter le risque et poursuivre"**
   - Recherchez : `xpinstall.signatures.required`
   - Double-cliquez pour passer la valeur à `false`

2. **Installer l'extension :**
   - Téléchargez le fichier `CheckMateFirefox.xpi` depuis la [page des releases](../../releases/latest)
   - Dans Firefox, allez dans `about:addons`
   - Cliquez sur l'**engrenage** ⚙️
   - Sélectionnez **"Installer depuis un fichier..."**
   - Choisissez le fichier `.xpi`

> ⚠️ **Attention** : Désactiver `xpinstall.signatures.required` réduit la sécurité de Firefox. Ne le faites que si vous faites confiance à la source de l'extension.

---

### Méthode 3 : Version de développement (Nightly/Dev/ESR)

Les versions spéciales de Firefox permettent de désactiver la signature :

- **Firefox Developer Edition** ou **Firefox Nightly** : possède un paramètre natif pour charger des extensions non signées
- **Firefox ESR** : conçu pour les entreprises, permet aussi de désactiver la vérification

1. Installez [Firefox Developer Edition](https://www.mozilla.org/fr/firefox/developer/) ou [Firefox Nightly](https://www.mozilla.org/fr/firefox/nightly/)
2. Suivez la **Méthode 1** ci-dessus (pas besoin de désactiver la signature en mode développeur)

---

### Vérifier l'installation

Quel que soit votre choix de méthode, CheckMate doit apparaître :
- Dans `about:debugging#/runtime/this-firefox` (liste des extensions)
- Épinglez l'icône 🔌 dans la barre d'outils Firefox pour un accès rapide

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

**En mode développeur temporaire :**
1. Retournez dans `about:debugging#/runtime/this-firefox`
2. Cliquez sur **↻ Recharger** sur la carte CheckMate

**En installation permanente :**
1. Téléchargez la nouvelle version depuis la [page des releases](../../releases/latest)
2. Remplacez les fichiers existants par les nouveaux

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
| Firefox Dev/Nightly    | ✅ Supporté                  | Gecko    |
| Firefox pour Android   | ⏳ En cours                  | Gecko    |
| Google Chrome          | ❌ Non supporté              | Chromium |
| Microsoft Edge         | ❌ Non supporté              | Chromium |
| Safari                 | ❌ Non supporté              | WebKit   |

---

## Développement

### Prérequis

- Firefox 109+ (pour le support MV3 complet)
- Node.js 18+ (optionnel)

### Structure du projet

```
CheckMateFirefox/
├── manifest.json       # Manifest de l'extension Firefox (MV3)
├── background.js       # Script de fond (background script)
├── content.js          # Script de contenu (injecté dans CESAR)
├── popup.html          # Interface du popup
├── popup.js            # Logique du popup
├── popup.css           # Styles du popup
├── icons/              # Icônes de l'extension
└── README.md           # Ce fichier
```

### API WebExtension

Cette extension utilise l'API WebExtension standard (`browser.*`) au lieu de l'API Chrome (`chrome.*`), ce qui assure la compatibilité avec Firefox et les navigateurs basés sur Gecko.

---

<div align="center">
  <sub>Forkée depuis <a href="https://github.com/MattiaPARRINELLO/CheckMate">MattiaPARRINELLO/CheckMate</a> · Portée sur Firefox par <a href="https://github.com/DxSper">DxSper</a></sub>
</div>
