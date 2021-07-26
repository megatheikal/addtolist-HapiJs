//initialize hapi server
//contains detail of port number and host information
"use strict";

const Hapi = require("@hapi/hapi");
const env = require("env2")("env.json");

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost"
  });

  //register postgresql into hapi server
  //use hapi auto route to help directory
  await server.register([
    {
      plugin: require("hapi-pgsql"),
      options: {
        database_url: process.env.DB_URL
      }
    },
    {
      plugin: require("hapi-auto-route"),
      options: {
        routes_dir: Path.join(__dirname, "routes")
      }
    },
    {
      plugin: require("hapi-pino"),
      options: {
        logPayload: true,
        prettyPrint: true,
        level: "debug"
      }
    }
  ]);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
