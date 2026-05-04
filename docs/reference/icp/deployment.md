---
title: Deployment
---

# Deployment

## Distribution

Build the packaged distribution:

```bash
./gradlew build
```

Output: `build/distribution/wso2-integration-control-plane-<version>.zip`

Extract and start the server:

```bash
# Extract
unzip build/distribution/wso2-integration-control-plane-<version>.zip -d build/distribution

# Change into the extracted directory
cd build/distribution/wso2-integration-control-plane-<version>/bin

# Start — Linux/macOS
./icp.sh

# Start — Windows
icp.bat
```
