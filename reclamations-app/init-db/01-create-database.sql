-- Script d'initialisation de la base de données

-- Créer la base de données si elle n'existe pas
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'reclamations_db')
BEGIN
    CREATE DATABASE reclamations_db;
END
GO

-- Utiliser la base de données
USE reclamations_db;
GO

-- Créer l'utilisateur si il n'existe pas
IF NOT EXISTS (SELECT name FROM sys.sql_logins WHERE name = 'reclamations_user')
BEGIN
    CREATE LOGIN reclamations_user WITH PASSWORD = 'Reclamations2024!';
END
GO

-- Créer l'utilisateur dans la base de données
IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = 'reclamations_user')
BEGIN
    CREATE USER reclamations_user FOR LOGIN reclamations_user;
    ALTER ROLE db_owner ADD MEMBER reclamations_user;
END
GO

PRINT 'Base de données initialisée avec succès';
GO
