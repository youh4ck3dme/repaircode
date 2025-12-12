# Deploying repaircode on your VPS

**IMPORTANT:** You must update your DNS A record for `nexify-studio.tech` to point to **194.182.87.6** before running the deployment. Currently, it points to 199.36.158.100.

## 1. Upload the Deployment Package
Open a terminal on your Mac (or local machine) and upload the `repaircode_deploy.zip` file to your server. 

```bash
scp repaircode_deploy.zip root@194.182.87.6:~/
```

## 2. Connect to the Server
SSH into your VPS:

```bash
ssh root@194.182.87.6
```

## 3. Prepare and Run
Once logged in, run the following commands one by one:

```bash
# 1. Update system
apt update && apt upgrade -y

# 2. Install Unzip and Docker (if not already installed)
apt install -y unzip curl
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
fi

# 3. Unzip the package
unzip -o repaircode_deploy.zip -d repaircode
cd repaircode

# 4. Make script executable and run
chmod +x deploy.sh
./deploy.sh
```
