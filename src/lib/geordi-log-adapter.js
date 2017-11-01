import GeordiClient from 'zooniverse-geordi-client';

const enabledTokens = ['zooHome', 'zooTalk', 'zooniverse/gravity-spy', 'mschwamb/comet-hunters', 'antiSlaveryManuscripts'];

function getEnv() {
  const shellEnv = process.env.NODE_ENV === 'production' ? 'production' : null;
  const reg = /\W?env=(\w)/;
  const browserEnv = ((window && window.location.search.match(reg)) || [])[0];
  return shellEnv || browserEnv || 'staging';
}

class GeordiLogAdapter {
  constructor() {
    this.geordiClient = null;
  }

  configure(keys) {
    this.geordiClient = new GeordiClient({
      env: getEnv(),
      projectToken: (keys && keys.projectToken) || 'zooHome',
      zooUserIDGetter: () => (keys && keys.userID),
      subjectGetter: () => (keys && keys.subjectID)
    });
  }

  onRemember(newKeys) {
    const resetGeordi = newKeys && newKeys.projectToken &&
      (newKeys.projectToken !== this.geordiClient.projectToken);

    if (resetGeordi) {
      this.geordiClient.update({ projectToken: newKeys.projectToken });
    }
  }

  onForget(keyList) {
    const resetGeordi = keyList.includes('projectToken');

    if (resetGeordi) {
      this.geordiClient.update({ projectToken: 'zooHome' });
    }
  }

  logEvent(logEntry) {
    if (enabledTokens.includes(logEntry.projectToken)) {
      if (this.geordiClient.logEvent) {
        this.geordiClient.logEvent(logEntry);
      } else {
        console.warn('No Geordi logger available for event', JSON.stringify(logEntry)); // eslint-disable-line no-console
      }
    }
  }
}

export default GeordiLogAdapter;
