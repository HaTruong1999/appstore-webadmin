#!/bin/bash
# Auto re-deploy project script

branch="$1"
rancherUrl="$2"
token="$3"

if [ -z $1 ]; then
	echo "Specify branch empty, no branch to deploy!"
else
	echo "Deploy branch $branch at $rancherUrl"
		data="{\"annotations\":{\"cattle.io/timestamp\":\"$(date -u +'%Y-%m-%dT%H:%M:%SZ')\"}}"
		curl -ik -X PUT $rancherUrl -H "Authorization: Bearer $token" -H 'content-type: application/json' -d "$data"
fi
