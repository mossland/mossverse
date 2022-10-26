#!/bin/bash
SECRET_MAP=( \
"apps/mossland/backend/src/environments/environment.local.ts,mossland-metaverse-mossland-backend-env-local,local" \
"apps/mossland/backend/src/environments/environment.debug.ts,mossland-metaverse-mossland-backend-env-debug,debug" \
"apps/mossland/backend/src/environments/environment.develop.ts,mossland-metaverse-mossland-backend-env-develop,develop" \
"apps/mossland/backend/src/environments/environment.main.ts,mossland-metaverse-mossland-backend-env-main,main" \
"apps/mossland/frontend/env.ts,mossland-metaverse-mossland-frontend-env,client" \
)

for SECRET in ${SECRET_MAP[@]}; do
    echo ${SECRET}
done
exit 0