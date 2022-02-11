const functions = require("firebase-functions");
const {PubSub} = require("@google-cloud/pubsub");

const pubSub = new PubSub();


const figmaPasscode = functions.config().figma.passcode;
const figmaFileKey = functions.config().figma.file_key;


exports.figmaHook = functions.https.onRequest(async (req, res) => {
  if (req.body["file_key"] === figmaFileKey &&
      req.body["event_type"] === "LIBRARY_PUBLISH" &&
      req.body["passcode"] === figmaPasscode) {
    const dataBuffer = Buffer.from(JSON.stringify(req.body));
    await pubSub.topic("modifyColorScheme").publish(dataBuffer);
  }

  res.status(200).send();
});
