import { POST, CONTENT_TYPE_JSON } from "./constants";
import { ENCRYPT_URL } from "./urls";
import { JSEncrypt } from "jsencrypt";
import { decode } from "js-base64";
import { setAes } from "./localStorage";

var CryptoJS = require("crypto-js");
var keypair = require("keypair");
const crypto = require("crypto");

const header = {
  "Content-Type": CONTENT_TYPE_JSON,
  accept: CONTENT_TYPE_JSON,
  "access-control-allow-credentials": true,
};

export function decryptStatic(bs4Text = "", plainText = "") {
  var ciphertext = CryptoJS.enc.Base64.parse(bs4Text);

  // split iv and ciphertext
  var iv = ciphertext.clone();
  iv.sigBytes = 16;
  iv.clamp();
  ciphertext.words.splice(0, 4); // delete 4 words = 16 bytes
  ciphertext.sigBytes -= 16;

  var key = CryptoJS.enc.Utf8.parse(plainText);

  var decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
    iv: iv,
  });
  if (decrypted.sigBytes < 0) {
    decrypted.sigBytes = 16;
  }
  return decrypted.toString(CryptoJS.enc.Utf8);
}

export function decrypt(bs4Text, plainText) {
  var ciphertext = CryptoJS.enc.Base64.parse(bs4Text);

  // split iv and ciphertext
  var iv = ciphertext.clone();
  iv.sigBytes = 16;
  iv.clamp();
  ciphertext.words.splice(0, 4); // delete 4 words = 16 bytes
  ciphertext.sigBytes -= 16;

  var key = CryptoJS.enc.Utf8.parse(plainText);

  var decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {
    iv: iv,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

export function encryptStatic(text, plainText) {
  var key = CryptoJS.enc.Utf8.parse(plainText);
  var iv = CryptoJS.lib.WordArray.random(16);
  var encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
  });
  return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}

export async function encrypt(text, plainText) {
  var key = CryptoJS.enc.Utf8.parse(plainText);
  var iv = CryptoJS.lib.WordArray.random(16);
  var encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
  });
  return await iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}

export async function decryptRsa(token) {
  // const decrypt = new JSEncrypt();
  // decrypt.setPrivateKey(key);
  var url = ENCRYPT_URL;
  var pair = keypair();
  var publicKey = {
    key: encodeURIComponent(pair.public),
  };

  // const onSuccess = (respones) => {
  //   var dataEnc = respones.data;
  //   const decrypt = new JSEncrypt();
  //   decrypt.setPrivateKey(pair.private);
  //   const plainText = decrypt.decrypt(dataEnc) || "DECRYPTION FAILED";
  //   return plainText;
  // };

  // const onFailure = (respones) => {};

  // _getStorageValue(ACCESS_TOKEN).then((token) => {

  //   apiCall(POST, url, publicKey, onSuccess, onFailure, "", token);
  // });
  header["Authorization"] = token;

  var formData = {
    method: POST,
    headers: header,
  };

  var formBody = JSON.stringify(publicKey);

  if (publicKey !== undefined && publicKey !== "") {
    formData["body"] = formBody;
  }

  // var requestJson = JSON.stringify({
  //   request: 'Requested to update access token',
  // });

  return await fetch(url, formData, 500)
    .then((response) => {
      return response
        .json()
        .then((responseJson) => {
          // return responseJson;
          var dataEnc = responseJson.data;

          const decrypt = new JSEncrypt();
          decrypt.setPrivateKey(pair.private);
          let dec = decrypt.setPrivateKey(pair.private);
          const plainText = decrypt.decrypt(dataEnc) || "DECRYPTION FAILED";
          setAes(plainText);
          return plainText;
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

export function rsaEnc(data, key) {
  var publicKeyValue = decode(key);

  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKeyValue,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(data),
  );
  return encryptedData.toString("base64");
}
