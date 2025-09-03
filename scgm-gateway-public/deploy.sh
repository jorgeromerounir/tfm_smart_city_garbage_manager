export PORT='8763'
export EUREKA_URL='http://localhost:8761/eureka'
export EUREKA_ENABLED='true'

"$JAVA_HOME/bin/java"  -jar ./target/scgm-gateway-public.jar
