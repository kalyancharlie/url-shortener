// Base 62 Encoder
const CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const encode = (id) => {
    if (id == 0) return 0;
    let encodedStr = []
    while (id > 0) {
        encodedStr.push(CHARSET[id % 62])
        id = Math.floor(id / 62)
    }
    return encodedStr.join('');
};

// Decoder
const decode = (encInp) => {
    if (!encInp || encInp === '') return null;
    return encInp.split('').reverse().reduce((prev, curr, i) => {
        return prev + (CHARSET.indexOf(curr) * (62 ** i))
    }, 0)
}

module.exports = {
    encode,
    decode
}