# Deploying RepairCode on your VPS

Tento návod vás prevedie nasadením produkčnej verzie RepairCode s perzistentnou databázou na vašom serveri.

## 1. Príprava DNS
Pred spustením sa uistite, že váš DNS A záznam pre `nexify-studio.tech` smeruje na IP adresu vášho VPS (**194.182.87.6**).

## 2. Odoslanie súborov
Nahrajte projekt na váš server. Najrýchlejší spôsob je použiť ZIP archív:

```bash
scp repaircode_deploy.zip root@194.182.87.6:~/
```

## 3. Inštalácia na VPS

Pripojte sa k serveru:
```bash
ssh root@194.182.87.6
```

Spustite inštalačnú sekvenciu:

```bash
# 1. Príprava prostredia
apt update && apt upgrade -y
apt install -y unzip curl docker-compose

# 2. Rozbalenie
unzip -o repaircode_deploy.zip -d repaircode
cd repaircode

# 3. Konfigurácia
# Uistite sa, že máte nastavený GEMINI_API_KEY v .env súbore
echo "GEMINI_API_KEY=your_real_key_here" > .env

# 4. Spustenie cez Docker Compose (Production Mode)
# Toto spustí frontend (8080) aj backend (4000) s perzistentnými volumes
docker-compose up -d --build
```

## 🛡️ Persistence & Backups
RepairCode využíva Docker Volumes pre ukladanie dát. Aj po reštarte kontajnerov zostávajú dáta zachované v:
- `./server/db` (SQLite DB)
- `./server/repo` (Nahraté projekty)

## 🌐 Prístup k aplikácii
- **Frontend:** http://nexify-studio.tech:8080 (alebo cez váš Reverse Proxy)
- **Backend API:** http://nexify-studio.tech:4000
