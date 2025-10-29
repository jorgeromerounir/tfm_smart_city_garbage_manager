export PORT='8180'
export EUREKA_URL='http://localhost:8761/eureka'
export RMQ_HOSTNAME0='localhost'
export RMQ_PORT='5672'
export RMQ_USER0='admin'
export RMQ_PASS='admin123'

if [ -z "$EUREKA_ENABLED" ]; then
    export EUREKA_ENABLED='true'
fi

"$JAVA_HOME/bin/java" -jar ./target/scgm-routes-api.jar
