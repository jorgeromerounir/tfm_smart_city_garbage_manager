## For local deploy

export PORT='8763'
export EUREKA_URL='http://localhost:8761/eureka'

if [ -z "$EUREKA_ENABLED" ]; then
    export EUREKA_ENABLED='true'
fi

"$JAVA_HOME/bin/java"  -jar ./target/scgm-gateway-public.jar
