const PRIME_STORE = require("./data/prime_10e7_10e8.json")
const extGcd = require('extgcd');
const INPUT_TEXT = "4bdb8a163d4b2fa4fa0e0a4b27e94ce2b18268d05df3d4f2628962654ca31d66";

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

const modExp = (a, b, n) => {
    a = a % n;
    let result = 1n;
    let x = a;

    while (b > 0n) {
        let leastSignificantBit = b % 2n;
        b = b / 2n;

        if (leastSignificantBit === 1n) {
            result = result * x;
            result = result % n;
        }
        x = x * x;
        x = x % n;
    }
    return result;
};


const encrypt = (string, E, N) => {
    return string.split('').map(char => {
        let char_id = BigInt(char.charCodeAt(0));
        return modExp(char_id, E, N);
    })
}

const decrypt = (string, D, N) => {
    return string.map(code => {
        return String.fromCharCode(Number(modExp(code, D, N)));
    }).join('');
}

const encryptSignature = (hashString, D, N) => {
    return encrypt(hashString, D, N);
}

const decryptSignature = (string, E, N) => {
    return decrypt(string, E, N);
}

const generateKeys = (primeNumbers) => {
    let p = BigInt(primeNumbers[getRandomInt(0, primeNumbers.length)]);
    let q = BigInt(primeNumbers[getRandomInt(0, primeNumbers.length)]);
    let fi = (p - 1n) * (q - 1n);

    const n = p * q;
    const e = BigInt(primeNumbers[getRandomInt(0, primeNumbers.length)]);
    const d = (extGcd(e, fi).x % fi + fi) % fi;

    return {publicKey: e, privateKey: d, N: n}
}


let keys = generateKeys(PRIME_STORE)

let encryptedSign = encryptSignature(INPUT_TEXT, keys.privateKey, keys.N)
let decryptedSign = decryptSignature(encryptedSign, keys.publicKey, keys.N)

// let encryptedText = encrypt(INPUT_TEXT, keys.publicKey, keys.N)
// let decryptedText = decrypt(encryptedText, keys.privateKey, keys.N)

console.log("Public key: = " + keys.publicKey + " " + keys.N)
console.log("Private key: = " + keys.privateKey + " " + keys.N)
console.log("Encrypted: = " + INPUT_TEXT)
console.log("Decrypted: = " + decryptedSign)
console.log("Store count:" + PRIME_STORE.length)
console.log("Store item len:" + PRIME_STORE[0].toString().length)