FROM eclipse-temurin:21-jdk AS builder
WORKDIR /workspace
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw -v
COPY src ./src
RUN ./mvnw -B package

FROM eclipse-temurin:21-jre
WORKDIR /srv
COPY --from=builder /workspace/target/*.jar service.jar
ENTRYPOINT ["java", "-jar", "service.jar"]
