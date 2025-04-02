Tools: 
- [Node.JS LTS](https://nodejs.org/en)
- GOOGLE CHROME
- [METAMASK](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=www.google.com) 


1. Open Chrome port :9222 with PowerShell
``` 
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\chrome-profile" 
```

2. Install [Metamask](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=www.google.com) on that Chrome port :9222

3. Create New Wallet / Import Your Private Keys

4. Open [ThirdWeb](https://thirdweb.com/thirdweb.eth/TokenERC20) and Connect Wallet

5. [Deploy Token with ThirdWeb](https://thirdweb.com/thirdweb.eth/TokenERC20/deploy) and copy Contract Address when complete deploying

6. Pull Script and Run script
```bash
    git clone https://github.com/Yunnie-pin/thirdweb-automation-tx-token-bot
    cd thirdweb-automation-tx-token-bot
    npm install
    node main.js
``` 

