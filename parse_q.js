const fs = require('fs');

const raw = fs.readFileSync('raw_q.txt', 'utf8');
const lines = raw.split('\n');

let currentLevel = '';
let currentSubject = '';
let questions = {
  ds_easy: [],
  ds_med: [],
  java_med: [],
  java_hard: []
};

let currentQ = null;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i].trim();
  if (!line) continue;
  
  if (line.includes('Easy Data Structures')) { currentLevel = 'ds_easy'; continue; }
  if (line.includes('Medium Level Data Structures')) { currentLevel = 'ds_med'; continue; }
  if (line.includes('Medium Level Java')) { currentLevel = 'java_med'; continue; }
  if (line.includes('Hard Level Java')) { currentLevel = 'java_hard'; continue; }
  
  const m = line.match(/^\d+\.\s*(.*)/);
  if (m) {
    if (currentQ) { questions[currentLevel].push(currentQ); }
    currentQ = { q: m[1], o: [], c: 0, e: 'Correct logic implemented.', d: currentLevel.includes('easy') ? 'easy' : currentLevel.includes('med') ? 'medium' : 'hard' };
    
    // Check if next line contains the question text continuation or the options
    if (i+1 < lines.length && !lines[i+1].trim().startsWith('A)')) {
      currentQ.q += '\\n' + lines[i+1].trim();
      i++;
    }
    continue;
  }
  
  if (line.startsWith('A)')) {
    const opts = line.split(/[A-D]\)\s*/).filter(x=>x.trim().length);
    currentQ.o = opts.map(x=>x.trim());
    continue;
  }
  
  if (line.startsWith('Answer:')) {
    const ans = line.replace('Answer:', '').trim();
    currentQ.c = ans === 'A' ? 0 : ans === 'B' ? 1 : ans === 'C' ? 2 : 3;
    continue;
  }
}
if (currentQ) questions[currentLevel].push(currentQ);

let dq = fs.readFileSync('js/data_questions.js', 'utf8');

const compileToJs = (qs) => qs.map(q => `  {q:'${q.q.replace(/'/g, "\\'")}',o:[${q.o.map(x=>`'${x.replace(/'/g, "\\'")}'`).join(',')}],c:${q.c},e:'${q.e}',d:'${q.d}'}`).join(',\n') + ',\n';

const dsReplaces = compileToJs(questions.ds_easy) + compileToJs(questions.ds_med);
const javaReplaces = compileToJs(questions.java_med) + compileToJs(questions.java_hard);

dq = dq.replace(/'uds1': \[/, "'uds1': [\n" + dsReplaces);
dq = dq.replace(/'uj1': \[/, "'uj1': [\n" + javaReplaces);

fs.writeFileSync('js/data_questions.js', dq);
console.log('Successfully injected 80 questions!');
