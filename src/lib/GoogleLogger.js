class GoogleLogger {
  constructor() {
    this.tokens = ['wgranger-test/anti-slavery-testing'];
  }

  getEnv() {
    let shell_env;
    let browser_env;

    if (process.env.NODE_ENV === "production") {
      shell_env = process.env.NODE_ENV === "production";
    }
    const reg = /\W?env=(\w+)/;

    if (window && window.location && window.location.search && window.location.search.match(reg)[1]) {
      browser_env = window.location.search.match(reg)[1];
    }

    return shell_env || browser_env || 'staging';
  }

  makeHandler(defType) {
    return (eventData, eventType) => {

      if (typeof eventType !== 'string') {
        eventType = defType;
      }

      this.logEvent({ type: eventType, relatedID: eventData });
    }
  }

  logEvent(logEntry) {
    const newEntry = Object.assign({}. logEntry, this.keys);

    if (GeordiLogger.tokens.indexOf(newEntry.projectToken) > -1) {
      this.instance().logEvent(newEntry);
      if (!this.instance().logEvent) {
        console.warn('No logger available for event', JSON.stringify(logEvent));
      }
    }
  }

  remember(eventData) {
    const reset = (eventData && eventData.projectToken && (eventData.projectToken !== this.instance().projectToken));

    if (reset) {
      this.instance().update({ projectToken: eventData });
    }
    this.keys = Object.assign({}, this.keys, eventData);
  }

  forget(forgetKeys) {
    let reset = false;

    forgetKeys.forEach((key) => {
      reset = (key === 'projectToken');
      delete this.keys[key];
    })

    if (reset) {
      this.remember({ projectToken: 'zooHome' });
    }
  }

}

export default GoogleLogger;
