/**
 * Modules
 */
var speakeasy = require("speakeasy");

/**
 * Validate
 */
var tokenValidates = speakeasy.totp.verify({
  secret: "IVJHOZKINQTEKRJDLVBVGTCHH5LUEV3NN5WVAXJ7HBXFM2KDGJWQ",
  encoding: "base32",
  token: "597848",
  window: 6,
});

console.log(tokenValidates);
