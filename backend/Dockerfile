FROM eclipse-temurin:21-jre

ARG AUTH0SECRET
ARG DB_URL
ARG DB_USERNAME
ARG DB_PASSWORD

ENV AUTH0SECRET=$AUTH0SECRET
ENV DB_URL=$DB_URL
ENV DB_USERNAME=$DB_USERNAME
ENV DB_PASSWORD=$DB_PASSWORD

RUN mkdir -p /opt/application
WORKDIR /opt/application

COPY ./target/shotlist-tool-backend-runner.jar /opt/application/backend.jar

EXPOSE 8080

ENTRYPOINT ["/bin/sh", "-c", "java -Dquarkus.oidc.credentials.secret=${AUTH0SECRET} -Dquarkus.datasource.jdbc.url=${DB_URL} -Dquarkus.datasource.username=${DB_USERNAME} -Dquarkus.datasource.password=${DB_PASSWORD} -jar backend.jar"]
