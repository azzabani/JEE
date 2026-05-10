# 🎯 Application de Gestion des Réclamations

Application web complète pour la gestion des réclamations clients avec Spring Boot et Angular.

---

## 🚀 Démarrage Rapide

### Backend (Terminal 1)

```powershell
cd reclamations-app\backend
.\start-backend.ps1
```

Attendez : `Started ReclamationsAppApplication`

### Frontend (Terminal 2)

```powershell
cd reclamations-app\frontend
npm start
```

Attendez : `Compiled successfully`

### Accès

- **Application :** http://localhost:4200
- **API :** http://localhost:8080/api
- **Swagger :** http://localhost:8080/swagger-ui.html

---

## 🔐 Identifiants

### Administrateur
- **Username :** admin
- **Password :** admin123

---

## 🐳 Alternative : Docker

```powershell
cd reclamations-app
docker-compose up --build
```

Puis : http://localhost

---

## 🛠️ Technologies

- **Backend :** Spring Boot 3.2, Spring Security, JWT, JPA/Hibernate
- **Frontend :** Angular 17, TypeScript
- **Base de données :** SQL Server
- **Documentation :** Swagger/OpenAPI

---

## 📊 Architecture

```
Frontend (Angular) → Backend (Spring Boot) → SQL Server
    :4200                  :8080                :1433
```

---

## 📝 Rôles

- **ADMIN :** Gestion complète du système
- **AGENT_SAV :** Traitement des réclamations
- **CLIENT :** Création et suivi des réclamations

---

## 🎓 Fonctionnalités

### Client
- ✅ Inscription publique
- ✅ Création de réclamations
- ✅ Suivi des réclamations
- ✅ Notation des services

### Agent SAV
- ✅ Traitement des réclamations
- ✅ Ajout de commentaires
- ✅ Changement de statut

### Administrateur
- ✅ Gestion des utilisateurs
- ✅ Création d'agents SAV
- ✅ Statistiques et rapports
- ✅ Gestion complète du système

---

**Développé avec ❤️ pour la gestion efficace des réclamations clients**
