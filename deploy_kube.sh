#!/bin/bash
# Auto re-deploy project script
branch="$1"
deployment="$2"
namespace="$3"

if [ -z $1 ]; then
	echo "Specify branch empty, no branch to deploy!"
else
	echo "Deploy branch $branch"
	data="{\"spec\":{\"template\":{\"metadata\":{\"labels\":{\"date\":\"`date +'%s'`\"}}}}}"
    kubectl --kubeconfig /.kube/config_stm patch deployment $deployment -n $namespace -p "$data"
	echo "Deploy success!"
fi
