# Une lettre pour toi — invitation interactive

Petit site en HTML/CSS/JS pur (aucune dépendance à installer) : une enveloppe
à cliquer, une question avec un bouton "Non" fuyant, puis un formulaire pour
fixer la date, l'heure et le lieu.

## Utilisation

Ouvre simplement `index.html` dans un navigateur — ça fonctionne en local,
sans serveur. Pour l'envoyer à quelqu'un, héberge le dossier tel quel sur
n'importe quel hébergement statique (Netlify, Vercel, GitHub Pages...).

## Structure

```
invitation-interactive/
├── index.html      # structure des 4 étapes (enveloppe, question, plan, récap)
├── css/style.css    # design (papier, cire, or)
└── js/script.js     # logique : ouverture, bouton fuyant, formulaire, mailto
```

## Personnaliser

- **Texte de la question / des relances** : dans `index.html` (`<h1>`) et le
  tableau `taunts` en haut de `js/script.js`.
- **Ton adresse e-mail de réception** : change `DESTINATAIRE_EMAIL` en haut
  de `js/script.js`. Par défaut, le bouton final ouvre le client mail de la
  personne avec un message pré-rempli (`mailto:`) — aucune configuration
  serveur nécessaire.
- **Couleurs** : variables CSS en haut de `css/style.css` (`--ink`, `--paper`,
  `--wax`, `--gold`).
- **Comportement du bouton "Non"** : fonction `dodge()` dans `script.js` —
  ajuste `maxDodges`, la vitesse de rétrécissement, ou remplace le
  positionnement aléatoire par un simple `mouseover` qui le déplace de
  quelques pixels si tu veux un effet plus doux.

## Aller plus loin (optionnel)

Le `mailto:` marche partout sans configuration, mais a une limite : il ouvre
le client mail de la *personne qui répond*, elle doit cliquer "Envoyer".
Si tu veux que le message parte automatiquement vers toi dès la validation
du formulaire (sans que la personne ait à faire quoi que ce soit), il faut un
service tiers ou un petit backend :

- **EmailJS** (le plus simple, pas de serveur) : crée un compte sur
  emailjs.com, ajoute leur script, et remplace la ligne `fillRecap(...)`
  dans `planForm`'s submit handler par un appel `emailjs.send(...)`.
- **Formspree** : encore plus simple, il suffit de pointer l'attribut
  `action` du `<form>` vers l'URL qu'ils te donnent.
- **Node.js/Express ou Firebase** : si tu veux aussi *enregistrer* les
  réponses quelque part (pas juste les recevoir par mail).

Aucun de ces services n'est inclus ici pour garder le projet 100% autonome
et sans compte à créer avant de pouvoir tester.
