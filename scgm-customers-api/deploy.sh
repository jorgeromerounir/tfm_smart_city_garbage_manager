export PORT='8182'
export EUREKA_ENABLED='false'
export EUREKA_URL='http://localhost:8761/eureka'
export POSTGRES_USER='uwm_user'
export POSTGRES_PASSWORD='uwm_password'
export RMQ_HOSTNAME0='localhost'
export RMQ_PORT='5672'
export RMQ_USER0='admin'
export RMQ_PASS='admin123'
export JWT_SECRET='dGhpc2lzYXZlcnlzZWNyZXRrZXlmb3J1d21hdXRoZW50aWNhdGlvbnNlcnZpY2U='
export AUTH_QUEUE='auth.queue'

"$JAVA_HOME/bin/java" -jar ./target/scgm-customers-api.jar
