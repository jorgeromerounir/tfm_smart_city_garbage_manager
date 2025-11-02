## For local deploy

export PORT='8181'
export EUREKA_URL='http://localhost:8761/eureka'
export POSTGRES_USER='uwm_user'
export POSTGRES_PASSWORD='uwm_password'
export RMQ_HOSTNAME0='localhost'
export RMQ_PORT='5672'
export RMQ_USER0='admin'
export RMQ_PASS='admin123'

if [ -z "$EUREKA_ENABLED" ]; then
    export EUREKA_ENABLED='true'
fi

"$JAVA_HOME/bin/java" -jar ./target/scgm-containers-api.jar
