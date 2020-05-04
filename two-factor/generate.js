/**
 * Modules
 */
var speakeasy = require('speakeasy');
var QRCode = require('qrcode');

/**
 * Generate
 */
var secret = speakeasy.generateSecret();
console.log(secret);

QRCode.toDataURL(secret.otpauth_url, { errorCorrectionLevel: 'H' }, function(err, data_url) {
  console.log(data_url);
});
