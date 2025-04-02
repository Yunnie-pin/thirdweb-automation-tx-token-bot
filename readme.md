# THIRDWEB-AUTOMATION-TX-TOKEN-BOT

## Tools & Requirements
- [Node.js LTS](https://nodejs.org/en) (Latest Long-Term Support version)
- [Google Chrome](https://www.google.com/chrome/)
- [MetaMask Extension](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)

## Setup Guide

### 1. Open Chrome with Remote Debugging
Buka Chrome dengan port `9222` menggunakan PowerShell:
```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\chrome-profile"
```

### 2. Install MetaMask
Pasang [MetaMask](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) pada Chrome yang berjalan di port `9222`.

### 3. Setup Wallet
- Buat dompet baru atau impor private key Anda ke MetaMask.

### 4. Hubungkan dengan ThirdWeb
- Buka [ThirdWeb](https://thirdweb.com/thirdweb.eth/TokenERC20) dan hubungkan dompet MetaMask Anda.

### 5. Deploy Token
- [Deploy token](https://thirdweb.com/thirdweb.eth/TokenERC20/deploy) menggunakan ThirdWeb.
- Setelah deploy selesai, salin alamat kontrak token Anda.

### 6. Clone dan Jalankan Script
```bash
# Clone repository
git clone https://github.com/Yunnie-pin/thirdweb-automation-tx-token-bot
cd thirdweb-automation-tx-token-bot

# Install dependencies
npm install

# Jalankan script
node main.js
```

## Supported Platforms
✅ Windows

