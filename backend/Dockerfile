FROM eclipse-temurin:21-jre

ENV AUTH0SECRET="unkown"
ENV DB_URL="unkown"
ENV DB_USERNAME="unkown"
ENV DB_PASSWORD="unkown"

RUN mkdir -p /opt/application
WORKDIR /opt/application

COPY ./target/shotlist-tool-backend-runner.jar /opt/application/backend.jar

EXPOSE 8080

ENTRYPOINT ["/bin/sh", "-c", "java -Dquarkus.oidc.credentials.secret=${AUTH0SECRET} -Dquarkus.datasource.jdbc.url=${DB_URL} -Dquarkus.datasource.username=${DB_USERNAME} -Dquarkus.datasource.password=${DB_PASSWORD} -jar backend.jar"]
