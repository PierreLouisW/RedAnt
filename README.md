# RedAnt LMP3 - Deploiement en ligne

Application de suivi mileage/sessions/setup pour l'equipe, installable comme
une appli sur telephone et PC, avec base de donnees partagee et acces hors-ligne.

## Etape 1 - Configurer Supabase (5 min)

1. Va sur ton projet Supabase (https://supabase.com/dashboard) → **SQL Editor** → **New query**.
2. Colle le contenu du fichier `supabase_schema.sql` et clique **Run**.
3. Va dans **Authentication → Providers → Email** et **desactive "Allow new users to sign up"**
   (comme ca, personne d'exterieur a l'equipe ne peut creer de compte).
4. Va dans **Authentication → Users → Add user** et cree un compte pour
   chaque membre de l'equipe (email + mot de passe). Coche "Auto Confirm User".

## Etape 2 - Mettre le code sur GitHub

Dans le dossier de ce projet (celui qui contient `index.html`, `manifest.json`, `sw.js`, `icons/`) :

```bash
git init
git add .
git commit -m "RedAnt LMP3 - version en ligne"
git branch -M main
git remote add origin https://github.com/<TON_PSEUDO>/RedAnt.git
git push -u origin main
```

(Remplace `<TON_PSEUDO>` par ton nom d'utilisateur GitHub.)

## Etape 3 - Deployer sur Vercel (2 min)

1. Va sur https://vercel.com → **Add New → Project**.
2. Choisis le repo **RedAnt**.
3. Laisse les reglages par defaut (aucun "build command" necessaire, c'est du HTML statique) → **Deploy**.
4. Vercel te donne une URL du type `https://redant-xxxx.vercel.app`. C'est votre site en ligne.

## Etape 4 - Installer l'appli sur telephone/PC

Chaque membre de l'equipe :
1. Ouvre l'URL Vercel dans son navigateur (Chrome/Edge sur PC ou Android, Safari sur iPhone).
2. Se connecte avec l'email/mot de passe cree a l'etape 1.
3. Clique sur "Installer l'application" (icone dans la barre d'adresse sur PC,
   ou "Ajouter a l'ecran d'accueil" dans le menu partage sur mobile).
4. L'appli apparait comme une icone normale, s'ouvre en plein ecran.

## Comment ca marche

- **Base commune** : toutes les donnees (sessions, mileage, pieces, setup...) sont
  stockees dans une seule table Supabase, partagee par toute l'equipe connectee.
- **Hors-ligne** : chaque modification est d'abord enregistree sur l'appareil
  (cache local), donc consultable/modifiable meme sans reseau. Des que la
  connexion revient, la synchronisation avec la base commune se fait automatiquement.
- **Acces reserve** : seuls les comptes que tu as crees manuellement dans
  Supabase peuvent se connecter (pas d'inscription publique).
- **Gratuit** : hebergement Vercel (plan gratuit) + base Supabase (plan gratuit,
  tres largement suffisant pour une equipe de cette taille) = 0 euro/mois.

## Ajouter ou retirer un membre de l'equipe

Supabase Dashboard → Authentication → Users → Add user (ou supprimer un compte existant).
Aucun redeploiement necessaire.
