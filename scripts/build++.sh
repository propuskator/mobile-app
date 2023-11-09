CURRENT=$(cat ./package.json  | grep "\"build\": " | sed 's/\(\"build\": \)\([[:digit:]]*\)\(,\)/\2/')

NEXT="$(($CURRENT + 1))"

printf "$(cat ./package.json | sed "s/\(\"build\": \)\([[:digit:]]*\)/\1$NEXT/g")" > ./package.json

echo "Build number incremented successfully"