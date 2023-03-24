"use strict";

/**
 *  product-code controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const path = require('path');
const config = "config"
const dataDir = path.join(config, "data")
const lastInsertedFilePath = path.join(dataDir, 'lastInserted.txt')
const generatedCode = path.join(dataDir, 'generatedCode.json')
const fs = require('fs');
function makeCode() {
  var length = 6;
  var result = "";
  var characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = createCoreController(
  "api::product-code.product-code",
  ({ strapi }) => ({
    async generate(ctx) {
      try {
        let beforeTime = Date.now();
        const numberOfCodes = parseInt(ctx.request.body.numberOfCodes);
        console.log("numberOfCodes", numberOfCodes)
        let currentData = await strapi.db.query("api::product-code.product-code").findMany();
        let createdCodes = [];

        console.log("Data..")
        const set = new Set();
        currentData.forEach(({ pin }) => {
          set.add(pin);
        });
        let extra = 0;
        for (let i = 0; i < numberOfCodes + extra; i++) {
          const code = makeCode();

          let existingCode = set.has(code);
          if (existingCode) {
            // i--;
            extra++;
          } else {
            let createdCode = { pin: code, scanCount: 0 }
            createdCodes.push(createdCode);
            set.add(code)
          }
        }
        for (let round = 0; round < createdCodes.length; round += 16000) {
          
          const to = Math.min(createdCodes.length, round + 16000)
          await strapi
            .query("api::product-code.product-code")
            .createMany({ data: createdCodes.slice(round, to) });
          console.log(createdCodes.length);

        }
        let afterTime = Date.now();
        console.log((afterTime - beforeTime) / 1000);
        // console.log(createdCodes.length);
        ctx.send(createdCodes);
      } catch (err) {
        ctx.response.status = 406;
        console.log(err);

        ctx.response.message = err.message;
      }
    },

    async authenticate(ctx) {
      try {
        console.log(ctx.request.body);

        const pin = ctx.request.body.pin;
        const email = ctx.request.body.email;

        if (email) {
          try {
            // try creating a subcriber because they might already exist
            let subscriber = await strapi
              .service("api::subscriber.subscriber")
              .create({ data: { email: email } });
            console.log("created subscriber " + subscriber);
          } catch (err) {
            console.log("error creating subscriber " + err);
          }
        }

        let code = await strapi.db
          .query("api::product-code.product-code")
          .findOne({
            where: { pin: pin },
          });

        if (code == null) {
          console.log("no code found");
          ctx.send(
            {
              type: "verification-failed",
            },
            200
          );
          return;
        }

        let updatedScanCount = code.scanCount + 1;

        if (code.scanCount > 0) {
          console.log("code already verified");
          let scannedCode = await strapi
            .service("api::product-code.product-code")
            .update(code.id, { data: { scanCount: updatedScanCount } });

          ctx.send(
            {
              type: "already-verified",
              scanCount: code.scanCount,
              verificationDate: code.verificationDate,
            },
            200
          );
          return;
        }

        let verificationDate = new Date();

        let scannedCode = await strapi
          .service("api::product-code.product-code")
          .update(code.id, {
            data: {
              scanCount: updatedScanCount,
              verificationDate: verificationDate,
            },
          });

        ctx.send(
          {
            type: "verification-success",
            scanCount: updatedScanCount,
            verificationDate: verificationDate,
          },
          200
        );
      } catch (err) {
        ctx.response.status = 406;
        console.log(err);

        ctx.response.message = err.message;
      }
    },
  })
);
