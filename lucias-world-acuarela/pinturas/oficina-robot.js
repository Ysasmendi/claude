// Pinturas: oficina-robot
(() => {
  const { agua, vel, trazo, pincel, punto, gotas, mancha, liso, pig, carga, lava, svg, C, ojo, sonrisa, colorete, hierba, flor, nubeD, LINEA, PAPEL, azar, f1 } = AQ;
  // rectángulo de agua: esquinas redondeadas y lados que bailan un poco
  const rect = (x, y, w, h, s = 1, j = 1.4) => { const r = azar(s * 7 + 3), q = () => (r() - .5) * 2 * j, k = Math.min(w, h) * .2 + 1;
    return liso([[x + k, y + q()], [x + w - k, y + q()], [x + w + q(), y + k], [x + w + q(), y + h - k], [x + w - k, y + h + q()], [x + k, y + h + q()], [x + q(), y + h - k], [x + q(), y + k]]); };
  const estrella = (x, y, r, c, rot = 0) => { const P = []; for (let i = 0; i < 10; i++) { const a = rot + i * Math.PI / 5 - Math.PI / 2, k = i % 2 ? .45 : 1; P.push(`${f1(x + Math.cos(a) * r * k)},${f1(y + Math.sin(a) * r * k)}`); } return agua('M' + P.join('L') + 'Z', c, { f: 'l' }); };
  const suelo = (x, y, rx) => vel(mancha(x, y, rx, 9, x + rx, .1), C.grisO, { o: .35 });
  const corazon = (cx, cy, s, rot = 0) => liso([[0, .92], [-.62, .3], [-1, -.2], [-.72, -.78], [-.26, -.8], [0, -.42], [.26, -.8], [.72, -.78], [1, -.2], [.62, .3]].map(([x, y]) => { const c = Math.cos(rot), n = Math.sin(rot); return [cx + (x * c - y * n) * s, cy + (x * n + y * c) * s]; }));
  const T = {
    madera: pig('#C98A4B'), maderaC: '#D9A66A', maderaO: carga(pig('#C98A4B'), .8), azulO: carga(C.azul, .8),
    verde: '#A7CF8E', turq: pig('#2EC4B6'), turqO: carga(pig('#2EC4B6'), .85), marron: pig('#8B5A2B'), marronO: carga(pig('#8B5A2B'), .85),
    morado: pig('#8E4EE0'), moradoO: carga(pig('#8E4EE0'), .85), cuero: pig('#B5733A'),
    luz: lava(C.gris, .55), tinta: '#4A3E58', tecla: lava(C.grisO, .3), teal: pig('#2EC4B6'), rojoV: '#C9605F',
  };
  const salto = ' stroke-dasharray="4 5"';

  // Unicornio de perfil (caja 200); k = escala, ox/oy = desplazamiento
  const unicornio = (k, ox, oy) => {
    const S = pts => pts.map(([x, y]) => [x * k + ox, y * k + oy]), K = (pts, c, op) => agua(liso(S(pts)), c, op), t = (x, y) => `${f1(x * k + ox)},${f1(y * k + oy)}`;
    return K([[84, 50], [52, 60], [38, 94], [42, 134], [56, 168], [66, 132], [72, 100], [88, 76]], C.azul)
      + K([[90, 62], [62, 82], [54, 122], [64, 172], [82, 138], [88, 106], [100, 84]], C.violeta)
      + K([[90, 56], [112, 48], [138, 56], [160, 72], [174, 92], [178, 114], [170, 132], [148, 140], [132, 150], [122, 172], [104, 188], [70, 192], [66, 150], [72, 108], [78, 76]], PAPEL)
      + vel(liso(S([[118, 120], [150, 100], [178, 114], [170, 132], [148, 140], [132, 150], [122, 172], [104, 188], [112, 150]])), C.grisO, { o: .25 })
      + trazo(`M${t(100, 100)} Q${t(108, 134)} ${t(140, 142)}`, 1.6 * Math.max(.6, k), C.grisO, { o: .5 })
      + K([[86, 60], [72, 88], [74, 128], [86, 160], [98, 142], [94, 112], [100, 82]], C.rosa) + K([[80, 96], [70, 118], [76, 150], [84, 128]], C.violeta, { o: .85 })
      + vel(liso(S([[150, 120], [174, 112], [176, 126], [164, 138], [150, 134]])), C.rosa, { o: .7 })
      + K([[96, 56], [112, 40], [134, 46], [128, 58], [118, 72], [110, 90], [98, 78]], C.rosa)
      + K([[98, 54], [102, 22], [118, 48]], PAPEL) + vel(liso(S([[103, 46], [105, 32], [111, 46]])), C.rosa, { o: .85 })
      + K([[120, 50], [137, 2], [148, 56]], C.sol) + trazo(`M${t(124, 40)} L${t(142, 34)} M${t(127, 28)} L${t(141, 22)} M${t(131, 16)} L${t(139, 13)}`, 1.8 * Math.max(.6, k), C.solO, { o: .8 })
      + ojo(140 * k + ox, 90 * k + oy, 5.2 * k + .8) + trazo(`M${t(131, 82)} Q${t(138, 76)} ${t(147, 80)}`, 2 * Math.max(.6, k), LINEA, { o: .8 })
      + punto(172 * k + ox, 112 * k + oy, 2.6 * k + .5, '#B5647F', .9) + colorete(150 * k + ox, 114 * k + oy, 9 * k + 1)
      + trazo(`M${t(166, 134)} Q${t(158, 140)} ${t(150, 134)}`, 1.8 * Math.max(.6, k));
  };

  // ---------- Pieza del robot: ayudantes ----------
  const CO = pig('#FF6B5A'), COo = carga(CO, .82), TEAL = pig('#17A9AE'), TEALo = carga(TEAL, .84), AMA = C.sol, AMAo = C.solO, FG = '#2F6B4A', GLv = '#9BDDA4';
  const pill = (x, y) => agua(rect(x - 6.5, y - 10, 13, 20, x + y, .6), FG, { f: 'l' }) + punto(x - 2, y - 5, 1.9, PAPEL, .85);
  const rubor = (o = .45, c = '#EE8FA8') => vel(mancha(17, 47, 8, 5, 3, .15), c, { o }) + vel(mancha(83, 47, 8, 5, 4, .15), c, { o });
  const trazoF = (d, w = 4.6) => trazo(d, w, FG, { o: .9 });
  const cara = b => svg('0 0 100 70', `<g transform="translate(50 35) scale(1.08) translate(-50 -35)">${b}</g>`);

  const brazo = m => {
    let s = pincel('M146,35 C126,35 118,45 102,44 C88,43 80,34 64,35', 22, AMA)
      + [[130, 37], [116, 43], [101, 44], [88, 41], [76, 36]].map(([x, y]) => trazo(`M${x},${y - 10} Q${x + 3},${y} ${x},${y + 10}`, 2.6, AMAo, { o: .85 })).join('')
      + agua(mancha(146, 35, 10, 10, 3, .06), TEAL, { f: 'l' }) + punto(143, 31.5, 2, PAPEL, .85)
      + agua(rect(55, 18.5, 14, 33, 4), TEAL, { f: 'l' });
    const dedos = [148, 169, 190, 211, 286].map((a, i) => { const r = a * Math.PI / 180, d = i === 4 ? 16.5 : (i % 3 ? 20.5 : 19); return agua(mancha(42 + Math.cos(r) * d, 37 + Math.sin(r) * d, i === 4 ? 10 : (i % 3 ? 11.5 : 10.5), 7.4, 5 + i, .08, 8, r), PAPEL, { f: 'l' }); }).join('');
    s += dedos + agua(mancha(42, 37, 15.5, 16, 9, .06), PAPEL) + vel('M30,46 Q42,54 56,46 L52,56 Q40,60 30,54Z', C.grisO, { o: .4 }) + trazo('M32,45 Q40,50 50,45', 1.8, C.grisO, { o: .7 });
    return svg('0 0 160 70', m ? `<g transform="translate(160 0) scale(-1 1)">${s}</g>` : s);
  };
  const hud = x => {
    const piel = pig('#F7CDB0'), pelo = pig('#8B5A2B'), oscuro = '#9C4A5A';
    let s = agua('M-4,-4 H104 V104 H-4Z', C.cielo, { f: 's', o: .85 }) + agua(mancha(50, 50, 42, 42, 3, .05), PAPEL, { f: 's', o: .5 })
      + agua('M72,26 C88,16 100,30 96,48 C94,60 84,66 79,59 C88,50 86,36 72,34Z', pelo, { f: 'l' })
      + agua('M12,102 C14,86 28,80 50,80 C72,80 86,86 88,102Z', T.turq)
      + agua(rect(44, 70, 12, 13, 4), piel, { f: 'l' }) + agua(mancha(76, 56, 4.5, 6, 5, .1), piel, { f: 'l' })
      + agua(mancha(50, 53, 26, 27, 6, .04), piel) + vel(mancha(58, 64, 16, 14, 7, .15), carga(piel, .85), { o: .3 })
      + agua('M24,54 C22,34 34,23 50,23 C66,23 78,34 76,54 C74,47 70,43 66,44 C63,39 58,37 55,40 C51,35 46,35 43,40 C39,37 35,39 33,44 C29,43 26,47 24,54Z', pelo)
      + trazo('M45,28 Q49,33 50,38 M57,28 Q60,33 60,38', 1.6, carga(pelo, .7), { o: .7 })
      + pincel('M24,52 C21,30 34,17 50,17 C66,17 79,30 76,52', 5, C.rojo) + agua(mancha(23, 56, 6.5, 8.5, 8, .08), C.rojo, { f: 'l' }) + punto(23, 56, 2, PAPEL, .85)
      + trazo('M23,63 Q25,72 36,72', 1.6, C.grisO, { o: .8 }) + agua(mancha(37, 72, 2.8, 2.8, 9, .1), C.rojo, { f: 'l' })
      + colorete(35, 64, 5) + colorete(65, 64, 5) + trazo('M49,61 q1.2,1.4 2.4,0', 1.4, carga(piel, .6), { o: .8 });
    if (x === 'normal') s += trazo('M35,46 q5,-2.5 10,-.5 M55,45.5 q5,-2 10,.5', 1.8, peloO(pelo), { o: .85 }) + ojo(40, 54, 3.4) + ojo(60, 54, 3.4) + agua('M44,66 Q50,72 56,66 Q50,67.5 44,66Z', oscuro, { f: 'l' });
    if (x === 'risa') s += trazo('M35,44 q5,-3 10,-.5 M55,43.5 q5,-2.5 10,.5', 1.8, peloO(pelo), { o: .85 }) + trazo('M34,57 Q40,48 46,57 M54,57 Q60,48 66,57', 2.2) + agua('M41,64 Q50,79 59,64 Q50,66.5 41,64Z', oscuro, { f: 'l' }) + vel('M45,71 Q50,68 55,71 Q53,75 50,75 Q47,75 45,71Z', '#EE8FA8', { o: .9 });
    if (x === 'sorpresa') s += trazo('M34,42 q6,-4 12,-1 M54,41 q6,-3 12,1', 1.8, peloO(pelo), { o: .85 }) + ojo(40, 54, 4.2) + ojo(60, 54, 4.2) + agua(mancha(50, 69, 3.6, 4.6, 5, .08), oscuro, { f: 'l' });
    if (x === 'guino') s += trazo('M34,44 q5,-3.5 11,-1 M55,47 q5,-1 10,1', 1.8, peloO(pelo), { o: .85 }) + ojo(40, 54, 3.4) + trazo('M55,55.5 Q60,51 65,55.5', 2.2) + trazo('M43,65 Q50,71 57,64', 2.2) + agua('M51,67.5 Q51,74 54.5,74 Q58,74 57.6,66.2Z', '#E88AA0', { f: 'l' });
    return svg('0 0 100 100', s);
  };
  const peloO = c => carga(c, .7);
  const gorguera = (c1, c2) => [0, 1, 2, 3, 4, 5, 6].map(i => agua(mancha(19 + i * 10.3, 88 + (i % 2) * 1.5, 9, 8, 20 + i, .1), c1, { f: 'l' })).join('') + agua(mancha(50, 87, 24, 7, 30, .08), c2, { f: 'l' });
  const CAL_VB = '0 0 200 200';
  const calcetin = (triste, dy = 0) => {
    const cuerpo = liso([[78, 24], [132, 22], [133, 108], [124, 150], [100, 172], [70, 175], [44, 174], [26, 160], [26, 146], [38, 132], [56, 128], [78, 129]]);
    let s = agua(cuerpo, C.crema) + [46, 64, 82, 100].map((y, i) => pincel(`M82,${y} L130,${y + (i % 2 ? 2 : -1)}`, 8, i % 2 ? T.turq : C.rosa, { f: 'l', o: .9 })).join('')
      + agua(liso([[26, 146], [38, 132], [50, 130], [46, 152], [44, 174], [30, 166]]), C.sol, { f: 'l' }) + agua(liso([[112, 152], [132, 136], [133, 150], [120, 168], [100, 174]]), C.sol, { f: 'l' })
      + vel('M110,30 L132,24 L133,108 Q124,150 100,172 Q120,120 110,30Z', C.grisO, { o: .3 })
      + agua(rect(70, 10, 70, 30, 6), C.violeta) + trazo('M88,24 V38 M99,24 V38 M110,24 V38 M121,24 V38', 2, T.moradoO, { o: .7 })
      + `<g transform="translate(0 ${dy})">`;
    if (triste) s += trazo('M87,79 l8,-4 M125,79 l-8,-4', 3, T.tinta, { o: .85 }) + ojo(95, 91, 4) + ojo(117, 91, 4) + trazo('M99,113 Q106,106 113,113', 3, T.tinta) + agua('M92,101 C88,107 87,112 90,114 C93,116 96,113 95,109Z', C.cielo, { f: 'l' }) + colorete(87, 105, 5) + colorete(125, 105, 5);
    else s += trazo('M88,92 Q95,82 102,92 M110,92 Q117,82 124,92', 3, T.tinta) + agua('M98,102 Q106,112 114,102Z', '#9C4A5A', { f: 'l' }) + colorete(87, 101, 5.5) + colorete(125, 101, 5.5);
    return s + '</g>';
  };
  const bruja = sp => {
    const piel = pig('#F7CDB0'), pelo = pig('#8B5A2B'), peloOs = carga(pelo, .75), zap = carga(C.violeta, .6);
    let s = suelo(100, 251, 54)
      + `<g transform="rotate(${sp ? 14 : 0} 70 96)">` + agua('M74,90 C50,80 26,98 30,124 C32,140 46,146 52,138 C44,124 50,106 70,106Z', pelo) + trazo('M60,98 C48,102 40,114 42,128 M66,102 C54,108 48,118 49,130', 2, peloOs, { o: .8 }) + agua(mancha(69, 97, 6, 9, 3, .1), C.rosa, { f: 'l' }) + `</g>`
      + agua('M80,138 C64,168 52,202 40,236 C70,247 130,247 160,236 C148,202 136,168 120,138Z', C.violeta) + vel('M110,150 Q140,200 160,236 Q130,247 100,244Z', T.moradoO, { o: .4 })
      + estrella(51, 226, 6, AMA, .2) + estrella(149, 224, 5.5, AMA, -.15) + estrella(140, 196, 4, AMA)
      + pincel('M89,210 V238', 11, PAPEL) + pincel('M111,210 V238', 11, PAPEL) + trazo('M89,212 V240 M111,212 V240', 9, C.rosa, { o: .8, x: ' stroke-dasharray="3.5 3.5"' })
      + agua('M72,247 C70,238 84,234 94,237 C100,239 100,248 96,251 H78 C74,251 72,250 72,247Z', zap, { f: 'l' }) + agua('M128,247 C130,238 116,234 106,237 C100,239 100,248 104,251 H122 C126,251 128,250 128,247Z', zap, { f: 'l' })
      + agua('M84,138 H116 C126,160 134,188 140,214 C122,224 78,224 60,214 C66,188 74,160 84,138Z', T.turq) + vel('M104,140 Q130,180 140,214 Q120,224 100,222Z', T.turqO, { o: .4 })
      + trazo('M64,206 C82,214 118,214 136,206', 3, PAPEL, { o: .9, x: ' stroke-dasharray=".1 8"' })
      + pincel('M78,156 Q70,174 66,192', 10, piel);
    const [arm, hx, hy, w1, w2, sx, sy, sr] = sp ? ['M121,152 Q143,152 152,135', 153, 131, [144, 147], [170, 88], 172, 80, 19] : ['M122,156 Q136,168 142,178', 143, 181, [133, 197], [164, 128], 166, 120, 17];
    if (sp) s += agua(mancha(sx, sy, 27, 27, 3, .08), C.sol, { f: 's', o: .4 }) + estrella(146, 50, 8, C.rosa) + estrella(186, 46, 6, T.turq) + estrella(188, 112, 6, PAPEL) + estrella(150, 94, 4, AMA) + estrella(176, 28, 4, AMA);
    s += pincel(`M${w1[0]},${w1[1]} L${w2[0]},${w2[1]}`, 5, PAPEL) + trazo(`M${w1[0]},${w1[1]} L${w2[0]},${w2[1]}`, 4, C.rosa, { o: .85, x: ' stroke-dasharray="3.5 4"' })
      + estrella(sx, sy, sr, AMA, sp ? .3 : .1);
    if (!sp) s += estrella(184, 102, 4, PAPEL) + estrella(150, 104, 3.5, AMA);
    s += pincel(arm, 10, piel) + agua(mancha(65, 196, 8, 8, 4, .1), piel, { f: 'l' }) + agua(mancha(hx, hy, 8.5, 8.5, 5, .1), piel, { f: 'l' })
      + agua(mancha(81, 151, 11, 11, 6, .1), T.turq, { f: 'l' }) + agua(mancha(119, 151, 11, 11, 7, .1), T.turq, { f: 'l' })
      + agua('M100,141 L72,133 C72,144 79,154 90,153Z', C.violeta, { f: 'l' }) + agua('M100,141 L128,133 C128,144 121,154 110,153Z', C.violeta, { f: 'l' }) + estrella(100, 145, 7, AMA)
      + agua(mancha(60, 115, 7.5, 7.5, 8, .1), piel, { f: 'l' }) + agua(mancha(140, 115, 7.5, 7.5, 9, .1), piel, { f: 'l' })
      + agua(mancha(100, 110, 40, 40, 10, .04), piel) + vel(mancha(112, 124, 26, 22, 11, .15), carga(piel, .85), { o: .3 })
      + agua('M60,112 C56,84 76,68 100,68 C124,68 144,84 140,112 C137,102 131,97 125,99 C120,92 113,90 108,95 C102,88 95,88 91,95 C85,90 79,92 76,99 C69,97 63,102 60,112Z', pelo)
      + trazo('M86,82 Q92,88 94,93 M108,80 Q112,87 112,93', 2, peloOs, { o: .8 }) + trazo('M77,106 q6,-3.5 12,-.5 M111,105.5 q6,-3 12,.5', 3, peloOs, { o: .85 });
    if (sp) s += trazo('M76,121 Q83,111 90,121 M110,121 Q117,111 124,121', 3, T.tinta) + agua('M87,129 Q100,148 113,129 Q100,134 87,129Z', '#9C4A5A', { f: 'l' }) + vel('M93,138 Q100,134 107,138 Q104,143 100,143 Q96,143 93,138Z', '#EE8FA8', { o: .9 });
    else s += ojo(83, 118, 5) + ojo(117, 118, 5) + trazo('M90,131 Q100,143 110,131', 2.6, '#9C4A5A', { o: .95 });
    s += colorete(72, 130, 7) + colorete(128, 130, 7) + trazo('M98,125 q2,2 4,0', 2, carga(piel, .6), { o: .8 })
      + `<g transform="rotate(-6 100 78)">` + agua('M64,78 C72,58 80,44 88,34 C78,30 66,30 50,32 C62,16 84,10 100,12 C114,16 126,40 136,78Z', C.violeta)
      + vel('M104,16 C120,30 130,50 136,78 L112,70Z', T.moradoO, { o: .35 }) + agua(mancha(100, 78, 66, 12, 12, .04), C.violeta)
      + agua('M70,56 C88,63 112,63 130,56 L132,67 C112,75 88,75 68,67Z', C.rosa, { f: 'l' }) + estrella(85, 46, 4.5, AMA) + estrella(117, 40, 3.5, AMA) + `</g>`;
    return svg('0 0 200 260', s);
  };

  Object.assign(ILUS, {
    // ===================== OFICINA =====================
    // Silla giratoria: respaldo y asiento azules, patas de estrella y ruedas
    ofi_silla: () => svg('0 0 200 200',
      suelo(100, 186, 66)
      + pincel('M100,160 L42,177', 7, C.grisO) + pincel('M100,160 L158,177', 7, C.grisO) + pincel('M100,150 L100,172', 8, C.grisO)
      + agua(mancha(42, 182, 7, 6, 3, .1), C.negro, { f: 'l' }) + agua(mancha(158, 182, 7, 6, 4, .1), C.negro, { f: 'l' }) + agua(mancha(100, 187, 7, 6, 5, .1), C.negro, { f: 'l' })
      + pincel('M100,126 L100,160', 13, C.gris)
      + pincel('M47,118 Q44,102 48,92', 8, C.negro, { o: .85 }) + pincel('M153,118 Q156,102 152,92', 8, C.negro, { o: .85 })
      + agua(liso([[54, 34], [76, 16], [124, 16], [148, 34], [152, 76], [140, 108], [100, 112], [60, 108], [48, 76]]), C.azul)
      + vel(mancha(112, 82, 34, 26, 5, .15), T.azulO, { o: .4 })
      + trazo('M66,36 Q100,28 134,36 Q142,70 130,98 Q100,102 70,98 Q58,70 66,36Z', 2, T.azulO, { o: .6, x: salto })
      + agua(liso([[42, 114], [60, 104], [100, 102], [140, 104], [158, 114], [156, 128], [100, 136], [44, 128]]), C.azul)
      + vel('M46,124 Q100,136 156,124 L154,130 Q100,142 48,132Z', T.azulO, { o: .5 })
      + agua(mancha(46, 90, 13, 6, 6, .1), C.negro, { f: 'l' }) + agua(mancha(154, 90, 13, 6, 7, .1), C.negro, { f: 'l' })),

    // Mesa de despacho: madera, tres cajones, un vasito de lápices y un papel
    ofi_mesa: () => svg('0 0 240 160',
      suelo(120, 152, 104)
      + agua(rect(196, 50, 18, 98, 2), T.madera) + vel('M196,50 L214,50 L214,148 L206,148Z', T.maderaO, { o: .4 })
      + agua(rect(98, 50, 100, 48, 3), T.maderaO, { o: .8 })
      + agua(rect(22, 48, 76, 100, 4), T.madera)
      + [58, 87, 116].map((y, i) => agua(rect(30, y, 60, 24, 5 + i), T.maderaC) + punto(60, y + 12, 3.4, C.solO, .95)).join('')
      + agua(liso([[14, 38], [30, 30], [120, 28], [214, 30], [228, 38], [224, 50], [120, 52], [18, 50]]), pig('#E2B27A'))
      + vel('M16,44 Q120,50 224,44 L222,50 Q120,56 18,50Z', T.maderaO, { o: .4 })
      + pincel('M190,16 L186,30', 2.4, C.sol, { f: 'l' }) + pincel('M198,12 L200,30', 2.4, C.azul, { f: 'l' })
      + agua(liso([[182, 20], [194, 18], [206, 20], [203, 33], [185, 33]]), C.rojo, { f: 'l' })
      + agua(liso([[134, 29], [140, 18], [152, 14], [170, 18], [168, 29]]), PAPEL, { f: 'l' }) + trazo('M142,22 H160', 1.6, C.grisO, { o: .7 })),

    // Ordenador sonriente: pantalla celeste con cara, teclado debajo
    ofi_ordenador: () => svg('0 0 200 200',
      suelo(100, 178, 80)
      + agua(liso([[88, 118], [112, 118], [120, 142], [80, 142]]), C.gris) + agua(mancha(100, 144, 38, 6, 3, .08), C.gris)
      + agua(liso([[28, 26], [40, 14], [100, 11], [162, 14], [174, 26], [176, 108], [162, 122], [100, 125], [38, 122], [26, 108]]), T.luz)
      + vel('M30,100 Q100,126 174,100 L174,112 Q100,134 30,112Z', C.grisO, { o: .35 })
      + agua(liso([[40, 30], [100, 25], [162, 30], [165, 68], [162, 108], [100, 112], [38, 108], [35, 68]]), C.cielo)
      + agua('M54,104 L92,30 L112,30 L74,104Z', PAPEL, { f: 's', o: .45 })
      + ojo(82, 58, 6.5) + ojo(118, 58, 6.5)
      + agua('M80,76 Q100,98 120,76 Q100,84 80,76Z', '#C9605F', { f: 'l' }) + colorete(66, 76, 8) + colorete(134, 76, 8)
      + agua(liso([[30, 168], [44, 148], [100, 146], [158, 148], [172, 168], [100, 174]]), PAPEL)
      + [0, 1, 2].map(r => trazo(`M${48 - r * 3},${153 + r * 5} H${152 + r * 3}`, 3, T.tecla, { o: .9, x: ' stroke-dasharray="9 3"' })).join('')),

    // Archivador gris: cajones con etiqueta y carpetas de colores asomando
    ofi_archivador: () => svg('0 0 200 200',
      suelo(100, 182, 62)
      + agua(liso([[50, 18], [100, 13], [150, 18], [154, 100], [151, 176], [100, 180], [49, 176], [46, 100]]), C.gris)
      + [22, 58].map((y, i) => agua(rect(58, y, 84, 32, 3 + i), T.luz) + agua(rect(88, y + 6, 24, 9, 9 + i), PAPEL, { f: 'l' }) + trazo(`M86,${y + 23} H114`, 3.4, C.grisO, { o: .8 })).join('')
      + agua(rect(52, 92, 96, 12, 8), C.negro, { o: .75 })
      + [[62, C.sol], [78, C.rojo], [94, C.azul], [112, C.hoja], [128, C.rosa]].map(([x, c], i) => agua(rect(x, 84 - (i % 2) * 5, 15, 22, 11 + i), c, { f: 'l' })).join('')
      + agua(rect(44, 102, 112, 36, 12), T.luz) + agua(rect(86, 108, 28, 10, 13), PAPEL, { f: 'l' }) + trazo('M84,126 H116', 3.4, C.grisO, { o: .8 })
      + agua(rect(58, 140, 84, 30, 14), T.luz) + agua(rect(88, 146, 24, 9, 15), PAPEL, { f: 'l' }) + trazo('M86,163 H114', 3.4, C.grisO, { o: .8 })),

    // Impresora: papel que entra, papel que sale con un corazón
    ofi_impresora: () => svg('0 0 200 200',
      suelo(100, 180, 80)
      + agua(liso([[62, 82], [60, 30], [98, 22], [136, 22], [140, 82]]), PAPEL) + trazo('M74,40 L120,36 M74,50 L124,46 M74,60 L110,57', 2.2, C.grisO, { o: .7 })
      + agua(liso([[28, 92], [38, 78], [100, 74], [162, 78], [174, 92], [176, 138], [164, 150], [100, 152], [36, 150], [24, 138]]), T.luz)
      + vel('M28,128 Q100,150 174,128 L170,148 Q100,156 30,148Z', C.grisO, { o: .4 })
      + agua(rect(132, 88, 30, 14, 3), C.cielo, { f: 'l' }) + agua(mancha(138, 116, 5, 5, 4, .1), C.hoja, { f: 'l' }) + agua(mancha(153, 116, 5, 5, 5, .1), C.rojo, { f: 'l' })
      + agua(rect(40, 117, 86, 10, 6), C.negro, { o: .8 })
      + agua(liso([[46, 126], [118, 126], [126, 166], [124, 180], [114, 182], [52, 182], [42, 170]]), PAPEL)
      + trazo('M56,138 H104 M56,148 H96', 2.2, C.grisO, { o: .65 })
      + agua(corazon(98, 163, 9), C.rosa, { f: 'l' })),

    // Taza blanca con corazón, café y dos hilos de vapor
    ofi_taza: () => svg('0 0 200 200',
      suelo(96, 180, 62)
      + trazo('M78,56 C66,44 88,34 76,20', 3, C.grisO, { o: .6 }) + trazo('M106,52 C94,38 118,30 106,18', 3, C.grisO, { o: .6 })
      + pincel('M138,92 Q170,90 170,116 Q170,140 138,140', 11, PAPEL) + pincel('M140,98 Q164,98 164,116 Q164,134 140,134', 3, C.grisO, { o: .5, f: 'l' })
      + agua(liso([[46, 68], [96, 64], [144, 68], [143, 130], [138, 162], [118, 175], [72, 175], [52, 162], [46, 130]]), PAPEL)
      + vel('M110,76 L144,70 L143,130 Q138,168 112,174 Q124,140 110,76Z', C.cieloO, { o: .45 })
      + agua(corazon(95, 116, 22), C.rojo)
      + agua(mancha(95, 68, 49, 10, 4, .04), PAPEL) + agua(mancha(95, 69, 40, 6.5, 5, .06), T.marron, { f: 'l' }) + trazo('M78,69 Q92,66 106,69', 2, C.crema, { o: .8 })),

    // Planta de interior: seis hojas verdes y una maceta de barro
    ofi_planta: () => {
      const hoja = (a, s, c) => agua('M0,0 C-26,-18 -22,-64 0,-80 C22,-64 26,-18 0,0Z', c, { t: `translate(100 118) rotate(${a}) scale(${s})`, f: 'l' }) + trazo('M0,-6 Q-2,-40 0,-68', 2, carga(c, .75), { o: .6, t: `translate(100 118) rotate(${a}) scale(${s})` });
      return svg('0 0 200 200',
        suelo(100, 180, 54)
        + hoja(-62, .85, C.hojaO) + hoja(58, .85, C.hojaO) + hoja(-30, 1, C.hoja) + hoja(30, 1, C.hoja) + hoja(-8, 1.12, C.prado) + hoja(14, .82, C.prado)
        + agua(liso([[62, 126], [100, 122], [138, 126], [130, 152], [126, 178], [100, 180], [74, 178], [70, 152]]), T.cuero)
        + vel('M104,126 L138,126 L126,178 L108,178Z', carga(T.cuero, .8), { o: .4 })
        + agua(rect(54, 112, 92, 18, 4), T.cuero) + vel('M56,124 H144 V130 H56Z', carga(T.cuero, .8), { o: .35 }));
    },

    // Caja de cartón abierta, con flechas de «este lado hacia arriba»
    ofi_caja: () => svg('0 0 200 200',
      suelo(104, 180, 78)
      + agua(liso([[62, 72], [100, 66], [170, 70], [166, 52], [152, 36], [76, 34], [68, 52]]), lava(C.tierra, .3))
      + agua('M30,86 L60,70 L172,70 L142,86Z', T.marronO, { o: .85 })
      + agua('M142,86 L172,70 Q174,116 170,158 L142,176Z', carga(C.tierra, .86))
      + agua('M30,86 L60,70 L44,46 L12,62Z', C.tierra)
      + agua('M30,87 Q86,83 142,87 Q145,130 142,176 Q86,180 30,176 Q27,130 30,87Z', C.tierra)
      + agua(rect(74, 86, 22, 30, 7), carga(C.paja, .9), { o: .8 }) + agua(rect(66, 140, 40, 11, 8), PAPEL, { f: 'l' })
      + trazo('M44,108 V94 M40,98 L44,94 L48,98 M56,108 V94 M52,98 L56,94 L60,98', 2.2, T.marronO, { o: .8 })),

    // Papelera con bolas de papel desbordadas
    ofi_papelera: () => {
      const bola = (x, y, r, s) => agua(mancha(x, y, r, r * .92, s, .13, 9), PAPEL, { f: 'l' }) + trazo(`M${x - r * .5},${y - r * .2} L${x},${y + r * .15} L${x + r * .3},${y - r * .5} M${x},${y + r * .15} L${x + r * .1},${y + r * .6}`, 1.7, C.grisO, { o: .7 });
      return svg('0 0 200 200',
        suelo(100, 180, 66)
        + bola(80, 62, 20, 2) + bola(118, 54, 22, 3) + bola(142, 66, 15, 4)
        + agua(liso([[98, 70], [104, 32], [130, 36], [120, 74]]), C.sol, { f: 'l' }) + trazo('M108,44 L122,47 M106,54 L120,57', 1.6, C.solO, { o: .7 })
        + agua(liso([[50, 76], [100, 72], [150, 76], [144, 128], [138, 176], [100, 180], [62, 176], [56, 128]]), T.turq)
        + [74, 92, 108, 126].map((x, i) => trazo(`M${x},86 L${x + (i % 2 ? 2 : -2)},170`, 3, T.turqO, { o: .5 })).join('')
        + agua(rect(42, 66, 116, 16, 5), T.turq) + vel('M44,76 H156 V82 H44Z', T.turqO, { o: .45 })
        + bola(172, 168, 12, 6) + vel(mancha(172, 181, 13, 3, 8, .1), C.grisO, { o: .35 }));
    },

    // Maletín de cuero con dos cierres amarillos
    ofi_maletin: () => svg('0 0 200 200',
      suelo(100, 178, 82)
      + pincel('M76,70 V54 Q76,40 90,40 H110 Q124,40 124,54 V70', 8, T.marronO)
      + agua(rect(66, 60, 14, 10, 3), C.sol, { f: 'l' }) + agua(rect(120, 60, 14, 10, 4), C.sol, { f: 'l' })
      + agua(liso([[22, 84], [34, 70], [100, 66], [166, 70], [180, 84], [180, 160], [168, 172], [100, 174], [32, 172], [20, 160]]), T.cuero)
      + vel('M24,150 Q100,176 178,150 L170,172 Q100,176 30,172Z', T.marronO, { o: .45 })
      + trazo('M32,106 V150 Q32,162 44,162 H156 Q168,162 168,150 V106', 2, C.tierra, { o: .8, x: salto })
      + agua('M20,84 Q22,68 38,68 L162,68 Q178,68 180,84 L180,104 Q100,114 20,104Z', carga(T.cuero, .9))
      + agua(rect(52, 98, 20, 18, 6), C.sol) + agua(rect(128, 98, 20, 18, 7), C.sol) + punto(62, 108, 2.6, T.tinta) + punto(138, 108, 2.6, T.tinta)),

    // Sofá morado de tres plazas con un cojín amarillo
    ofi_sofa: () => svg('0 0 240 160',
      suelo(120, 152, 108)
      + agua(rect(26, 138, 12, 15, 2), T.marron, { f: 'l' }) + agua(rect(202, 138, 12, 15, 3), T.marron, { f: 'l' })
      + agua(rect(32, 26, 176, 76, 4, 2), C.violeta)
      + agua(rect(46, 36, 74, 58, 5), lava(C.violeta, .35)) + agua(rect(120, 36, 74, 58, 6), lava(C.violeta, .35))
      + agua(rect(34, 114, 172, 28, 7), C.violeta) + vel('M36,134 H204 V142 H36Z', T.moradoO, { o: .4 })
      + agua(rect(40, 90, 80, 30, 8), lava(C.violeta, .25)) + agua(rect(120, 90, 80, 30, 9), lava(C.violeta, .25))
      + agua(rect(10, 62, 40, 84, 10, 2), C.violeta) + agua(rect(190, 62, 40, 84, 11, 2), C.violeta)
      + vel(mancha(30, 130, 14, 14, 12, .2), T.moradoO, { o: .4 }) + vel(mancha(210, 130, 14, 14, 13, .2), T.moradoO, { o: .4 })
      + agua(liso([[52, 56], [72, 50], [94, 56], [98, 76], [92, 96], [72, 100], [52, 94], [46, 74]]), C.sol, { t: 'rotate(-12 72 74)' }) + punto(72, 74, 3.4, C.solO, .9)),

    // El jefe: traje azul marino, corbata roja, un dedo en alto y una taza de café
    ofi_jefe: () => {
      const traje = pig('#2E3D73'), trajeO = carga(traje, .8), piel = pig('#F7CDB0'), pelo = pig('#8B5A2B'), peloO = carga(pelo, .8);
      return svg('0 0 160 240',
        suelo(80, 230, 52)
        + agua(rect(56, 176, 21, 46, 2), traje) + agua(rect(83, 176, 21, 46, 3), traje)
        + agua(liso([[42, 228], [42, 216], [58, 211], [78, 214], [78, 230]]), C.negro, { f: 'l' }) + agua(liso([[118, 228], [118, 216], [102, 211], [84, 214], [84, 230]]), C.negro, { f: 'l' })
        + pincel('M44,120 L28,92', 14, traje)
        + agua(liso([[32, 142], [34, 108], [56, 96], [80, 94], [106, 96], [128, 108], [130, 142], [124, 184], [80, 192], [38, 184]]), traje)
        + vel(mancha(110, 150, 20, 36, 4, .15), trajeO, { o: .4 })
        + agua('M64,96 L80,136 L96,96Z', PAPEL, { f: 'l' }) + agua('M75,102 H85 L83,108 L90,140 L80,152 L70,140 L77,108Z', C.rojo, { f: 'l' })
        + trazo('M64,96 L74,128 M96,96 L86,128', 2.6, trajeO, { o: .8 }) + punto(80, 164, 2.6, C.sol) + punto(80, 178, 2.6, C.sol)
        + pincel('M120,118 Q132,132 130,150', 14, traje)
        + agua(rect(126, 136, 24, 26, 5), C.rojo, { f: 'l' }) + pincel('M150,143 Q160,143 160,150 Q160,156 150,156', 3, C.rojoO) + agua(mancha(128, 152, 9, 9, 6, .1), piel, { f: 'l' })
        + trazo('M134,128 C128,120 140,114 134,104', 2.4, C.grisO, { o: .6 })
        + agua(mancha(22, 80, 11, 11, 7, .1), piel, { f: 'l' }) + trazo('M17,74 L13,58 M23,72 L22,54 M29,74 L32,58', 4, piel, { o: .95 }) + trazo('M16,84 Q22,88 28,84', 1.6, carga(piel, .8), { o: .7 })
        + agua(mancha(46, 64, 8, 8, 8, .1), piel, { f: 'l' }) + agua(mancha(114, 64, 8, 8, 9, .1), piel, { f: 'l' })
        + agua(mancha(80, 60, 34, 34, 10, .04), piel) + vel(mancha(92, 76, 24, 18, 11, .15), carga(piel, .85), { o: .3 })
        + agua('M47,60 Q42,28 76,24 Q92,20 104,28 Q118,38 113,60 Q110,46 102,42 Q96,50 84,44 Q70,48 60,42 Q52,46 47,60Z', pelo)
        + trazo('M60,46 Q68,40 76,45 M84,45 Q92,40 100,46', 4.4, peloO, { o: .85 })
        + ojo(68, 59, 4) + ojo(92, 59, 4) + colorete(56, 74, 7) + colorete(104, 74, 7)
        + agua('M70,86 Q80,96 90,86Z', '#B3262C', { f: 'l' })
        + agua('M80,78 Q72,72 62,76 Q56,79 54,76 Q56,88 68,85 Q76,83 80,80 Q84,83 92,85 Q104,88 106,76 Q104,79 98,76 Q88,72 80,78Z', pelo, { f: 'l' })
        + agua(mancha(80, 70, 6.5, 5.5, 12, .1), '#F2A98A', { f: 'l' }));
    },

    // Fotocopiadora: tapa con cristal, panel de botones y dos bandejas de papel
    ofi_fotocopiadora: () => svg('0 0 200 200',
      suelo(100, 182, 76)
      + agua(rect(34, 96, 132, 78, 2), T.luz)
      + [106, 138].map((y, i) => agua(rect(42, y, 116, 26, 4 + i), PAPEL) + trazo(`M82,${y + 13} H118`, 3.4, C.grisO, { o: .8 })).join('')
      + agua(mancha(48, 178, 7, 6, 5, .1), C.negro, { f: 'l' }) + agua(mancha(152, 178, 7, 6, 6, .1), C.negro, { f: 'l' })
      + agua(rect(24, 56, 152, 44, 7, 2), lava(C.gris, .3)) + vel('M26,92 Q100,104 174,92 L174,100 Q100,106 26,100Z', C.grisO, { o: .4 })
      + agua(rect(34, 84, 72, 9, 8), C.negro, { o: .8 }) + agua(liso([[40, 88], [98, 88], [94, 104], [44, 104]]), PAPEL) + trazo('M52,94 H86 M54,99 H78', 1.8, C.grisO, { o: .7 })
      + agua(rect(124, 64, 40, 18, 9), C.cielo, { f: 'l' }) + trazo('M130,70 H146 M130,76 H140', 1.6, T.luz, { o: .9 })
      + agua(mancha(130, 91, 4, 4, 3, .1), C.hoja, { f: 'l' }) + agua(mancha(142, 91, 4, 4, 4, .1), C.sol, { f: 'l' }) + agua(mancha(154, 91, 4, 4, 5, .1), C.rojo, { f: 'l' })
      + agua(rect(30, 40, 140, 18, 10), C.grisO) + agua(rect(40, 54, 80, 4, 11), '#BFEBCB', { f: 'l' })),

    // Dispensador de agua: garrafón azul arriba, grifos rojo y azul
    ofi_dispensador: () => svg('0 0 200 200',
      suelo(100, 182, 60)
      + agua(rect(50, 98, 100, 80, 2), PAPEL) + vel('M110,100 L150,100 L148,178 L114,178Z', C.cieloO, { o: .3 })
      + agua(rect(66, 108, 68, 44, 3), C.gris)
      + agua(rect(76, 112, 14, 12, 4), C.rojo, { f: 'l' }) + agua(rect(110, 112, 14, 12, 5), C.cielo, { f: 'l' })
      + agua(rect(108, 136, 18, 16, 6), PAPEL, { f: 'l' }) + trazo('M110,142 H124', 2.6, C.cieloO, { o: .8 })
      + trazo('M70,164 H130 M70,170 H130', 2.4, T.tecla, { o: .8 })
      + agua(rect(86, 88, 28, 14, 7), T.luz, { f: 'l' })
      + agua(liso([[60, 28], [66, 12], [100, 10], [134, 12], [140, 28], [140, 70], [126, 90], [100, 98], [74, 90], [60, 70]]), C.cielo)
      + vel('M104,24 L140,30 L140,70 L126,90 L100,98Z', C.cieloO, { o: .45 })
      + trazo('M66,50 H134 M66,70 H134', 2.4, C.cieloO, { o: .45 })
      + punto(112, 78, 3.6, PAPEL, .9) + punto(122, 62, 2.8, PAPEL, .9) + punto(104, 54, 2.4, PAPEL, .9) + punto(118, 40, 2.8, PAPEL, .9)),

    // ===================== ROBOT (300×380, piezas que se apilan por CSS) =====================
    robot_cuerpo: () => svg('0 0 300 380',
      suelo(150, 371, 104)
      + agua(mancha(102, 352, 19, 17, 3, .06), C.negro) + agua(mancha(198, 352, 19, 17, 4, .06), C.negro)
      + agua(mancha(102, 352, 8, 8, 5, .1), AMA, { f: 'l' }) + agua(mancha(198, 352, 8, 8, 6, .1), AMA, { f: 'l' })
      + agua(rect(44, 82, 22, 46, 2), C.gris) + agua(rect(234, 82, 22, 46, 3), C.gris)
      + trazo('M48,96 H62 M48,114 H62 M238,96 H252 M238,114 H252', 2.4, C.grisO, { o: .8 })
      + agua(rect(124, 150, 52, 28, 4), C.gris)
      + pincel('M150,46 V30', 5, C.grisO) + agua(rect(137, 38, 26, 11, 5), C.gris, { f: 'l' }) + agua(mancha(150, 22, 12, 12, 6, .08), C.rojo, { f: 'l' })
      + trazo('M128,12 Q123,22 128,32 M172,12 Q177,22 172,32', 3, C.rosaO, { o: .85 })
      + agua(rect(60, 174, 180, 176, 7, 2.5), CO) + vel('M62,300 Q150,330 238,296 L236,340 Q150,352 64,340Z', COo, { o: .5 })
      + agua(mancha(62, 215, 15, 15, 7, .08), C.gris, { f: 'l' }) + agua(mancha(238, 215, 15, 15, 8, .08), C.gris, { f: 'l' })
      + agua(mancha(150, 177, 40, 9, 9, .06), C.gris, { f: 'l' })
      + agua(corazon(150, 245, 53), AMA)
      + vel(corazon(150, 247, 41), lava(C.rosa, .3), { o: .45 })
      + trazo('M72,268 H94 M70,279 H94 M72,290 H94', 4, C.rojoO, { o: .85 })
      + agua(mancha(214, 270, 7.5, 7.5, 10, .08), C.azul, { f: 'l' }) + agua(mancha(214, 293, 7.5, 7.5, 11, .08), AMA, { f: 'l' })
      + agua(rect(95, 314, 110, 22, 12), lava(C.sol, .3), { f: 'l' })
      + agua(rect(64, 44, 172, 118, 13, 2), TEAL) + vel('M70,138 Q150,160 232,134 L230,158 Q150,166 72,158Z', TEALo, { o: .5 })
      + punto(77, 86, 3.8, PAPEL, .9) + punto(77, 124, 3.8, PAPEL, .9) + punto(223, 86, 3.8, PAPEL, .9) + punto(223, 124, 3.8, PAPEL, .9)
      + agua(rect(88, 58, 124, 94, 14, 2), carga(C.negro, .75))
      + agua(rect(100, 70, 100, 70, 15, 1.5), lava(C.prado, .45), { f: 'l' })
      + agua('M100,70 L128,70 L100,104Z', PAPEL, { f: 's', o: .6 })
      + trazo('M104,76 Q150,72 196,76', 1.6, C.hoja, { o: .5 })),

    robot_cara_feliz: () => cara(pill(32, 30) + pill(68, 30)
      + agua('M36,45 Q50,47.5 64,45 Q63,60 50,60 Q37,60 36,45Z', FG, { f: 'l' }) + vel('M43,55.5 Q50,51 57,55.5 Q54,59.5 50,59.5 Q46,59.5 43,55.5Z', '#E8607F', { o: .9 }) + rubor()),
    robot_cara_enamorada: () => cara(agua(corazon(31, 31, 13), '#E8607F', { f: 'l' }) + agua(corazon(69, 31, 13), '#E8607F', { f: 'l' })
      + agua('M40,48 Q50,49.5 60,48 Q59,59 50,59 Q41,59 40,48Z', FG, { f: 'l' }) + vel('M44,55.5 Q50,52 56,55.5 Q54,58.6 50,58.6 Q46,58.6 44,55.5Z', '#E8607F', { o: .9 })
      + rubor(.6, '#E8607F') + agua(corazon(88, 12, 4.2), '#E8607F', { f: 'l' }) + agua(corazon(12, 60, 3.4, -.3), '#E8607F', { f: 'l' })),
    robot_cara_enfadada: () => cara(
      agua(mancha(11, 15, 6, 5, 3, .15, 8), PAPEL, { f: 'l' }) + agua(mancha(87, 15, 6, 5, 4, .15, 8), PAPEL, { f: 'l' }) + punto(14, 7, 2, PAPEL, .9) + punto(90, 7, 2, PAPEL, .9)
      + trazoF('M24,20 L40,26.5 M76,20 L60,26.5', 5.5)
      + agua('M25,31 L40,35 V38 Q40,44 32.5,44 Q25,44 25,38Z', FG, { f: 'l' }) + agua('M75,31 L60,35 V38 Q60,44 67.5,44 Q75,44 75,38Z', FG, { f: 'l' }) + punto(28, 38, 1.8, PAPEL, .9) + punto(64, 39, 1.8, PAPEL, .9)
      + trazoF('M40,58 Q50,49 60,58', 5) + rubor(.6, '#E8706A')),
    robot_cara_guino: () => cara(pill(32, 30) + trazoF('M60,33 Q68,21 76,33', 5.5) + trazoF('M35,45 Q50,58 65,45', 5)
      + agua('M50,51.8 Q50,64 56.5,64 Q63,64 62.6,49.5Z', '#E8607F', { f: 'l' }) + trazo('M56.4,53.5 v5', 1.6, '#C9405F', { o: .8 }) + rubor()),
    robot_cara_sorpresa: () => cara(trazoF('M21,13 Q31,7 41,12 M59,12 Q69,7 79,13', 4.5)
      + trazo(mancha(31, 31, 11, 11, 3, .04), 4.5, FG, { o: .9 }) + trazo(mancha(69, 31, 11, 11, 4, .04), 4.5, FG, { o: .9 })
      + agua(mancha(31, 31, 5.2, 5.2, 5, .08), FG, { f: 'l' }) + agua(mancha(69, 31, 5.2, 5.2, 6, .08), FG, { f: 'l' }) + punto(28, 28, 1.8, PAPEL, .9) + punto(66, 28, 1.8, PAPEL, .9)
      + agua(mancha(50, 54, 6.5, 8, 7, .08), FG, { f: 'l' }) + vel(mancha(50, 57, 3.4, 3, 8, .1), '#E8607F', { o: .9 }) + rubor(.35)),

    robot_corazon: () => svg('0 0 100 100',
      agua(corazon(50, 51, 41), C.rojo)
      + vel('M54,40 Q90,40 90,58 Q80,84 50,90 Q76,74 54,40Z', C.rojoO, { o: .45 })
      + trazo('M26,36 Q30,28 38,27', 3.4, PAPEL, { o: .9 }) + punto(22, 48, 2.6, PAPEL, .9)),

    robot_brazo_izq: () => brazo(false),
    robot_brazo_der: () => brazo(true),

    robot_punio: () => svg('0 0 100 100',
      trazo('M9,26 L3,21 M7,46 H1 M10,66 L4,71 M91,26 L97,21 M93,46 H99 M90,66 L96,71', 2.4, C.rojoO, { o: .85 })
      + agua(liso([[28, 66], [72, 64], [76, 90], [50, 97], [26, 90]]), PAPEL) + vel('M20,64 H80 V72 H20Z', C.rojo, { o: .7 }) + trazo('M44,78 l12,8 M56,78 l-12,8', 1.8, C.grisO, { o: .7 })
      + agua(liso([[16, 40], [20, 18], [50, 6], [78, 14], [87, 40], [78, 62], [60, 72], [34, 72], [22, 60]]), C.rojo)
      + vel('M56,36 Q86,34 86,48 Q80,66 60,72 Q70,56 56,36Z', C.rojoO, { o: .4 })
      + trazo('M26,28 Q50,18 76,28', 2, C.rojoO, { o: .8 }) + trazo('M40,12 Q38,18 39,24 M58,11 Q60,17 59,22', 1.8, C.rojoO, { o: .8 })
      + agua(liso([[16, 46], [28, 52], [50, 52], [68, 52], [70, 62], [48, 70], [24, 68], [14, 56]]), C.rojo, { o: .9 })
      + estrella(13, 10, 5, AMA) + estrella(90, 84, 4, PAPEL) + estrella(88, 8, 3.5, AMA)),

    robot_pow: () => {
      let a = '', b = '';
      const n = 14, rr = [1, .9, 1.04, .94, 1, .88, 1.06, .92, .98, .9, 1.05, .93, 1, .9];
      for (let i = 0; i < n * 2; i++) {
        const t = (i / (n * 2)) * 2 * Math.PI - Math.PI / 2, o = i % 2 === 0, k = o ? rr[i / 2] : .66;
        a += (i ? 'L' : 'M') + f1(80 + Math.cos(t) * 74 * k) + ',' + f1(60 + Math.sin(t) * 54 * k);
        b += (i ? 'L' : 'M') + f1(80 + Math.cos(t) * 74 * (o ? k * .8 : .55)) + ',' + f1(60 + Math.sin(t) * 54 * (o ? k * .8 : .55));
      }
      return svg('0 0 160 120', agua(a + 'Z', C.rojo) + agua(b + 'Z', C.sol) + agua(mancha(62, 40, 18, 7, 3, .1, 8, -.3), PAPEL, { f: 'l', o: .6 })
        + punto(8, 20, 3, AMA, .95) + punto(152, 98, 3.5, AMA, .95) + punto(148, 16, 2.5, C.rojo, .95)
        + trazo('M14,46 L4,44 M150,60 L158,62 M24,100 L16,106', 2.2, C.rojoO, { o: .8 }));
    },

    // ===================== HUD =====================
    hud_cara_normal: () => hud('normal'),
    hud_cara_risa: () => hud('risa'),
    hud_cara_sorpresa: () => hud('sorpresa'),
    hud_cara_guino: () => hud('guino'),

    // ===================== CAJA SORPRESA (100×100) =====================
    sorpresa_payaso: () => svg('0 0 100 100',
      gorguera(PAPEL, C.rojo)
      + agua(mancha(21, 44, 11, 13, 3, .12), C.naranja) + agua(mancha(79, 44, 11, 13, 4, .12), C.naranja)
      + agua(liso([[50, 2], [62, 23], [38, 23]]), C.azul, { t: 'rotate(-10 50 22)' }) + agua(mancha(50, 3.5, 4.5, 4.5, 5, .1), C.rojo, { f: 'l', t: 'rotate(-10 50 22)' })
      + agua(mancha(50, 48, 27, 27, 6, .05), PAPEL) + vel(mancha(58, 58, 18, 14, 7, .15), C.rosa, { o: .3 })
      + trazo('M33,35 q6,-5 12,0 M55,35 q6,-5 12,0', 2.4, C.azulO || C.azul, { o: .9 }) + ojo(39, 44, 3.2) + ojo(61, 44, 3.2)
      + agua('M34,60 Q50,78 66,60 Q50,65 34,60Z', '#B5475A', { f: 'l' }) + vel('M43,68 Q50,64 57,68 Q54,72.5 50,72.5 Q46,72.5 43,68Z', '#EE8FA8', { o: .9 })
      + colorete(29, 54, 5.5) + colorete(71, 54, 5.5) + agua(mancha(50, 54, 6.5, 6.5, 8, .08), C.rojo, { f: 'l' }) + punto(48, 52, 1.5, PAPEL, .9)),
    sorpresa_rana: () => svg('0 0 100 100',
      gorguera(C.rosa, C.sol)
      + agua(mancha(31, 33, 13, 13, 3, .08), C.hojaO) + agua(mancha(69, 33, 13, 13, 4, .08), C.hojaO)
      + agua(mancha(50, 56, 37, 24, 5, .05), C.hoja) + vel(mancha(50, 74, 26, 10, 6, .1), C.prado, { o: .8 })
      + agua('M40,22 L42,13 L46,18 L50,11 L54,18 L58,13 L60,22Z', C.sol, { f: 'l' })
      + ojo(31, 33, 4.4) + ojo(69, 33, 4.4)
      + agua('M27,57 Q50,78 73,57 Q50,63 27,57Z', '#B5475A', { f: 'l' }) + vel('M41,66 Q50,61 59,66 Q55,71.5 50,71.5 Q45,71.5 41,66Z', '#EE8FA8', { o: .9 })
      + punto(46, 48, 1.4, C.hojaO, .9) + punto(54, 48, 1.4, C.hojaO, .9) + colorete(22, 58, 6) + colorete(78, 58, 6)),
    sorpresa_mono: () => svg('0 0 100 100',
      gorguera(C.turq || T.turq, C.sol)
      + [20, 80].map((x, i) => agua(mancha(x, 47, 11, 11, 3 + i, .08), T.cuero) + agua(mancha(x, 47, 6, 6.5, 5 + i, .1), C.crema, { f: 'l' })).join('')
      + agua('M41,22 Q39,12 46,14 Q46,5 53,9 Q58,4 59,14 Q65,13 61,22Z', T.cuero, { f: 'l' })
      + agua(mancha(50, 47, 28, 29, 7, .05), T.cuero)
      + agua(liso([[30, 42], [40, 34], [50, 40], [60, 34], [70, 42], [72, 58], [60, 70], [50, 72], [40, 70], [28, 58]]), C.crema)
      + ojo(41, 45, 3.2) + ojo(59, 45, 3.2) + punto(47, 56, 1.5, T.tinta) + punto(53, 56, 1.5, T.tinta)
      + trazo('M41,62 Q50,70 59,62', 2, T.tinta, { o: .85 }) + colorete(33, 60, 4.5) + colorete(67, 60, 4.5)),
    sorpresa_unicornio: () => svg('0 0 100 100',
      gorguera(C.violeta, C.rosa)
      + unicornio(.46, 10, 1)
      + estrella(14, 16, 4.5, AMA) + estrella(90, 12, 3.5, PAPEL)),
    sorpresa_fantasma: () => svg('0 0 100 100',
      gorguera('#C9B5FF'.length ? C.violeta : C.violeta, C.cielo)
      + agua('M22,58 C14,56 12,46 16,42 C20,44 22,48 26,50Z', PAPEL, { f: 'l' }) + agua('M78,54 C88,50 90,40 86,36 C82,38 78,44 74,46Z', PAPEL, { f: 'l' })
      + agua('M22,64 C20,50 21,40 26,31 C32,20 42,14 50,14 C58,14 68,20 74,31 C79,40 80,50 78,64 C76,76 66,82 50,82 C34,82 24,76 22,64Z', PAPEL)
      + vel('M62,24 Q78,36 78,62 Q74,80 50,82 Q70,66 62,24Z', C.cieloO, { o: .45 })
      + agua(mancha(40, 44, 5.5, 7.5, 3, .08), T.tinta, { f: 'l' }) + agua(mancha(60, 44, 5.5, 7.5, 4, .08), T.tinta, { f: 'l' }) + punto(38.5, 41, 2, PAPEL, .95) + punto(58.5, 41, 2, PAPEL, .95)
      + agua(mancha(50, 61, 6, 7.5, 5, .08), '#9C4A5A', { f: 'l' }) + colorete(31, 54, 5) + colorete(69, 54, 5)
      + estrella(10, 14, 4.5, AMA) + estrella(90, 74, 4, C.violeta)),

    // ===================== BRUJA LUCÍA =====================
    bruja_lucia: () => bruja(false),
    bruja_lucia_hechizo: () => bruja(true),

    // ===================== CALCETINES =====================
    calcetin_perdido: () => svg(CAL_VB, suelo(92, 182, 54) + `<g transform="translate(110 8) rotate(12) scale(.9) translate(-80 0)">${calcetin(true)}</g>`),
    calcetines_juntos: () => { const sc = .66;
      return svg(CAL_VB, suelo(100, 162, 80)
        + `<g transform="rotate(5 96 154)"><g transform="translate(${f1(96 - 132 * sc)} ${f1(54 - 22 * sc)}) scale(${sc})">${calcetin(false, -18)}</g></g>`
        + `<g transform="rotate(-5 104 154)"><g transform="translate(${f1(104 + 132 * sc)} ${f1(54 - 22 * sc)}) scale(${-sc} ${sc})">${calcetin(false, -18)}</g></g>`
        + pincel('M102,112 Q92,119 81,110', 5, PAPEL) + agua(mancha(79, 108, 6, 6, 3, .1), PAPEL, { f: 'l' }) + agua(mancha(137, 107, 6, 6, 4, .1), PAPEL, { f: 'l' })
        + agua(corazon(100, 34, 15), C.rojo) + agua(corazon(70, 38, 6), C.rosa, { f: 'l' }) + agua(corazon(132, 34, 7), C.rosa, { f: 'l' })
        + estrella(40, 70, 5, AMA) + estrella(162, 64, 4, PAPEL)); },
  });
})();
