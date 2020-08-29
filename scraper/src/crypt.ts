import crypto from "crypto";

const algorithm = "aes-256-cbc";

function encrypt(text, pass) {
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

console.log(process.argv);
if (process.argv[2] === "decrypt") {
  console.log(decrypt(process.argv[3], process.argv[4]));
} else if (process.argv[2]) {
  console.log(encrypt(process.argv[2], process.argv[3]));
}
