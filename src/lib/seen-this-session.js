import auth from 'panoptes-client/lib/auth';

const subjectsSeenThisSession = [];

auth.listen('change', () => {
  return subjectsSeenThisSession.splice(0);
});

function add(workflowId, subjectIds) {
  subjectIds.map((subjectId) => {
    subjectsSeenThisSession.push(`${workflowId}/${subjectId}`);
  });
}

function check(workflow, subject) {
  return subjectsSeenThisSession.includes(`${workflow.id}/${subject.id}`);
}

if (window) {
  window.subjectsSeenThisSession = subjectsSeenThisSession;
}

export {
  add,
  check,
};
