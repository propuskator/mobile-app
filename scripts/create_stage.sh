if [ "$1" ]
then
    if [ "$2" ]
    then
        git clone $2 "./config/$1"
    else
        echo "You should pass URL to git repo(e.g. git@gitlab.host.com:example.git) with credentials as second parameter"
    fi
else
    echo "You should pass staging name(e.g. qa, prod, etc) as first parameter"
fi