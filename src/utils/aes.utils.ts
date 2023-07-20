import * as crypto from 'crypto';

const secretKey = process.env.SECRET_KEY_AES;

export function encryptResponse(response: any): any {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encryptedResponse = cipher.update(JSON.stringify(response), 'utf8', 'base64');
  encryptedResponse += cipher.final('base64');

  return {
    encryptedResponse,
    iv: iv.toString('base64')
  };
}

export function decryptResponse(encryptedResponse: any, iv: string): any {
  const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, Buffer.from(iv, 'base64'));
  let decryptedResponse = decipher.update(encryptedResponse, 'base64', 'utf8');
  decryptedResponse += decipher.final('utf8');

  return JSON.parse(decryptedResponse);
}