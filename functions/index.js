const admin = require("firebase-admin");

const serviceAccount = require("./service_account.json");

const figmaHook = require("./lib/figma_hook");
const modifyColorScheme = require("./lib/modify_color_scheme");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


exports.figmaHook = figmaHook.figmaHook;
exports.modifyColorScheme = modifyColorScheme.modifyColorScheme;
