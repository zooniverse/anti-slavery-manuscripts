const stored = sessionStorage.getItem('session_id') || null;

const generateSessionID = () => {
  const hash = require('hash.js');
  const sha2 = hash.sha256();
  const id = sha2.update(`${Math.random() * 10000 }${Date.now()}${Math.random() * 1000}`).digest('hex');
  const ttl = twoHoursFromNow();
  const stored = {id, ttl};
  try {
    sessionStorage.setItem('session_id', JSON.stringify(stored));
  }
  catch(err) {
    console.error('lib/get-session-id.js generateSessionID() error: ', err);
  }
  return stored;
};

const getSessionID = () => {
  let id;
  let ttl;
  if (stored) {
    ({id, ttl} = JSON.parse(sessionStorage.getItem('session_id')));
  }

  if (new Date(ttl).getTime() < Date.now()) {
    id = generateSessionID();
  } else {
    ttl = twoHoursFromNow();
    try {
      sessionStorage.setItem('session_id', JSON.stringify({id, ttl}))
    }
    catch(err) {
      console.error('lib/get-session-id.js getSessionID() error: ', err);
    }
  }
  return id;
};

const fiveMinutesFromNow = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 5);
  return d;
};

const twoHoursFromNow = () => {
  const d = new Date();
  d.setHours(d.getHours() + 2);
  return d;
};

export { generateSessionID, getSessionID };
