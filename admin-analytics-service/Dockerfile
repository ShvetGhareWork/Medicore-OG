FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/admin-analytics-service-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
