## For local deploy

export PORT='8761'
export EUREKA_HOST='localhost'

"$JAVA_HOME/bin/java" -jar ./target/scgm-eureka-balancer.jar
