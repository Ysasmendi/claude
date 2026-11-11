// Pinturas: cuentos-b (cuentos 5 a 8: el pingüino, la nube, el robot y la tortuga)
(() => {
  const { agua, vel, trazo, pincel, punto, gotas, mancha, liso, pig, carga, lava, svg, C, ojo, sonrisa, colorete, hierba, flor, nubeD, LINEA, PAPEL, azar, f1 } = AQ;
  const VB = '0 0 400 260';

  // ---------- ayudantes comunes ----------
  const en = (x, y, k, inner, fl, rot) => `<g transform="translate(${f1(x)} ${f1(y)})${rot ? ` rotate(${rot})` : ''} scale(${fl ? -k : k} ${k})">${inner}</g>`;
  const fondo = (c, c2) => agua('M-20,-20 H420 V280 H-20Z', c, { f: 's', o: 1 }) + (c2 ? vel('M-20,-20 H420 V100 Q200,130 -20,92Z', c2, { o: .4 }) : '');
  const suelo = (y, c, c2) => agua(`M-20,${y} Q100,${y - 12} 200,${y - 2} Q300,${y + 9} 420,${y - 8} L420,280 L-20,280Z`, c) + (c2 ? vel(`M-20,${y + 30} Q150,${y + 14} 420,${y + 24} L420,280 L-20,280Z`, c2, { o: .35 }) : '');
  const sombra = (x, y, rx) => vel(mancha(x, y, rx, 5, x, .1), C.grisO, { o: .38 });
  const gota = (x, y, s = 1, c = '#9CCBEA') => agua(`M${f1(x)},${f1(y)} q${-3 * s},${6 * s} 0,${9 * s} q${3 * s},${-3 * s} 0,${-9 * s}Z`, c, { f: 'l' });
  const arbol = (x, y, k, c = C.hoja, c2 = C.hojaO, s = 1) =>
    agua(`M${x - 8 * k},${y} Q${x - 4 * k},${y - 40 * k} ${x - 6 * k},${y - 82 * k} L${x + 8 * k},${y - 82 * k} Q${x + 5 * k},${y - 40 * k} ${x + 10 * k},${y}Z`, C.tronco)
    + agua(mancha(x - 22 * k, y - 92 * k, 30 * k, 26 * k, s + 3, .1), c) + agua(mancha(x + 24 * k, y - 92 * k, 30 * k, 27 * k, s + 4, .1), c2, { o: .92 }) + agua(mancha(x, y - 114 * k, 32 * k, 26 * k, s + 5, .1), c)
    + vel(mancha(x + 14 * k, y - 94 * k, 34 * k, 18 * k, s + 6, .2), carga(c2, .8), { o: .3 });
  const nota = (x, y, c = C.violeta, r = 1) => agua(mancha(x, y, 4.4 * r, 3.4 * r, x + y, .1), carga(c, .8), { f: 'l' }) + trazo(`M${x + 3.6 * r},${y} L${x + 3.6 * r},${y - 15 * r} q6,2 5,9`, 2, carga(c, .8));
  const corazon = (x, y, r, c = C.rojo) => agua(`M${x},${y + r} C${x - r * 1.8},${y - r * .2} ${x - r * .8},${y - r * 1.4} ${x},${y - r * .5} C${x + r * .8},${y - r * 1.4} ${x + r * 1.8},${y - r * .2} ${x},${y + r}Z`, c, { f: 'l' });
  const copo = (x, y, r, c = C.cieloO) => [0, 60, 120].map(a => { const q = a * Math.PI / 180; return trazo(`M${f1(x - Math.cos(q) * r)},${f1(y - Math.sin(q) * r)} L${f1(x + Math.cos(q) * r)},${f1(y + Math.sin(q) * r)}`, 1.5, c, { o: .8 }); }).join('');
  const lineasVel = (x0, x1, ys, c = C.grisO) => ys.map((y, i) => trazo(`M${x0 + i * 7},${y} L${x1 - i * 5},${y + (i % 2 ? 2 : -2)}`, 2.2, c, { o: .55 })).join('');

  // ---------- Pepe, el pingüino ----------
  // origen en los pies, mira de frente; mide unas 100 unidades
  const pinguino = (x, y, k, o = {}) => {
    const D = '#7C80A8', Dd = carga(D, .78);
    const ala = (d, t) => t === 'arriba' ? agua(`M${d * 22},-68 Q${d * 52},-84 ${d * 50},-110 Q${d * 34},-96 ${d * 18},-76Z`, Dd)
      : t === 'fuera' ? agua(`M${d * 24},-62 Q${d * 54},-60 ${d * 62},-40 Q${d * 42},-44 ${d * 20},-48Z`, Dd)
      : t === 'frente' ? agua(`M${d * 22},-58 Q${d * 38},-76 ${d * 22},-88 Q${d * 12},-76 ${d * 14},-62Z`, Dd)
      : agua(`M${d * 24},-66 Q${d * 42},-46 ${d * 36},-20 Q${d * 28},-32 ${d * 20},-44Z`, Dd);
    const ai = o.alaI || 'baja', ad = o.alaD || 'baja';
    let s = sombra(0, 2, 32);
    s += agua(mancha(-11, -1, 10, 4.4, 3, .1), C.naranja) + agua(mancha(11, -1, 10, 4.4, 4, .1), C.naranja);
    s += ala(-1, ai) + ala(1, ad);
    s += agua(mancha(0, -46, 27, 47, 5, .04), D) + vel(mancha(10, -30, 18, 34, 9, .15), Dd, { o: .35 });
    s += agua(mancha(0, -34, 18, 32, 6, .05), PAPEL) + vel(mancha(8, -22, 14, 22, 7, .15), C.cieloO, { o: .22 });
    s += agua(mancha(-9, -74, 8, 8.5, 11, .05), PAPEL, { f: 'l' }) + agua(mancha(9, -74, 8, 8.5, 12, .05), PAPEL, { f: 'l' });
    const oj = o.ojos || 'abiertos';
    if (o.gafas) s += agua(mancha(-9.5, -74, 10, 8, 13, .05), '#6A5B78', { f: 'l' }) + agua(mancha(9.5, -74, 10, 8, 14, .05), '#6A5B78', { f: 'l' }) + trazo('M-2,-76 Q0,-78 2,-76', 2, '#6A5B78') + vel(mancha(-12, -77, 3, 1.6, 15, .1), PAPEL, { o: .9 }) + vel(mancha(7, -77, 3, 1.6, 16, .1), PAPEL, { o: .9 });
    else if (oj === 'cerrados') s += trazo('M-14,-73 Q-9,-68 -4,-73', 2.2) + trazo('M4,-73 Q9,-68 14,-73', 2.2);
    else s += ojo(-8, -73, 3.4) + ojo(8, -73, 3.4);
    if (!o.gafas && oj === 'pena') s += trazo('M-15,-84 L-4,-81', 2, LINEA, { o: .7 }) + trazo('M15,-84 L4,-81', 2, LINEA, { o: .7 });
    s += agua(o.boca === 'abierta' ? 'M-8,-67 Q0,-73 8,-67 Q6,-52 0,-50 Q-6,-52 -8,-67Z' : 'M-7,-67 Q0,-72 7,-67 Q3,-57 0,-56 Q-3,-57 -7,-67Z', C.naranja, { f: 'l' });
    if (o.boca === 'abierta') s += agua(mancha(0, -58, 4, 4, 17, .1), '#C9605F', { f: 'l' });
    s += colorete(-17, -64, 5) + colorete(17, -64, 5);
    if (o.sudor) s += gota(-30, -96, 1) + gota(31, -88, 1.1) + gota(-34, -74, .9) + gota(0, -108, .9);
    return en(x, y, k, s, o.flip, o.rot);
  };

  // ---------- la niña ----------
  const nino = (x, y, k, o = {}) => {
    const ropa = pig(o.ropa || '#E8777F'), piel = o.piel || '#F4CDB4', pelo = pig(o.pelo || '#7A4B2E');
    const arr = o.brazos === 'arriba';
    let s = sombra(0, 1, 16);
    s += pincel('M-4,-16 L-4,-1', 5.5, carga(piel, .9), { f: 'l' }) + pincel('M4,-16 L4,-1', 5.5, carga(piel, .9), { f: 'l' });
    s += agua(mancha(-5, 0, 6, 3, 21, .1), carga(ropa, .8), { f: 'l' }) + agua(mancha(5, 0, 6, 3, 22, .1), carga(ropa, .8), { f: 'l' });
    if (o.vestido) s += agua('M-9,-44 Q-14,-24 -17,-13 Q0,-8 17,-13 Q14,-24 9,-44Z', ropa);
    else s += agua(mancha(0, -31, 11, 15, 23, .06), ropa);
    if (arr) s += pincel('M-9,-40 Q-14,-52 -11,-64', 5.5, carga(piel, .92)) + pincel('M9,-40 Q14,-52 11,-64', 5.5, carga(piel, .92));
    else if (o.brazos === 'mano') s += pincel('M-9,-40 Q-14,-30 -13,-22', 5.5, carga(piel, .92)) + pincel('M9,-40 Q18,-34 24,-30', 5.5, carga(piel, .92));
    else s += pincel('M-9,-40 Q-14,-30 -13,-22', 5.5, carga(piel, .92)) + pincel('M9,-40 Q14,-30 13,-22', 5.5, carga(piel, .92));
    if (o.pelo !== false && o.trenzas) s += agua(mancha(-12, -48, 5, 8, 24, .1), pelo, { f: 'l' }) + agua(mancha(12, -48, 5, 8, 25, .1), pelo, { f: 'l' });
    s += agua(mancha(0, -53, 11, 10.5, 26, .05), piel);
    s += agua(`M-12,-54 Q-11,-68 0,-66 Q11,-68 12,-54 Q6,-60 0,-59 Q-6,-60 -12,-54Z`, pelo);
    s += punto(-4, -52, 1.6) + punto(4, -52, 1.6) + trazo(`M-3,-47 Q0,${o.boca === 'o' ? -45 : -44.5} 3,-47`, 1.5) + colorete(-8, -48, 3.4) + colorete(8, -48, 3.4);
    return en(x, y, k, s, o.flip);
  };

  // ---------- la nube pequeña ----------
  const nubeP = (x, y, k, o = {}) => {
    const c = o.color || PAPEL;
    let s = agua(liso([[-50, 12], [-56, -6], [-34, -20], [-18, -38], [10, -40], [30, -26], [50, -20], [62, 0], [50, 14], [0, 18]]), c)
      + vel(mancha(6, 8, 46, 10, 3, .2), o.sombra || C.cieloO, { o: .35 });
    const e = o.cara || 'feliz';
    if (e === 'esfuerzo') s += trazo('M-24,-14 L-14,-10 L-24,-6', 2.6) + trazo('M24,-14 L14,-10 L24,-6', 2.6) + agua(mancha(0, 2, 8, 5, 4, .1), '#C9605F', { f: 'l' });
    else if (e === 'triste') s += ojo(-16, -10, 3.6) + ojo(16, -10, 3.6) + trazo('M-24,-20 L-10,-16', 2, LINEA, { o: .7 }) + trazo('M24,-20 L10,-16', 2, LINEA, { o: .7 }) + trazo('M-8,4 Q0,-2 8,4', 2) + gota(-24, 0, .9);
    else if (e === 'preocupada') s += ojo(-16, -10, 3.6) + ojo(16, -10, 3.6) + trazo('M-24,-21 L-10,-17', 2, LINEA, { o: .7 }) + trazo('M24,-21 L10,-17', 2, LINEA, { o: .7 }) + trazo('M-9,4 Q-4,0 0,4 Q4,8 9,4', 2);
    else s += ojo(-16, -10, 3.6) + ojo(16, -10, 3.6) + sonrisa(0, 0, 14);
    s += colorete(-27, -1, 7) + colorete(27, -1, 7);
    return en(x, y, k, s);
  };
  const nubeG = (x, y, k, s = 1, c = '#D9D2E3') => en(x, y, k, agua(liso([[-60, 16], [-66, -4], [-40, -18], [-22, -36], [8, -40], [30, -26], [56, -20], [70, 0], [58, 16], [0, 20]]), c) + vel(mancha(6, 8, 52, 12, s, .2), C.grisO, { o: .5 }));

  const dulce = (x, y, tipo, c, rot = 0, k = 1) => {
    let s;
    if (tipo === 'env') s = agua(mancha(0, 0, 9, 6, x, .1), c, { f: 'l' }) + agua('M8,0 L17,-6 L17,6Z', c, { f: 'l' }) + agua('M-8,0 L-17,-6 L-17,6Z', c, { f: 'l' }) + trazo('M-3,-4 L-1,4', 1.6, PAPEL, { o: .9 });
    else if (tipo === 'pir') s = trazo('M0,8 L0,28', 2.2, '#B9A99A', { o: .8 }) + agua(mancha(0, 0, 9, 9, x, .06), c, { f: 'l' }) + trazo('M0,0 m-1,0 a2,2 0 1,1 3,1 a5,5 0 1,1 -6,-3', 1.6, PAPEL, { o: .9 });
    else s = agua(mancha(0, 0, 6, 6, x + y, .08), c, { f: 'l' }) + punto(-2, -2, 1.4, PAPEL, .85);
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${k})">${s}</g>`;
  };
  const DC = [C.rojo, C.sol, C.violeta, C.hoja, C.rosa, C.cieloO, C.naranja];

  // ---------- Bip, el robot ----------
  const robot = (x, y, k, o = {}) => {
    const M = '#AEC2DE', Md = carga(M, .78), R = '#E27C78';
    const [bi, bd] = o.brazos || [[-36, -26], [36, -26]];
    const brazo = (d, h) => pincel(`M${d * 24},-54 Q${f1((d * 24 + h[0]) / 2 + d * 6)},${f1((-54 + h[1]) / 2)} ${h[0]},${h[1]}`, 7, Md) + agua(mancha(h[0], h[1], 6.5, 6, h[0] + 3, .1), carga(M, .7), { f: 'l' });
    let s = sombra(0, 1, 30);
    // piernas
    s += o.pie === 'izq' ? pincel('M-9,-18 Q-14,-12 -24,-12', 7, Md) + agua(mancha(-28, -12, 8, 4.5, 31, .1), Md, { f: 'l' }) : pincel('M-9,-18 L-10,-4', 7, Md) + agua(mancha(-12, -2, 9, 4.5, 31, .1), Md, { f: 'l' });
    s += o.pie === 'der' ? pincel('M9,-18 Q14,-12 24,-12', 7, Md) + agua(mancha(28, -12, 8, 4.5, 32, .1), Md, { f: 'l' }) : pincel('M9,-18 L10,-4', 7, Md) + agua(mancha(12, -2, 9, 4.5, 32, .1), Md, { f: 'l' });
    s += brazo(-1, bi) + brazo(1, bd);
    s += agua('M-24,-64 Q-28,-36 -23,-15 Q0,-9 23,-15 Q28,-36 24,-64 Q0,-70 -24,-64Z', M) + vel('M4,-62 Q26,-50 23,-15 Q10,-12 2,-14Z', Md, { o: .4 });
    s += agua(mancha(0, -38, 11, 9, 33, .08), PAPEL, { f: 'l' }) + punto(-5, -38, 2.4, R) + punto(1, -38, 2.4, C.hojaO) + punto(7, -38, 2.4, C.azul);
    s += pincel('M0,-66 L0,-70', 6, Md, { f: 'l' });
    let cab = agua('M-22,-78 Q-25,-98 -3,-99 Q22,-101 24,-80 Q22,-66 0,-66 Q-22,-66 -22,-78Z', M) + vel('M8,-96 Q24,-92 24,-80 Q20,-67 2,-67Z', Md, { o: .35 })
      + trazo('M0,-99 Q-1,-108 1,-114', 2.2, Md) + punto(1, -116, 3.4, R, .95)
      + agua(mancha(-24, -82, 3.6, 6, 34, .1), Md, { f: 'l' }) + agua(mancha(25, -82, 3.6, 6, 35, .1), Md, { f: 'l' })
      + agua(mancha(-9, -83, 6.8, 6.8, 36, .05), PAPEL, { f: 'l' }) + agua(mancha(9, -83, 6.8, 6.8, 37, .05), PAPEL, { f: 'l' });
    if (o.ojos === 'cerrados') cab += trazo('M-14,-83 Q-9,-87 -4,-83', 2) + trazo('M4,-83 Q9,-87 14,-83', 2);
    else cab += punto(-8.5, -83, 3, '#4A3E58') + punto(8.5, -83, 3, '#4A3E58') + punto(-7.6, -84, 1, PAPEL) + punto(9.4, -84, 1, PAPEL);
    cab += o.boca === 'plana' ? trazo('M-7,-72 L7,-72', 2) : o.boca === 'o' ? agua(mancha(0, -72, 4.4, 3.6, 38, .1), '#C9605F', { f: 'l' }) : o.boca === 'abierta' ? agua('M-9,-74 Q0,-62 9,-74Z', '#C9605F', { f: 'l' }) : sonrisa(0, -75, 14);
    cab += colorete(-17, -74, 4) + colorete(17, -74, 4);
    s += o.cab ? `<g transform="rotate(${o.cab} 0 -66)">${cab}</g>` : cab;
    if (o.giro) s += trazo('M-34,-96 Q-30,-118 0,-122', 2.4, C.violeta, { o: .85 }) + trazo('M-4,-126 L0,-122 L-4,-118', 2.2, C.violeta, { o: .85 }) + trazo('M34,-90 Q32,-70 8,-62', 2.4, C.violeta, { o: .85 });
    return en(x, y, k, s, o.flip, o.rot);
  };

  const osito = (x, y, k, o = {}) => {
    const B = '#CFA37E', Bd = carga(B, .76);
    const arr = o.baila;
    let s = sombra(0, 1, 20) + agua(mancha(-8, -3, 8, 5, 41, .1), Bd, { f: 'l' }) + agua(mancha(8, -3, 8, 5, 42, .1), Bd, { f: 'l' });
    s += pincel(arr ? 'M-12,-30 Q-24,-40 -22,-54' : 'M-12,-26 Q-22,-26 -24,-16', 8, B) + pincel(arr ? 'M12,-30 Q24,-40 22,-54' : 'M12,-26 Q22,-26 24,-16', 8, B);
    s += agua(mancha(0, -24, 16, 19, 43, .06), B) + vel(mancha(4, -16, 10, 11, 44, .15), C.crema, { o: .6 });
    s += agua(mancha(-11, -54, 5.5, 5.5, 45, .1), B, { f: 'l' }) + agua(mancha(11, -54, 5.5, 5.5, 46, .1), B, { f: 'l' });
    s += agua(mancha(0, -48, 14, 12.5, 47, .05), B) + agua(mancha(0, -43, 7, 5.5, 48, .08), C.crema, { f: 'l' }) + punto(0, -45, 2.2, '#6A5B78') + ojo(-5.5, -50, 2.2) + ojo(5.5, -50, 2.2) + trazo('M-3,-40 Q0,-38 3,-40', 1.4);
    s += colorete(-10, -43, 3.2) + colorete(10, -43, 3.2);
    return en(x, y, k, s, o.flip, o.rot);
  };
  const pato = (x, y, k, o = {}) => {
    const Y = C.sol;
    let s = sombra(0, 1, 18) + agua(mancha(-6, -1, 6, 3, 51, .1), C.naranja, { f: 'l' }) + agua(mancha(7, -1, 6, 3, 52, .1), C.naranja, { f: 'l' });
    s += agua(liso([[-18, -12], [-14, -24], [2, -26], [12, -20], [12, -8], [-2, -2], [-14, -4]]), Y) + vel(mancha(-4, -10, 10, 7, 53, .15), C.solO, { o: .5 });
    s += agua(mancha(10, -34, 9.5, 9, 54, .06), Y) + agua('M17,-34 Q26,-36 25,-31 Q20,-29 16,-30Z', C.naranja, { f: 'l' }) + ojo(11, -37, 2) + colorete(8, -30, 3);
    return en(x, y, k, s, o.flip, o.rot);
  };
  const pelota = (x, y, k, o = {}) => en(x, y, k, sombra(0, 1, 15) + agua(mancha(0, -13, 13, 13, 61, .05), C.cieloO) + vel('M-12,-18 Q0,-12 12,-18 L12,-10 Q0,-4 -12,-10Z', PAPEL, { o: .9 }) + vel(mancha(5, -8, 8, 7, 62, .2), carga(C.cieloO, .8), { o: .35 }) + ojo(-4, -17, 1.9) + ojo(4, -17, 1.9) + sonrisa(0, -11, 6), o.flip, o.rot);

  // ---------- Tula, la tortuga ----------
  const tortuga = (x, y, k, o = {}) => {
    const G = C.hoja, Gd = C.hojaO, P = '#CDDB9B';
    let s = o.sinSombra ? '' : sombra(0, 2, 36);
    s += agua(mancha(-18, -4, 8, 6, 71, .1), P, { f: 'l' }) + agua(mancha(16, -4, 8, 6, 72, .1), P, { f: 'l' }) + agua('M-30,-12 L-40,-8 L-30,-6Z', P, { f: 'l' });
    s += agua(liso([[24, -14], [34, -26], [46, -30], [54, -22], [50, -12], [38, -8]]), P);
    s += agua(mancha(0, -24, 33, 23, 73, .05), G) + vel(mancha(8, -14, 26, 13, 74, .15), Gd, { o: .5 });
    s += trazo('M-14,-34 L-4,-40 L8,-36 L12,-26 L0,-20 L-12,-24Z', 1.8, Gd, { o: .85 }) + trazo('M-14,-34 L-26,-30 M12,-26 L24,-22 M8,-36 L18,-38 M0,-20 L-2,-10', 1.6, Gd, { o: .7 });
    s += agua('M-34,-14 Q0,-6 34,-14 Q30,-8 0,-6 Q-30,-8 -34,-14Z', C.paja, { f: 'l' });
    const ex = o.sorpresa ? ojo(46, -27, 3) : ojo(46, -27, 2.5);
    s += ex + (o.boca === 'o' ? agua(mancha(52, -20, 2.6, 2.6, 75, .1), '#C9605F', { f: 'l' }) : trazo('M46,-18 Q50,-15 54,-19', 1.6)) + colorete(43, -20, 4);
    return en(x, y, k, s, o.flip, o.rot);
  };
  const monopatin = (x, y, k, o = {}) => en(x, y, k,
    sombra(0, 12, 46) + agua('M-46,-4 Q-50,-9 -42,-8 L42,-8 Q50,-9 46,-4 Q40,2 30,2 L-30,2 Q-40,2 -46,-4Z', C.naranja) + vel('M-40,-4 L40,-4 L36,2 L-36,2Z', C.solO, { o: .4 })
    + agua(mancha(-28, 8, 6, 6, 81, .08), '#6A5B78', { f: 'l' }) + agua(mancha(28, 8, 6, 6, 82, .08), '#6A5B78', { f: 'l' }) + punto(-28, 8, 1.8, PAPEL, .8) + punto(28, 8, 1.8, PAPEL, .8), o.flip, o.rot);
  const conejo = (x, y, k, o = {}) => {
    const B = '#E5D6C2', Bd = carga(B, .8);
    let s = sombra(0, 2, 30);
    if (o.corre) s += pincel('M-14,-10 Q-24,-4 -34,-3', 7, Bd, { f: 'l' }) + pincel('M14,-10 Q24,-4 34,-3', 7, Bd, { f: 'l' });
    else s += agua(mancha(-12, -3, 8, 5, 91, .1), Bd, { f: 'l' }) + agua(mancha(14, -3, 7, 4.5, 92, .1), Bd, { f: 'l' });
    s += agua(mancha(-22, -20, 7, 7, 93, .1), PAPEL, { f: 'l' });
    s += agua(mancha(0, -17, 21, 13, 94, .05), B) + vel(mancha(6, -12, 14, 7, 95, .2), Bd, { o: .45 });
    s += agua('M17,-30 Q11,-56 19,-58 Q26,-52 24,-32Z', B) + vel('M18,-34 Q15,-52 19,-54 Q22,-48 22,-34Z', C.rosa, { o: .7 });
    s += agua('M24,-30 Q26,-54 34,-54 Q38,-46 30,-28Z', B) + vel('M26,-34 Q28,-48 33,-50 Q34,-44 29,-33Z', C.rosa, { o: .7 });
    s += agua(mancha(25, -25, 11, 9.5, 96, .05), B) + agua(mancha(34, -23, 2.8, 2.2, 97, .1), '#D98FA0', { f: 'l' });
    s += ojo(27, -28, 2.3) + colorete(24, -20, 4);
    s += o.boca === 'o' ? agua(mancha(33, -17, 2.8, 3.4, 98, .1), '#C9605F', { f: 'l' }) : o.boca === 'risa' ? agua('M28,-19 Q33,-12 38,-20Z', '#C9605F', { f: 'l' }) : trazo('M30,-18 Q33,-15 36,-18', 1.5);
    s += trazo('M34,-23 L42,-25 M34,-22 L42,-21', 1, LINEA, { o: .5 });
    return en(x, y, k, s, o.flip, o.rot);
  };
  const ardilla = (x, y, k, o = {}) => {
    const B = '#D9A074', Bd = carga(B, .76);
    let s = sombra(0, 2, 22);
    s += agua('M-10,-8 Q-34,-6 -32,-34 Q-30,-52 -14,-50 Q-22,-40 -18,-30 Q-12,-20 -4,-16Z', B) + vel('M-28,-30 Q-26,-46 -16,-48 Q-22,-38 -18,-28Z', Bd, { o: .5 });
    s += agua(mancha(0, -14, 13, 12, 101, .06), B) + agua(mancha(0, -10, 7, 7, 102, .08), C.crema, { f: 'l' });
    s += agua(mancha(12, -28, 8.5, 8, 103, .06), B) + agua('M8,-34 L9,-42 L14,-35Z', Bd, { f: 'l' }) + agua(mancha(19, -26, 2.6, 2.2, 104, .1), '#6A5B78', { f: 'l' }) + ojo(14, -30, 1.9);
    s += o.boca === 'o' ? agua(mancha(17, -22, 2.4, 2.8, 105, .1), '#C9605F', { f: 'l' }) : trazo('M13,-22 Q16,-20 19,-22', 1.4);
    return en(x, y, k, s, o.flip, o.rot);
  };
  const bici = (x, y, k, o = {}) => {
    let s = sombra(0, 4, 40);
    s += trazo(mancha(-26, -16, 17, 17, 111, .03), 3.4, '#6A5B78', { o: .8 }) + trazo(mancha(26, -16, 17, 17, 112, .03), 3.4, '#6A5B78', { o: .8 });
    s += pincel('M-26,-16 L-6,-34 L16,-34 L26,-16 M-6,-34 L2,-16 L-26,-16 M2,-16 L16,-34 M12,-34 L10,-44 L18,-46', 3.4, C.rojoO, { f: 'l' });
    s += trazo('M-10,-37 L-3,-37', 3, '#6A5B78', { o: .8 });
    if (o.jinete) s += agua(mancha(-2, -52, 8, 11, 113, .08), C.azul) + agua(mancha(0, -70, 7.5, 7.5, 114, .06), '#F4CDB4') + agua('M-8,-72 Q-6,-80 2,-79 Q8,-78 8,-70 Q2,-74 -8,-72Z', '#8E6A52', { f: 'l' }) + ojo(3, -70, 1.5) + pincel('M0,-56 Q10,-50 12,-44', 4, '#F4CDB4', { f: 'l' }) + pincel('M-4,-44 Q0,-36 4,-24', 4.4, C.azul, { f: 'l' });
    return en(x, y, k, s, o.flip, o.rot);
  };
  const sol = (x, y, r, rayos = true) => (rayos ? Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5, c = Math.cos(a), s = Math.sin(a); return pincel(`M${f1(x + c * (r + 7))},${f1(y + s * (r + 7))} L${f1(x + c * (r + 15 + (i % 2) * 8))},${f1(y + s * (r + 15 + (i % 2) * 8))}`, 6, i % 2 ? C.sol : C.solO, { f: 'l' }); }).join('') : '')
    + agua(mancha(x, y, r, r * .97, 121, .04), C.sol) + vel(mancha(x + r * .25, y + r * .25, r * .65, r * .55, 122, .2), C.solO, { o: .5 });

  Object.assign(ILUS, {
    // ===== Cuento 5: el pingüino que tenía calor =====
    // Pepe en el zoo, bajo un sol enorme
    cuento5_1: () => svg(VB,
      fondo(C.cielo, C.cieloO) + sol(335, 52, 30)
      + suelo(176, C.paja, C.pajaO)
      + pincel('M-10,154 L410,148', 4.4, C.troncoO, { o: .85 }) + [24, 72, 126, 180, 236, 292, 348, 396].map((x, i) => pincel(`M${x},${176 - (i % 2) * 2} L${x},${142 + (i % 3)}`, 6, C.tronco)).join('')
      + arbol(52, 196, .9, C.hoja, C.hojaO, 3)
      + agua(mancha(120, 228, 52, 13, 7, .08), C.cielo) + vel(mancha(130, 230, 36, 8, 8, .1), C.cieloO, { o: .5 }) + trazo('M96,226 q12,-4 24,0', 1.6, PAPEL, { o: .9 })
      + [[170, 150], [250, 140], [300, 160]].map(([x, y], i) => trazo(`M${x},${y} q6,-8 0,-16 q-6,-8 0,-16`, 2, C.naranja, { o: .55 })).join('')
      + pinguino(238, 236, 1.1, { ojos: 'pena', sudor: true, boca: 'abierta' })
      + hierba(30, 240, 14, C.pajaO) + hierba(370, 244, 12, C.pajaO, -1)),

    // Intenta de todo: sombra, abanicarse, charquito
    cuento5_2: () => svg(VB,
      fondo(C.cielo, C.cieloO) + sol(344, 44, 24)
      + suelo(170, C.paja, C.pajaO)
      + vel('M-10,236 Q60,214 150,226 Q190,240 130,258 L-10,258Z', C.grisO, { o: .4 })
      + arbol(62, 232, 1.15, C.hoja, C.hojaO, 5)
      + agua(mancha(326, 232, 54, 14, 9, .08), C.cielo) + vel(mancha(334, 234, 38, 8, 10, .1), C.cieloO, { o: .5 }) + trazo('M296,230 q12,-4 26,0', 1.6, PAPEL, { o: .9 }) + trazo('M338,236 q10,-3 20,0', 1.4, PAPEL, { o: .8 })
      + [[318, 214], [330, 206], [344, 212]].map(([x, y]) => gota(x, y, .8)).join('')
      + pinguino(196, 238, 1.15, { ojos: 'pena', sudor: true, alaD: 'arriba', alaI: 'fuera' })
      + trazo('M258,112 q10,8 2,20', 2, C.cieloO, { o: .8 }) + trazo('M266,100 q14,12 4,30', 2, C.cieloO, { o: .7 }) + trazo('M146,120 q-10,8 -4,18', 2, C.cieloO, { o: .7 })
      + hierba(180, 250, 12, C.pajaO) + hierba(390, 246, 12, C.pajaO, -1)),

    // El puesto de helados: el de hielo se derrite
    cuento5_3: () => svg(VB,
      fondo(C.cielo, C.cieloO) + sol(46, 48, 24)
      + suelo(176, C.paja, C.pajaO)
      + agua('M-10,222 Q100,212 200,220 Q300,228 410,216 L410,270 L-10,270Z', C.crema, { o: .85 })
      // puesto
      + sombra(290, 238, 76)
      + agua('M210,128 Q212,190 214,226 Q290,232 366,226 Q368,190 370,128Z', C.crema) + vel('M210,198 L370,198 L366,226 Q290,232 214,226Z', C.pajaO, { o: .3 })
      + pincel('M216,96 L214,226 M366,96 L368,226', 5, C.tronco)
      + [0, 1, 2, 3, 4].map(i => agua(`M${204 + i * 33},92 L${238 + i * 33},92 Q${240 + i * 33},118 ${234 + i * 33},122 Q${221 + i * 33},132 ${206 + i * 33},122Z`, i % 2 ? PAPEL : C.rojo)).join('')
      + agua('M200,96 Q290,70 380,96 Q290,86 200,96Z', C.rojoO)
      + agua('M268,70 L290,24 L312,70Z', C.naranja) + agua(mancha(290, 22, 16, 13, 12, .1), C.rosa) + agua(mancha(290, 8, 11, 10, 13, .1), C.crema) + punto(290, -1, 4, C.rojoO, .95)
      + agua(mancha(250, 160, 16, 14, 14, .1), C.cieloO) + agua(mancha(330, 160, 16, 14, 15, .1), C.rosa) + trazo('M232,172 L268,172 M312,172 L348,172', 2, C.tronco, { o: .6 })
      + agua(mancha(236, 238, 15, 15, 16, .04), C.troncoO) + agua(mancha(346, 238, 15, 15, 17, .04), C.troncoO)
      // el helado de hielo, goteando
      + pinguino(112, 240, 1.15, { ojos: 'abiertos', alaD: 'fuera', boca: 'abierta' })
      + agua('M162,168 L176,206 L190,168Z', C.tierra) + agua(liso([[160, 168], [158, 154], [170, 144], [186, 146], [194, 158], [190, 170], [176, 172]]), '#BFE4F3') + vel(mancha(184, 160, 8, 6, 18, .1), C.cieloO, { o: .5 }) + punto(168, 152, 3, PAPEL, .95)
      + pincel('M160,170 q-4,10 -2,22', 4, '#BFE4F3', { f: 'l' }) + pincel('M192,170 q4,12 2,28', 4, '#BFE4F3', { f: 'l' }) + gota(176, 212, 1.1, '#BFE4F3') + gota(170, 224, .9, '#BFE4F3')
      + agua(mancha(176, 240, 26, 5, 19, .1), '#BFE4F3', { o: .8 })),

    // La niña lo lleva al cuarto de las neveras, donde guardan el pescado
    cuento5_4: () => svg(VB,
      fondo(lava(C.cielo, .35), C.cieloO)
      + agua('M-20,210 Q100,200 200,206 Q320,212 420,200 L420,280 L-20,280Z', '#D8E8F2')
      + vel('M-20,236 Q200,224 420,234 L420,280 L-20,280Z', C.cieloO, { o: .35 })
      // estantes con pescado
      + pincel('M20,86 L290,86', 6, C.troncoO, { o: .8 }) + pincel('M20,150 L290,150', 6, C.troncoO, { o: .8 })
      + [[48, 74, C.azul], [96, 76, '#B7B3D6'], [150, 74, C.azul], [210, 76, '#B7B3D6'], [262, 74, C.azul], [70, 138, '#B7B3D6'], [128, 140, C.azul], [196, 138, '#B7B3D6'], [250, 140, C.azul]].map(([x, y, c], i) => en(x, y, 1, agua(mancha(0, 0, 15, 6.5, i + 131, .08), c) + agua('M12,0 L24,-7 L22,0 L24,7Z', c, { f: 'l' }) + punto(-8, -1, 1.8) + vel('M-8,2 Q0,6 8,2 L6,5 Q0,8 -6,5Z', C.cieloO, { o: .6 }))).join('')
      + [30, 70, 120, 180, 240, 280].map((x, i) => agua(`M${x},89 L${x + 6},89 L${x + 3},${99 + (i % 3) * 3}Z`, PAPEL, { f: 'l' })).join('')
      + agua('M322,34 L322,226 L368,238 L368,24Z', C.gris) + vel('M340,30 L368,24 L368,238 L340,230Z', C.grisO, { o: .4 }) + pincel('M326,36 L326,224', 4, C.grisO, { o: .8 }) + agua(mancha(356, 140, 3, 6, 141, .1), '#6A5B78', { f: 'l' })
      + nina5()
      + pinguino(214, 238, 1.12, { ojos: 'cerrados', alaI: 'fuera', boca: 'abierta' })
      + copo(40, 40, 6) + copo(300, 60, 5) + copo(170, 40, 7) + copo(310, 190, 5) + copo(100, 112, 5) + copo(358, 80, 6)
      + `<g opacity=".7">${gotas(256, 170, 30, 7, PAPEL, 5, 2)}</g>`),

    // Pepe duerme la siesta entre cubitos de hielo
    cuento5_5: () => svg(VB,
      fondo(lava(C.cielo, .3), C.cieloO)
      + agua('M-20,196 Q100,184 200,192 Q320,200 420,186 L420,280 L-20,280Z', '#D8E8F2')
      + [[70, 190, 26, -8], [118, 176, 22, 10], [300, 180, 24, 6], [340, 196, 28, -10]].map(([x, y, r, a], i) => cubo(x, y, r, a, i + 151)).join('')
      + pinguino(206, 232, 1.2, { gafas: true, rot: -82, alaD: 'fuera' })
      + [[158, 244, 26, 6], [214, 250, 24, -8], [262, 244, 26, 8], [300, 236, 22, -6], [110, 238, 24, -6]].map(([x, y, r, a], i) => cubo(x, y, r, a, i + 161)).join('')
      + trazo('M284,70 h12 l-12,14 h12', 2.6, C.violeta) + trazo('M306,46 h9 l-9,11 h9', 2.2, C.violeta) + trazo('M324,26 h7 l-7,8 h7', 1.9, C.violeta)
      + copo(60, 60, 7) + copo(150, 36, 6) + copo(354, 120, 7) + copo(36, 130, 5)),

    // ===== Cuento 6: la nube que llovía caramelos =====
    cuento6_1: () => svg(VB,
      fondo(C.cielo, C.cieloO)
      + nubeG(70, 66, 1, 3) + nubeG(338, 60, 1, 5)
      + [[30, 96], [52, 100], [74, 94], [96, 100], [318, 92], [342, 98], [364, 90], [386, 98]].map(([x, y], i) => pincel(`M${x},${y} l-5,${24 + (i % 3) * 8}`, 2.8, C.cieloO, { f: 'l', o: .85 })).join('')
      + [[40, 140], [86, 150], [330, 146], [372, 140]].map(([x, y]) => gota(x, y, .9)).join('')
      + agua('M-20,214 Q100,176 220,206 Q320,230 420,196 L420,280 L-20,280Z', C.prado) + agua('M-20,246 Q150,224 420,244 L420,280 L-20,280Z', C.hoja)
      + casa(300, 224, .8, C.rojo) + casa(66, 232, .7, C.paja) + hierba(200, 246, 12, C.hojaO)
      + nubeP(200, 124, 1.15, { cara: 'triste' }) + trazo('M190,172 q-4,6 0,10', 1.4, C.cieloO, { o: .5 })),

    // La nube aprieta con todas sus fuerzas y caen caramelos
    cuento6_2: () => svg(VB,
      fondo(lava(C.rosa, .5), C.violeta)
      + nubeP(200, 76, 1.5, { cara: 'esfuerzo', sombra: C.rosaO })
      + gota(106, 56, .9) + gota(296, 50, .9)
      + trazo('M110,84 l-18,-6 M296,84 l18,-6 M120,40 l-10,-14 M284,40 l10,-14', 2, C.rosaO, { o: .6 })
      + [[150, 140, 'env', 0], [190, 168, 'pir', 14], [232, 138, 'env', 30], [270, 176, 'bol', 0], [128, 188, 'bol', 0], [208, 206, 'env', -20], [312, 144, 'pir', -12], [96, 150, 'pir', 8], [166, 232, 'pir', 0], [258, 222, 'env', 14], [340, 214, 'bol', 0], [60, 220, 'env', -12], [30, 120, 'bol', 0], [370, 100, 'bol', 0]].map(([x, y, t, r], i) => dulce(x, y, t, DC[i % DC.length], r, 1.25)).join('')
      + trazo('M150,106 l0,12 M232,104 l0,12 M190,138 l0,12', 2, C.rosaO, { o: .4 })),

    // Los niños salen con los paraguas al revés
    cuento6_3: () => svg(VB,
      fondo(C.cielo, C.cieloO)
      + nubeP(200, 56, 1.1, { cara: 'feliz' })
      + [[120, 100, 'env', 20], [160, 124, 'bol', 0], [210, 110, 'pir', -10], [262, 128, 'env', -20], [296, 102, 'bol', 0], [80, 130, 'pir', 10], [340, 120, 'env', 14], [188, 150, 'bol', 0]].map(([x, y, t, r], i) => dulce(x, y, t, DC[(i + 2) % DC.length], r, 1.1)).join('')
      + agua('M-20,200 Q100,172 220,196 Q320,214 420,184 L420,280 L-20,280Z', C.prado) + agua('M-20,236 Q150,214 420,232 L420,280 L-20,280Z', C.hoja)
      + casa(48, 200, .6, C.paja) + casa(356, 196, .6, C.rojo)
      + [[90, 'rosa', C.rojo, '#7A4B2E', true], [170, 'azul', C.azul, '#2F2F3F', false], [250, 'amarillo', C.sol, '#B0703C', true], [322, 'verde', C.hoja, '#7A4B2E', false]].map(([x, , ropa, pelo, v], i) => nino(x, 250 - (i % 2) * 6, 1.45, { brazos: 'arriba', ropa, pelo, vestido: v, trenzas: v, boca: 'o' }) + paraguas(x, 250 - (i % 2) * 6 - 90, 1.45, [C.violeta, C.naranja, C.cieloO, C.rosa][i])).join('')),

    // La nube se preocupa por los dientes
    cuento6_4: () => svg(VB,
      fondo(lava(C.violeta, .55), C.violeta)
      + nubeP(120, 160, 1.4, { cara: 'preocupada' }) + gota(66, 112, .9)
      + agua(mancha(206, 96, 4, 4, 171, .1), PAPEL, { f: 'l' }) + agua(mancha(232, 70, 6, 6, 172, .1), PAPEL, { f: 'l' })
      + agua(liso([[220, 36], [250, 16], [300, 16], [328, 34], [352, 40], [360, 70], [340, 100], [300, 112], [250, 112], [220, 100], [206, 70]]), PAPEL) + vel(mancha(290, 94, 60, 12, 173, .2), C.cieloO, { o: .3 })
      + agua('M262,44 Q250,40 246,58 Q246,78 254,96 Q258,84 266,84 Q272,96 276,78 Q290,70 288,52 Q276,38 262,44Z', PAPEL) + trazo('M262,44 Q250,40 246,58 Q246,78 254,96 Q258,84 266,84 Q272,96 276,78 Q290,70 288,52', 1.8, C.grisO, { o: .8 }) + agua(mancha(268, 58, 4.2, 4.2, 174, .1), '#8E6A52', { f: 'l' })
      + dulce(318, 64, 'env', C.rojo, 20, 1.1) + dulce(332, 88, 'bol', C.sol, 0, 1.1)
      // calendario: solo el domingo tiene sol
      + agua('M236,150 L384,150 L384,226 L236,226Z', PAPEL) + agua('M236,150 L384,150 L384,168 L236,168Z', C.rojo)
      + trazo('M258,168 L258,226 M280,168 L280,226 M302,168 L302,226 M324,168 L324,226 M346,168 L346,226 M368,168 L368,226 M236,196 L384,196', 1.4, C.grisO, { o: .6 })
      + [0, 1, 2, 3, 4, 5].map(i => punto(247 + i * 22, 182, 2.4, C.grisO, .7) + punto(247 + i * 22, 211, 2.4, C.grisO, .7)).join('') + punto(247 + 6 * 22 - 0, 182, 0, C.grisO)
      + agua(mancha(373, 211, 8, 8, 175, .08), C.sol) + trazo('M373,196 v-5 M373,226 v5', 1.4, C.solO)
      + trazo('M150,98 Q200,106 210,100', 2, C.violeta, { o: .4 }) ),

    // El resto de la semana llueve agua; el domingo, caramelos
    cuento6_5: () => svg(VB,
      fondo(C.cielo, C.cieloO) + sol(364, 40, 20, true)
      + ['#E98E86', '#F4B77E', '#F6D978', '#A7CF8E', '#9CCBEA', '#9CB8EA', '#B9A2DE'].map((c, i) => { const r = 150 - i * 11; return pincel(`M${200 - r},218 A${r},${r} 0 0 1 ${200 + r},218`, 12, c, { o: .88 }); }).join('')
      + agua('M-20,208 Q100,184 220,206 Q320,220 420,196 L420,280 L-20,280Z', C.prado) + agua('M-20,240 Q150,224 420,240 L420,280 L-20,280Z', C.hoja)
      + nubeP(200, 80, 1.2, { cara: 'feliz' })
      + [[150, 112], [172, 124], [194, 114], [216, 126], [238, 114], [258, 126]].map(([x, y], i) => pincel(`M${x},${y} l-4,${22 + (i % 3) * 8}`, 2.8, C.cieloO, { f: 'l', o: .9 })).join('')
      + [[60, 248, C.rojo], [110, 252, C.sol], [160, 246, C.violeta], [250, 250, C.rosa], [300, 246, C.rojo], [350, 252, C.sol]].map(([x, y, c]) => trazo(`M${x},${y + 8} Q${x + 2},${y - 2} ${x},${y - 10}`, 2.2, C.hojaO) + flor(x, y - 12, c, 8)).join('')
      + gotas(200, 160, 70, 10, C.cieloO, 6, 2)),

    // ===== Cuento 7: el robot que aprendió a bailar =====
    cuento7_1: () => svg(VB,
      fondo(lava(C.violeta, .6), C.violeta)
      + agua('M30,30 L120,30 L120,104 L30,104Z', C.cielo) + trazo('M75,30 V104 M30,67 H120', 2, C.grisO, { o: .6 }) + agua(mancha(98, 52, 9, 9, 181, .1), C.sol, { f: 'l' })
      + agua('M-20,186 Q200,176 420,186 L420,280 L-20,280Z', lava(C.grisO, .45))
      + agua('M-10,206 Q100,200 200,204 Q300,208 410,202 L410,224 Q300,230 200,226 Q100,222 -10,228Z', C.grisO) + vel('M-10,216 Q200,212 410,214 L410,224 Q200,230 -10,228Z', '#6A5B78', { o: .3 })
      + [30, 90, 150, 210, 270, 330, 390].map((x, i) => agua(mancha(x, 227, 6, 4, i + 191, .1), C.gris, { f: 'l' })).join('')
      + piezaJuguete(50, 196) + tornillo(270, 204) + cajaJ(340, 196, 1)
      + robot(186, 206, 1.15, { boca: 'plana', brazos: [[-30, -34], [34, -30]] })
      + agua(mancha(244, 164, 4, 9, 192, .1), C.gris, { f: 'l' }) + trazo('M244,152 L244,176', 1.8, C.grisO)),

    // Suena la radio y a Bip se le mueve un pie
    cuento7_2: () => svg(VB,
      fondo(lava(C.violeta, .6), C.violeta)
      + agua('M-20,196 Q200,186 420,196 L420,280 L-20,280Z', lava(C.grisO, .45))
      + pincel('M236,150 L396,150', 7, C.tronco) + pincel('M252,152 L248,176 M380,152 L384,176', 4, C.troncoO, { o: .8 })
      + agua('M268,96 Q266,128 270,148 L370,148 Q374,126 372,96 Q320,90 268,96Z', C.rojo) + vel('M330,96 L372,96 Q374,126 370,148 L336,148Z', C.rojoO, { o: .4 })
      + agua(mancha(296, 124, 17, 17, 201, .05), C.crema) + trazo(mancha(296, 124, 17, 17, 202, .05), 1.4, C.pajaO, { o: .7 }) + trazo('M284,116 H308 M283,124 H309 M284,132 H308', 1.4, C.pajaO, { o: .6 })
      + agua(mancha(344, 116, 7, 7, 203, .1), C.crema, { f: 'l' }) + punto(344, 116, 2, C.rojoO) + agua(mancha(344, 136, 7, 7, 204, .1), C.crema, { f: 'l' })
      + trazo('M362,98 L392,58', 2, C.troncoO, { o: .8 })
      + nota(244, 74, C.violeta, 1.3) + nota(228, 40, C.rosaO, 1.1) + nota(268, 50, C.azul, 1.2) + nota(210, 100, C.sol, 1)
      + robot(122, 232, 1.2, { pie: 'izq', boca: 'abierta', brazos: [[-34, -34], [34, -26]] })
      + trazo('M52,222 l-8,-4 M52,232 l-10,0 M58,212 l-6,-8', 2, C.naranja, { o: .8 })),

    // ¡Bip está bailando! Hasta la cabeza da una vuelta entera
    cuento7_3: () => svg(VB,
      fondo(lava(C.rosa, .55), C.violeta)
      + agua('M-20,208 Q200,198 420,208 L420,280 L-20,280Z', lava(C.grisO, .4))
      + robot(200, 232, 1.5, { rot: -5, pie: 'der', boca: 'abierta', brazos: [[-46, -88], [46, -66]], giro: true, cab: 14 })
      + nota(60, 80, C.violeta, 1.4) + nota(96, 134, C.rosaO, 1.1) + nota(330, 70, C.azul, 1.4) + nota(352, 128, C.sol, 1.1) + nota(40, 186, C.sol, 1) + nota(364, 196, C.violeta, 1)
      + [[100, 50, C.sol], [300, 40, C.rojo], [60, 150, C.azul], [346, 160, C.hoja], [130, 110, C.rojo]].map(([x, y, c], i) => agua(mancha(x, y, 3.4, 2.2, i + 211, .1), c, { f: 'l', t: `rotate(${i * 40} ${x} ${y})` })).join('')),

    // Los juguetes se despiertan y bailan con él
    cuento7_4: () => svg(VB,
      fondo(lava(C.violeta, .6), C.cielo)
      + agua('M-20,206 Q200,196 420,206 L420,280 L-20,280Z', lava(C.grisO, .45))
      + trazo('M-10,26 Q100,60 200,34 Q300,10 410,44', 2, C.grisO, { o: .7 }) + [[30, 40, C.rojo], [76, 52, C.sol], [124, 54, C.azul], [172, 44, C.hoja], [232, 28, C.rosa], [286, 22, C.violeta], [346, 32, C.rojo]].map(([x, y, c], i) => agua(`M${x - 9},${y} L${x + 9},${y} L${x},${y + 18}Z`, c, { f: 'l' })).join('')
      + osito(76, 236, 1.5, { baila: true }) + pato(318, 240, 1.7, { flip: true }) + pelota(150, 244, 1.15, { rot: -10 }) + pelota(264, 244, 1, { rot: 14 })
      + robot(206, 238, 1.3, { pie: 'izq', boca: 'abierta', brazos: [[-42, -78], [42, -74]], cab: -8 })
      + nota(30, 110, C.violeta, 1.2) + nota(116, 96, C.rosaO, 1) + nota(300, 100, C.azul, 1.2) + nota(366, 130, C.sol, 1)
      + [[108, 156], [276, 150]].map(([x, y], i) => trazo(`M${x},${y} q8,-6 16,0`, 1.8, C.naranja, { o: .7 })).join('')),

    // Cada viernes hay baile en la fábrica
    cuento7_5: () => svg(VB,
      fondo(lava(C.sol, .55), C.rosa)
      + agua('M-20,208 Q200,198 420,208 L420,280 L-20,280Z', lava(C.grisO, .45))
      + agua('M312,98 L312,218 L392,218 L392,98 Q352,70 312,98Z', C.paja) + agua('M322,108 L322,218 L382,218 L382,108 Q352,88 322,108Z', lava(C.cielo, .4))
      + nino(340, 220, 1.25, { brazos: 'arriba', ropa: C.rosa, vestido: true, trenzas: true, boca: 'o' }) + nino(368, 222, 1.1, { brazos: 'arriba', ropa: C.azul, pelo: '#2F2F3F' })
      + trazo('M-10,40 Q100,76 200,48 Q300,22 410,56', 2, C.grisO, { o: .7 }) + [[40, 50, C.rojo], [90, 66, C.sol], [150, 64, C.azul], [210, 46, C.hoja], [270, 34, C.rosa], [330, 36, C.violeta]].map(([x, y, c]) => agua(`M${x - 9},${y} L${x + 9},${y} L${x},${y + 18}Z`, c, { f: 'l' })).join('')
      + osito(72, 238, 1.4, { baila: true }) + pato(138, 242, 1.4) + pelota(268, 244, 1.05)
      + robot(204, 238, 1.3, { pie: 'der', boca: 'sonrisa', brazos: [[-40, -74], [42, -80]], rot: 4 })
      + corazon(176, 70, 8) + corazon(250, 56, 6, C.rosaO) + corazon(224, 36, 5) + nota(120, 104, C.violeta, 1.2) + nota(294, 90, C.azul, 1.1) + nota(40, 130, C.sol, 1)),

    // ===== Cuento 8: la tortuga más rápida del mundo =====
    // Tula, lentísima, y el conejo ya lejos
    cuento8_1: () => svg(VB,
      fondo(C.cielo, C.cieloO) + nubeD(100, 50, .7, 2) + nubeD(300, 40, .6, 5)
      + agua('M-20,150 Q140,120 300,146 Q380,158 420,140 L420,280 L-20,280Z', C.prado) + agua('M-20,214 Q200,194 420,208 L420,280 L-20,280Z', C.hoja)
      + agua('M-20,222 Q200,208 420,220 L420,252 Q200,240 -20,254Z', C.tierra, { o: .85 })
      + arbol(340, 170, .7, C.hoja, C.hojaO, 7) + arbol(26, 168, .6, C.hoja, C.hojaO, 9)
      + pincel('M296,208 L296,240', 3, C.troncoO) + agua('M296,208 L330,214 L296,222Z', C.rojo)
      + tortuga(96, 244, 1.2, { boca: 'sonrisa' })
      + conejo(270, 232, 1.2, { boca: 'risa', corre: true })
      + trazo('M214,226 l-14,2 M216,236 l-18,-2', 2, C.tronco, { o: .6 }) + agua(mancha(218, 238, 8, 5, 221, .2), C.tierra, { o: .5, f: 'l' }) + agua(mancha(204, 240, 6, 4, 222, .2), C.tierra, { o: .5, f: 'l' })
      + gotas(96, 200, 20, 3, C.cieloO, 4, 1.6) + hierba(168, 252, 12, C.hojaO)),

    // Tula se sube al monopatín y sale disparada
    cuento8_2: () => svg(VB,
      fondo(C.cielo, C.cieloO) + nubeD(300, 50, .7, 3)
      + agua('M-20,150 Q140,120 300,146 Q380,158 420,140 L420,280 L-20,280Z', C.prado) + agua('M-20,214 Q200,194 420,208 L420,280 L-20,280Z', C.hoja)
      + agua('M-20,224 Q200,210 420,222 L420,254 Q200,242 -20,256Z', C.tierra, { o: .85 })
      + arbol(40, 172, .7, C.hoja, C.hojaO, 11) + arbol(350, 168, .75, C.hoja, C.hojaO, 13)
      + lineasVel(20, 170, [196, 212, 228, 244], C.grisO)
      + agua(mancha(70, 244, 10, 6, 231, .2), C.tierra, { o: .6, f: 'l' }) + agua(mancha(48, 248, 7, 4, 232, .2), C.tierra, { o: .6, f: 'l' })
      + monopatin(230, 244, 1.5) + tortuga(230, 232, 1.5, { sorpresa: true, boca: 'o', sinSombra: true, rot: -4 })
      + trazo('M170,170 l-14,0 M174,188 l-20,0', 2, C.cieloO, { o: .6 })),

    // ¡Zuuum! Adelanta al conejo, a la ardilla y a una bicicleta
    cuento8_3: () => svg(VB,
      fondo(C.cielo, C.cieloO) + nubeD(120, 46, .6, 4) + nubeD(320, 40, .6, 6)
      + agua('M-20,148 Q140,118 300,142 Q380,154 420,138 L420,280 L-20,280Z', C.prado) + agua('M-20,206 Q200,188 420,202 L420,280 L-20,280Z', C.hoja)
      + agua('M-20,214 Q200,200 420,212 L420,254 Q200,244 -20,258Z', C.tierra, { o: .85 })
      + arbol(374, 164, .6, C.hoja, C.hojaO, 15)
      + bici(70, 226, .85, { jinete: true }) + ardilla(142, 236, 1.2, { boca: 'o' }) + conejo(228, 246, 1.05, { boca: 'o', corre: true })
      + lineasVel(100, 300, [196, 206, 218, 230], C.grisO)
      + monopatin(330, 244, 1.4) + tortuga(330, 232, 1.4, { boca: 'sonrisa', sinSombra: true, rot: -3 })
      + trazo('M276,206 l-30,0 M280,224 l-38,0 M284,238 l-30,0', 2.2, C.cieloO, { o: .6 })),

    // Gana la gran carrera del bosque; lo mejor es el viento en la cara
    cuento8_4: () => svg(VB,
      fondo(C.cielo, C.cieloO) + sol(60, 50, 22, false)
      + agua('M-20,148 Q140,118 300,142 Q380,154 420,138 L420,280 L-20,280Z', C.prado) + agua('M-20,208 Q200,190 420,204 L420,280 L-20,280Z', C.hoja)
      + agua('M-20,216 Q200,202 420,214 L420,254 Q200,244 -20,258Z', C.tierra, { o: .85 })
      + trazo('M-10,34 Q100,70 200,44 Q300,20 410,54', 2, C.grisO, { o: .7 }) + [[40, 50, C.rojo], [96, 64, C.sol], [160, 62, C.azul], [226, 44, C.hoja], [290, 34, C.rosa], [350, 40, C.violeta]].map(([x, y, c]) => agua(`M${x - 9},${y} L${x + 9},${y} L${x},${y + 18}Z`, c, { f: 'l' })).join('')
      // cinta de meta rota
      + pincel('M246,96 L246,250', 5, C.troncoO) + pincel('M326,96 L326,250', 5, C.troncoO)
      + pincel('M246,112 Q226,126 214,150', 6, C.rojo, { f: 'l' }) + pincel('M326,112 Q346,124 360,148', 6, C.rojo, { f: 'l' })
      + trazo('M300,122 q10,6 4,16', 2, C.rojoO, { o: .7 })
      + lineasVel(30, 180, [208, 222, 236], C.grisO) + trazo('M120,170 q16,-8 34,0 q10,6 22,-2 M140,150 q14,-6 28,0 M110,190 q18,-6 40,2', 2.2, C.cieloO, { o: .7 })
      + monopatin(190, 244, 1.5) + tortuga(190, 232, 1.5, { boca: 'sonrisa', sinSombra: true, rot: -3 })
      + agua('M326,246 L384,246 L384,214 L326,214Z', C.paja) + vel('M360,214 L384,214 L384,246 L360,246Z', C.pajaO, { o: .4 })
      + agua('M342,214 Q338,184 350,174 L366,174 Q378,184 372,214Z', C.sol) + vel('M360,176 L366,174 Q378,184 372,214 L362,214Z', C.solO, { o: .5 }) + trazo('M342,184 Q330,184 332,196 Q336,204 342,200 M372,184 Q384,184 382,196 Q378,204 372,200', 2.4, C.solO) + agua('M352,214 L362,214 L360,222 L354,222Z', C.solO, { f: 'l' }) + punto(354, 188, 2.4, PAPEL, .9)),

    // Tula y el conejo, juntos en el mismo monopatín
    cuento8_5: () => svg(VB,
      fondo(C.cielo, C.cieloO) + nubeD(90, 50, .6, 7) + nubeD(320, 44, .6, 8)
      + agua('M-20,148 Q140,118 300,142 Q380,154 420,138 L420,280 L-20,280Z', C.prado) + agua('M-20,208 Q200,190 420,204 L420,280 L-20,280Z', C.hoja)
      + agua('M-20,216 Q200,202 420,214 L420,254 Q200,244 -20,258Z', C.tierra, { o: .85 })
      + arbol(40, 168, .7, C.hoja, C.hojaO, 17) + arbol(362, 164, .65, C.hoja, C.hojaO, 19)
      + lineasVel(10, 130, [200, 214, 228, 242], C.grisO)
      + monopatin(214, 246, 1.9) + tortuga(180, 233, 1.15, { boca: 'sonrisa', sinSombra: true }) + conejo(258, 233, 1.1, { boca: 'risa', sinSombra: true })
      + corazon(214, 108, 8) + corazon(256, 90, 5, C.rosaO) + trazo('M310,190 l-20,0 M316,208 l-26,0', 2.2, C.cieloO, { o: .6 })),
  });

  // ---------- piezas sueltas usadas por varias escenas ----------
  function cubo(x, y, r, a, s) {
    return `<g transform="translate(${x} ${y}) rotate(${a})">` + agua(liso([[-r, -r + 3], [-r + 4, -r - 2], [r - 3, -r], [r + 1, -r + 6], [r, r - 4], [r - 4, r + 1], [-r + 3, r], [-r - 1, r - 5]]), '#BFE4F3')
      + vel(mancha(r * .3, r * .3, r * .6, r * .5, s, .15), C.cieloO, { o: .5 }) + agua(mancha(-r * .35, -r * .35, r * .28, r * .18, s + 1, .15), PAPEL, { f: 'l' }) + trazo(`M${-r * .1},${r * .5} L${r * .4},${r * .1}`, 1.4, PAPEL, { o: .9 }) + `</g>`;
  }
  function nina5() {
    return nino(116, 238, 1.5, { brazos: 'mano', ropa: C.rosa, vestido: true, trenzas: true, pelo: '#7A4B2E' });
  }
  function casa(x, y, k, c) {
    return en(x, y, k, agua('M-24,0 L-24,-30 Q0,-36 24,-30 L24,0Z', C.crema) + agua('M-30,-28 Q0,-62 30,-28 Q0,-36 -30,-28Z', c) + vel('M0,-50 L30,-28 Q10,-34 0,-34Z', carga(c, .8), { o: .4 }) + agua('M-6,0 L-6,-14 Q0,-20 6,-14 L6,0Z', C.tronco) + agua(mancha(14, -18, 4.5, 4.5, 7, .08), C.cielo, { f: 'l' }));
  }
  function paraguas(x, y, k, c) {
    return en(x, y, k, agua('M-20,-8 Q-17,10 0,12 Q17,10 20,-8 Q0,-2 -20,-8Z', c) + vel('M2,-4 Q18,-2 20,-8 Q17,10 4,12Z', carga(c, .8), { o: .4 }) + trazo('M-20,-8 Q0,-2 20,-8', 1.6, carga(c, .8), { o: .7 }));
  }
  function piezaJuguete(x, y) {
    return agua(`M${x - 18},${y} L${x - 18},${y - 20} L${x + 18},${y - 20} L${x + 18},${y}Z`, C.azul) + agua(mancha(x - 8, y - 26, 5, 5, 3, .1), C.azul, { f: 'l' }) + agua(mancha(x + 8, y - 26, 5, 5, 4, .1), C.azul, { f: 'l' }) + vel(`M${x + 4},${y - 20} L${x + 18},${y - 20} L${x + 18},${y}L${x + 4},${y}Z`, carga(C.azul, .8), { o: .4 });
  }
  function tornillo(x, y) {
    return agua(mancha(x, y - 14, 7, 5, 6, .1), C.gris, { f: 'l' }) + pincel(`M${x},${y - 12} L${x},${y}`, 4.4, C.grisO, { f: 'l' }) + trazo(`M${x - 2},${y - 8} l4,-2 M${x - 2},${y - 4} l4,-2`, 1, PAPEL, { o: .9 });
  }
  function cajaJ(x, y, k) {
    return en(x, y, k, agua('M-22,0 L-22,-30 Q0,-34 22,-30 L22,0Z', C.tierra) + vel('M4,-32 L22,-30 L22,0 L4,0Z', C.troncoO, { o: .35 }) + trazo('M-22,-22 Q0,-18 22,-22', 1.6, C.troncoO, { o: .7 }) + trazo('M0,-32 L0,-20', 2.4, C.pajaO));
  }
})();
