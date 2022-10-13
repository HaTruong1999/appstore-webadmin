# version 2020.05.06
# /bin/bash build.sh <project> <branch> [Dockerfile]
project=""                              # project-name
tag=""                                  # docker image tag (branch)
branch=""
tagn=""
Dockerfile="Dockerfile" # Dockerfile
registry=""
registry_user=""
registry_password=""


# Check parameter project and branch
if [ ! -z "$2" ]; then
        project="$1"
        if [ $2 == "master" ]; then
        tag="latest"
	    branch=""
		tagn=""
        elif [ $2 == "pro" ] || [ $2 == "prod" ]  || [ $2 == "release" ]; then
                        tag="stable"
	    branch=$2
		tagn="-$2"
        else
                tag="latest"	    
                branch=$2
				tagn="-$2"
        fi
else
        echo "Can not build empty tag for project $2"
        exit 1
fi
if [ "$7" != "" ]; then
        tag=$7
	    branch=""
		tagn=""
fi

# Check parameter Dockerfile
if [ ! -z "$3" ]; then
        Dockerfile="$3"
fi
# Check parameter Registry
if [ ! -z "$4" ]; then
        registry="$4"
fi
if [ ! -z "$5" ]; then
        registry_user="$5"
fi
if [ ! -z "$6" ]; then
        registry_password="$6"
fi
# Check Dockerfile exits
if [ -f "./Dockerfile" ]; then
        echo "$(date +'%d-%m-%Y %H:%M:%S') [$HOSTNAME] Build $Dockerfile"
        cp build/environment.ts$branch src/environments/environment.prod.ts
        docker build -f $Dockerfile -t $project$tagn:$tag .
else
        echo "$Dockerfile not found!"
        exit 1
fi
retVal=$?
if [ $retVal -gt 0 ]; then
    echo "Build failed - exit code: $retVal"
    exit 1
fi

# Tag and push to docker registry server
echo "Push $registry/$project:$tag to Registry"
docker login $registry -u $registry_user -p $registry_password
docker tag $project$tagn:$tag $registry/$project$tagn:$tag
docker push $registry/$project$tagn:$tag

#Remove Docker Imgae
docker image rm $project$tagn:$tag
docker image rm $registry/$project$tagn:$tag
#docker system prune -f


echo "$(date +'%d-%m-%Y %H:%M:%S') [$HOSTNAME] End build"
