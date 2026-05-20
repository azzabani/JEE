# Dockerfile pour le backend Spring Boot

# Étape 1 : Build avec Maven
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copier le pom.xml et télécharger les dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source et builder
COPY src ./src
RUN mvn clean package -DskipTests

# Étape 2 : Image finale légère
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copier le JAR depuis l'étape de build
COPY --from=build /app/target/*.jar app.jar

# Exposer le port
EXPOSE 8080

# Variables d'environnement pour la base de données
ENV DB_HOST=sqlserver
ENV DB_PORT=1433
ENV DB_NAME=reclamations_db
ENV DB_USER=reclamations_user
ENV DB_PASSWORD=Reclamations2024!

# Commande de démarrage
ENTRYPOINT ["java", "-jar", "app.jar"]
