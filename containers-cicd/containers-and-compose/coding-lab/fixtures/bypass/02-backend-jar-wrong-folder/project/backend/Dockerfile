FROM eclipse-temurin:21-jdk AS builder
WORKDIR /workspace
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw -B dependency:go-offline
COPY src ./src
RUN ./mvnw -B package

FROM eclipse-temurin:21-jre
WORKDIR /srv
COPY --from=builder /target/*.jar service.jar
ENTRYPOINT ["java", "-jar", "service.jar"]
