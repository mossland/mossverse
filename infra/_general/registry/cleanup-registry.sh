#!/bin/bash
HOST=$(infra/_general/jenkins/getRegistry.sh)
REGISTRY_DIR=~/registry/data/docker/registry/v2/repositories
REGISTRY_URL=https://$HOST/registry
#add --insecure to the curl command on line 17 if you use https with self-signed certificates

cd ${REGISTRY_DIR}
count=0

manifests_without_tags=$(comm -23 <(find . -type f -name "link" | grep "_manifests/revisions/sha256" | grep -v "\/signatures\/sha256\/" | awk -F/ '{print $(NF-1)}' | sort) <(for f in $(find . -type f -name "link" | grep "_manifests/tags/.*/current/link"); do cat ${f} | sed 's/^sha256://g'; echo; done | sort))

total_count=$(echo ${manifests_without_tags} | wc -w)

for manifest in ${manifests_without_tags}; do
	repo=$(find . | grep "_manifests/revisions/sha256/${manifest}/link" | awk -F "_manifest"  '{print $(NF-1)}' | sed 's#^./\(.*\)/#\1#')
	
	#should have error checking on the curl command, it might fail silently atm.
	curl -s -X DELETE ${REGISTRY_URL}/v2/${repo}/manifests/sha256:${manifest} > /dev/null
	
	((count++))
	echo "Deleted ${count} of ${total_count} manifests."
done