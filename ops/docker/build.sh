#!/bin/bash
set -e
display_usage() {
    echo -e "usage:\t./ops/docker/build.sh <command> <version>\n"
    echo -e "Commands:\n   images\t\tBuilds the images and pushes it to gcr\n"
    echo -e "ENV_VARS:\n ==================================================================="
    echo -e "\tGCP_PROJECT\t\tDefault set to honeycomb-321717"
}
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
GIT_TAG=$(git tag --points-at HEAD)
COMMIT_ID=$(git rev-parse HEAD)
TAG=${COMMIT_ID:0:7}
if [ ! -z "$GIT_TAG" ]
then
    echo "Found tag on the branch"
    TAG=$GIT_TAG
fi

if [[ $GIT_BRANCH == *"release"* ]]; then
    echo "You are on a release branch, TAG is overridden"
    TAG=$(cut -d "/" -f2 <<< ${GIT_BRANCH})
fi

if [[ $GIT_BRANCH == *"honeycomb"* ]]; then
    echo "You are on a honeycomb branch, TAG is overridden"
    TAG=$(cut -d "/" -f2 <<< ${GIT_BRANCH})
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WEB_DIR=${DIR}/api-server/prod
AR_PATH=gcr.io/${GCP_PROJECT:-"honeycomb-321717"}/honeycomb-api-dev

case $1 in
    images)
        VERSION=$2
        if [ ! -z "$VERSION" ]
        then
            echo "Overriding auto tag, with manual version"
            TAG="${VERSION}"
        fi
        echo "TAG: ${TAG}"
       
        echo "GCP: ${GCP_PROJECT}"

        [ -z ${TAG} ] && display_usage && exit 1
        echo ${TAG} > ~/tag-${GCP_PROJECT}.txt
        echo "docker build --tag ${AR_PATH}:${TAG}  --file ${WEB_DIR}/Dockerfile ."
        docker build --tag ${AR_PATH}:${TAG}  --file ${WEB_DIR}/Dockerfile .
        #this means we are probably in local and we can push to Acr
        if [ ! -z "$2" ]
        then 
            docker -- push ${AR_PATH}:${TAG}
        fi
        ;;
    * )
        display_usage
        exit 1
esac