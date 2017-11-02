const stored = sessionStorage.getItem('session_id') || null;

const generateSessionID = () => {
  const hash = require('hash.js');
  const sha2 = hash.sha256();
  const id = sha2.update(`${Math.random() * 10000 }${Date.now()}${Math.random() * 1000}`).digest('hex');
  const ttl = fiveMinutesFromNow();
  const stored = {id, ttl};
  try {
    sessionStorage.setItem('session_id', JSON.stringify(stored));
  }
  catch(e) {
    console.log(e);
  }
  return stored;
};

const getSessionID = () => {
  let id;
  let ttl;
  if (stored) {
    ({id, ttl} = JSON.parse(sessionStorage.getItem('session_id')));
  }

  if (ttl < Date.now()) {
    id = generateSessionID();
  } else {
    ttl = fiveMinutesFromNow();
    try {
      sessionStorage.setItem('session_id', JSON.stringify({id, ttl}))
    }
    catch(e) {
      console.log(e);
    }
  }
  return id;
};

const fiveMinutesFromNow = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 5);
  return d;
};

export { generateSessionID, getSessionID };
