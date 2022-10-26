#!/bin/bash
SECRET_MAP=( \
"infra/kubernetes/secrets.yaml,mossland-metaverse-kube-secret,general" \
"infra/kubernetes/kubeconfig.yaml,mossland-metaverse-kube-config,general" \
"secure/.jenkins.conf,mossland-metaverse-jenkins-conf,general" \
# "infra/debug/mossland/secrets.yaml,mossland-metaverse-mossland-secret-debug,debug" \
# "infra/develop/mossland/secrets.yaml,mossland-metaverse-mossland-secret-develop,develop" \
# "infra/main/mossland/secrets.yaml,mossland-metaverse-mossland-secret-main,main" \
)

for SECRET in ${SECRET_MAP[@]}; do
    echo ${SECRET}
done
exit 0