#!/bin/bash
# trial 1
HOST=$(infra/_general/jenkins/getRegistry.sh)
JENKINS_URL="https://$HOST/jenkins"
JENKINS_USER=$1
JENKINS_USER_PASS=$2
JENKINS_CRUMB=$(curl -u "$JENKINS_USER:$JENKINS_USER_PASS" -s --cookie-jar /tmp/cookies "$JENKINS_URL/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,\":\",//crumb)")
ACCESS_TOKEN=$(curl -u "$JENKINS_USER:$JENKINS_USER_PASS" -H "$JENKINS_CRUMB" -s \
                    --cookie /tmp/cookies "$JENKINS_URL/me/descriptorByName/jenkins.security.ApiTokenProperty/generateNewToken" \
                    --data 'newTokenName=GlobalToken' | jq -r '.data.tokenValue')
SECRET_MAP=$(infra/_general/jenkins/getSecrets.sh)

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
    if [ $ENV_TYPE != "local" ] 
    then
        json="json={\"\": \"\", \"credentials\": {\"file\": \"file0\", \"id\": \"$SECRET_ID\", \"description\": \"secret-file created by API\", \"stapler-class\": \"org.jenkinsci.plugins.plaincredentials.impl.FileCredentialsImpl\", \"\$class\": \"org.jenkinsci.plugins.plaincredentials.impl.FileCredentialsImpl\"}}"
        chmod 777 -R $FILE_PATH
        curl -X POST \
            $JENKINS_URL/credentials/store/system/domain/_/credential/$SECRET_ID/doDelete  \
            -u "$JENKINS_USER:$ACCESS_TOKEN" \
            -H "Jenkins-Crumb:$JENKINS_CRUMB"
        curl -X POST \
            $JENKINS_URL/credentials/store/system/domain/_/createCredentials  \
            -u "$JENKINS_USER:$ACCESS_TOKEN" \
            -H "Jenkins-Crumb:$JENKINS_CRUMB" \
            -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
            -H 'content-type: multipart/form-data;' \
            -F file0=@$FILE_PATH  \
            -F "$json"
        echo "Upload Complete - ${SECRET_ID}"
    else
        echo "Skipping Local Env Variable - ${SECRET_ID}"
    fi
done
exit 0