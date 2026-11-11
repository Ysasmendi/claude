// Pinturas: cuentos-a
(() => {
  const { agua, vel, trazo, pincel, punto, gotas, mancha, liso, pig, carga, lava, svg, C, ojo, sonrisa, colorete, hierba, flor, nubeD, LINEA, PAPEL, azar, f1 } = AQ;
  const VB = '0 0 400 260';

  // ---------- ayudantes comunes ----------
  // Los filtros de línea del kit usan como zona el lienzo entero: un personaje dibujado en coordenadas locales
  // dentro de un <g transform> se recortaría. Por eso cada personaje transforma sus propias trayectorias a coordenadas del lienzo.
  const pen = (x0, y0, k = 1, rot = 0, fl = 1) => {
    const r = rot * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r), A = k * fl * cs, B = k * fl * sn, Cc = -k * sn, D = k * cs;
    const P = (x, y) => [A * x + Cc * y + x0, B * x + D * y + y0];
    const N = { M: 2, L: 2, T: 2, Q: 4, S: 4, C: 6, H: 1, V: 1, Z: 0 };
    const td = d => {
      const tk = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || []; let out = '', i = 0, cx = 0, cy = 0, sx = 0, sy = 0, cmd = '';
      while (i < tk.length) {
        if (/[a-zA-Z]/.test(tk[i])) { cmd = tk[i++]; if (/z/i.test(cmd)) { out += 'Z'; cx = sx; cy = sy; continue; } }
        const up = cmd.toUpperCase(), rel = cmd !== up, n = N[up]; const a = tk.slice(i, i + n).map(Number); i += n;
        if (up === 'H') { const nx = rel ? cx + a[0] : a[0]; const q = P(nx, cy); out += `L${f1(q[0])},${f1(q[1])}`; cx = nx; continue; }
        if (up === 'V') { const ny = rel ? cy + a[0] : a[0]; const q = P(cx, ny); out += `L${f1(q[0])},${f1(q[1])}`; cy = ny; continue; }
        out += (rel && up === 'M' && i > n) ? 'M' : up;
        for (let j = 0; j < n; j += 2) { const lx = rel ? cx + a[j] : a[j], ly = rel ? cy + a[j + 1] : a[j + 1]; const q = P(lx, ly); out += (j ? ' ' : '') + f1(q[0]) + ',' + f1(q[1]); if (j === n - 2) { cx = lx; cy = ly; } }
        if (up === 'M') { sx = cx; sy = cy; cmd = rel ? 'l' : 'L'; }
      }
      return out;
    };
    const W = k;
    const ag = (d, c, o) => agua(td(d), c, o), ve = (d, c, o) => vel(td(d), c, o);
    const tr = (d, w, c, o) => trazo(td(d), (w == null ? 2.4 : w) * W, c, o), pi = (d, w, c, o) => pincel(td(d), w * W, c, o);
    const pu = (x, y, r, c, o) => { const q = P(x, y); return punto(q[0], q[1], f1(r * W * 100) / 100, c, o); };
    const oj = (x, y, r = 3.2) => { const q = P(x + r * .3, y - r * .35); return pu(x, y, r, '#4A3E58', .95) + `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="${f1(r * .3 * W)}" fill="${PAPEL}"/>`; };
    const so = (x, y, w) => tr(`M${x - w / 2},${y} Q${x},${y + w * .55} ${x + w / 2},${y}`, 2);
    const co = (x, y, r = 8) => ve(mancha(x, y, r, r * .8, x + y, .15), '#EE8FA8', { o: .5 });
    const sh = (x, y, rx, o = .35) => ve(mancha(x, y, rx, rx * .13, Math.round(rx * 3 + x), .1), C.grisO, { o });
    return { agua: ag, vel: ve, trazo: tr, pincel: pi, punto: pu, ojo: oj, sonrisa: so, colorete: co, sh };
  };
  const sh = (x, y, rx, o = .35) => vel(mancha(x, y, rx, rx * .13, Math.round(rx * 3 + x), .1), C.grisO, { o });
  const lienzo = (c, c2, o2 = .5) => agua('M-14,-14H414V272H-14Z', c, { f: 's', o: 1 }) + (c2 ? vel('M-14,-14H414V120Q200,150 -14,108Z', c2, { o: o2 }) : '');
  const suelo = (d, c, c2) => agua(d, c) + (c2 ? vel(d, c2, { o: .25 }) : '');
  const est = (x, y, r, c = C.sol) => agua(`M${x},${y - r} Q${x + r * .2},${y - r * .2} ${x + r},${y} Q${x + r * .2},${y + r * .2} ${x},${y + r} Q${x - r * .2},${y + r * .2} ${x - r},${y} Q${x - r * .2},${y - r * .2} ${x},${y - r}Z`, c, { f: 'l' });
  const interroga = (x, y, k = 1, c = C.violeta) => trazo(`M${x - 6 * k},${y - 8 * k} Q${x - 6 * k},${y - 18 * k} ${x},${y - 18 * k} Q${x + 8 * k},${y - 18 * k} ${x + 8 * k},${y - 10 * k} Q${x + 8 * k},${y - 4 * k} ${x},${y} V${y + 4 * k}`, 3.2 * k, carga(c, .85), { o: .85 }) + punto(x, y + 11 * k, 2.2 * k, carga(c, .85));
  const corazon = (x, y, k, c) => agua('M0,10 C-15,0 -13,-13 0,-6 C13,-13 15,0 0,10Z', c, { t: `translate(${x} ${y}) scale(${k})`, f: k < 1 ? 'l' : undefined });
  const bur = (x, y, r, c) => agua(mancha(x, y, r, r * .96, Math.round(x + y + r), .06, 8), lava(c, .5), { f: r < 12 ? 'l' : undefined, o: .85 })
    + vel(mancha(x + r * .3, y + r * .3, r * .6, r * .6, Math.round(r + 2), .12), c, { o: .35 })
    + trazo(`M${f1(x - r * .55)},${f1(y - r * .15)} Q${f1(x - r * .45)},${f1(y - r * .62)} ${f1(x + r * .05)},${f1(y - r * .68)}`, Math.max(1.3, r * .13), PAPEL, { o: .95 });
  const zeta = (x, y, k, c = PAPEL) => trazo(`M${x},${y} h${11 * k} l${-11 * k},${12 * k} h${11 * k}`, 2.8 * k, c, { o: .95 });
  const arbusto = (x, y, k, c, s = 1) => agua(mancha(x - 12 * k, y - 8 * k, 14 * k, 11 * k, s + 3, .12), c) + agua(mancha(x + 10 * k, y - 10 * k, 15 * k, 12 * k, s + 5, .12), carga(c, .9), { o: .95 }) + agua(mancha(x, y - 16 * k, 14 * k, 11 * k, s + 8, .12), c);
  const arbolito = (x, y, k, c, s = 1) => agua(`M${x - 4 * k},${y} Q${x - 2 * k},${y - 24 * k} ${x - 3 * k},${y - 40 * k} L${x + 4 * k},${y - 40 * k} Q${x + 3 * k},${y - 22 * k} ${x + 5 * k},${y}Z`, C.tronco)
    + agua(mancha(x - 10 * k, y - 48 * k, 17 * k, 15 * k, s + 3, .1), c) + agua(mancha(x + 10 * k, y - 50 * k, 17 * k, 15 * k, s + 4, .1), carga(c, .9), { o: .95 }) + agua(mancha(x, y - 62 * k, 17 * k, 14 * k, s + 6, .1), c);
  const palmera = (x, y, k, s = 1) => pincel(`M${x},${y} Q${x + 8 * k},${y - 40 * k} ${x + 2 * k},${y - 78 * k}`, 7 * k, C.tronco)
    + [[-34, -4], [-24, -22], [24, -22], [36, -6], [0, -30]].map(([dx, dy], i) => agua(`M${x + 2 * k},${y - 78 * k} Q${x + (dx * .5) * k},${y + (dy - 74) * k} ${x + dx * k},${y + (dy - 58 + i * 2) * k} Q${x + (dx * .5) * k},${y + (dy - 62) * k} ${x + 2 * k},${y - 78 * k}Z`, i % 2 ? C.hojaO : C.hoja, { f: 'l' })).join('');
  const nubes = (...a) => a.map(([x, y, k, s]) => nubeD(x, y, k, s)).join('');

  // ---------- personajes ----------
  // Fermín el dragón: origen en el suelo, entre los pies; mide unos 115 de alto
  const dragon = (x, y, k = 1, o = {}) => {
    const { agua, vel, trazo, pincel, punto, ojo, sonrisa, colorete, sh } = pen(x, y, k, o.rot || 0, o.fl || 1);
    const v = C.hoja, vo = C.hojaO, e = o.e || 'risa', b = o.b || 'abajo';
    let s = o.rot ? '' : sh(0, 2, 44);
    s += pincel('M26,-14 Q64,-6 66,-34 Q67,-44 58,-44', 13, v)
      + agua('M52,-50 L68,-60 L72,-42 L58,-38Z', C.violeta, { f: 'l' })
      + agua('M-20,-70 Q-54,-94 -60,-62 Q-46,-60 -50,-48 Q-32,-52 -20,-46Z', C.violeta, { o: .9 })
      + agua('M20,-70 Q54,-94 60,-62 Q46,-60 50,-48 Q32,-52 20,-46Z', C.violeta, { o: .9 })
      + agua(mancha(0, -38, 32, 38, 3, .06), v) + vel(mancha(14, -22, 22, 24, 4, .15), vo, { o: .4 })
      + agua(mancha(0, -32, 19, 27, 5, .08), C.paja) + trazo('M-10,-44 q10,4 20,0 M-11,-34 q11,4 22,0 M-10,-24 q10,4 20,0', 1.6, C.pajaO, { o: .6 })
      + agua(mancha(-17, -4, 12, 7, 6, .1), vo) + agua(mancha(17, -4, 12, 7, 7, .1), vo);
    // brazos
    const brazo = (d, fin) => pincel(`M${d * 24},-54 Q${(d * 24 + fin[0]) / 2 + d * 4},${(-54 + fin[1]) / 2} ${fin[0]},${fin[1]}`, 9, v) + agua(mancha(fin[0], fin[1], 6, 6, 9 + d, .12), vo, { f: 'l' });
    const P = { abajo: [[-34, -30], [34, -30]], saluda: [[-34, -30], [50, -86]], arriba: [[-38, -88], [38, -88]], mejillas: [[-24, -76], [24, -76]], cuenta: [[-34, -30], [46, -74]] }[b];
    s += brazo(-1, P[0]) + brazo(1, P[1]);
    // cabeza
    s += agua('M-16,-108 L-20,-124 L-8,-112Z', C.paja, { f: 'l' }) + agua('M16,-108 L20,-124 L8,-112Z', C.paja, { f: 'l' })
      + agua(mancha(0, -88, 29, 25, 8, .05), v) + vel(mancha(10, -78, 20, 14, 10, .2), vo, { o: .35 })
      + agua(mancha(0, -77, 15, 9, 11, .08), lava(C.paja, .3), { f: 'l' }) + punto(-5, -80, 1.7, vo) + punto(5, -80, 1.7, vo)
      + agua(mancha(0, -114, 7, 5, 12, .15), C.violeta, { f: 'l' }) + agua(mancha(-12, -111, 5, 4, 13, .15), C.violeta, { f: 'l' }) + agua(mancha(12, -111, 5, 4, 14, .15), C.violeta, { f: 'l' });
    const cerr = e === 'hip' || e === 'esfuerzo';
    if (e === 'esfuerzo') s += trazo('M-18,-97 l8,3 l-8,3 M18,-97 l-8,3 l8,3', 2, LINEA, { o: .8 });
    else if (cerr) s += trazo('M-17,-92 q5,-5 10,0 M7,-92 q5,-5 10,0', 2, LINEA, { o: .8 });
    else s += ojo(-12, -95, e === 'sorpresa' ? 4.8 : 4) + ojo(12, -95, e === 'sorpresa' ? 4.8 : 4);
    if (e === 'sorpresa') s += trazo('M-18,-102 q6,-4 12,-1 M18,-102 q-6,-4 -12,-1', 1.8, LINEA, { o: .7 });
    s += colorete(-22, -80, 6) + colorete(22, -80, 6);
    if (e === 'risa' || e === 'feliz' || e === 'contento') s += agua('M-10,-75 Q0,-62 10,-75Z', '#C9605F', { f: 'l' });
    else if (e === 'hip') s += agua(mancha(0, -72, 4.5, 6, 15, .1), '#B5647F', { f: 'l' });
    else if (e === 'sorpresa') s += agua(mancha(0, -72, 5, 7, 16, .1), '#B5647F', { f: 'l' });
    else if (e === 'fuego') s += agua('M-10,-76 Q0,-58 10,-76Z', '#C9605F', { f: 'l' });
    else if (e === 'esfuerzo') s += trazo('M-6,-75 q6,4 12,0', 2) + vel(mancha(-21, -80, 11, 10, 17, .1), C.rosa, { o: .6 }) + vel(mancha(21, -80, 11, 10, 18, .1), C.rosa, { o: .6 });
    else s += sonrisa(0, -75, 14);
    if (o.gorro === 'fiesta') s += agua('M-13,-111 Q-6,-128 0,-146 Q8,-128 14,-111Z', C.rojo) + trazo('M-9,-122 q9,5 18,0', 2, C.sol, { o: .9 }) + punto(0, -147, 3.4, C.sol);
    if (o.gorro === 'noche') s += agua('M-22,-104 Q-24,-132 6,-134 Q24,-134 36,-112 Q28,-120 20,-114 Q0,-108 -22,-104Z', C.violeta) + punto(36, -111, 5, PAPEL, .95) + trazo('M-22,-105 Q0,-110 20,-114', 4, PAPEL, { o: .8 });
    return s;
  };

  // Niña / niño: origen en el suelo; mide unos 105 de alto. o.l / o.r = posición de las manos
  const nina = (x, y, k = 1, o = {}) => {
    const { agua, vel, trazo, pincel, punto, ojo, sonrisa, colorete, sh } = pen(x, y, k, o.rot || 0, o.fl || 1);
    const piel = pig('#F1C7A0'), pelo = pig(o.pelo || '#7A4A30'), vest = o.vest || C.azul, e = o.e || 'contento', chico = o.chico;
    const L = o.l || [-24, -36], R = o.r || [24, -36];
    let s = o.sit ? '' : sh(0, 2, 22);
    s += agua(mancha(0, -82, 22, 21, 31, .06), pelo);
    if (!chico) s += agua(mancha(-26, -70, 7, 10, 32, .1), pelo, { f: 'l' }) + agua(mancha(26, -70, 7, 10, 33, .1), pelo, { f: 'l' });
    // piernas
    if (o.sit) s += agua('M-6,-28 L16,-27 L24,-6 L16,-4 L12,-19 L-6,-20Z', piel, { f: 'l' }) + agua('M4,-28 L24,-26 L32,-5 L24,-3 L20,-18 L4,-20Z', piel, { f: 'l' }) + agua(mancha(22, -3, 6, 4, 34, .1), C.rojoO, { f: 'l' }) + agua(mancha(30, -2, 6, 4, 35, .1), C.rojoO, { f: 'l' });
    else s += agua('M-10,-26 L-3,-26 L-4,-4 L-10,-4Z', piel, { f: 'l' }) + agua('M3,-26 L10,-26 L10,-4 L4,-4Z', piel, { f: 'l' }) + agua(mancha(-8, -2, 7, 4, 34, .1), C.rojoO, { f: 'l' }) + agua(mancha(8, -2, 7, 4, 35, .1), C.rojoO, { f: 'l' });
    // brazos y vestido
    const br = (d, f) => pincel(`M${d * 11},-58 Q${(d * 11 + f[0]) / 2 + d * 3},${(-58 + f[1]) / 2 + 4} ${f[0]},${f[1]}`, 6.5, chico ? vest : piel, { f: 'l' }) + agua(mancha(f[0], f[1], 4.6, 4.6, 36 + d, .1), piel, { f: 'l' });
    s += br(-1, L);
    s += chico ? agua('M-14,-62 Q-17,-40 -14,-24 L14,-24 Q17,-40 14,-62Z', vest) + agua('M-14,-30 L14,-30 L14,-4 L6,-4 L0,-22 L-6,-4 L-14,-4Z', o.pant || C.crema, { f: 'l' })
      : agua('M-12,-62 Q-16,-44 -22,-20 Q0,-12 22,-20 Q16,-44 12,-62Z', vest) + vel('M-18,-28 Q0,-20 18,-28 L22,-20 Q0,-12 -22,-20Z', carga(vest, .8), { o: .5 });
    s += br(1, R);
    // cabeza
    s += agua(mancha(0, -80, 19, 18, 37, .05), piel);
    s += chico ? agua('M-20,-82 Q-18,-102 0,-100 Q19,-102 20,-82 Q10,-92 0,-91 Q-10,-92 -20,-82Z', pelo) : agua('M-20,-82 Q-17,-103 0,-100 Q17,-103 20,-82 Q9,-92 -3,-90 Q-13,-92 -20,-82Z', pelo);
    s += ojo(-7, -80, 2.6) + ojo(7, -80, 2.6) + colorete(-13, -73, 4.5) + colorete(13, -73, 4.5);
    if (e === 'risa' || e === 'habla') s += agua('M-6,-71 Q0,-62 6,-71Z', '#C9605F', { f: 'l' });
    else if (e === 'asombro') s += agua(mancha(0, -69, 3.4, 4.2, 38, .1), '#B5647F', { f: 'l' }) + trazo('M-11,-87 q4,-3 8,0 M3,-87 q4,-3 8,0', 1.5, LINEA, { o: .6 });
    else s += sonrisa(0, -71, 9);
    if (o.hat) s += agua('M-9,-97 Q-3,-114 2,-128 Q8,-112 12,-96Z', o.hat) + punto(2, -129, 3, C.sol);
    return s;
  };

  const gato = (x, y, k = 1, o = {}) => {
    const { agua, vel, trazo, pincel, punto, ojo, sonrisa, colorete, sh } = pen(x, y, k, o.rot || 0, o.fl || 1);
    const c = C.naranja, e = o.e || 'contento';
    let s = sh(0, 2, 26) + pincel('M20,-8 Q44,-6 42,-30 Q41,-40 34,-36', 7, c)
      + agua(mancha(0, -22, 22, 20, 41, .07), c) + vel(mancha(8, -14, 14, 12, 42, .15), carga(c, .8), { o: .35 }) + agua(mancha(0, -16, 11, 14, 43, .1), lava(C.crema, .2), { f: 'l' })
      + agua(mancha(-11, -3, 8, 5, 44, .1), c, { f: 'l' }) + agua(mancha(11, -3, 8, 5, 45, .1), c, { f: 'l' })
      + agua('M-17,-58 L-18,-74 L-5,-64Z', c, { f: 'l' }) + agua('M17,-58 L18,-74 L5,-64Z', c, { f: 'l' })
      + agua(mancha(0, -50, 19, 16, 46, .06), c) + trazo('M-8,-62 l1,6 M0,-64 l0,7 M8,-62 l-1,6', 1.8, carga(c, .7), { o: .55 })
      + agua(mancha(0, -44, 8, 5, 47, .1), lava(C.crema, .3), { f: 'l' }) + punto(0, -47, 1.8, '#C9819A');
    s += e === 'sorpresa' ? ojo(-8, -53, 3.8) + ojo(8, -53, 3.8) + agua(mancha(0, -41, 2.6, 3.4, 48, .1), '#B5647F', { f: 'l' })
      : ojo(-8, -53, 2.8) + ojo(8, -53, 2.8) + sonrisa(0, -43, 8);
    s += trazo('M-10,-46 q-14,-2 -20,-6 M-10,-44 q-14,2 -20,3 M10,-46 q14,-2 20,-6 M10,-44 q14,2 20,3', 1.3, LINEA, { o: .55 }) + colorete(-14, -45, 4) + colorete(14, -45, 4);
    return s;
  };

  // El calcetín: origen en la base; ~62 de alto y 50 de ancho
  const calcetin = (x, y, k = 1, o = {}) => {
    const { agua, vel, trazo, pincel, punto, ojo, sonrisa, colorete, sh } = pen(x, y, k, o.rot || 0, o.fl || 1);
    const c = pig(o.c || '#6F9BE0'), e = o.e || 'risa';
    let s = sh(4, 2, 30) + agua('M-14,-60 Q-17,-30 -14,-16 Q-20,-2 -2,0 Q24,2 36,-5 Q41,-16 27,-19 Q14,-22 14,-30 L15,-60Z', c)
      + vel('M2,-34 Q8,-20 30,-18 Q40,-14 34,-6 Q16,0 0,-2Z', carga(c, .8), { o: .38 })
      + agua(mancha(26, -9, 10, 7, 51, .12), C.sol, { f: 'l' }) + agua(mancha(-6, -7, 9, 6, 52, .12), C.sol, { f: 'l' })
      + agua('M-16,-62 Q0,-67 16,-62 L16,-50 Q0,-45 -16,-50Z', C.rojo) + trazo('M-9,-64 l1,15 M2,-65 l0,16 M12,-63 l-1,14', 2, PAPEL, { o: .8 });
    if (e === 'triste') s += ojo(-5, -38, 3) + ojo(6, -38, 3) + trazo('M-5,-27 Q0,-32 5,-27', 1.8) + trazo('M-9,-45 l6,-2 M10,-45 l-6,-2', 1.6, LINEA, { o: .6 }) + agua(mancha(8, -30, 1.8, 3, 53, .1), C.cieloO, { f: 'l' });
    else if (e === 'asombro') s += ojo(-5, -38, 3.8) + ojo(6, -38, 3.8) + agua(mancha(0, -27, 3, 4, 54, .1), '#B5647F', { f: 'l' });
    else if (e === 'pillo') s += ojo(-3, -38, 3) + ojo(8, -38, 3) + trazo('M-5,-28 Q2,-24 9,-30', 1.8);
    else s += ojo(-5, -38, 3) + ojo(6, -38, 3) + sonrisa(0, -30, 10);
    s += colorete(-10, -31, 4) + colorete(12, -31, 4);
    return s;
  };

  const luna = (x, y, k = 1, o = {}) => {
    const { agua, vel, trazo, pincel, punto, ojo, sonrisa, colorete, sh } = pen(x, y, k, o.rot || 0, o.fl || 1);
    const e = o.e || 'contento', base = o.pale ? lava(pig('#F2E3A0'), .55) : pig('#F5E49A');
    let s = o.pale ? '' : agua(mancha(0, 0, 60, 60, 61, .05), C.sol, { f: 's', o: .5 });
    s += agua(mancha(0, 0, 42, 42, 62, .045), base) + (o.pale ? vel(mancha(10, 12, 30, 26, 63, .12), C.cieloO, { o: .3 }) : vel(mancha(12, 14, 30, 26, 63, .12), C.solO, { o: .4 }))
      + vel(mancha(-22, 18, 7, 6, 64, .15), C.pajaO, { o: .4 }) + vel(mancha(24, -22, 8, 7, 65, .15), C.pajaO, { o: .4 }) + vel(mancha(22, 28, 5, 5, 66, .15), C.pajaO, { o: .4 });
    if (e === 'dormido') s += trazo('M-19,-6 q6,5 12,0 M7,-6 q6,5 12,0', 2.2, LINEA, { o: .85 }) + sonrisa(0, 11, 12);
    else if (e === 'asombro') s += ojo(-13, -6, 5.2) + ojo(13, -6, 5.2) + agua(mancha(0, 16, 5, 6.5, 67, .1), '#B5647F', { f: 'l' }) + trazo('M-20,-18 q7,-5 14,-1 M20,-18 q-7,-5 -14,-1', 2, LINEA, { o: .65 });
    else if (e === 'enfado') s += ojo(-13, -5, 3.6) + ojo(13, -5, 3.6) + trazo('M-22,-18 L-6,-11 M22,-18 L6,-11', 3.4, LINEA, { o: .85 }) + trazo('M-9,19 Q0,10 9,19', 2.6) + (o.nobolsa ? '' : vel(mancha(-4, 17, 4, 3, 68, .1), C.rojoO, { o: .3 }));
    else s += ojo(-13, -6, 4) + ojo(13, -6, 4) + sonrisa(0, 11, 18);
    s += colorete(-24, 8, 7) + colorete(24, 8, 7);
    if (o.gorro) s += agua('M-34,-22 Q-36,-58 -6,-60 Q20,-60 34,-34 Q30,-40 24,-34 Q4,-28 -34,-22Z', C.violeta) + trazo('M-34,-23 Q0,-30 26,-35', 5, PAPEL, { o: .85 }) + agua(mancha(36, -32, 7, 7, 69, .12), PAPEL, { f: 'l' });
    return s;
  };

  const solc = (x, y, k = 1, o = {}) => {
    const { agua, vel, trazo, pincel, punto, ojo, sonrisa, colorete, sh } = pen(x, y, k, o.rot || 0, o.fl || 1);
    let s = Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5 + .15, c = Math.cos(a), si = Math.sin(a); return pincel(`M${f1(c * 48)},${f1(si * 48)} L${f1(c * (i % 2 ? 60 : 68))},${f1(si * (i % 2 ? 60 : 68))}`, i % 2 ? 6 : 8, i % 2 ? C.sol : C.solO); }).join('')
      + agua(mancha(0, 0, 42, 41, 71, .04), C.sol) + vel(mancha(12, 14, 28, 22, 72, .2), C.solO, { o: .5 })
      + ojo(-13, -6, 3.6) + ojo(13, -6, 3.6) + colorete(-24, 8, 7) + colorete(24, 8, 7);
    s += o.e === 'habla' ? agua('M-11,8 Q0,28 11,8 Q0,12 -11,8Z', '#C9605F', { f: 'l' }) : sonrisa(0, 9, 18);
    return s;
  };

  const jirafa = (x, y, k = 1, o = {}) => {
    const { agua, vel, trazo, pincel, punto, ojo, sonrisa, colorete, sh } = pen(x, y, k, o.rot || 0, o.fl || 1);
    const N = o.N || 100, lx = o.lx || 0, e = o.e || 'feliz', c = C.paja, m = carga(C.pajaO, .8);
    const hx = 34 + lx + 8, hy = -96 - N;
    let s = sh(4, 2, 52);
    s += [[-32, -60, -34], [-18, -58, -18], [26, -58, 24], [40, -62, 40]].map(([x0, y0, x1], i) => agua(`M${x0 - 5},${y0} Q${x0 - 4},${y0 / 2} ${x1 - 4},-4 L${x1 + 4},-4 Q${x0 + 5},${y0 / 2} ${x0 + 5},${y0}Z`, i % 2 ? C.paja : lava(C.pajaO, .1), { f: 'l' }) + agua(mancha(x1, -2, 6, 3.6, 80 + i, .1), C.troncoO, { f: 'l' })).join('');
    s += pincel('M-44,-84 Q-56,-76 -52,-52', 3.5, C.pajaO, { f: 'l' }) + punto(-52, -50, 3.6, C.troncoO);
    s += agua(mancha(0, -76, 47, 23, 85, .06), c) + vel(mancha(12, -66, 34, 12, 86, .2), C.pajaO, { o: .4 });
    s += agua(`M22,-72 Q${f1(22 + lx * .3)},${f1(-86 - N * .55)} ${25 + lx},${-94 - N} L${43 + lx},${-94 - N} Q${f1(44 + lx * .3)},${f1(-86 - N * .55)} 48,-80 Z`, c) + vel(`M38,-80 Q${f1(38 + lx * .3)},${f1(-86 - N * .55)} ${41 + lx},${-92 - N} L${43 + lx},${-92 - N} Q${f1(44 + lx * .3)},${f1(-86 - N * .55)} 48,-80Z`, C.pajaO, { o: .4 });
    // manchas
    [[-24, -80, 9], [-4, -86, 7], [12, -72, 8], [-14, -64, 6], [34, -82, 6]].forEach(([px, py, r], i) => { s += vel(mancha(px, py, r, r * .85, 87 + i, .2), m, { o: .6 }); });
    for (let i = 0; i < 4; i++) { const t = (i + .5) / 4; s += vel(mancha(33 + lx * .3 * t + (i % 2 ? 4 : -3), -86 - N * t * .95, 5.5, 4.5, 90 + i, .2), m, { o: .6 }); }
    // cabeza
    s += agua(`M${hx - 8},${hy} L${hx - 2},${hy - 2} L${hx - 7},${hy - 16}Z`, C.pajaO, { f: 'l' }) + punto(hx - 7, hy - 17, 3.2, C.troncoO) + agua(`M${hx + 1},${hy - 4} L${hx + 7},${hy - 4} L${hx + 4},${hy - 18}Z`, C.pajaO, { f: 'l' }) + punto(hx + 4, hy - 19, 3.2, C.troncoO);
    s += agua(`M${hx - 16},${hy - 1} Q${hx - 22},${hy - 8} ${hx - 12},${hy - 8} Q${hx - 10},${hy - 2} ${hx - 10},${hy + 3}Z`, C.pajaO, { f: 'l' });
    s += agua(mancha(hx + 3, hy, 14, 10, 94, .06, 10, -.15), c) + agua(mancha(hx + 14, hy + 3, 8, 6.5, 95, .08), lava(C.crema, .1), { f: 'l' }) + punto(hx + 17, hy + 1, 1.6, m);
    if (e === 'orgullo') s += trazo(`M${hx - 3},${hy - 3} q4,-4 8,0`, 1.8, LINEA, { o: .85 });
    else s += ojo(hx + 1, hy - 3, e === 'grita' ? 3.2 : 2.8);
    if (e === 'triste') s += trazo(`M${hx + 17},${hy + 7} q-5,-3 -10,0`, 1.8) + trazo(`M${hx - 4},${hy - 9} l7,2`, 1.5, LINEA, { o: .6 }) + agua(mancha(hx + 1, hy + 4, 1.6, 3, 96, .1), C.cieloO, { f: 'l' });
    else if (e === 'grita') s += agua(mancha(hx + 13, hy + 7, 5, 4, 97, .1), '#B5647F', { f: 'l' });
    else s += trazo(`M${hx + 7},${hy + 6} q5,4 10,0`, 1.8);
    s += colorete(hx + 5, hy + 4, 3.6);
    return s;
  };

  const mono = (x, y, k = 1, o = {}) => {
    const { agua, vel, trazo, pincel, punto, ojo, sonrisa, colorete, sh } = pen(x, y, k, o.rot || 0, o.fl || 1);
    const c = pig('#A8754F'), cl = lava(pig('#D9B48C'), .1), e = o.e || 'risa';
    let s = sh(0, 2, 22) + pincel('M12,-10 Q40,-8 34,-34 Q30,-44 24,-38', 5, c)
      + agua(mancha(0, -22, 15, 18, 101, .07), c) + agua(mancha(0, -19, 9, 12, 102, .1), cl, { f: 'l' })
      + agua(mancha(-9, -3, 7, 4, 103, .1), c, { f: 'l' }) + agua(mancha(9, -3, 7, 4, 104, .1), c, { f: 'l' });
    const sal = o.b === 'saluda';
    s += pincel('M-12,-30 Q-20,-20 -18,-10', 5, c, { f: 'l' }) + pincel(sal ? 'M12,-30 Q22,-44 20,-58' : 'M12,-30 Q20,-20 18,-10', 5, c, { f: 'l' });
    s += agua(mancha(-18, -52, 7, 7, 105, .1), c, { f: 'l' }) + agua(mancha(18, -52, 7, 7, 106, .1), c, { f: 'l' }) + vel(mancha(-18, -52, 4, 4, 107, .1), C.rosa, { o: .7 }) + vel(mancha(18, -52, 4, 4, 108, .1), C.rosa, { o: .7 })
      + agua(mancha(0, -50, 15, 14, 109, .06), c) + agua(mancha(0, -46, 11, 9, 110, .08), cl, { f: 'l' });
    if (e === 'triste') s += ojo(-5, -50, 2.6) + ojo(5, -50, 2.6) + trazo('M-4,-40 Q0,-44 4,-40', 1.6) + agua(mancha(7, -45, 1.4, 2.6, 111, .1), C.cieloO, { f: 'l' }) + trazo('M-9,-56 l5,2 M9,-56 l-5,2', 1.4, LINEA, { o: .6 });
    else if (e === 'pillo') s += ojo(-3, -50, 2.6) + ojo(7, -50, 2.6) + trazo('M-4,-41 Q2,-38 7,-42', 1.6);
    else s += ojo(-5, -50, 2.6) + ojo(5, -50, 2.6) + agua('M-5,-43 Q0,-35 5,-43Z', '#C9605F', { f: 'l' });
    s += colorete(-10, -44, 3.4) + colorete(10, -44, 3.4);
    return s;
  };

  // Elefante: mira a la izquierda (fl=-1 lo gira)
  const elefante = (x, y, k = 1, o = {}) => {
    const { agua, vel, trazo, pincel, punto, ojo, sonrisa, colorete, sh } = pen(x, y, k, o.rot || 0, o.fl || 1);
    const c = pig('#A7A3C4'), co = carga(c, .85), e = o.e || 'risa', up = o.trompa === 'arriba';
    let s = sh(0, 2, 50) + agua(mancha(14, -48, 42, 32, 121, .06), c) + vel(mancha(26, -36, 28, 18, 122, .2), co, { o: .35 })
      + agua(mancha(-12, -8, 10, 9, 123, .1), co, { f: 'l' }) + agua(mancha(36, -8, 10, 9, 124, .1), co, { f: 'l' }) + pincel('M54,-52 Q62,-44 58,-30', 3.5, c, { f: 'l' })
      + pincel(up ? 'M-52,-58 Q-80,-62 -74,-92 Q-72,-98 -66,-92' : 'M-52,-52 Q-70,-38 -60,-12 Q-56,-6 -52,-12', 14, c)
      + agua(mancha(-38, -60, 28, 26, 125, .06), c) + agua(mancha(-12, -62, 16, 24, 126, .1), co, { o: .9 }) + vel(mancha(-12, -62, 9, 15, 127, .1), C.rosa, { o: .5 })
      + agua('M-56,-46 Q-66,-38 -62,-32 Q-52,-34 -50,-44Z', PAPEL, { f: 'l' });
    s += e === 'preocupa' ? ojo(-48, -66, 3) + trazo('M-54,-73 l9,3 M-34,-73 l-8,3', 1.5, LINEA, { o: .6 }) + ojo(-34, -66, 3) : ojo(-48, -66, 3) + ojo(-34, -66, 3);
    s += e === 'preocupa' ? trazo('M-54,-52 Q-48,-56 -42,-52', 1.6) : sonrisa(-47, -52, 10);
    s += colorete(-54, -58, 4.5);
    return s;
  };

  const castillo = (x, y, k = 1, o = {}) => {
    const { agua, vel, trazo, pincel, punto, ojo, sonrisa, colorete, sh } = pen(x, y, k, o.rot || 0, o.fl || 1);
    let s = sh(0, 2, 70, .3)
      + agua('M-48,0 Q-50,-30 -47,-56 L-44,-66 L-36,-66 L-34,-58 L-26,-58 L-24,-66 L-16,-66 L-14,-58 L14,-58 L16,-66 L24,-66 L26,-58 L34,-58 L36,-66 L44,-66 L47,-56 Q50,-30 48,0Z', C.gris)
      + vel('M20,-56 L47,-56 Q50,-30 48,0 L20,0Z', C.grisO, { o: .4 })
      + agua('M-64,0 Q-66,-50 -62,-92 L-34,-92 Q-32,-50 -34,0Z', lava(C.gris, .2)) + agua('M34,0 Q32,-50 34,-92 L62,-92 Q66,-50 64,0Z', lava(C.gris, .2))
      + vel('M48,-92 L62,-92 Q66,-50 64,0 L48,0Z', C.grisO, { o: .35 })
      + agua('M-68,-90 L-49,-126 L-30,-90Z', C.rojo) + agua('M30,-90 L49,-126 L68,-90Z', C.rojo)
      + agua('M-20,-58 Q-21,-80 -18,-98 L18,-98 Q21,-80 20,-58Z', lava(C.gris, .1)) + agua('M-22,-96 L0,-128 L22,-96Z', C.violeta)
      + agua('M-1.4,-128 L1.4,-128 L1.4,-146 L-1.4,-146Z', C.grisO, { f: 'l' }) + agua('M0,-146 L16,-141 L0,-136Z', C.rojoO, { f: 'l' })
      + agua('M-11,0 L-11,-24 Q0,-38 11,-24 L11,0Z', C.tronco) + punto(6, -14, 2, C.sol)
      + agua(mancha(-49, -64, 4, 6, 130, .1), C.cieloO, { f: 'l' }) + agua(mancha(49, -64, 4, 6, 131, .1), C.cieloO, { f: 'l' }) + agua(mancha(0, -78, 4, 7, 132, .1), C.cieloO, { f: 'l' });
    return s;
  };

  const fuego = (x, y, k = 1) => { const { agua } = pen(x, y, k); return agua('M0,0 Q16,-16 38,-8 Q54,-4 72,-14 Q62,2 76,12 Q52,18 32,14 Q10,14 0,6Z', C.naranja) + agua('M4,3 Q18,-6 34,-2 Q50,0 62,-4 Q52,6 58,10 Q38,12 22,10 Q10,10 4,3Z', C.sol, { f: 'l' }); };

  // ================= CUENTO 1: el dragón con hipo =================
  const hip1 = []; // (sin estado)
  Object.assign(ILUS, {
    cuento1_1: () => svg(VB,
      lienzo(C.cielo, C.cieloO, .4) + nubes([66, 50, .6, 2], [345, 70, .5, 4], [212, 36, .36, 6])
      + agua('M-14,176 Q80,146 170,170 Q260,146 414,166 V272 H-14Z', C.prado)
      + castillo(268, 188, 1.02)
      + agua('M-14,208 Q120,192 200,204 Q300,216 414,198 V272 H-14Z', C.hoja)
      + agua('M252,206 Q246,236 214,272 H320 Q290,236 270,206Z', C.tierra)
      + dragon(98, 238, 1.05, { b: 'saluda', e: 'risa' })
      + flor(30, 240, C.rosa, 5.5) + flor(168, 238, C.sol, 5) + flor(346, 244, C.violeta, 5) + flor(374, 232, C.rosa, 4.5)
      + hierba(60, 252, 14, C.hojaO) + hierba(332, 226, 12, C.hojaO, -1) + hierba(186, 254, 14, C.hojaO)),

    cuento1_2: () => svg(VB,
      lienzo(lava(C.violeta, .6), null)
      + agua('M-14,196 Q200,184 414,198 V272 H-14Z', C.tierra)
      // ventana con el amanecer
      + agua('M30,160 L30,66 Q30,34 68,34 Q106,34 106,66 L106,160Z', C.tronco, { o: .9 })
      + agua('M38,154 L38,68 Q38,42 68,42 Q98,42 98,68 L98,154Z', C.sol, { f: 's', o: 1 }) + vel('M38,100 Q68,90 98,100 V154 H38Z', C.naranja, { o: .5 }) + agua(mancha(68, 112, 17, 16, 141, .08), C.solO) + agua(mancha(50, 70, 12, 6, 142, .2), PAPEL, { f: 'l' })
      + trazo('M68,42 V154 M38,100 H98', 2.6, C.troncoO, { o: .8 })
      // cuadro
      + agua('M296,52 Q330,46 366,54 L364,92 Q330,98 298,90Z', C.tronco) + agua('M304,58 Q330,54 358,60 L356,86 Q330,90 306,84Z', C.cielo) + agua(mancha(332, 80, 14, 9, 143, .1), C.hojaO, { f: 'l' })
      // cama
      + agua('M118,200 Q116,120 122,86 Q205,76 292,86 Q298,120 296,200Z', C.tronco)
      + agua(mancha(205, 142, 76, 26, 144, .05), PAPEL)
      + dragon(205, 206, 1.02, { e: 'hip', b: 'arriba', gorro: 'noche' })
      + agua('M104,188 Q205,162 308,188 L316,238 Q205,252 96,238Z', C.rojo) + vel('M96,214 Q205,226 316,214 L316,238 Q205,252 96,238Z', C.rojoO, { o: .45 })
      + trazo('M138,186 l3,52 M184,176 l1,66 M232,176 l-1,66 M274,184 l-3,56', 2.2, PAPEL, { o: .6 })
      + agua('M92,226 L92,252 L112,252 L112,226Z', C.tronco) + agua('M300,226 L300,252 L320,252 L320,226Z', C.tronco)
      + trazo('M236,102 l8,-6 M240,116 l12,-2 M174,104 l-8,-6', 2.4, C.grisO, { o: .7 })
      + bur(246, 126, 8, C.rosa) + bur(268, 96, 14, C.violeta) + bur(298, 58, 20, C.cielo) + bur(250, 70, 7, C.sol) + bur(326, 100, 6, C.rosa)),

    cuento1_3: () => svg(VB,
      lienzo(lava(C.violeta, .55), null)
      + agua('M-14,192 Q200,180 414,196 V272 H-14Z', C.tierra) + vel('M-14,192 Q200,180 414,196 V272 H-14Z', C.pajaO, { o: .15 })
      // 1) bebiendo del revés
      + sh(70, 238, 34)
      + dragon(70, 128, .72, { rot: 180, e: 'esfuerzo', b: 'abajo' })
      + agua('M44,204 L50,238 Q62,242 74,238 L80,204Z', C.cielo, { o: .9 }) + vel('M47,218 L52,238 Q62,242 74,238 L78,218Z', C.cieloO, { o: .55 }) + pincel('M62,230 Q70,206 88,190', 3, C.rosa, { f: 'l' })
      + trazo('M110,160 q8,-4 10,-12 M112,176 q10,0 14,-6', 2, C.grisO, { o: .6 })
      // 2) contando
      + dragon(200, 222, .7, { e: 'neutro', b: 'cuenta' })
      + trazo('M176,64 l2,22 M185,63 l2,23 M194,64 l1,22 M203,63 l2,23 M170,84 L212,66', 3, carga(C.violeta, .8), { o: .85 })
      + [0, 1, 2, 3, 4].map(i => punto(226 + i * 9, 80 - i * 2, 2.6, [C.rojoO, C.solO, C.hojaO, C.azul, C.violeta][i], .85)).join('')
      + bur(250, 118, 12, C.cielo) + bur(262, 92, 7, C.violeta)
      // 3) aguantando la respiración
      + dragon(326, 222, .7, { e: 'esfuerzo', b: 'mejillas' })
      + bur(362, 126, 15, C.sol) + bur(378, 96, 8, C.hoja) + bur(346, 82, 6, C.rosa) + bur(300, 100, 9, C.rosa) + bur(390, 140, 5, C.violeta)
      + trazo('M380,176 q8,-8 4,-18', 2.2, C.grisO, { o: .6 })
      + flor(30, 252, C.rosa, 4.5) + flor(150, 250, C.sol, 4) + hierba(276, 250, 12, C.hojaO)),

    cuento1_4: () => svg(VB,
      lienzo(C.cielo, C.cieloO, .45) + nubes([320, 44, .5, 3], [70, 36, .4, 5])
      + agua('M-14,142 Q200,128 414,146 V272 H-14Z', C.prado)
      + castillo(330, 160, .62)
      + agua('M-14,196 Q200,182 414,200 V272 H-14Z', C.hoja)
      + nina(112, 240, 1.2, { e: 'habla', l: [-24, -36], r: [34, -96] })
      // calendario
      + agua('M146,86 Q160,82 176,86 L178,126 Q161,131 148,127Z', PAPEL) + agua('M146,86 Q160,82 176,86 L177,96 Q161,92 146,96Z', C.rojo)
      + trazo('M152,106 h18 M152,114 h18 M152,121 h12', 1.6, C.grisO, { o: .7 }) + trazo(`M${f1(166)},114 Q171,108 166,104 Q158,102 158,110 Q160,118 168,116`, 2, C.rojoO, { o: .85 })
      + dragon(284, 240, 1.08, { e: 'sorpresa', b: 'mejillas' })
      + bur(236, 100, 9, C.rosa) + est(206, 118, 6) + est(220, 86, 4.5, C.rosa) + est(250, 70, 5, C.violeta)
      + flor(30, 248, C.rosa, 5) + flor(372, 250, C.sol, 5) + hierba(200, 252, 14, C.hojaO)),

    cuento1_5: () => svg(VB,
      lienzo(lava(C.paja, .45), C.naranja, .25)
      + agua('M-14,196 Q200,186 414,198 V272 H-14Z', C.tierra)
      // banderines
      + pincel('M-10,22 Q100,52 200,26 Q300,2 410,34', 2.2, C.grisO, { f: 'l' })
      + [[24, 34, C.rojo], [64, 44, C.sol], [104, 48, C.cielo], [146, 44, C.hoja], [188, 32, C.rosa], [232, 22, C.violeta], [272, 16, C.rojo], [316, 18, C.sol], [358, 24, C.cielo]].map(([x, y, c], i) => agua(`M${x - 8},${y} L${x + 8},${y - 2} L${x + 1},${y + 18}Z`, c, { f: 'l' })).join('')
      // globos
      + [[40, 82, C.rojo], [72, 62, C.azul], [362, 76, C.sol], [336, 100, C.rosa]].map(([x, y, c], i) => pincel(`M${x},${y + 14} Q${x + 6},${y + 50} ${x - 2},${y + 80}`, 1.8, C.grisO, { f: 'l', o: .6 }) + agua(mancha(x, y, 15, 18, 150 + i, .06), c) + vel(mancha(x + 5, y + 5, 9, 11, 155 + i, .15), carga(c, .8), { o: .4 }) + punto(x - 5, y - 7, 2.2, PAPEL, .9)).join('')
      // mesa y tarta
      + agua('M134,196 Q210,190 288,196 L288,208 Q210,214 134,208Z', C.tronco) + pincel('M148,208 V250 M274,208 V250', 7, C.troncoO, { f: 'l' })
      + agua('M170,196 Q168,172 172,158 Q210,154 250,158 Q254,172 252,196Z', C.crema) + vel('M170,180 Q210,190 252,180 V196 H170Z', C.rosa, { o: .6 })
      + agua('M166,160 Q180,150 190,160 Q200,150 212,160 Q224,150 234,160 Q244,150 256,160 Q254,168 210,170 Q170,168 166,160Z', C.rosa)
      + [186, 202, 218, 234].map((cx, i) => agua(`M${cx - 2},158 L${cx + 2},158 L${cx + 1.6},142 L${cx - 1.6},142Z`, [C.azul, C.sol, C.rojo, C.hoja][i], { f: 'l' }) + agua(mancha(cx, 137, 3.4, 5, 160 + i, .12), C.solO, { f: 'l' }) + agua(mancha(cx, 138, 1.8, 3, 164 + i, .12), C.sol, { f: 'l' })).join('')
      // dragón echando fuego
      + dragon(90, 238, 1.02, { e: 'fuego', b: 'arriba', gorro: 'fiesta' })
      + fuego(104, 160, .95)
      + nina(334, 240, 1.1, { e: 'risa', l: [-4, -54], r: [4, -54], hat: C.azul, fl: -1 })
      + [[120, 70, C.rosa], [160, 96, C.sol], [252, 76, C.cielo], [292, 112, C.rojo], [200, 58, C.hoja], [104, 126, C.violeta], [310, 146, C.azul], [232, 118, C.naranja], [60, 150, C.sol], [390, 150, C.rosa]].map(([x, y, c], i) => agua(mancha(x, y, 4.4, 2.6, 170 + i, .12, 6, i), c, { f: 'l' })).join('')),
  });

  // ================= CUENTO 2: la luna que no quería dormir =================
  const casita = (x, y, k, pared, tejado, luz) => {
    const { agua } = pen(x, y, k);
    return agua('M-24,0 Q-26,-16 -23,-32 Q0,-30 24,-33 Q26,-16 24,0Z', pared) + agua('M-31,-30 Q-12,-48 0,-60 Q14,-48 31,-31Z', tejado)
      + agua(mancha(-8, -16, 5, 5.5, 180, .1), luz || C.sol, { f: 'l' }) + agua('M8,0 L8,-17 Q14,-22 19,-17 L19,0Z', C.tronco, { f: 'l' });
  };
  const estrellas = (arr, c = C.sol) => arr.map(([x, y, r], i) => est(x, y, r || 4 + i % 3, c)).join('');
  Object.assign(ILUS, {
    cuento2_1: () => svg(VB,
      lienzo(lava(C.violeta, .15), null)
      + vel('M-14,100 Q200,70 414,110 V272 H-14Z', C.naranja, { o: .55 }) + vel('M-14,168 Q200,150 414,170 V272 H-14Z', C.sol, { o: .6 })
      + estrellas([[30, 30], [150, 40], [60, 140, 3.4], [196, 100, 3.4], [260, 28, 5], [380, 70, 4], [120, 170, 3]], PAPEL)
      + agua(mancha(334, 206, 56, 54, 190, .04), C.sol, { f: 's', o: .9 })
      + solc(332, 200, 1.05, { e: 'contento' })
      + agua('M-14,196 Q80,170 170,192 Q260,168 414,186 V272 H-14Z', carga(C.hojaO, .85))
      + casita(240, 216, .6, C.paja, C.rojo, C.sol) + casita(160, 224, .5, C.rosa, C.azul, C.sol) + casita(70, 222, .55, C.cielo, C.naranja, C.sol)
      + agua('M-14,226 Q200,208 414,228 V272 H-14Z', C.hojaO)
      + luna(112, 90, 1.25, { e: 'enfado' })
      + trazo('M164,66 q10,4 14,14 M170,52 q12,4 18,16', 2.8, PAPEL, { o: .8 })),

    cuento2_2: () => svg(VB,
      lienzo(carga(C.azul, .8), carga(C.violeta, .7), .35)
      + estrellas([[20, 20], [210, 22], [380, 24], [250, 170], [160, 170], [14, 176], [390, 160]], C.sol)
      // pensamiento: el parque
      + agua(mancha(120, 100, 100, 74, 200, .05), PAPEL)
      + agua(mancha(120, 100, 88, 62, 201, .04), C.cielo, { o: .9 })
      + agua(mancha(66, 68, 12, 12, 202, .1), C.sol, { f: 'l' })
      + agua('M36,128 Q120,98 206,122 Q196,152 120,158 Q56,156 36,128Z', C.hoja)
      + arbolito(60, 138, .5, C.hojaO, 3)
      + trazo('M112,138 L124,76 L190,76 L200,138 M124,76 H190', 3.2, C.rojoO, { o: .85 }) + trazo('M148,76 V112 M172,76 V112', 1.6, C.grisO, { o: .7 }) + trazo('M144,112 h32', 4, C.tronco)
      + agua(mancha(160, 100, 6, 9, 203, .1), C.azul, { f: 'l' }) + agua(mancha(160, 88, 5.4, 5.4, 204, .1), pig('#F1C7A0'), { f: 'l' }) + agua('M154,87 Q160,80 166,87Z', C.tronco, { f: 'l' })
      + flor(92, 148, C.rojo, 3.4) + flor(190, 146, C.sol, 3.4)
      + agua(mancha(238, 124, 8, 8, 205, .1), PAPEL, { f: 'l' }) + agua(mancha(256, 106, 5, 5, 206, .1), PAPEL, { f: 'l' })
      + luna(322, 118, 1.25, { e: 'enfado' }) + trazo('M280,70 l-8,-8 M272,92 l-10,-2 M286,52 l-4,-10', 3, C.sol, { o: .9 })
      + agua('M-14,232 Q200,220 414,230 V272 H-14Z', carga(C.azul, .6))
      + casita(60, 250, .5, C.azul, carga(C.violeta, .8), C.sol) + casita(354, 248, .5, C.azul, carga(C.violeta, .8), C.sol)),

    cuento2_3: () => svg(VB,
      lienzo(lava(C.naranja, .55), C.cielo, .55) + nubes([58, 152, .5, 3], [362, 140, .45, 5])
      + estrellas([[206, 60, 5]], C.sol) + est(196, 150, 4, PAPEL)
      + solc(276, 94, 1.15, { e: 'habla' })
      + luna(132, 106, 1.1, { e: 'asombro' })
      + agua('M-14,212 Q100,194 200,208 Q300,222 414,202 V272 H-14Z', C.hoja)
      + casita(50, 238, .6, C.rosa, C.azul, C.sol) + casita(112, 242, .5, C.paja, C.rojo, C.sol) + casita(340, 234, .6, C.cielo, C.naranja, C.sol)
      + arbolito(290, 246, .6, C.hojaO, 2) + arbolito(172, 248, .5, C.hoja, 4)
      + agua('M-14,244 Q200,232 414,246 V272 H-14Z', C.hojaO)
      + trazo('M206,244 L214,212 L246,212 L254,244 M214,212 H246', 3, C.rojoO, { o: .8 })),

    cuento2_4: () => svg(VB,
      lienzo(C.cielo, C.cieloO, .35) + nubes([226, 46, .5, 3], [372, 82, .4, 5])
      + luna(84, 66, .85, { e: 'contento', pale: true })
      + agua('M-14,180 Q200,160 414,178 V272 H-14Z', C.hoja)
      + arbolito(352, 214, 1.05, C.hojaO, 2) + arbolito(30, 214, .8, C.hoja, 1)
      + pincel('M148,242 L166,112 M312,242 L296,112', 7, C.rojo) + pincel('M160,112 H302', 8, C.sol)
      // columpios con niños
      + `<g transform="rotate(16 200 114)">` + trazo('M186,114 V196 M214,114 V196', 2, C.grisO, { o: .8 }) + agua('M178,194 L222,194 L222,200 L178,200Z', C.tronco, { f: 'l' }) + nina(200, 220, .92, { e: 'risa', sit: true, l: [-14, -62], r: [14, -62] }) + `</g>`
      + `<g transform="rotate(-12 262 114)">` + trazo('M248,114 V196 M276,114 V196', 2, C.grisO, { o: .8 }) + agua('M240,194 L284,194 L284,200 L240,200Z', C.tronco, { f: 'l' }) + nina(262, 220, .92, { e: 'contento', sit: true, chico: true, pelo: '#5A3A28', vest: C.rojo, pant: C.sol, l: [-14, -62], r: [14, -62] }) + `</g>`
      + trazo('M120,186 q-8,-10 -4,-22 M124,206 q-12,-6 -14,-18 M340,140 q10,6 10,18', 2.2, C.grisO, { o: .6 })
      + flor(110, 248, C.rosa, 5) + flor(350, 252, C.sol, 5) + flor(80, 238, C.violeta, 4) + hierba(30, 252, 12, C.hojaO) + hierba(382, 242, 12, C.hojaO, -1)),

    cuento2_5: () => svg(VB,
      lienzo(carga(C.azul, .72), carga(C.violeta, .7), .3)
      + estrellas([[30, 30], [120, 22], [330, 30], [372, 122], [20, 122], [160, 72], [300, 176]], C.sol)
      + nubeD(250, 126, 1.1, 4)
      + luna(250, 90, 1.05, { e: 'dormido', gorro: true })
      + zeta(322, 62, 1) + zeta(338, 42, .8) + zeta(352, 26, .6)
      + agua('M-14,222 Q200,206 414,224 V272 H-14Z', carga(C.azul, .6))
      + agua('M-14,240 Q200,230 414,242 V272 H-14Z', carga(C.hojaO, .7))
      + agua('M52,240 Q50,200 54,180 L128,180 Q130,200 128,240Z', C.crema) + agua('M44,184 L90,138 L136,184Z', C.rojo)
      + agua('M66,222 Q80,204 92,206 L92,226Z', C.tronco, { f: 'l' }) + agua('M70,208 L98,208 L98,170 L70,170Z', C.sol, { f: 'l' })
      + trazo('M84,170 V208 M70,189 H98', 2, C.pajaO, { o: .8 })
      + arbolito(178, 242, .8, carga(C.hojaO, .7), 2) + arbolito(350, 244, .9, carga(C.hojaO, .7), 4)),
  });

  // ================= CUENTO 3: la jirafa que quería ser bajita =================
  Object.assign(ILUS, {
    cuento3_1: () => svg(VB,
      lienzo(C.cielo, C.cieloO, .4) + nubes([60, 46, .5, 3], [310, 62, .45, 5], [258, 44, .5, 7], [112, 40, .4, 9])
      + agua('M-14,196 Q100,182 200,194 Q300,204 414,188 V272 H-14Z', C.prado)
      + pincel('M322,240 Q318,196 326,170', 12, C.tronco) + agua('M262,172 Q290,148 330,154 Q376,148 394,172 Q350,184 328,180 Q290,184 262,172Z', C.hoja)
      + vel('M300,168 Q340,180 388,172 Q352,188 328,184Z', C.hojaO, { o: .4 })
      + jirafa(150, 248, .95, { N: 100, lx: 8, e: 'feliz' })
      + nubeD(120, 104, .34, 11)
      + hierba(40, 248, 14, C.hojaO) + hierba(262, 252, 14, C.hojaO, -1) + hierba(372, 244, 12, C.hojaO) + flor(90, 254, C.sol, 4.5)),

    cuento3_2: () => svg(VB,
      lienzo(C.cielo, C.cieloO, .35) + nubes([334, 42, .48, 3])
      + agua('M-14,188 Q200,172 414,190 V272 H-14Z', C.hoja)
      + palmera(40, 222, 1.05)
      + jirafa(214, 244, .88, { N: 78, lx: -4, e: 'triste' })
      + arbusto(222, 252, 1.3, C.hojaO, 1)
      + palmera(318, 246, 1) + elefante(334, 238, .9, { fl: -1, e: 'risa' })
      + mono(84, 232, .95, { e: 'pillo' }) + arbusto(84, 256, 1.5, C.hoja, 2)
      + flor(150, 254, C.rosa, 4.5) + flor(382, 254, C.sol, 4.5)),

    cuento3_3: () => svg(VB,
      lienzo(lava(C.hoja, .55), PAPEL, .25)
      + palmera(372, 232, 1.15) + arbolito(250, 214, 1.5, C.hoja, 2) + arbolito(20, 204, 1.3, C.hojaO, 3)
      + agua('M-14,198 Q200,182 414,200 V272 H-14Z', C.hoja)
      + agua('M296,272 Q316,238 414,228 V272Z', C.cielo) + trazo('M330,252 q10,-4 20,0 M366,240 q10,-4 20,0', 2, PAPEL, { o: .9 })
      + mono(364, 248, .7, { e: 'triste' }) + arbusto(392, 258, .8, C.hojaO, 1)
      + jirafa(142, 250, .82, { N: 82, lx: -6, e: 'triste' })
      + elefante(278, 250, .9, { trompa: 'arriba', e: 'preocupa', fl: -1 })
      + interroga(106, 104, 1.3, C.violeta) + interroga(232, 112, 1.1, C.rosa) + interroga(312, 94, 1, C.violeta)
      + arbusto(60, 264, 1.5, C.hojaO, 2) + hierba(210, 254, 14, C.hojaO) + hierba(340, 250, 12, C.hojaO)),

    cuento3_4: () => svg(VB,
      lienzo(C.cielo, C.cieloO, .35) + nubes([334, 34, .5, 3])
      + agua('M-14,192 Q200,176 414,194 V272 H-14Z', C.hoja)
      + agua('M186,272 Q246,226 414,214 V272Z', C.cielo) + vel('M216,262 Q260,232 414,226 V272Z', C.cieloO, { o: .45 }) + trazo('M262,244 q10,-4 20,0 M322,230 q10,-4 20,0 M302,256 q10,-4 20,0', 2.2, PAPEL, { o: .9 })
      + agua(mancha(346, 224, 22, 9, 220, .1), C.gris) + mono(346, 222, .75, { e: 'risa', b: 'saluda' })
      + arbolito(152, 196, 1, C.hoja, 1) + arbolito(218, 202, .9, C.hojaO, 2) + arbolito(20, 222, .9, C.hoja, 3) + arbolito(284, 198, .75, C.hojaO, 4)
      + jirafa(86, 258, .9, { N: 128, lx: 14, e: 'grita' })
      + trazo('M182,66 q16,-2 26,-10 M184,80 q20,4 34,2 M180,52 q12,-8 18,-20', 3, C.grisO, { o: .7 })
      + trazo('M192,78 Q290,124 330,196', 2.2, C.grisO, { o: .5, x: ' stroke-dasharray="3 9"' })),

    cuento3_5: () => svg(VB,
      lienzo(lava(C.rosa, .5), C.cielo, .45) + nubes([80, 42, .5, 3])
      + agua('M-14,192 Q200,178 414,194 V272 H-14Z', C.hoja)
      + arbolito(36, 200, 1, C.hojaO, 1)
      + jirafa(220, 248, .88, { N: 88, e: 'orgullo' })
      + corazon(304, 52, 1.5, C.rojo) + corazon(330, 82, .9, C.rosa) + corazon(274, 100, .7, C.rojo)
      + mono(78, 238, .9, { e: 'risa' }) + arbusto(72, 256, 1.4, C.hojaO, 2)
      + palmera(346, 250, 1) + elefante(362, 242, .85, { fl: -1, e: 'risa' })
      + flor(150, 252, C.rosa, 5) + flor(300, 254, C.sol, 5) + hierba(120, 250, 12, C.hojaO)),
  });

  // ================= CUENTO 4: el calcetín que siempre se perdía =================
  const pared = c => lienzo(c, null) + [[40, 40], [110, 70], [180, 30], [250, 80], [330, 36], [380, 90], [60, 110], [150, 120]].map(([x, y], i) => vel(mancha(x, y, 6, 6, 230 + i, .2), C.rosaO, { o: .22 })).join('');
  const suelo4 = () => agua('M-14,188 Q200,180 414,190 V272 H-14Z', C.tierra) + vel('M-14,188 Q200,180 414,190 V196 Q200,190 -14,198Z', C.pajaO, { o: .3 });
  const marco = (x, y, w, h, r = 12) => `M${x + r},${y} Q${x + w / 2},${y - 2} ${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w + 1},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} Q${x + w / 2},${y + h + 2} ${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} L${x - 1},${y + r} Q${x},${y} ${x + r},${y}Z`;
  Object.assign(ILUS, {
    cuento4_1: () => svg(VB,
      pared(lava(C.rosa, .55)) + suelo4()
      // ventana
      + agua('M246,28 Q296,22 350,30 L348,108 Q298,114 248,106Z', C.tronco) + agua('M254,36 Q298,32 342,38 L340,100 Q298,104 256,98Z', C.cielo) + trazo('M298,34 V102 M254,68 H342', 2.4, C.troncoO, { o: .8 }) + nubeD(318, 56, .16, 3)
      + agua('M236,24 Q258,70 250,114 L234,114 Q244,60 230,24Z', C.sol, { o: .9 })
      // cesto de la ropa
      + agua('M40,236 L30,168 Q80,160 130,168 L120,236Q80,242 40,236Z', C.paja) + trazo('M36,184 h88 M38,202 h84 M40,220 h80 M60,170 v64 M84,170 v66 M108,170 v64', 2, C.pajaO, { o: .6 })
      + agua('M36,170 Q46,142 68,152 Q80,132 98,148 Q112,142 124,170Z', C.azul) + agua(mancha(58, 154, 14, 9, 240, .15), C.rojo, { f: 'l' }) + vel('M70,150 Q72,162 64,170', C.azul, { o: .4 })
      + calcetin(228, 238, 1.3, { rot: -10, e: 'pillo' })
      + trazo('M180,214 h-24 M186,228 h-30 M176,200 h-16', 2.6, C.grisO, { o: .6 }) + trazo('M148,238 q4,-6 10,0 M126,238 q4,-6 10,0', 2, C.grisO, { o: .5 })
      + interroga(300, 164, 1.4, C.violeta) + est(340, 142, 5, C.sol) + est(270, 142, 4, C.rosa)),

    cuento4_2: () => svg(VB,
      lienzo(lava(C.crema, .2), null)
      // 1: debajo de la cama
      + agua(marco(10, 20, 120, 220), lava(C.violeta, .3)) + agua('M12,172 Q70,166 128,172 L130,238 Q70,244 12,238Z', C.tierra)
      + agua('M10,24 Q70,18 128,24 L130,96 Q70,104 12,96Z', C.rojo) + vel('M12,88 Q70,98 130,88 L130,100 Q70,108 12,100Z', C.rojoO, { o: .6 })
      + vel('M14,98 Q70,106 128,98 L128,176 Q70,184 14,176Z', C.negro, { o: .45 })
      + agua(mancha(30, 168, 9, 6, 250, .15), C.gris, { f: 'l' }) + agua(mancha(112, 172, 11, 6, 251, .15), C.gris, { f: 'l' })
      + calcetin(70, 190, .85, { e: 'pillo' })
      // 2: dentro de la nevera
      + agua(marco(140, 20, 120, 220), lava(C.cielo, .5)) + agua(marco(148, 30, 104, 202, 8), lava(C.cielo, .75), { f: 'l' })
      + trazo('M150,100 H250 M150,164 H250', 3.4, C.grisO, { o: .8 })
      + agua('M162,62 L162,98 L182,98 L182,64 L172,56Z', PAPEL) + trazo('M164,72 h16', 5, C.azul, { o: .85 }) + agua(mancha(212, 86, 10, 12, 252, .1), C.sol, { f: 'l' }) + agua(mancha(236, 90, 8, 8, 253, .1), C.rojo, { f: 'l' })
      + agua(mancha(166, 142, 11, 9, 254, .15), C.hoja, { f: 'l' }) + agua(mancha(238, 148, 9, 12, 255, .15), C.naranja, { f: 'l' })
      + calcetin(204, 164, .72, { e: 'asombro' })
      + est(160, 192, 5, C.cieloO) + est(244, 200, 4, C.cieloO) + est(180, 214, 3.4, C.cieloO)
      // 3: en la cabeza del gato
      + agua(marco(270, 20, 120, 220), lava(C.rosa, .5)) + agua('M272,186 Q330,180 388,186 L390,238 Q330,244 272,238Z', C.tierra)
      + gato(330, 226, 1.3, { e: 'sorpresa' })
      + calcetin(332, 150, .5, { rot: -6, e: 'risa' })
      + interroga(372, 70, .8, C.violeta)),

    cuento4_3: () => svg(VB,
      pared(lava(C.rosa, .55)) + suelo4()
      + agua(mancha(250, 232, 66, 18, 260, .08), C.cielo) + vel(mancha(262, 238, 44, 9, 261, .1), C.cieloO, { o: .4 })
      + nina(112, 248, 1.4, { e: 'habla', l: [-24, -38], r: [34, -62] })
      + calcetin(246, 226, 1.15, { e: 'triste' })
      + agua(mancha(282, 120, 5, 5, 262, .1), PAPEL, { f: 'l' }) + agua(mancha(294, 102, 7, 7, 263, .1), PAPEL, { f: 'l' })
      + agua(mancha(332, 62, 58, 42, 264, .12), PAPEL) + calcetin(318, 92, .62, { e: 'triste', fl: -1 }) + interroga(358, 58, 1.1, C.violeta)),

    cuento4_4: () => svg(VB,
      lienzo(lava(C.azul, .6), null) + agua('M-14,210 Q200,200 414,212 V272 H-14Z', C.tierra)
      // mesa
      + agua('M150,174 Q270,168 398,176 L398,190 Q270,184 150,190Z', C.tronco) + pincel('M168,190 V256 M386,190 V256', 7, C.troncoO, { f: 'l' })
      // ordenador
      + agua('M262,176 L270,150 L296,150 L304,176Z', C.gris)
      + agua(marco(196, 38, 174, 118, 10), lava(C.gris, .3)) + vel('M300,40 L370,40 L370,156 L290,156Z', C.grisO, { o: .25 })
      + agua(marco(208, 50, 150, 94, 6), C.cielo, { f: 'l' }) + trazo('M208,62 H358', 2, C.cieloO, { o: .7 })
      + punto(216, 56, 2, C.rojo) + punto(223, 56, 2, C.sol)
      + agua('M222,74 L238,74 L238,86 L222,86Z', C.sol, { f: 'l' }) + agua('M222,98 L238,98 L238,110 L222,110Z', C.rosa, { f: 'l' })
      + agua('M272,142 L266,106 Q296,100 326,106 L322,142Z', C.gris) + trazo('M282,110 v28 M296,110 v30 M310,110 v28', 2.4, C.grisO, { o: .7 })
      + agua('M262,104 L330,96 L330,102 L262,110Z', lava(C.gris, .1), { f: 'l' })
      + calcetin(300, 120, .6, { e: 'risa', fl: -1 })
      + est(256, 82, 5) + est(344, 84, 4, C.rosa) + est(340, 130, 3.5, C.solO)
      + calcetin(362, 174, .78, { e: 'risa', fl: -1 })
      + nina(90, 254, 1.4, { e: 'asombro', l: [-24, -38], r: [38, -72] })
      // lupa
      + pincel('M141,155 L152,142', 5, C.tronco, { f: 'l' }) + vel(mancha(160, 134, 13, 13, 270, .05), C.cielo, { o: .6 }) + trazo(mancha(160, 134, 13, 13, 270, .05), 3.2, C.troncoO, { o: .85 }) + trazo('M153,128 q3,-4 8,-4', 1.8, PAPEL, { o: .95 })),

    cuento4_5: () => svg(VB,
      pared(lava(C.rosa, .55)) + suelo4()
      + agua(marco(44, 40, 66, 58, 6), C.tronco) + agua(marco(51, 47, 52, 44, 4), C.cielo, { f: 'l' }) + corazon(77, 72, 1.1, C.rojo)
      + agua(mancha(200, 234, 122, 20, 280, .06), C.sol) + trazo('M120,234 Q200,224 280,234', 3, C.naranja, { o: .6 })
      + calcetin(180, 236, 1.2, { rot: -7, e: 'contento' }) + calcetin(226, 236, 1.2, { rot: 7, e: 'contento', fl: -1 })
      + corazon(200, 112, 1.6, C.rojo) + corazon(164, 86, .85, C.rosa) + corazon(238, 82, .95, C.rosa)
      + nina(336, 240, 1.2, { e: 'contento', l: [-6, -50], r: [8, -50], fl: -1 })
      + gato(70, 236, 1.05, { e: 'contento' })),
  });
})();
