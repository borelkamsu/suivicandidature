# Guide pour Push sur GitHub avec Token

## 📋 Étapes pour pousser votre code sur GitHub

### Étape 1 : Créer un Personal Access Token sur GitHub

1. Allez sur GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
3. Donnez un nom au token (ex: `render-deploy`)
4. Sélectionnez les permissions :
   - ✅ `repo` (accès complet aux repositories)
5. Cliquez sur **"Generate token"**
6. **⚠️ IMPORTANT :** Copiez le token immédiatement (vous ne pourrez plus le voir après)

### Étape 2 : Créer un nouveau repository sur GitHub

1. Allez sur [GitHub](https://github.com) et cliquez sur **"New repository"** (ou allez sur https://github.com/new)
2. Remplissez :
   - **Repository name:** `suivi-postulation` (ou le nom de votre choix)
   - **Description:** (optionnel)
   - **Visibility:** Public ou Private (selon votre préférence)
   - **⚠️ NE COCHEZ PAS** "Initialize this repository with a README"
3. Cliquez sur **"Create repository"**

### Étape 3 : Initialiser Git et pousser le code

Ouvrez votre terminal dans le dossier du projet et exécutez ces commandes :

```bash
# 1. Initialiser Git
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Faire le premier commit
git commit -m "Initial commit: Application de suivi des postulations"

# 4. Renommer la branche principale en 'main' (si nécessaire)
git branch -M main

# 5. Ajouter le remote avec votre token
# Remplacez USERNAME par votre nom d'utilisateur GitHub
# Remplacez TOKEN par le token que vous avez copié
# Remplacez REPO_NAME par le nom de votre repository
git remote add origin https://TOKEN@github.com/USERNAME/REPO_NAME.git

# 6. Pousser le code
git push -u origin main
```

### 🔐 Format de l'URL avec Token

L'URL du remote doit avoir ce format :
```
https://TOKEN@github.com/USERNAME/REPO_NAME.git
```

**Exemple concret :**
```
https://ghp_xxxxxxxxxxxxxxxxxxxx@github.com/monusername/suivi-postulation.git
```

### ⚠️ Sécurité : Ne pas commiter le token

Le token ne doit **JAMAIS** être dans le code. Il est uniquement dans l'URL du remote, qui est stockée localement dans `.git/config`.

Pour vérifier votre remote :
```bash
git remote -v
```

### 🔄 Commandes pour les prochains push

Une fois configuré, vous pouvez simplement faire :
```bash
git add .
git commit -m "Votre message de commit"
git push
```

### 📝 Alternative : Utiliser Git Credential Manager

Si vous préférez ne pas mettre le token dans l'URL, vous pouvez :

1. Ajouter le remote sans token :
```bash
git remote add origin https://github.com/USERNAME/REPO_NAME.git
```

2. Lors du premier push, Git vous demandera vos identifiants :
   - **Username:** Votre nom d'utilisateur GitHub
   - **Password:** Collez votre token (pas votre mot de passe)

### 🛠️ Si vous avez déjà un remote configuré

Pour modifier l'URL du remote existant :
```bash
# Voir les remotes actuels
git remote -v

# Modifier l'URL du remote origin
git remote set-url origin https://TOKEN@github.com/USERNAME/REPO_NAME.git
```

### ✅ Vérification

Après le push, vérifiez sur GitHub que tous vos fichiers sont bien présents.
