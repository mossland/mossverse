pipeline {
    agent any
    environment {
        BRANCH = "$env.BRANCH_NAME"
        BUILD_CONF = credentials("mossland-metaverse-jenkins-conf")
        KUBE_SECRET = credentials("mossland-metaverse-kube-secret")
        KUBE_CONFIG = credentials("mossland-metaverse-kube-config")
        ORGS = "mossland"
        ALL_CLIENTS = "mossland/frontend"
        ALL_SERVERS = "mossland/backend"
    }
    stages {
        stage("Boot"){
            steps{
                sh "cp $BUILD_CONF .jenkins.conf"
                load ".jenkins.conf"
                discordSend description: "Build Start - $env.JOB_NAME $env.BUILD_NUMBER", link: env.BUILD_URL, result: currentBuild.currentResult, title: env.JOB_NAME, webhookURL: env.DISCORD_WEBHOOK
                sh "tar -cvf codebase.tar ./"
            }
        }
        stage("Prepare"){
            parallel{
                stage("Prepare Master"){
                    steps{
                        sh "ssh -o StrictHostKeyChecking=no $MS_USER@$MS_HOST -p $MS_PORT \"mkdir -p $REPO_NAME/$BRANCH/node_modules && touch $REPO_NAME/$BRANCH/dummy.js\""
                        sh "ssh -p $MS_PORT $MS_USER@$MS_HOST \"cd $REPO_NAME/$BRANCH && find . -maxdepth 1 ! -path . ! \\( -name node_modules -or -name package-lock.json -or -name dist -or -name .git \\) -print0 | xargs -0 sudo rm -r\""
                        sh "scp -P $MS_PORT codebase.tar $MS_USER@$MS_HOST:~/$REPO_NAME/$BRANCH/codebase.tar"
                        sh "ssh -p $MS_PORT $MS_USER@$MS_HOST \"cd $REPO_NAME/$BRANCH && tar -xvf codebase.tar\""
                        sh "scp -P $MS_PORT $KUBE_SECRET $MS_USER@$MS_HOST:~/$REPO_NAME/$BRANCH/infra/kubernetes/secrets.yaml"
                        script {
                            ORGS.tokenize(",").each { org -> 
                                sh "scp -P $MS_PORT $KUBE_CONFIG $MS_USER@$MS_HOST:~/$REPO_NAME/$BRANCH/infra/kubernetes/${org}.yaml"
                                sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH/infra/kubernetes && sudo chown $MS_USER ${org}.yaml && sudo chmod 777 ${org}.yaml\""
                                sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH/infra/kubernetes && kubectl config use-context $org --kubeconfig ${org}.yaml\""
                                sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH/infra/kubernetes && (kubectl delete -f secrets.yaml -n $org-$BRANCH --kubeconfig ${org}.yaml || true) && kubectl apply -f secrets.yaml -n $org-$BRANCH --kubeconfig ${org}.yaml\""
                            }
                        }
                        script {
                            // affected = sh (script: "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH && sudo nx print-affected --type=app --select=projects --base=HEAD~1\"", returnStdout: true).trim() 
                            // AFFECTED = affected.tokenize(", ");
                            // CLIENTS = AFFECTED.intersect(ALL_CLIENTS.tokenize(","));
                            // SERVERS = AFFECTED.intersect(ALL_SERVERS.tokenize(","));
                            CLIENTS = ALL_CLIENTS.tokenize(",");
                            SERVERS = ALL_SERVERS.tokenize(",");
                            ALL_CLIENTS.tokenize(",").each { app -> 
                                def envName = "$REPO_NAME-" + app.tokenize("/").join("-") + "-env";
                                withCredentials([file(credentialsId: "$envName", variable: "ENV")]) {
                                    sh "ssh -p $MS_PORT $MS_USER@$MS_HOST \"cd $REPO_NAME/$BRANCH/apps/$app && echo CLIENT_ENV=$BRANCH > .env\""
                                    sh "scp -P $MS_PORT $ENV $MS_USER@$MS_HOST:~/$REPO_NAME/$BRANCH/apps/$app/env.ts"
                                }
                                
                            }
                            ALL_SERVERS.tokenize(",").each { app -> 
                                def envName = "$REPO_NAME-" + app.tokenize("/").join("-") + "-env-$BRANCH";
                                withCredentials([file(credentialsId: "$envName", variable: "ENV")]) {
                                    sh "scp -P $MS_PORT $ENV $MS_USER@$MS_HOST:~/$REPO_NAME/$BRANCH/apps/$app/src/environments/environment.ts"        
                                }
                            }
                        }
                    }
                }
            }
        }
        stage("Build"){
            steps {
                script {
                    BUILD_PROJECTS = (SERVERS + CLIENTS).join(",");
                    sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH && npm install --legacy-peer-deps\""
                    sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH && sudo nx run-many --target=build --projects=$BUILD_PROJECTS --parallel=8\""
                }
            }
        }
        stage("Dockerize"){
            steps {
                script {
                    def dockerizes = [:]
                    (CLIENTS + SERVERS).each { app -> 
                        dockerizes[app] = {
                            sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH && sudo find ./apps/$app -name *.env -exec cp {} ./dist/apps/$app \\;\""
                            sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH && sudo find ./apps/$app \\( -name Dockerfile -or -name .dockerignore \\) -exec cp {} ./dist/apps/$app \\;\""
                            sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH/dist/apps/$app && sudo docker build . -t $REG_URL/$REPO_NAME/$app:$BRANCH-$env.BUILD_NUMBER\" --label=\"repo=$REPO_NAME\" --label=\"branch=$BRANCH\" --label=\"buildNum=$env.BUILD_NUMBER\""
                            sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"sudo docker image tag $REG_URL/$REPO_NAME/$app:$BRANCH-$env.BUILD_NUMBER $REG_URL/$REPO_NAME/$app:$BRANCH-live\""
                            sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"docker push $REG_URL/$REPO_NAME/$app:$BRANCH-live\""
                        }
                    }
                    parallel dockerizes
                }
            }
        }
        stage("Deploy"){
            steps {
                script {
                    def deploys = [:]
                    (ALL_SERVERS + "," + ALL_CLIENTS).tokenize(",").each { app -> 
                        def orgName = app.tokenize("/")[0]
                        def appName = app.tokenize("/")[1]
                        if((SERVERS + CLIENTS).contains(app)) {
                            deploys[app] = {
                                sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH/infra && sudo kubectl apply -f $BRANCH/${app}.yaml -n $orgName-$BRANCH --kubeconfig kubernetes/${orgName}.yaml\""
                                sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH/infra && sudo kubectl rollout restart deployments/$appName-deployment -n $orgName-$BRANCH --kubeconfig kubernetes/${orgName}.yaml\""
                            }
                        } else {
                            deploys[app] = {
                                sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH/infra && sudo kubectl apply -f $BRANCH/${app}.yaml -n $orgName-$BRANCH --kubeconfig kubernetes/${orgName}.yaml\""
                            }
                        }
                    }
                    parallel deploys
                }
            }
        }
        stage("Cleanup"){
            parallel {
                stage("Clean Master Registry"){
                    steps{
                        sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH/infra/_general/registry && chmod +x cleanup-registry.sh && ./cleanup-registry.sh\""
                    }
                }
                stage("Clean Build Registry"){
                    steps {
                        discordSend description: "Build Finished! Cleaning up... - $env.JOB_NAME $env.BUILD_NUMBER", link: env.BUILD_URL, result: currentBuild.currentResult, title: env.JOB_NAME, webhookURL: env.DISCORD_WEBHOOK
                        sh "ssh $MS_USER@$MS_HOST -p $MS_PORT \"cd $REPO_NAME/$BRANCH/infra/_general/registry && chmod +x cleanup-agent.sh && ./cleanup-agent.sh $REG_URL/$REPO_NAME $BRANCH $env.BUILD_NUMBER\""
                    }
                }
            }
        }
    }
    post {
        failure {
            discordSend description: "Build Failed - $env.JOB_NAME $env.BUILD_NUMBER", link: env.BUILD_URL, result: currentBuild.currentResult, title: env.JOB_NAME, webhookURL: env.DISCORD_WEBHOOK
        }
        success {
            discordSend description: "Build Succeed - $env.JOB_NAME $env.BUILD_NUMBER", link: env.BUILD_URL, result: currentBuild.currentResult, title: env.JOB_NAME, webhookURL: env.DISCORD_WEBHOOK
        }
    }
}