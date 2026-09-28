// Pure logic engine shared by the page and its regression checks.
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LogicCore = api;
})(typeof globalThis === 'object' ? globalThis : this, function() {
  const ALL = 'ABCDE';
  function parse(source) {
    const s = source.toUpperCase().replace(/\s+/g, '');
    if (!s) throw Error('Escriu una expressió.');
    let i = 0;
    function atom() {
      if (s[i] === '!') { i++; return ['not', atom()]; }
      if (s[i] === '(') { i++; const result = or(); if (s[i++] !== ')') throw Error('Falta un parèntesi de tancament.'); return result; }
      const c = s[i++];
      if (ALL.includes(c) && c) return ['var', c];
      if (c === '0' || c === '1') return ['const', Number(c)];
      throw Error('Sintaxi no vàlida. Utilitza A–E, 0, 1, !, &, | i parèntesis.');
    }
    function and() { let node = atom(); while (s[i] === '&') { i++; node = ['and', node, atom()]; } return node; }
    function or() { let node = and(); while (s[i] === '|') { i++; node = ['or', node, and()]; } return node; }
    const tree = or();
    if (i !== s.length) throw Error('Sintaxi no vàlida prop de «' + s.slice(i) + '».');
    return tree;
  }
  function evaluate(node, vars) {
    switch (node[0]) {
      case 'var': return vars[node[1]];
      case 'const': return node[1];
      case 'not': return 1 - evaluate(node[1], vars);
      case 'and': return evaluate(node[1], vars) & evaluate(node[2], vars);
      default: return evaluate(node[1], vars) | evaluate(node[2], vars);
    }
  }
  function variables(...expressions) {
    return [...ALL].filter(v => expressions.some(s => s.toUpperCase().includes(v)));
  }
  function assignment(index, names) {
    return Object.fromEntries(names.map((v, j) => [v, (index >> (names.length - j - 1)) & 1]));
  }
  function gray(bits) { return Array.from({length: 2 ** bits}, (_, i) => i ^ (i >> 1)); }
  // Enumerate all cubes (0, 1 or don't-care per variable), then retain prime implicants.
  function simplify(names, minterms) {
    const n = names.length, ones = new Set(minterms), limit = 2 ** n;
    if (!ones.size) return {expression: '0', groups: []};
    if (ones.size === limit) return {expression: '1', groups: [{cells: [...ones].sort((a,b)=>a-b), term:'1'}]};
    const candidates = [];
    function enumerate(pattern) {
      if (pattern.length < n) { for (const c of ['-', '0', '1']) enumerate(pattern + c); return; }
      const cells = Array.from({length: limit}, (_, i) => i).filter(i => [...pattern].every((c, j) => c === '-' || Number(c) === ((i >> (n-j-1)) & 1)));
      if (cells.every(i => ones.has(i))) candidates.push({pattern, cells, term: [...pattern].map((c,j)=>c==='-'?'':c==='1'?names[j]:'!'+names[j]).filter(Boolean).join(' & '), literals: n - [...pattern].filter(c=>c==='-').length});
    }
    enumerate('');
    const primes = candidates.filter(a => !candidates.some(b => b !== a && b.cells.length > a.cells.length && a.cells.every(i => b.cells.includes(i))));
    const sorted = [...ones].sort((a,b)=>a-b), essential = new Set();
    for (const cell of sorted) { const options = primes.map((p,j)=>p.cells.includes(cell)?j:-1).filter(j=>j>=0); if (options.length === 1) essential.add(options[0]); }
    const covered = new Set([...essential].flatMap(j=>primes[j].cells));
    const remaining = sorted.filter(i=>!covered.has(i));
    let best = null;
    function choose(selected, uncovered) {
      if (!uncovered.length) {
        const indices = [...essential, ...selected], cost = indices.reduce((sum,j)=>sum+primes[j].literals,0);
        if (!best || cost < best.cost || (cost === best.cost && indices.length < best.indices.length)) best = {indices,cost};
        return;
      }
      const cell = uncovered[0];
      for (let j=0;j<primes.length;j++) if (!essential.has(j) && primes[j].cells.includes(cell) && !selected.includes(j)) {
        const cost = [...essential, ...selected, j].reduce((sum,k)=>sum+primes[k].literals,0);
        if (best && cost > best.cost) continue;
        choose([...selected,j], uncovered.filter(i=>!primes[j].cells.includes(i)));
      }
    }
    choose([],remaining);
    const groups = best.indices.map(j=>primes[j]).sort((a,b)=>b.cells.length-a.cells.length || a.term.localeCompare(b.term));
    return {expression: groups.map(g=>g.cells.length===1 && g.term.includes(' & ')?'('+g.term+')':g.term).join(' | '), groups};
  }
  return {parse, evaluate, variables, assignment, gray, simplify};
});
