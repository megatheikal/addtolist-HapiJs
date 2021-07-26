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
  await server.register([
    {
      plugin: require("hapi-pgsql"),
      options: {
        database_url: process.env.DB_URL
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

  server.route({
    method: "GET",
    path: "/",
    handler: async (request, h) => {
      const time = await request.pgsql.query("SELECT NOW()");
      return `Hello World! Time: ${time.rows[0].now}`;
    }
  });
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
