const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '2hszvg',
  watchForFileChanges: false,
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: true,
  screenshotOnRunFailure: true,
  env: {
    'email': 'testuser1@mailer.com',
    'password': 'password',
    'apiURL': 'https://conduit-api.bondaracademy.com'
  },
  retries: {
    runMode: 2,
    openMode: 1
  },
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  e2e: {
    setupNodeEvents(on, config) {
      const email = process.env.email
      const password = process.env.password

      config.env = { email, password }
      return config
    },

    baseUrl: 'https://conduit.bondaracademy.com/',
  },
});
