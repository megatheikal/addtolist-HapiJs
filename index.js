//initialize hapi server
//contains detail of port number and host information
'use strict'

const Hapi = require('@hapi/hapi')
const env = require('env2')('env.json')
const Pack = require('./package.json')

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    debug: { request: ['error'] },
  })

  //authentication using jwt
  await server.register(require('hapi-auth-jwt2'))
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate: require('./util/jwtValidate'),
  })
  server.auth.default('jwt')

  const swaggerOptions = {
    info: {
      title: 'Todo API Documentation',
      version: Pack.version,
    },
  }
  //register postgresql into hapi server
  //use hapi auto route to help directory
  await server.register([
    { plugin: require('@hapi/inert') },
    { plugin: require('@hapi/vision') },
    {
      plugin: require('hapi-pgsql'),
      options: {
        database_url: process.env.DB_URL,
      },
    },
    {
      plugin: require('hapi-router'),
      options: {
        routes: 'routes/.*js',
      },
    },
    {
      plugin: require('hapi-swagger'),
      options: swaggerOptions,
    },
    {
      plugin: require('hapi-pino'),
      options: {
        logPayload: true,
        prettyPrint: true,
        level: 'debug',
      },
    },
    {
      plugin: require('hapi-redis2'),
      options: {
        settings: 'redis://127.0.0.1:6379/2',
        decorate: true,
      },
    },
  ])

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
