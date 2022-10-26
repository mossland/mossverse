#!/bin/bash

REPO_NAME="mossland-metaverse"
USER="ubuntu"
HOST=$(infra/_general/jenkins/getRegistry.sh)
PORT=22
SECRET_MAP=$(infra/_general/jenkins/getSecrets.sh)
echo $SECRET_MAP
ssh -o StrictHostKeyChecking=no $USER@$HOST -p $PORT "chmod 777 -R ~/secrets"
for SECRET in ${SECRET_MAP[@]}; do
    IFS=',' read -ra DATA <<< $SECRET
    FILE_PATH=${DATA[0]}
    SECRET_ID=${DATA[1]}
    ENV_TYPE=${DATA[2]}
    if [ -z "$ENV_TYPE" ]
    then
        DAT=($FILE_PATH)
        FILE_PATH=${DAT[0]}
        SECRET_ID=${DAT[1]}
        ENV_TYPE=${DAT[2]}
    fi
    DIRNAME=$(dirname "$FILE_PATH")
    FILENAME=$(basename "$FILE_PATH")
    ssh -o StrictHostKeyChecking=no $USER@$HOST -p $PORT "mkdir -p ~/secrets/$REPO_NAME/$DIRNAME"
    scp -o StrictHostKeyChecking=no -rp -P $PORT $FILE_PATH $USER@$HOST:~/secrets/$REPO_NAME/$FILE_PATH
    echo "${SECRET_ID} Upload Completed"
done