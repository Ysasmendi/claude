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
})();
