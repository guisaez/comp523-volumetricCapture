// Pull all files in project directory automatically every 300 seconds.
module.exports = {
    webpack: (config) => {
      config.watchOptions.poll = 300;
      return config;
    },
  };

