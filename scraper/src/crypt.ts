import crypto from "crypto";

const algorithm = "aes-256-cbc";
const pass = process.argv[2];

function encrypt(text) {
  const cipher = crypto.createCipher(algorithm, pass);
  let crypted = cipher.update(text, "utf8", "hex");
  crypted += cipher.final("hex");
  return crypted;
}

export function decrypt(text, pw) {
  if (!text) {
    return;
  }
  const decipher = crypto.createDecipher(algorithm, pw);
  let dec = decipher.update(text, "hex", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

if (process.argv[2]) {
  console.log(encrypt(""));
}
