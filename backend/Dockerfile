FROM eclipse-temurin:21-jre

ENV AUTH0SECRET="unknown"
ENV DB_URL="unknown"
ENV DB_USERNAME="unknown"
ENV DB_PASSWORD="unknown"

RUN mkdir -p /opt/application
WORKDIR /opt/application

COPY ./target/shotlist-tool-backend-runner.jar /opt/application/backend.jar

EXPOSE 8080

ENTRYPOINT ["/bin/sh", "-c", "java -Dquarkus.oidc.credentials.secret=${AUTH0SECRET} -Dquarkus.datasource.jdbc.url=${DB_URL} -Dquarkus.datasource.username=${DB_USERNAME} -Dquarkus.datasource.password=${DB_PASSWORD} -jar backend.jar"]
