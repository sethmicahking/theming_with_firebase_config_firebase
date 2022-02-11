const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const figmaFileKey = functions.config().figma.file_key;

const figmaAccessToken = functions.config().figma.access_token;
const pageName = "Color Showcase";
const canvasName = "All Colors";

const rgbToHex = (a, r, g, b) => [a, r, g, b].map((x) => {
  const hex = Math.round((x * 255)).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}).join("");

exports.modifyColorScheme = functions.pubsub
    .topic("modifyColorScheme").onPublish(async (message, context) => {
      const fileRes = await axios({method: "get", url: `https://api.figma.com/v1/files/${figmaFileKey}`,
        headers: {"X-FIGMA-TOKEN": figmaAccessToken}});

      if (fileRes.status === 200) {
        const data = fileRes.data;


        const page = data.document
            .children.find((page) => page.name === pageName);
        const canvas = page
            .children.find((canvas) => canvas.name === canvasName);
        if (canvas.children) {
          const shapes = Array.from(canvas.children);
          const colorScheme = {};
          for (const shape of shapes) {
            const name = shape.name;
            const a = shape["fills"][0]["color"]["a"];
            const r = shape["fills"][0]["color"]["r"];
            const g = shape["fills"][0]["color"]["g"];
            const b = shape["fills"][0]["color"]["b"];

            colorScheme[name] = parseInt(rgbToHex(a, r, g, b), 16);
          }

          const configTemplate = await admin.remoteConfig()
              .getTemplate();
          configTemplate.parameters["colorScheme"] = {
            defaultValue: {
              value: JSON.stringify(colorScheme),
            },
          };
          await admin.remoteConfig().publishTemplate(configTemplate);
        }
      }
    });


