FROM eclipse-temurin:21-jre

ENV AUTH0SECRET="unknown"
ENV AUTH0_MANAGEMENT_SECRET="unknown"
ENV DB_URL="unknown"
ENV DB_USERNAME="unknown"
ENV DB_PASSWORD="unknown"
ENV STRIPE_API_KEY="unknown"
ENV STRIPE_WEBHOOK_SECRET="unknown"
ENV FRONTEND_URL="unknown"

RUN mkdir -p /opt/application
WORKDIR /opt/application

COPY ./target/shotlist-tool-backend-runner.jar /opt/application/backend.jar

EXPOSE 8080

ENTRYPOINT ["/bin/sh", "-c", "java -Dquarkus.oidc.credentials.secret=${AUTH0SECRET} -Dauth0.client-secret${AUTH0_MANAGEMENT_SECRET} -Dquarkus.datasource.jdbc.url=${DB_URL} -Dquarkus.datasource.username=${DB_USERNAME} -Dquarkus.datasource.password=${DB_PASSWORD} -Dstripe.api-key=${STRIPE_API_KEY} -Dstripe.webhook-secret=${STRIPE_WEBHOOK_SECRET} -Dstripe.frontend-url=${FRONTEND_URL} -jar backend.jar"]
