// Pinturas: visiones-caras
(() => {
  const { agua, vel, trazo, pincel, punto, gotas, mancha, liso, pig, carga, lava, svg, C, ojo, sonrisa, colorete, hierba, flor, nubeD, LINEA, PAPEL, azar, f1 } = AQ;
  const M = mancha;
  const SOMB = (x, y, rx, s = 2) => vel(M(x, y, rx, 7, s, .1), C.grisO, { o: .3 });
  // corazón a pincel: (x,y) = centro, s = tamaño
  const cor = (x, y, s) => `M${f1(x)},${f1(y + s * .95)} C${f1(x - s * 1.7)},${f1(y - s * .1)} ${f1(x - s * .9)},${f1(y - s * 1.35)} ${f1(x)},${f1(y - s * .45)} C${f1(x + s * .9)},${f1(y - s * 1.35)} ${f1(x + s * 1.7)},${f1(y - s * .1)} ${f1(x)},${f1(y + s * .95)}Z`;
  // destello de cuatro puntas
  const chis = (x, y, r, c = C.solO) => trazo(`M${x - r},${y} L${x + r},${y} M${x},${y - r} L${x},${y + r}`, 2, c, { o: .8 });
  // espiral (ojos del mareo)
  const espiral = (x, y, r, giro = 1) => { const P = []; for (let i = 0; i <= 14; i++) { const a = i * .55 * giro, q = r * i / 14; P.push([x + Math.cos(a) * q, y + Math.sin(a) * q]); } return liso(P, true); };
  // estrella de cinco puntas, con un temblor de mano
  const estrella = (cx, cy, R, r, sd) => { const q = azar(sd); let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, k = (i % 2 ? r : R) * (1 + (q() - .5) * .06); d += (i ? 'L' : 'M') + f1(cx + Math.cos(a) * k) + ',' + f1(cy + Math.sin(a) * k); } return d + 'Z'; };

  // ====== CARAS: una sola base amarilla, solo cambian los rasgos ======
  const cara = (cx = 50, cy = 50, r = 40, c = C.sol, s = 1) =>
    agua(M(cx, cy, r, r * .97, s, .035, 12), c)
    + vel(M(cx + r * .28, cy + r * .42, r * .7, r * .5, s + 1, .12), carga(c, .82), { o: .4 });
  const BOCA = '#C9605F';
  const ceja = (d, w = 3.2) => trazo(d, w, LINEA, { o: .75 });
  const gota = (x, y, k = 1) => agua(`M${x},${y - 6 * k} Q${x + 5 * k},${y + 1 * k} ${x + 3.6 * k},${y + 5 * k} Q${x},${y + 8 * k} ${x - 3.6 * k},${y + 5 * k} Q${x - 5 * k},${y + 1 * k} ${x},${y - 6 * k}Z`, C.cielo, { f: 'l' });
  const ojoBlanco = (x, y, rx, ry, s) => agua(M(x, y, rx, ry, s, .05), PAPEL, { f: 'l' });

  Object.assign(ILUS, {
    cara_contenta: (o = {}) => svg('0 0 100 100',
      cara(50, 50, 40, C.sol, 3)
      + colorete(23, 58, 7) + colorete(77, 58, 7)
      + ojo(36, 41, 3.8) + ojo(64, 41, 3.8)
      + agua(`M29,59 Q50,90 71,59 Q50,66 29,59Z`, BOCA) + vel(M(50, 75, 10, 5, 31, .1), C.rosa, { o: .8 })),

    cara_risa: (o = {}) => svg('0 0 100 100',
      cara(50, 50, 40, C.sol, 5)
      + colorete(22, 58, 7) + colorete(78, 58, 7)
      + trazo('M27,33 L41,41 L27,48', 3.6) + trazo('M73,33 L59,41 L73,48', 3.6)
      + agua(`M26,55 Q50,94 74,55 Q50,62 26,55Z`, BOCA) + vel(M(50, 76, 13, 6, 32, .1), C.rosa, { o: .8 })
      + gota(13, 52, 1.1) + gota(87, 52, 1.1)),

    cara_sorpresa: (o = {}) => svg('0 0 100 100',
      cara(50, 50, 40, C.sol, 7)
      + colorete(22, 59, 7) + colorete(78, 59, 7)
      + ceja('M26,25 Q35,17 44,23') + ceja('M56,23 Q65,17 74,25')
      + ojoBlanco(36, 40, 7, 8, 40) + ojoBlanco(64, 40, 7, 8, 41) + ojo(36, 41, 3.8) + ojo(64, 41, 3.8)
      + agua(M(50, 71, 7.5, 10, 33, .08), '#A8505F') + vel(M(50, 76, 5, 3.4, 34, .1), C.rosa, { o: .8 })),

    cara_triste: (o = {}) => svg('0 0 100 100',
      cara(50, 50, 40, C.sol, 9)
      + colorete(23, 59, 7) + colorete(77, 59, 7)
      + ceja('M26,31 Q34,30 42,22') + ceja('M74,31 Q66,30 58,22')
      + ojo(36, 43, 3.8) + ojo(64, 43, 3.8)
      + trazo('M39,73 Q50,63 61,73', 3.4) + gota(69, 60, 1.1)),

    cara_dormida: (o = {}) => svg('0 0 100 100',
      cara(42, 60, 34, C.sol, 11)
      + colorete(21, 70, 6) + colorete(63, 70, 6)
      + trazo('M23,58 Q29,64 35,58', 3.4) + trazo('M49,58 Q55,64 61,58', 3.4)
      + agua(M(42, 76, 3.8, 5, 35, .1), '#A8505F', { f: 'l' })
      + trazo('M60,31 h9 l-9,9 h9', 3, carga(C.violeta, .8), { o: .9 }) + trazo('M71,9 h13 l-13,13 h13', 4, carga(C.violeta, .8), { o: .9 })),

    cara_enamorada: (o = {}) => svg('0 0 100 100',
      cara(50, 50, 40, C.sol, 13)
      + colorete(21, 59, 7) + colorete(79, 59, 7)
      + agua(cor(35, 41, 8.6), C.rojoO, { f: 'l' }) + agua(cor(65, 41, 8.6), C.rojoO, { f: 'l' })
      + punto(29, 35, 2, PAPEL, .85) + punto(59, 35, 2, PAPEL, .85)
      + agua(`M32,62 Q50,86 68,62 Q50,67 32,62Z`, BOCA) + vel(M(50, 73, 8, 4, 36, .1), C.rosa, { o: .8 })),

    cara_guino: (o = {}) => svg('0 0 100 100',
      cara(50, 50, 40, C.sol, 15)
      + colorete(23, 57, 7) + colorete(77, 57, 7)
      + ojo(36, 40, 3.9) + trazo('M57,42 Q64,35 71,42', 3.4)
      + agua(`M31,58 Q50,65 69,58 Q64,76 50,76 Q36,76 31,58Z`, BOCA)
      + agua(`M48,70 Q50,89 58,88 Q67,87 64,69Z`, C.rosaO) + trazo('M57,72 L58,81', 1.8, carga(C.rosaO, .7), { o: .6 })),

    cara_rica: (o = {}) => svg('0 0 100 100',
      cara(50, 50, 40, C.sol, 17)
      + colorete(23, 57, 7) + colorete(77, 57, 7)
      + trazo('M29,43 Q36,35 43,43', 3.4) + trazo('M57,43 Q64,35 71,43', 3.4)
      + trazo('M32,60 Q46,74 62,64', 3.4)
      + agua(`M57,65 C58,57 67,53 72,57 C76,62 69,69 62,70Z`, C.rojo) + trazo('M62,66 Q66,61 70,60', 1.6, carga(C.rojo, .7), { o: .7 })),

    cara_nada: (o = {}) => svg('0 0 100 100',
      vel(M(50, 50, 40, 39, 19, .04, 12), C.sol, { o: .3 })
      + Array.from({ length: 30 }, (_, i) => { const a = i / 30 * Math.PI * 2; return punto(50 + Math.cos(a) * 40, 50 + Math.sin(a) * 40, 2.2, C.grisO, .6); }).join('')
      + punto(37, 45, 3.4, C.grisO, .75) + punto(63, 45, 3.4, C.grisO, .75)
      + punto(42, 64, 1.8, C.grisO, .7) + punto(50, 64, 1.8, C.grisO, .7) + punto(58, 64, 1.8, C.grisO, .7)),

    cara_enfadada: (o = {}) => svg('0 0 100 100',
      pincel('M20,38 q-5,-5 0,-10 t0,-10', 3.6, C.gris, { f: 'l', o: .85 }) + pincel('M31,28 q-4.5,-4 0,-8 t0,-8', 3.4, C.gris, { f: 'l', o: .85 })
      + pincel('M80,38 q5,-5 0,-10 t0,-10', 3.6, C.gris, { f: 'l', o: .85 }) + pincel('M69,28 q4.5,-4 0,-8 t0,-8', 3.4, C.gris, { f: 'l', o: .85 })
      + cara(50, 58, 35, C.naranja, 21)
      + colorete(25, 72, 6) + colorete(75, 72, 6)
      + ojo(37, 59, 3.7) + ojo(63, 59, 3.7)
      + trazo('M26,45 L43,52', 4.4) + trazo('M74,45 L57,52', 4.4)
      + trazo('M42,79 Q50,72 58,79', 3.4)),

    cara_tapa_ojos: (o = {}) => {
      const MONO = C.tronco, PIEL = C.tierra;
      const mano = (x, r) => `<g transform="rotate(${r} ${x} 46)">` + agua(M(x, 46, 13, 12, 50 + x, .09), PIEL) + vel(M(x + 3, 51, 9, 6, 51 + x, .12), C.troncoO, { o: .3 })
        + trazo(`M${x - 5},35 V42 M${x + 1},34 V42 M${x + 7},36 V42`, 1.8, C.troncoO, { o: .6 }) + `</g>`;
      return svg('0 0 100 100',
        agua(M(16, 50, 10, 10, 22, .08), MONO) + vel(M(16, 50, 5, 5, 23, .1), C.crema, { o: .8 })
        + agua(M(84, 50, 10, 10, 24, .08), MONO) + vel(M(84, 50, 5, 5, 25, .1), C.crema, { o: .8 })
        + agua(M(50, 52, 35, 34, 26, .04), MONO) + vel(M(58, 68, 26, 18, 27, .12), C.troncoO, { o: .35 })
        + trazo('M44,19 Q47,11 52,17 Q56,11 58,19', 2.4, C.troncoO, { o: .8 })
        + agua(M(50, 67, 23, 15, 28, .07), C.crema)
        + punto(46, 62, 1.7, C.troncoO) + punto(54, 62, 1.7, C.troncoO) + trazo('M41,70 Q50,78 59,70', 2.6)
        + colorete(31, 68, 5) + colorete(69, 68, 5)
        + mano(37, -12) + mano(63, 12));
    },

    cara_pensando: (o = {}) => svg('0 0 100 100',
      cara(56, 44, 36, C.sol, 29)
      + colorete(38, 55, 6) + colorete(82, 55, 6)
      + ceja('M40,23 Q46,16 53,20') + ceja('M64,26 L77,24')
      + ojoBlanco(46, 38, 6, 7, 42) + ojoBlanco(70, 38, 6, 7, 43) + ojo(48, 40, 3.7) + ojo(72, 40, 3.7)
      + trazo('M54,62 L69,58', 3.4)
      + pincel('M38,80 L51,68', 7, C.sol, { f: 'l' })
      + agua(M(35, 82, 13, 11, 44, .1), C.sol) + vel(M(38, 87, 9, 5, 45, .12), C.solO, { o: .5 })
      + trazo('M42,81 Q45,80 48,81 M41,87 Q44,86 47,87', 2, carga(C.solO, .8), { o: .7 })),

    cara_secreto: (o = {}) => svg('0 0 100 100',
      cara(50, 41, 34, C.sol, 31)
      + colorete(25, 51, 5.5) + colorete(75, 51, 5.5)
      + ceja('M29,21 Q35,16 42,19') + ceja('M58,19 Q65,16 71,21')
      + ojo(37, 36, 3.7) + ojo(63, 36, 3.7)
      + agua(M(50, 58, 10, 5, 46, .1), BOCA, { f: 'l' })
      + agua('M45.5,50 Q45,43 50.5,43 Q56,43 55.5,50 L55,80 L45.5,80Z', C.sol) + vel('M51,45 Q56,45 55.5,50 L55,80 L50,80Z', C.solO, { o: .5 })
      + agua(M(49, 83, 13, 10, 47, .1), C.sol) + vel(M(52, 88, 9, 5, 48, .12), C.solO, { o: .5 })
      + trazo('M40,82 Q43,81 46,82 M40,88 Q43,87 46,88', 2, carga(C.solO, .8), { o: .7 })),
  });

  // ====== VISIONES (200×200): sobre fondo de color, así que con base clara ======
  const TAN = '#E3BE90', TANO = '#C99A68', MARR = '#B99370';
  const TURQ = pig('#35B9C0'), TURQO = carga(TURQ, .8);
  const VERDE = pig('#4FAE5A'), VERDEO = carga(VERDE, .78);
  Object.assign(ILUS, {
    // Calcetín de rayas: una mancha, rayas de pincel, talón y puntera ocres
    vision_calcetin: (o = {}) => svg('0 0 200 200',
      agua('M102,26 Q128,22 154,26 Q157,70 153,108 Q150,160 118,174 Q90,179 66,177 Q46,175 46,153 Q46,134 66,130 Q92,128 100,123 Q104,72 102,26Z', PAPEL)
      + vel('M126,30 Q154,28 154,40 Q157,80 153,110 Q150,160 118,174 Q100,178 80,177 Q120,160 128,110Z', C.grisO, { o: .22 })
      + agua('M104,50 Q128,46 152,50 L152,66 Q128,62 104,67Z', C.rosa) + agua('M104,76 Q128,72 153,76 L153,92 Q128,88 104,93Z', TURQ) + agua('M103,102 Q128,98 153,102 L152,118 Q128,114 102,119Z', C.rosa)
      
      + agua('M99,18 Q128,12 158,18 Q160,30 158,42 Q128,48 98,42 Q96,30 99,18Z', C.violeta)
      + trazo('M110,22 V38 M122,21 V39 M134,21 V39 M146,22 V38', 2, carga(C.violeta, .75), { o: .6 })
      + agua(M(138, 158, 19, 16, 3, .1), C.paja) + agua(M(62, 152, 15, 14, 4, .1), C.paja)
      + chis(176, 44, 5) + chis(26, 40, 4)),

    // Arcoíris con dos nubecitas
    vision_arcoiris: (o = {}) => svg('0 0 200 200',
      ['#E98E86', '#F4B77E', '#F6D978', '#A7CF8E', '#9CCBEA', '#B9A2DE'].map((c, i) => { const r = 74 - i * 10; return pincel(`M${100 - r},136 A${r},${r} 0 0 1 ${100 + r},136`, 11, c, { o: .92 }); }).join('')
      + nubeD(36, 142, .42, 2) + nubeD(164, 142, .42, 5)
      + chis(100, 28, 5) + chis(30, 66, 4) + chis(172, 70, 4)),

    // Perrito sentado de frente, con collar rojo y la lengua fuera
    vision_perrito: (o = {}) => svg('0 0 200 200',
      SOMB(100, 182, 50, 2)
      + pincel('M144,152 Q168,146 164,114', 7, TAN)
      + agua(M(100, 142, 34, 36, 3, .06), TAN) + agua(M(100, 152, 17, 22, 4, .08), C.crema)
      + agua(M(84, 166, 10, 16, 5, .08), TAN) + agua(M(116, 166, 10, 16, 6, .08), TAN)
      + agua(M(84, 180, 11, 6, 7, .1), C.crema, { f: 'l' }) + agua(M(116, 180, 11, 6, 8, .1), C.crema, { f: 'l' })
      + agua(M(66, 58, 13, 25, 9, .08), MARR, { t: 'rotate(14 66 58)' }) + agua(M(134, 58, 13, 25, 10, .08), MARR, { t: 'rotate(-14 134 58)' })
      + agua(M(100, 68, 34, 31, 11, .05), TAN)
      + vel(M(112, 84, 22, 16, 12, .12), TANO, { o: .3 })
      + agua(M(100, 83, 17, 13, 13, .06), C.crema)
      + agua(M(100, 76, 5, 4, 14, .1), '#5B4B63', { f: 'l' }) + trazo('M100,80 v5 M92,88 Q100,92 108,88', 2)
      + agua(M(100, 95, 4.5, 6, 15, .1), C.rosaO, { f: 'l' })
      + ojo(85, 62, 4.4) + ojo(115, 62, 4.4) + colorete(72, 76, 6) + colorete(128, 76, 6)
      + pincel('M78,108 Q100,118 122,108', 6.5, C.rojo) + punto(100, 118, 3.4, C.sol, .95)
      + chis(172, 56, 5) + trazo('M172,86 q8,8 0,18', 2, C.grisO, { o: .6 })),

    // Regalo: caja roja con lunares, lazo amarillo
    vision_regalo: (o = {}) => svg('0 0 200 200',
      SOMB(100, 180, 60, 2)
      + agua('M50,88 Q47,130 50,170 Q100,177 150,170 Q153,130 150,88Z', C.rojo)
      + vel('M112,88 L150,88 Q153,130 150,170 L114,174Z', C.rojoO, { o: .4 })
      + [[66, 112], [64, 146], [128, 126], [132, 154], [84, 164]].map(([x, y], i) => agua(M(x, y, 5, 5, i + 4, .12), PAPEL, { f: 'l' })).join('')
      + agua('M91,90 Q89,132 92,172 L109,172 Q111,132 109,90Z', C.sol)
      + agua('M38,66 Q40,57 100,58 Q160,57 162,66 L160,92 Q100,99 40,92Z', C.rojo) + vel('M40,82 Q100,92 160,82 L160,92 Q100,99 40,92Z', C.rojoO, { o: .35 })
      + agua('M90,60 L110,60 L111,96 L89,95Z', C.sol)
      + agua('M100,60 Q68,24 54,38 Q52,56 100,60Z', C.sol) + agua('M100,60 Q132,24 146,38 Q148,56 100,60Z', C.sol)
      + vel('M100,60 Q76,40 62,44 Q72,56 100,60Z', C.solO, { o: .5 }) + agua(M(100, 60, 8, 7, 12, .1), C.solO)
      + chis(176, 40, 5) + chis(24, 56, 4)),

    // Risa: cara amarilla que llora de risa
    vision_risa: (o = {}) => svg('0 0 200 200',
      agua(M(100, 96, 58, 56, 5, .035, 12), C.sol) + vel(M(120, 122, 40, 32, 6, .12), C.solO, { o: .45 })
      + colorete(54, 118, 11) + colorete(146, 118, 11)
      + trazo('M56,70 L82,84 L56,98', 5) + trazo('M144,70 L118,84 L144,98', 5)
      + agua('M54,112 Q100,176 146,112 Q100,124 54,112Z', BOCA) + vel(M(100, 148, 24, 11, 7, .1), C.rosa, { o: .8 })
      + gota(36, 118, 2) + gota(166, 118, 2)),

    // Abrazo: dos alubias, una rosa y otra turquesa, abrazadas, y un corazón
    vision_abrazo: (o = {}) => svg('0 0 200 200',
      SOMB(100, 182, 62, 2)
      + agua(M(122, 118, 34, 46, 3, .06), TURQ, { t: 'rotate(8 122 118)' }) + vel(M(132, 138, 22, 26, 4, .12), TURQO, { o: .35 })
      + agua(M(80, 116, 34, 48, 5, .06), C.rosa, { t: 'rotate(-8 80 116)' }) + vel(M(70, 138, 22, 26, 6, .12), C.rosaO, { o: .4 })
      + trazo('M62,98 q6,6 12,0 M88,98 q6,6 12,0', 2.6) + trazo('M70,116 Q78,124 86,116', 2.4)
      + trazo('M116,98 q6,6 12,0 M138,98 q6,6 12,0', 2.6) + trazo('M122,116 Q130,124 138,116', 2.4)
      + colorete(58, 108, 6) + colorete(100, 108, 6)
      + pincel('M62,134 Q100,160 142,130', 9, C.rosaO) + pincel('M144,134 Q112,152 86,140', 9, TURQO)
      + agua(cor(100, 38, 14), C.rojo) + agua(cor(60, 26, 6), C.rosa, { f: 'l' }) + agua(cor(146, 36, 7), C.rosa, { f: 'l' })),

    // Pizza: porción con corteza, queso y pepperoni
    vision_pizza: (o = {}) => svg('0 0 200 200',
      SOMB(100, 180, 40, 2)
      + agua('M34,58 Q100,44 166,58 Q134,118 102,172 Q70,118 34,58Z', C.sol)
      + vel('M110,64 Q150,60 166,58 Q134,118 102,172Z', C.solO, { o: .4 })
      + agua('M28,50 Q100,34 172,50 Q174,62 166,66 Q100,52 34,66 Q26,60 28,50Z', C.paja) + vel('M30,58 Q100,42 170,58 Q172,64 166,66 Q100,52 34,66Z', C.pajaO, { o: .5 })
      + agua(M(76, 84, 14, 13, 3, .1), C.rojo) + agua(M(122, 86, 13, 12, 4, .1), C.rojo) + agua(M(100, 126, 11, 10, 5, .1), C.rojo)
      + vel(M(80, 88, 7, 6, 6, .1), C.rojoO, { o: .6 }) + vel(M(125, 90, 7, 6, 7, .1), C.rojoO, { o: .6 }) + vel(M(102, 130, 6, 5, 8, .1), C.rojoO, { o: .6 })
      + agua(M(98, 100, 5, 4, 9, .15), C.hoja, { f: 'l' }) + agua(M(142, 108, 4.5, 4, 10, .15), C.hoja, { f: 'l' }) + agua(M(66, 108, 4.5, 4, 11, .15), C.hoja, { f: 'l' })),

    // Brócoli: copa de manchas verdes, tronco claro, cara y un brazo fuerte
    vision_brocoli: (o = {}) => svg('0 0 200 200',
      SOMB(100, 186, 40, 2)
      + agua('M82,188 Q78,150 80,116 L122,116 Q124,150 120,188 Q100,192 82,188Z', C.prado) + vel('M104,118 L122,116 Q124,150 120,188 L106,190Z', C.pradoO, { o: .4 })
      + agua(M(70, 78, 28, 26, 3, .1), VERDE) + agua(M(132, 78, 28, 26, 4, .1), VERDEO, { o: .92 }) + agua(M(100, 54, 32, 28, 5, .1), VERDE)
      + agua(M(84, 102, 26, 20, 6, .1), VERDEO, { o: .9 }) + agua(M(118, 102, 26, 20, 7, .1), VERDE)
      + vel(M(120, 92, 36, 22, 8, .2), VERDEO, { o: .3 })
      + ojo(92, 138, 3.8) + ojo(112, 138, 3.8) + sonrisa(102, 150, 14) + colorete(82, 148, 5) + colorete(124, 148, 5)
      + pincel('M122,150 Q150,152 152,124', 10, C.prado) + agua(M(152, 116, 9, 9, 9, .1), C.prado)
      + chis(40, 54, 5, C.hojaO)),

    // Helado: cucurucho, dos bolas y una cereza
    vision_helado: (o = {}) => svg('0 0 200 200',
      SOMB(100, 192, 30, 2)
      + agua('M68,104 Q100,112 134,104 L102,190Z', C.paja) + vel('M102,108 L134,104 L102,190Z', C.pajaO, { o: .45 })
      + trazo('M78,114 L98,160 M96,110 L110,166 M116,110 L102,176', 1.8, C.pajaO, { o: .7 })
      + agua('M64,100 Q60,80 82,76 Q100,70 120,76 Q142,82 138,100 Q132,114 124,108 Q116,118 108,108 Q96,116 88,108 Q78,116 64,100Z', C.rosa) + vel(M(120, 92, 18, 8, 3, .15), C.rosaO, { o: .4 })
      + agua(M(100, 66, 30, 24, 4, .08), C.tronco) + vel(M(110, 74, 18, 12, 5, .15), C.troncoO, { o: .4 })
      + agua(M(102, 40, 8.5, 8.5, 6, .08), C.rojo, { f: 'l' }) + trazo('M102,32 Q106,22 114,18', 2, C.troncoO) + punto(99, 37, 1.8, PAPEL, .8)
      + trazo('M86,60 l5,3 M110,56 l-4,5 M122,70 l5,-2 M94,78 l4,4', 2.2, C.solO, { o: .85 }) + trazo('M104,70 l5,2 M78,72 l3,-4', 2.2, C.azul, { o: .85 })),

    // Macarrones en cuenco azul con salsa de tomate
    vision_macarrones: (o = {}) => svg('0 0 200 200',
      SOMB(100, 180, 62, 2)
      + agua('M40,116 Q38,84 70,78 Q100,66 134,78 Q164,86 160,116Z', C.sol) + vel(M(118, 98, 34, 14, 3, .15), C.pajaO, { o: .35 })
      + trazo('M56,96 q8,-8 16,0 M84,86 q8,-8 16,0 M116,90 q8,-8 16,0 M70,108 q8,-8 16,0 M104,104 q8,-8 16,0 M138,104 q6,-6 12,0', 2.4, C.pajaO, { o: .8 })
      + agua(M(100, 96, 24, 11, 3, .1), C.rojo) + vel(M(104, 98, 12, 5, 4, .1), C.rojoO, { o: .5 })
      + agua('M94,84 Q100,70 112,78 Q108,90 94,84Z', C.hoja, { f: 'l' })
      + agua('M30,112 Q34,166 100,176 Q166,166 170,112 Q100,124 30,112Z', C.azul) + vel('M110,120 Q166,114 170,112 Q166,166 100,176Z', carga(C.azul, .75), { o: .35 })
      + [[56, 138], [78, 152], [102, 156], [126, 152], [148, 138]].map(([x, y], i) => agua(M(x, y, 4.2, 4.2, i + 3, .12), PAPEL, { f: 'l' })).join('')
      + chis(34, 56, 4) + chis(170, 62, 4)),

    // Fresas: tres, la grande en medio
    vision_fresas: (o = {}) => {
      const fresa = (x, y, k, s) => agua(`M${x - 28 * k},${y - 16 * k} Q${x},${y - 30 * k} ${x + 28 * k},${y - 16 * k} Q${x + 30 * k},${y + 16 * k} ${x + 4 * k},${y + 42 * k} Q${x - 4 * k},${y + 44 * k} ${x - 12 * k},${y + 32 * k} Q${x - 32 * k},${y + 8 * k} ${x - 28 * k},${y - 16 * k}Z`, C.rojo)
        + vel(M(x + 10 * k, y + 10 * k, 16 * k, 20 * k, s, .15), C.rojoO, { o: .4 })
        + [[-12, -4], [8, -8], [-2, 10], [14, 12], [-14, 14], [2, 26]].map(([dx, dy], i) => punto(x + dx * k, y + dy * k, 1.7 * k + .3, C.sol, .9)).join('')
        + agua(`M${x - 22 * k},${y - 22 * k} Q${x - 8 * k},${y - 38 * k} ${x},${y - 28 * k} Q${x + 10 * k},${y - 40 * k} ${x + 22 * k},${y - 22 * k} Q${x},${y - 18 * k} ${x - 22 * k},${y - 22 * k}Z`, C.hoja);
      return svg('0 0 200 200',
        SOMB(100, 178, 62, 2)
        + fresa(56, 124, .85, 3) + fresa(146, 122, .85, 4) + fresa(100, 112, 1.2, 5)
        + chis(34, 52, 4) + chis(172, 50, 5)); },

    // Tortitas con chocolate y una fresa encima
    vision_tortitas: (o = {}) => svg('0 0 200 200',
      agua(M(100, 160, 80, 17, 2, .05), PAPEL) + vel(M(104, 166, 70, 10, 3, .1), C.grisO, { o: .35 })
      + agua(M(100, 146, 62, 16, 4, .06), C.paja) + vel(M(100, 154, 56, 7, 5, .1), C.pajaO, { o: .5 })
      + agua(M(100, 124, 60, 15, 6, .06), C.pajaO, { o: .9 })
      + agua(M(100, 104, 58, 15, 7, .06), C.paja) + vel(M(100, 112, 52, 6, 8, .1), C.pajaO, { o: .5 })
      + agua('M44,96 Q48,80 100,76 Q152,80 156,96 Q150,108 144,112 Q142,100 136,112 Q128,122 124,108 Q114,112 108,106 Q98,112 90,106 Q82,124 74,108 Q64,114 56,110Z', C.tronco)
      + vel(M(110, 88, 30, 6, 9, .15), C.troncoO, { o: .4 })
      + agua(M(100, 58, 11, 12, 10, .1), C.rojo, { f: 'l' }) + agua('M90,50 Q100,42 110,50 Q100,52 90,50Z', C.hoja, { f: 'l' })),

    // Cohete en diagonal, con luna y estrellas
    vision_cohete: (o = {}) => svg('0 0 200 200',
      agua(M(158, 46, 20, 20, 3, .06), C.crema) + vel(M(165, 52, 12, 12, 4, .1), C.pajaO, { o: .3 }) + punto(152, 42, 3, C.pajaO, .5) + punto(166, 56, 2.4, C.pajaO, .5)
      + `<g transform="rotate(40 94 110)">`
      + agua('M94,168 Q80,190 94,200 Q108,190 94,168Z', C.naranja)
      + agua('M72,112 Q54,128 56,152 Q72,146 80,136Z', C.rojo) + agua('M116,112 Q134,128 132,152 Q116,146 108,136Z', C.rojo)
      + agua('M94,36 Q122,62 118,128 Q116,164 94,170 Q72,164 70,128 Q66,62 94,36Z', PAPEL) + vel('M104,50 Q122,70 118,128 Q116,164 94,170Z', C.grisO, { o: .3 })
      + agua('M94,36 Q108,48 114,66 Q94,72 74,66 Q80,48 94,36Z', C.rojo)
      + agua(M(94, 98, 12, 12, 5, .06), C.cielo)
      + `</g>`
      + chis(40, 36, 5) + chis(176, 120, 4) + chis(36, 150, 3.5)),

    // Tarta de tres pisos con velas
    vision_tarta: (o = {}) => svg('0 0 200 200',
      agua(M(100, 180, 70, 11, 3, .05), PAPEL) + vel(M(104, 184, 60, 6, 4, .1), C.grisO, { o: .35 })
      + agua('M42,132 Q40,160 44,172 Q100,180 156,172 Q160,160 158,132Z', C.rosa) + vel('M112,134 L158,132 Q160,160 156,172 Q130,176 112,176Z', C.rosaO, { o: .35 })
      + agua('M36,130 Q70,120 100,134 Q132,120 164,130 Q164,142 156,140 Q144,150 134,140 Q116,150 100,142 Q84,150 66,140 Q50,148 40,140Z', PAPEL) + vel('M120,132 Q150,126 164,130 Q164,142 156,140Z', C.grisO, { o: .2 })
      + agua('M58,96 Q56,114 60,128 Q100,134 142,128 Q146,114 142,96Z', PAPEL) + vel('M106,98 L142,96 Q146,114 142,128 Q124,132 106,132Z', C.grisO, { o: .22 })
      + pincel('M62,110 Q100,120 140,108', 6, C.rosa, { o: .85 })
      + agua('M74,74 Q72,88 76,98 Q100,104 128,98 Q130,88 126,74Z', C.rosa) + vel('M104,76 L126,74 Q130,88 128,98 Q116,102 104,100Z', C.rosaO, { o: .35 })
      + agua('M68,72 Q90,66 100,76 Q114,66 134,72 Q134,80 128,80 Q118,86 108,80 Q96,88 84,80 Q72,84 68,72Z', PAPEL)
      + [[86, 52, C.azul], [100, 48, C.rosa], [114, 52, C.sol]].map(([x, y, c], i) => agua(`M${x - 3},${y + 22} L${x - 3},${y} L${x + 3},${y} L${x + 3},${y + 22}Z`, c, { f: 'l' }) + agua(`M${x},${y - 12} Q${x + 5},${y - 4} ${x},${y} Q${x - 5},${y - 4} ${x},${y - 12}Z`, i % 2 ? C.naranja : C.sol, { f: 'l' })).join('')
      + [[56, 150], [78, 158], [124, 152], [144, 156], [70, 116], [120, 112]].map(([x, y], i) => punto(x, y, 2, [C.violeta, C.sol, C.azul][i % 3], .85)).join('')),

    // Veterinaria: fonendo turquesa, huella y corazón
    vision_veterinaria: (o = {}) => svg('0 0 200 200',
      pincel('M64,22 Q56,70 80,100 Q96,118 100,150', 6.5, TURQ) + pincel('M118,22 Q126,70 106,100 Q96,118 100,150', 6.5, TURQ)
      + pincel('M100,150 Q104,178 140,172 Q158,168 158,146', 6.5, TURQ)
      + agua(M(64, 20, 7, 7, 3, .1), C.gris, { f: 'l' }) + agua(M(118, 20, 7, 7, 4, .1), C.gris, { f: 'l' })
      + agua(M(158, 132, 19, 19, 5, .06), C.gris) + agua(M(158, 132, 11, 11, 6, .08), PAPEL) + vel(M(160, 135, 9, 9, 7, .1), C.grisO, { o: .4 })
      + agua(M(70, 142, 16, 14, 8, .1), C.rosa) + agua(M(46, 120, 7, 9, 9, .1), C.rosa) + agua(M(62, 108, 7, 9, 10, .1), C.rosa)
      + agua(M(82, 108, 7, 9, 11, .1), C.rosa) + agua(M(96, 122, 7, 9, 12, .1), C.rosa)
      + vel(M(72, 146, 10, 8, 13, .1), C.rosaO, { o: .5 })
      + agua(cor(166, 52, 9), C.rojo, { f: 'l' }) + chis(34, 70, 4) + chis(146, 24, 4)),

    // Paleta de pintor con sus pinturas y un pincel
    vision_paleta: (o = {}) => svg('0 0 200 200',
      agua('M28,98 Q22,52 80,36 Q148,24 176,70 Q186,108 152,122 Q130,130 126,148 Q120,172 86,168 Q34,160 28,98Z', C.tierra) + vel('M110,128 Q130,130 152,122 Q186,108 176,70 Q184,120 140,150 Q120,170 86,168Z', C.troncoO, { o: .3 })
      + agua(M(70, 128, 11, 9, 3, .1), PAPEL)
      + agua(M(60, 82, 12, 11, 4, .1), C.rojo) + agua(M(92, 62, 12, 10, 5, .1), C.azul) + agua(M(128, 70, 12, 11, 6, .1), VERDE) + agua(M(40, 112, 10, 9, 7, .1), C.sol) + agua(M(112, 104, 11, 10, 8, .1), PAPEL)
      + pincel('M96,166 L176,98', 8, TURQ) + agua('M170,104 Q182,88 190,80 Q184,98 176,106Z', C.rosa)
      + trazo('M150,128 l10,-8', 2, TURQO, { o: .5 })),

    // Corona de oro con joyas
    vision_corona: (o = {}) => svg('0 0 200 200',
      SOMB(100, 182, 64, 2)
      + agua('M34,152 L28,80 L66,112 L100,60 L134,112 L172,80 L166,152 Q100,160 34,152Z', C.sol) + vel('M104,66 L134,112 L172,80 L166,152 Q130,158 104,156Z', C.solO, { o: .45 })
      + agua('M32,148 Q100,158 168,148 L170,172 Q100,182 30,172Z', C.solO)
      + [[28, 74], [100, 54], [172, 74]].map(([x, y], i) => agua(M(x, y, 8, 8, i + 3, .1), PAPEL) + vel(M(x + 2, y + 2, 5, 5, i + 4, .1), C.grisO, { o: .35 })).join('')
      + agua(M(68, 162, 8, 7, 5, .1), C.azul, { f: 'l' }) + agua(M(100, 165, 8, 7, 6, .1), C.rojo, { f: 'l' }) + agua(M(132, 162, 8, 7, 7, .1), VERDE, { f: 'l' })
      + agua(cor(100, 128, 8), C.rosa, { f: 'l' })
      + chis(26, 44, 4) + chis(176, 44, 4)),

    // Dino explorador con sombrero y lupa
    vision_dinosaurio: (o = {}) => svg('0 0 200 200',
      SOMB(104, 184, 62, 2)
      + agua('M60,142 Q38,150 28,170 Q58,166 78,160Z', VERDE)
      + [[70, 96], [86, 84], [104, 82], [122, 90]].map(([x, y], i) => agua(`M${x - 8},${y + 6} L${x},${y - 12} L${x + 8},${y + 6}Z`, C.naranja, { f: 'l' })).join('')
      + agua(M(104, 130, 44, 38, 3, .06), VERDE) + vel(M(116, 146, 28, 20, 4, .12), VERDEO, { o: .35 }) + agua(M(112, 142, 26, 26, 5, .08), C.crema)
      + agua(M(92, 170, 12, 12, 6, .1), VERDE) + agua(M(128, 170, 12, 12, 7, .1), VERDE)
      + pincel('M122,106 Q132,92 136,84', 22, VERDE)
      + agua(M(140, 74, 28, 22, 8, .06), VERDE) + vel(M(146, 82, 18, 10, 9, .12), VERDEO, { o: .3 })
      + agua(M(134, 52, 28, 7, 10, .08), C.paja) + agua(M(134, 44, 14, 11, 11, .1), C.paja) + trazo('M122,50 Q134,56 148,50', 2, C.pajaO, { o: .7 })
      + ojo(138, 72, 4.2) + trazo('M146,86 Q158,88 164,82', 2) + colorete(130, 84, 5)
      + pincel('M134,134 Q148,142 150,152', 6, VERDE)
      + `<path d="${M(160, 158, 15, 15, 12, .05)}" fill="none" stroke="${TURQ}" stroke-width="5" stroke-linecap="round" filter="url(#§l)" opacity=".85"/>` + vel(M(160, 158, 12, 12, 13, .05), C.cielo, { o: .5 }) + trazo('M171,169 L184,182', 5, C.tronco, { o: .85 })
      + agua(M(34, 150, 14, 5, 14, .1), PAPEL, { f: 'l' })),

    // Dragón de frente: alas naranjas, vientre crema y cuernos
    vision_dragon: (o = {}) => svg('0 0 200 200',
      SOMB(100, 184, 54, 2)
      + agua('M70,110 Q30,80 20,110 Q36,114 40,130 Q56,124 66,138Z', C.naranja) + agua('M130,110 Q170,80 180,110 Q164,114 160,130 Q144,124 134,138Z', C.naranja)
      + pincel('M134,160 Q168,166 172,140 Q174,126 160,128', 10, TURQ)
      + agua(M(100, 134, 34, 40, 3, .06), TURQ) + vel(M(112, 148, 20, 24, 4, .12), TURQO, { o: .35 }) + agua(M(100, 142, 20, 28, 5, .08), C.crema)
      + trazo('M88,134 H112 M86,146 H114 M88,158 H112', 1.8, C.pajaO, { o: .5 })
      + agua(M(80, 174, 13, 8, 6, .1), TURQ) + agua(M(120, 174, 13, 8, 7, .1), TURQ)
      + agua('M76,52 Q72,32 80,24 Q88,36 90,50Z', C.crema) + agua('M124,52 Q128,32 120,24 Q112,36 110,50Z', C.crema)
      + agua(M(100, 72, 32, 28, 8, .05), TURQ) + vel(M(112, 84, 20, 14, 9, .12), TURQO, { o: .3 })
      + agua(M(100, 86, 16, 11, 10, .06), lava(TURQ, .5)) + punto(94, 86, 2.2, TURQO) + punto(106, 86, 2.2, TURQO)
      + ojo(84, 66, 4.6) + ojo(116, 66, 4.6) + colorete(70, 80, 5) + colorete(130, 80, 5) + sonrisa(100, 95, 12)
      + chis(176, 44, 5) + chis(26, 50, 4)),

    // Estrella amarilla con carita
    vision_estrella: (o = {}) => svg('0 0 200 200',
      agua(estrella(100, 108, 84, 40, 3), C.sol) + vel(M(120, 128, 40, 34, 4, .15), C.solO, { o: .45 })
      + ojo(86, 106, 5) + ojo(114, 106, 5) + colorete(72, 124, 8) + colorete(128, 124, 8) + sonrisa(100, 124, 16)
      + chis(34, 38, 5) + chis(172, 38, 5) + chis(30, 168, 4) + chis(172, 164, 5)),

    // Unicornio: cabeza blanca de perfil, melena de colores y cuerno dorado
    vision_unicornio: (o = {}) => svg('0 0 200 200',
      agua('M70,114 Q54,150 62,182 Q86,178 98,160 Q110,138 112,118Z', C.rosa)
      + agua('M64,76 Q36,98 44,134 Q54,118 62,112 Q58,94 72,84Z', C.violeta) + agua('M58,56 Q42,66 40,86 Q56,78 64,80Z', C.azul)
      + agua('M74,118 Q64,76 94,56 Q124,48 144,66 Q178,70 178,98 Q176,120 150,120 Q138,134 120,148 Q98,166 80,156 Q72,140 74,118Z', PAPEL)
      + vel('M120,76 Q164,76 178,98 Q176,120 150,120 Q138,134 120,148 Q108,150 106,128Z', C.grisO, { o: .22 })
      + agua('M104,56 Q108,34 120,26 Q124,40 126,60Z', PAPEL) + vel('M110,52 Q114,40 118,36 Q120,46 120,56Z', C.rosa, { o: .8 })
      + agua('M110,56 Q114,30 134,6 Q132,30 134,60Z', C.sol) + trazo('M114,44 L130,40 M114,32 L130,28', 1.8, C.solO, { o: .7 })
      + agua('M82,66 Q96,60 104,58 Q100,72 90,78Z', C.violeta)
      + ojo(120, 92, 4.4) + punto(166, 108, 2.4, C.rosaO, .9) + colorete(136, 108, 8)
      + trazo('M156,124 Q164,124 168,118', 1.8) + chis(34, 34, 4) + chis(172, 40, 4) + chis(40, 172, 4)),

    // Caramelos de envoltorio y un cepillo de dientes
    vision_caramelos: (o = {}) => {
      const car = (x, y, r, c, s) => `<g transform="rotate(${r} ${x} ${y})">` + agua(`M${x - 40},${y - 12} L${x - 22},${y} L${x - 40},${y + 12}Z`, lava(c, .3)) + agua(`M${x + 40},${y - 12} L${x + 22},${y} L${x + 40},${y + 12}Z`, lava(c, .3))
        + agua(M(x, y, 24, 15, s, .06), c) + vel(M(x + 4, y + 5, 16, 8, s + 1, .12), carga(c, .75), { o: .4 }) + trazo(`M${x - 8},${y - 8} q8,-4 16,0`, 1.8, PAPEL, { o: .8 }) + `</g>`;
      return svg('0 0 200 200',
        SOMB(100, 186, 62, 2)
        + pincel('M30,76 Q90,56 150,38', 11, TURQ) + trazo('M44,72 Q70,64 100,56', 2, TURQO, { o: .5 })
        + agua('M138,28 Q160,14 178,20 Q182,34 164,42 Q150,48 138,40Z', PAPEL) + trazo('M146,26 v10 M154,24 v10 M162,22 v12 M170,22 v10', 2.2, C.cielo, { o: .8 })
        + car(66, 116, -14, C.rosa, 3) + car(138, 112, 12, C.violeta, 5) + car(60, 160, 10, VERDE, 7) + car(138, 160, -10, C.rojo, 9)
        + trazo('M52,112 l6,-4 M126,108 l8,-3', 1.6, PAPEL, { o: .8 })); },

    // Mareo: bola azul con ojos de espiral y estrellas dando vueltas
    vision_mareo: (o = {}) => svg('0 0 200 200',
      trazo('M44,46 Q100,-4 172,56', 2.4, LINEA, { o: .5, x: ' stroke-dasharray="3 7"' })
      + agua(estrella(44, 48, 10, 4.5, 3), C.sol, { f: 'l' }) + agua(estrella(172, 58, 10, 4.5, 5), C.sol, { f: 'l' })
      + agua(M(100, 110, 58, 56, 3, .04, 12), C.cielo) + vel(M(118, 130, 40, 34, 4, .12), C.cieloO, { o: .45 })
      + trazo(espiral(78, 100, 15, 1), 2.4) + trazo(espiral(122, 100, 15, -1), 2.4)
      + trazo('M76,138 Q88,128 100,138 Q112,148 124,138', 3) + colorete(58, 120, 8) + colorete(142, 120, 8)
      + agua(estrella(100, 44, 8, 3.6, 7), C.sol, { f: 'l' })),
  });
})();
