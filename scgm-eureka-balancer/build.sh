if [ -z "$JAVA_HOME" ]; then
    export JAVA_HOME='C:\Program Files\Java\openjdk-21.0.2'
fi
##run mvn
mvn clean install -Dmaven.test.skip=true -f pom.xml
