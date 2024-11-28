import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as bitcoin from 'bitcoinjs-lib';
import * as BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';
import { QRCodeSVG } from 'qrcode.react';

// Create BIP32 instance
const bip32 = BIP32Factory.default(ecc);

function getRandomBytes(size) {
    const array = new Uint8Array(size);
    window.crypto.getRandomValues(array);
    return array;
}

function generateBitcoinKeyPair() {
    const seed = getRandomBytes(32);
    const root = bip32.fromSeed(seed);
    const account = root.derivePath("m/44'/0'/0'/0/0");
    const privateKey = account.toWIF();
    const { address } = bitcoin.payments.p2pkh({ pubkey: account.publicKey });
    return { privateKey, publicKey: address };
}

const App = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        const { privateKey, publicKey } = generateBitcoinKeyPair();
        setPrivateKey(privateKey);
        setPublicKey(publicKey);
    }, []);

    return (
        <div>
            {isOnline ? <p>Online</p> : <p>Offline</p>}
            <div style={{ display: 'flex-column' }}>
                <div>
                    <h1>Public Key</h1>
                    <h2>{publicKey}</h2>
                    <div><QRCodeSVG value={publicKey} /></div>
                </div>
                <div>
                    <h1>Private Key</h1>
                    <h2>{privateKey}</h2>
                    <div><QRCodeSVG value={privateKey} /></div>
                </div>
            </div>
        </div>
    );
};

// Mount the app using createRoot
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);