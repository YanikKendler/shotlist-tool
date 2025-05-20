FROM eclipse-temurin:21-jre

RUN mkdir -p /opt/application
WORKDIR /opt/application

COPY ./target/shotlist-tool-backend-runner.jar /opt/application/backend.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","backend.jar"]