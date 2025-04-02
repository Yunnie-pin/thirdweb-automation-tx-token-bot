const puppeteer = require("puppeteer-core");
const readline = require("readline");
const fs = require("fs");

// Membuat interface untuk input dari pengguna
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fungsi untuk mendapatkan address contract
const getContractAddress = () => {
  return new Promise((resolve) => {
    rl.question("Masukkan address contract: ", (input) => {
      resolve(input.trim());
    });
  });
};

const getSlugChain = () => {
  return new Promise((resolve) => {
    rl.question("Masukkan slug chain: ", (input) => {
      resolve(input.trim());
    });
  });
}

// Fungsi untuk mendapatkan jumlah pengulangan dari pengguna
const getBurnCount = () => {
  return new Promise((resolve) => {
    rl.question(
      "Berapa kali proses yang ingin dilakukan? (misalnya, 3): ",
      (input) => {
        const burnCount = parseInt(input, 10);
        resolve(isNaN(burnCount) || burnCount <= 0 ? 1 : burnCount); // Default 1 kali jika input invalid
      }
    );
  });
};

const getRandomAddress = () => {
    const addresses = fs.readFileSync("address.txt", "utf-8").split("\n").map(a => a.trim()).filter(a => a);
    return addresses.length > 0 ? addresses[Math.floor(Math.random() * addresses.length)] : "0x0000000000000000000000000000000000000000";
  };

const burnMethod = async (page, browser) => {
  // Klik tombol "Burn" pertama untuk membuka input
  await page.waitForSelector("button:has(svg.lucide-flame)", { timeout: 5000 });
  await page.click("button:has(svg.lucide-flame)");
  console.log("--Tombol Burn ditekan!");

  // Tunggu input amount muncul
  await page.waitForSelector('input[name="amount"]', { timeout: 5000 });

  // Tunggu 2 detik sebelum mengisi amount
  await page.evaluate(
    () => new Promise((resolve) => setTimeout(resolve, 2000))
  );

  // Generate angka random antara 1-200
  const randomAmount = Math.floor(Math.random() * 200) + 1;
  console.log("--Mengisi amount dengan nilai:", randomAmount);

  // Isi input amount menggunakan page.type
  await page.type('input[name="amount"]', randomAmount.toString(), {
    delay: 100,
  }); // delay 100ms antar karakter

  // Tunggu tombol Burn Tokens aktif
  await page.waitForFunction(() => {
    const btn = document.querySelector(
      'button[type="submit"][form="token-burn-form"]'
    );
    return btn && !btn.disabled;
  });

  // Klik tombol Burn Tokens
  await page.click('button[type="submit"][form="token-burn-form"]');
  console.log("--Tombol Burn Tokens ditekan!");

  // Tunggu popup MetaMask muncul dan klik tombol Confirm
  let metamaskPage = null;
  const maxAttempts = 20; // Coba maksimal 20 kali
  let attempts = 0;

  while (!metamaskPage && attempts < maxAttempts) {
    const allPages = await browser.pages();
    metamaskPage = allPages.find((page) =>
      page
        .url()
        .includes(
          "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/notification.html"
        )
    );

    if (!metamaskPage) {
      console.log("Popup belum muncul, menunggu...");
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 500))
      );
    }
    attempts++;
  }

  if (!metamaskPage) {
    console.log("Popup MetaMask tidak muncul dalam waktu yang ditentukan.");
    await browser.disconnect();
    return;
  }

  console.log("--Popup MetaMask terdeteksi!");

  // Tunggu tombol Confirm muncul dan klik
  await metamaskPage.waitForSelector(
    'button[data-testid="confirm-footer-button"]',
    { visible: true }
  );
  await metamaskPage.click('button[data-testid="confirm-footer-button"]');
  console.log("--Transaksi dikonfirmasi di MetaMask!");

  // Tunggu sampai elemen sukses muncul atau timeout 30 detik
  try {
    await page.waitForSelector('div[data-title="Tokens burned successfully"]', {
      visible: true,
      timeout: 15000,
    });
    console.log("--Tokens burned successfully! Melanjutkan perulangan...");
  } catch (error) {
    console.log("--Timeout 30 detik berlalu tanpa menemukan elemen sukses.");
  }

  console.log("Proses burn selesai!");
};

const mintMethod = async (page, browser) => {
  // Tunggu tombol Mint yang lebih spesifik
  await page.waitForSelector("button.bg-primary > svg.lucide-plus", {
    timeout: 10000,
  }); // Tunggu hingga 10 detik
  await page.click("button.bg-primary > svg.lucide-plus");
  console.log("--Tombol Mint ditekan!");

  // Tunggu input amount muncul
  await page.waitForSelector('input[name="amount"]', { timeout: 5000 });

  // Tunggu 2 detik sebelum mengisi amount
  await page.evaluate(
    () => new Promise((resolve) => setTimeout(resolve, 2000))
  );

  // Generate angka random antara 1-200
  const randomAmount = Math.floor(Math.random() * 200) + 1;
  console.log("--Mengisi amount dengan nilai:", randomAmount);

  // Isi input amount menggunakan page.type
  await page.type('input[name="amount"]', randomAmount.toString(), {
    delay: 100,
  }); // delay 100ms antar karakter

  // Tunggu tombol Burn Tokens aktif
  await page.waitForFunction(() => {
    const btn = document.querySelector(
      'button[type="submit"][form="token-mint-form"]'
    );
    return btn && !btn.disabled;
  });

  // Klik tombol Burn Tokens
  await page.click('button[type="submit"][form="token-mint-form"]');
  console.log("--Tombol Burn Tokens ditekan!");

  // Tunggu popup MetaMask muncul dan klik tombol Confirm
  let metamaskPage = null;
  const maxAttempts = 20; // Coba maksimal 20 kali
  let attempts = 0;

  while (!metamaskPage && attempts < maxAttempts) {
    const allPages = await browser.pages();
    metamaskPage = allPages.find((page) =>
      page
        .url()
        .includes(
          "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/notification.html"
        )
    );

    if (!metamaskPage) {
      console.log("Popup belum muncul, menunggu...");
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 500))
      );
    }
    attempts++;
  }

  if (!metamaskPage) {
    console.log("--Popup MetaMask tidak muncul dalam waktu yang ditentukan.");
    await browser.disconnect();
    return;
  }

  console.log("--Popup MetaMask terdeteksi!");

  // Tunggu tombol Confirm muncul dan klik
  await metamaskPage.waitForSelector(
    'button[data-testid="confirm-footer-button"]',
    { visible: true }
  );
  await metamaskPage.click('button[data-testid="confirm-footer-button"]');
  console.log("--Transaksi dikonfirmasi di MetaMask!");

  // Tunggu sampai elemen sukses muncul atau timeout 30 detik
  try {
    await page.waitForSelector('div[data-title="Tokens burned successfully"]', {
      visible: true,
      timeout: 15000,
    });
    console.log("--Tokens burned successfully! Melanjutkan perulangan...");
  } catch (error) {
    console.log("--Timeout 30 detik berlalu tanpa menemukan elemen sukses.");
  }

  console.log("--Proses burn selesai!");
};

const transferMethod = async (page, browser) => {
  // Tunggu tombol Send yang lebih spesifik
  await page.waitForSelector("button.bg-primary > svg.lucide-send", {
    timeout: 10000,
  }); // Tunggu hingga 10 detik
  await page.click("button.bg-primary > svg.lucide-send");
  console.log("--Tombol Send ditekan!");

  // Tunggu input amount muncul
  await page.waitForSelector('input[name="amount"]', { timeout: 5000 });

  // Tunggu 2 detik sebelum mengisi amount
  await page.evaluate(
    () => new Promise((resolve) => setTimeout(resolve, 2000))
  );

  // Generate angka random antara 1-200
  const randomAmount = Math.floor(Math.random() * 200) + 1;
  console.log("--Mengisi amount dengan nilai:", randomAmount);

  // Isi input amount menggunakan page.type
  await page.type('input[name="amount"]', randomAmount.toString(), {
    delay: 100,
  }); // delay 100ms antar karakter

  // isi input Address 
  const randomAddress = getRandomAddress();
  console.log("--Menggunakan address tujuan:", randomAddress);
  await page.type('input[placeholder="0x0000000000000000000000000000000000000000"]', randomAddress, {
    // delay: 100,
  });

  // Tunggu tombol Transfer Tokens aktif
  await page.waitForFunction(() => {
    const btn = document.querySelector(
      'button[type="submit"][form="token-transfer-form"]'
    );
    return btn && !btn.disabled;
  });

  // Klik tombol Transfer Tokens
  await page.click('button[type="submit"][form="token-transfer-form"]');
  console.log("--Tombol Transfer Tokens ditekan!");

  // Tunggu popup MetaMask muncul dan klik tombol Confirm
  let metamaskPage = null;
  const maxAttempts = 20; // Coba maksimal 20 kali
  let attempts = 0;

  while (!metamaskPage && attempts < maxAttempts) {
    const allPages = await browser.pages();
    metamaskPage = allPages.find((page) =>
      page
        .url()
        .includes(
          "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/notification.html"
        )
    );

    if (!metamaskPage) {
      console.log("Popup belum muncul, menunggu...");
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 500))
      );
    }
    attempts++;
  }

  if (!metamaskPage) {
    console.log("--Popup MetaMask tidak muncul dalam waktu yang ditentukan.");
    await browser.disconnect();
    return;
  }

  console.log("--Popup MetaMask terdeteksi!");

  // Tunggu tombol Confirm muncul dan klik
  await metamaskPage.waitForSelector(
    'button[data-testid="confirm-footer-button"]',
    { visible: true }
  );
  await metamaskPage.click('button[data-testid="confirm-footer-button"]');
  console.log("--Transaksi dikonfirmasi di MetaMask!");

  // Tunggu sampai elemen sukses muncul atau timeout 30 detik
  try {
    await page.waitForSelector('div[data-title="Tokens transfer successfully"]', {
      visible: true,
      timeout: 15000,
    });
    console.log("--Tokens tranfer successfully! Melanjutkan perulangan...");
  } catch (error) {
    console.log("--Timeout 30 detik berlalu tanpa menemukan elemen sukses.");
  }

  console.log("--Proses Transfer selesai!");
};

(async () => {

  const contractAddress = await getContractAddress();
  const slugChain = await getSlugChain();

  const browser = await puppeteer.connect({
    browserURL: "http://localhost:9222",
  });

  console.log("Berhasil terhubung ke browser!");

  const page = await browser.newPage();
  await page.goto(
    "https://thirdweb.com/" + slugChain + "/" + contractAddress + "/tokens",
    {
      waitUntil: "networkidle2",
    }
  );

  console.log("Berhasil membuka halaman");

  const burnCount = await getBurnCount();
  console.log(`Proses akan dilakukan sebanyak ${burnCount} kali`);

  const methods = [burnMethod, mintMethod, transferMethod];

  for (let i = 0; i < burnCount; i++) {
    console.log(`-Memulai pengulangan ${i + 1} dari ${burnCount}...`);
    const randomMethod = methods[Math.floor(Math.random() * methods.length)];
    await randomMethod(page, browser);

    // Jeda antar iterasi
    if (i < burnCount - 1) {
      console.log("-Menunggu 2 detik sebelum pengulangan berikutnya...");
      await page.evaluate(
        () => new Promise((resolve) => setTimeout(resolve, 2000))
      );
    }
  }

  await browser.disconnect();
  rl.close(); // Menutup interface readline setelah selesai
})();
