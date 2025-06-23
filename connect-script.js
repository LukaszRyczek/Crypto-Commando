const connectWalletBtn = document.getElementById('connect-wallet');
const xButton = document.getElementById('submit-x');
const xInput = document.getElementById('x-username');
const xConnect = document.getElementById('x-connect');
const disconnectBtn = document.getElementById('disconnect-wallet');
const status = document.getElementById('status');
let walletAddress = null;

function saveDataToDatabase(data) {
    fetch('http://localhost/save-wallet.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(error => console.error('Error saving to database:', error));
}

async function connectWallet() {
    const solana = window.solana;
    if (!solana || !solana.isPhantom) {
        status.textContent = "Install Phantom wallet";
        return;
    }

    try {
        const response = await solana.connect();
        if (response && response.publicKey) {
            walletAddress = response.publicKey.toString();
            status.textContent = `Connected: ${walletAddress}`;
            connectWalletBtn.style.display = 'none';
            xConnect.style.display = 'block';
            disconnectBtn.style.display = 'inline-block';
            saveDataToDatabase({ wallet: walletAddress, type: 'phantom' });
        } else {
            status.textContent = "Phantom connection failed: No public key";
        }
    } catch (error) {
        status.textContent = `Connection failed: ${error.message || error}`;
        console.error(error);
    }
}

async function connectX() {
    const username = xInput.value.trim();
    if (!username || !username.startsWith('@')) {
        status.textContent = "Enter valid X username (e.g., @username)";
        return;
    }

    const userEntry = { wallet: walletAddress, username: username };
    saveDataToDatabase(userEntry);
    setTimeout(() => {
        window.location.href = 'index2.html';
    }, 1000);
}

function checkConnectedWallet() {
    // This would require server-side check; for now, assume no initial connection
    connectWalletBtn.style.display = 'block';
    xConnect.style.display = 'none';
    disconnectBtn.style.display = 'none';
    status.textContent = '';
}

async function disconnectWallet() {
    if (walletAddress) {
        const solana = window.solana;
        if (solana && solana.disconnect) {
            await solana.disconnect();
        }
        walletAddress = null;
        xConnect.style.display = 'none';
        disconnectBtn.style.display = 'none';
        status.textContent = "Wallet disconnected";
        connectWalletBtn.style.display = 'block';
        saveDataToDatabase({ action: 'disconnect', wallet: walletAddress }); // Notify server
    }
}

connectWalletBtn.addEventListener('click', connectWallet);
xButton.addEventListener('click', connectX);
disconnectBtn.addEventListener('click', disconnectWallet);

window.addEventListener('load', checkConnectedWallet);