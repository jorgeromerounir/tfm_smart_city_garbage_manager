export PORT='8081'
export EUREKA_ENABLED='true'
export EUREKA_URL='http://localhost:8761/eureka'
export POSTGRES_USER='uwm_user'
export POSTGRES_PASSWORD='uwm_password'
export RMQ_HOSTNAME0='localhost'
export RMQ_PORT='5672'
export RMQ_USER0='admin'
export RMQ_PASS='admin123'
export JWT_SECRET='dGhpc2lzYXZlcnlzZWNyZXRrZXlmb3J1d21hdXRoZW50aWNhdGlvbnNlcnZpY2U='

"$JAVA_HOME/bin/java" -jar ./target/scgm-auth-service-1.0.0.jar
