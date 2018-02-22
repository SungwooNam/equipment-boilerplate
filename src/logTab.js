function LogTabAppender(layout, timezoneOffset) {
    const appender = (loggingEvent) => {
        process.stdout.write(`${layout(loggingEvent, timezoneOffset)}\n`);
      };
    
      // add a shutdown function.
      appender.shutdown = (done) => {
        process.stdout.write('', done);
      };
    
      return appender;  
  }
  
  function configure(config, layouts) {
    let layout = layouts.colouredLayout;
    if (config.layout) {
      layout = layouts.layout(config.layout.type, config.layout);
    }

    return LogTabAppender(layout, config.timezoneOffset);
  }
  
  exports.configure = configure;
  