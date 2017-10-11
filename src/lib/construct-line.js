import React from 'react';

function constructLines(line) {
  const lines = [];
  if (line && line.clusters_x) {
    line.clusters_x.map((point, i) => {
      if (i > 0) {
        lines.push(
          <line
            key={`line${i-1}`}
            x1={line.clusters_x[i - 1]} y1={line.clusters_y[i - 1]}
            x2={line.clusters_x[i]} y2={line.clusters_y[i]}
            stroke="#c33" strokeWidth="2"
          />
        );
      }
    });
  }
  return lines;
}

function constructPoints(line) {
  const points = [];
  if (line && line.clusters_x && line.clusters_y) {
    line.clusters_x.map((point, i) => {
      const x = line.clusters_x[i];
      const y = line.clusters_y[i];
      points.push(
        <circle
          key={`point${i}`}
          cx={x} cy={y} r={5} fill="#c33"
        />
      );
    });
  }
  return points;
};

function constructText(line) {
  const sentences = [];
  if (line && line.clusters_text) {
    line.clusters_text.map((value) => {
      value.map((word, i) => {
        if (!sentences[i]) { sentences[i] = []; }
        if (word && word.length) { sentences[i].push(word); }
      })
    });
  }
  return sentences.map(value => value.join(' '));
}

export { constructPoints, constructLines, constructText };
