// Pinturas: ui (glifos de interfaz, 100x100, se ven a 20-40px: pocas manchas, trazos gordos)
(() => {
  const { agua, vel, trazo, pincel, punto, gotas, mancha, liso, pig, carga, lava, svg, C, ojo, sonrisa, colorete, hierba, flor, nubeD, LINEA, PAPEL, azar, f1 } = AQ;
  const V = '0 0 100 100';
  // ---- ayudantes ----
  const K = (pts, c, o) => agua(liso(pts), c, o);                       // mancha por puntos
  const M = (x, y, a, b, s, c, o, irr = .07) => agua(mancha(x, y, a, b, s, irr), c, o);
  const flip = s => `<g transform="translate(100 0) scale(-1 1)">${s}</g>`;
  const rot = (s, a, x = 50, y = 50) => `<g transform="rotate(${a} ${x} ${y})">${s}</g>`;
  // cabeza de flecha / triángulo blando: la punta en (tx,ty), mirando a `ang` (rad)
  const head = (tx, ty, ang, L, W, c, o) => {
    const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx, bx = tx - dx * L, by = ty - dy * L;
    const P = (u, v) => [tx - dx * L * u + nx * W * v, ty - dy * L * u + ny * W * v];
    return K([P(0, 0), P(.5, .26), P(1, .5), P(.88, 0), P(1, -.5), P(.5, -.26)], c, o);
  };
  const est = (cx, cy, R, r, rt = -90) => { const P = []; for (let i = 0; i < 10; i++) { const a = (rt + i * 36) * Math.PI / 180, q = i % 2 ? r : R; P.push([cx + Math.cos(a) * q, cy + Math.sin(a) * q]); } return liso(P); };
  const chispa = (x, y, r, c) => agua(est(x, y, r, r * .38, -90), c, { f: 'l' });
  const AZ = C.azul, AZO = carga(C.azul, .8), TEAL = pig('#27B5A8'), TEALO = carga(TEAL, .8), PIEL = pig('#F0B48C'), PIELO = carga(PIEL, .85), CREMA = C.crema;
  const cara = (x, y, r) => ojo(x - r * .36, y - r * .1, r * .13 + 1.6) + ojo(x + r * .36, y - r * .1, r * .13 + 1.6);

  // Flecha a la derecha: un trazo de pincel y una punta cargada
  const flechaD = c => pincel('M15,50 Q36,48 58,50', 15, c) + head(91, 50, 0, 42, 64, c) + vel('M24,58 Q56,62 84,56 L90,52 Q60,60 22,56Z', carga(c, .8), { o: .35 });

  Object.assign(ILUS, {
    ui_casa: () => svg(V,
      agua('M20,48 Q18,70 22,90 Q50,94 78,90 Q82,70 80,48 Q50,56 20,48Z', C.crema)
      + vel('M54,56 Q78,52 80,52 Q82,72 78,90 Q60,92 56,90Z', C.pajaO, { o: .35 })
      + agua('M64,16 L78,16 L78,40 Q70,38 64,34Z', C.rojoO)
      + agua('M6,54 Q28,34 50,8 Q72,34 94,54 Q50,48 6,54Z', C.rojo)
      + vel('M50,8 Q72,34 94,54 Q70,50 52,50Z', C.rojoO, { o: .4 })
      + agua('M40,90 L40,72 Q50,60 60,72 L60,90Z', C.azul)),

    ui_atras: () => svg(V, flip(flechaD(C.sol))),
    ui_adelante: () => svg(V, flechaD(C.sol)),

    ui_recargar: () => svg(V,
      pincel('M80,57 A29,29 0 1 1 68,29', 15, C.hoja)
      + vel('M24,62 Q40,84 70,76 Q50,92 26,76Z', C.hojaO, { o: .5 })
      + head(81, 40, .75, 26, 34, C.hoja)),

    ui_lupa: () => svg(V,
      pincel('M60,60 L86,86', 14, C.tronco)
      + agua(mancha(40, 40, 28, 28, 5, .04), C.cielo)
      + vel(mancha(50, 52, 18, 14, 6, .15), C.cieloO, { o: .45 })
      + pincel(mancha(40, 40, 27, 27, 3, .04), 9, C.naranja)
      + trazo('M26,34 Q30,24 40,22', 3.4, PAPEL, { o: .9 })),

    ui_mas: () => svg(V,
      pincel('M50,14 Q52,50 50,86', 25, C.hoja)
      + pincel('M14,50 Q50,48 86,50', 25, C.hoja)
      + vel('M54,56 Q70,60 86,60 L86,70 Q60,68 54,70Z', C.hojaO, { o: .4 })),

    ui_luna: () => svg(V,
      agua('M64,8 Q20,14 20,52 Q22,88 66,92 Q38,70 40,50 Q42,28 64,8Z', C.sol)
      + vel('M24,58 Q34,84 62,90 Q36,86 26,64Z', C.solO, { o: .6 })
      + chispa(78, 36, 11, C.solO)),

    ui_tierra: () => svg(V,
      agua(mancha(50, 50, 42, 42, 4, .035), C.cielo)
      + vel(mancha(62, 64, 32, 28, 5, .15), C.cieloO, { o: .55 })
      + agua('M24,30 Q36,18 50,24 Q56,38 44,46 Q34,40 22,46Z', C.hoja)
      + agua('M60,48 Q76,40 86,54 Q82,76 66,84 Q58,68 60,48Z', C.hoja)
      + agua('M26,62 Q38,58 42,70 Q38,82 30,78Z', C.hoja)),

    ui_terremoto: () => svg(V,
      agua('M6,62 Q26,58 46,54 L42,90 Q24,92 6,90Z', C.tierra)
      + agua('M6,62 Q26,58 46,54 L45,62 Q24,66 6,70Z', C.hoja)
      + agua('M54,70 Q74,64 94,62 L94,90 Q74,92 56,90Z', C.tierra)
      + agua('M54,70 Q74,64 94,62 L94,70 Q74,74 54,78Z', C.hoja)
      + vel('M8,78 L42,76 L42,90 L8,90Z', C.troncoO, { o: .3 })
      + agua(mancha(36, 30, 8, 7, 3, .15), C.grisO, { f: 'l' }) + agua(mancha(62, 22, 6, 5, 4, .15), C.gris, { f: 'l' }) + agua(mancha(52, 42, 5, 5, 5, .15), C.grisO, { f: 'l' })
      + pincel('M14,34 L24,40', 4, C.grisO, { f: 'l' }) + pincel('M84,34 L76,42', 4, C.grisO, { f: 'l' }) + pincel('M86,50 L76,50', 4, C.grisO, { f: 'l' })),

    ui_escoba: () => svg(V,
      pincel('M86,12 Q70,34 52,52', 8, C.tronco)
      + agua('M54,46 Q64,56 66,66 Q50,90 14,90 Q18,72 34,52 Q44,42 54,46Z', C.paja)
      + vel('M30,66 Q46,64 62,70 Q44,88 18,88Z', C.pajaO, { o: .5 })
      + pincel('M38,52 Q50,54 62,64', 8, C.rojo)
      + trazo('M26,82 L38,66 M36,86 L48,70', 2.2, C.pajaO, { o: .7 })),

    ui_claqueta: () => svg(V,
      agua('M10,42 Q8,66 10,90 Q50,94 90,90 Q92,66 90,42 Q50,48 10,42Z', C.negro)
      + trazo('M22,62 L56,62 M22,76 L42,76', 3.4, PAPEL, { o: .85 })
      + agua('M8,22 Q50,10 90,10 L92,30 Q50,34 10,40Z', C.gris)
      + [0, 1, 2, 3].map(i => pincel(`M${22 + i * 20},${31 - i * 3.6} L${34 + i * 20},${15 - i * 3.6}`, 8, C.negro)).join('')
      + vel('M8,22 L92,20 L92,30 L10,40Z', C.grisO, { o: .3 })),

    ui_siguiente: () => svg(V,
      pincel('M86,22 Q88,50 86,78', 10, AZO)
      + head(46, 50, 0, 38, 62, AZ) + head(78, 50, 0, 38, 62, AZ)
      + vel('M12,60 L46,62 L36,74 L12,76Z', AZO, { o: .35 })),
    ui_anterior: () => svg(V, flip(
      pincel('M86,22 Q88,50 86,78', 10, AZO)
      + head(46, 50, 0, 38, 62, AZ) + head(78, 50, 0, 38, 62, AZ)
      + vel('M12,60 L46,62 L36,74 L12,76Z', AZO, { o: .35 }))),

    ui_pausa: () => svg(V,
      pincel('M33,18 Q35,50 33,82', 20, C.naranja) + pincel('M68,18 Q66,50 68,82', 20, C.naranja)
      + vel('M38,22 Q40,50 38,80 L42,80 Q43,50 42,22Z', C.rojoO, { o: .25 })),

    ui_play: () => svg(V,
      head(88, 50, 0, 68, 76, C.hoja)
      + vel('M30,56 Q60,62 84,52 Q60,70 28,82Z', C.hojaO, { o: .5 })),

    ui_stop: () => svg(V,
      K([[18, 20], [50, 16], [82, 19], [85, 50], [82, 82], [50, 85], [18, 81], [15, 50]], C.rojo)
      + vel('M20,60 Q50,70 82,58 L82,82 Q50,86 20,80Z', C.rojoO, { o: .45 })),

    ui_repetir: () => svg(V,
      pincel('M18,52 Q16,28 40,28 L62,28', 11, C.violeta) + head(90, 28, 0, 26, 34, C.violeta)
      + pincel('M82,48 Q84,72 60,72 L38,72', 11, C.violeta) + head(10, 72, Math.PI, 26, 34, C.violeta)
      + vel('M16,34 Q40,38 50,34 L50,38 Q30,42 16,42Z', carga(C.violeta, .75), { o: .3 })),

    ui_nota: () => svg(V,
      pincel('M47,70 Q48,44 46,16', 8, AZO)
      + agua('M46,16 Q70,22 76,42 Q74,52 70,56 Q64,38 46,38Z', AZ)
      + agua(mancha(34, 74, 17, 13, 3, .06, 10, -.3), AZ)
      + vel(mancha(36, 78, 12, 7, 4, .12), AZO, { o: .45 })),

    ui_altavoz: () => svg(V,
      agua('M8,38 Q18,36 28,38 Q36,28 46,18 Q50,18 50,24 Q51,50 50,76 Q50,82 46,80 Q36,70 28,62 Q18,64 8,62Z', C.naranja)
      + vel('M26,60 Q40,70 48,78 L50,60Z', C.rojoO, { o: .35 })
      + pincel('M62,36 Q70,50 62,64', 7, C.sol) + pincel('M74,24 Q92,50 74,76', 7, C.solO)),
    ui_mudo: () => svg(V,
      agua('M6,38 Q16,36 26,38 Q34,28 44,18 Q48,18 48,24 Q49,50 48,76 Q48,82 44,80 Q34,70 26,62 Q16,64 6,62Z', C.naranja)
      + vel('M24,60 Q38,70 46,78 L48,60Z', C.rojoO, { o: .35 })
      + pincel('M62,36 Q74,50 90,66', 9, C.rojoO) + pincel('M90,34 Q76,50 62,66', 9, C.rojoO)),

    ui_idioma: () => svg(V,
      agua(mancha(38, 62, 31, 31, 6, .04), TEAL)
      + trazo('M10,62 Q38,70 66,60 M38,32 Q26,62 38,92 M38,32 Q52,62 38,92', 2.6, PAPEL, { o: .8 })
      + agua('M52,8 Q74,4 92,10 Q98,22 90,32 Q80,38 70,36 Q66,46 60,48 Q60,40 58,34 Q50,28 52,8Z', C.gris)
      + punto(64, 22, 3.3, LINEA, .8) + punto(75, 22, 3.3, LINEA, .8) + punto(86, 22, 3.3, LINEA, .8)),

    ui_web: () => svg(V,
      agua(mancha(44, 46, 35, 35, 7, .04), TEAL)
      + trazo('M10,46 Q44,56 78,44 M44,12 Q30,46 44,80 M44,12 Q60,46 44,80', 2.6, PAPEL, { o: .8 })
      + agua('M56,50 Q58,70 58,88 L68,78 Q74,88 80,92 L88,86 Q80,78 76,70 L90,68Z', C.negro)),

    ui_sol: () => svg(V,
      Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4 + .2, c = Math.cos(a), s = Math.sin(a); return pincel(`M${f1(50 + c * 36)},${f1(50 + s * 36)} L${f1(50 + c * 47)},${f1(50 + s * 47)}`, 9, i % 2 ? C.sol : C.solO, { f: 'l' }); }).join('')
      + agua(mancha(50, 50, 32, 32, 8, .04), C.sol)
      + vel(mancha(58, 58, 22, 20, 9, .15), C.solO, { o: .5 })
      + ojo(40, 45, 3.6) + ojo(60, 45, 3.6) + colorete(32, 58, 6) + colorete(68, 58, 6) + sonrisa(50, 56, 16)),

    ui_libros: () => svg(V,
      agua('M8,66 Q50,62 92,66 Q94,78 92,90 Q50,94 8,90 Q6,78 8,66Z', C.rojo)
      + agua('M82,68 Q90,78 88,88 Q80,86 80,78Z', PAPEL, { f: 'l' }) + vel('M8,82 L92,82 L92,90 L8,90Z', C.rojoO, { o: .4 })
      + agua('M14,42 Q54,38 86,42 Q88,54 86,64 Q50,68 12,64 Q10,52 14,42Z', AZ)
      + agua('M76,46 Q82,54 80,62 Q74,60 74,54Z', PAPEL, { f: 'l' })
      + agua('M18,14 Q50,12 82,22 L78,40 Q48,34 14,34Z', C.sol)
      + vel('M16,28 Q48,32 78,34 L78,40 Q48,34 14,34Z', C.solO, { o: .5 })),

    ui_megafono: () => svg(V,
      agua('M24,60 L38,60 L42,88 Q34,92 28,88Z', C.grisO)
      + agua('M10,40 Q22,38 36,36 Q54,26 72,12 Q76,40 72,76 Q54,60 36,56 Q22,60 10,58Z', C.rojo)
      + vel('M20,52 Q42,54 70,70 L72,76 Q54,60 36,56 Q22,60 10,58Z', C.rojoO, { o: .5 })
      + pincel('M72,14 Q78,44 72,74', 9, C.sol)
      + pincel('M84,26 L94,18', 5, C.solO, { f: 'l' }) + pincel('M86,44 L96,44', 5, C.solO, { f: 'l' }) + pincel('M84,62 L94,70', 5, C.solO, { f: 'l' })),

    ui_silencio: () => svg(V,
      agua(mancha(50, 50, 42, 42, 10, .035), C.sol)
      + vel(mancha(60, 62, 28, 24, 11, .15), C.solO, { o: .5 })
      + ojo(36, 38, 4) + ojo(64, 38, 4)
      + agua('M22,64 Q50,52 80,58 L82,72 Q50,80 24,78Z', C.gris, { o: .95 })
      + trazo('M34,66 L36,74 M50,62 L52,72 M66,60 L68,70', 2.2, C.grisO, { o: .8 })),

    ui_tortuga: () => svg(V,
      agua(mancha(80, 48, 11, 10, 3, .08), C.hoja)
      + agua(mancha(26, 76, 9, 8, 4, .1), C.hoja) + agua(mancha(62, 78, 9, 8, 5, .1), C.hoja) + agua(mancha(30, 38, 8, 7, 6, .1), C.hojaO)
      + agua('M10,64 Q8,34 36,28 Q64,26 74,50 Q76,64 70,70 Q40,76 10,64Z', C.hoja)
      + vel('M12,60 Q40,70 72,62 Q70,70 66,72 Q36,76 12,66Z', C.hojaO, { o: .6 })
      + trazo('M24,50 Q34,40 44,48 Q54,38 62,48 M34,56 Q44,64 54,56', 3, C.hojaO, { o: .75 })
      + ojo(84, 45, 2.6)),

    ui_caminante: () => svg(V,
      pincel('M10,44 L26,44', 5, C.grisO, { f: 'l' }) + pincel('M6,58 L24,58', 5, C.grisO, { f: 'l' }) + pincel('M12,72 L26,72', 5, C.grisO, { f: 'l' })
      + agua('M32,26 Q46,24 50,38 Q64,48 84,54 Q94,58 92,72 L30,74 Q26,50 32,26Z', C.rojo)
      + vel('M30,60 Q60,62 92,66 L92,74 L30,74Z', C.rojoO, { o: .4 })
      + pincel('M28,82 Q60,84 92,80', 8, C.gris)
      + trazo('M52,48 L60,40 M62,54 L70,46', 3, PAPEL, { o: .9 })),

    ui_conejo: () => svg(V,
      agua('M34,44 Q26,16 36,8 Q50,20 48,46Z', '#F1EEF4') + agua('M56,44 Q56,18 68,10 Q78,22 68,46Z', '#F1EEF4')
      + vel('M36,40 Q32,22 38,16 Q44,26 44,40Z', '#F3B4C4', { o: .7 }) + vel('M60,40 Q60,24 67,18 Q70,28 66,40Z', '#F3B4C4', { o: .7 })
      + agua(mancha(52, 66, 30, 26, 12, .05), '#F1EEF4') + vel(mancha(60, 78, 20, 12, 13, .15), C.grisO, { o: .5 })
      + ojo(42, 60, 3.8) + ojo(62, 60, 3.8) + agua(mancha(52, 72, 5, 4, 14, .1), '#E58AA5', { f: 'l' }) + trazo('M52,76 Q46,82 42,78 M52,76 Q58,82 62,78', 2)
      + colorete(34, 72, 6) + colorete(70, 72, 6)
      + trazo('M8,54 L20,54 M6,66 L18,64', 3, C.grisO, { o: .7 })),

    ui_tambor: () => svg(V,
      pincel('M26,6 Q40,18 50,36', 6, C.tronco) + pincel('M74,6 Q60,18 50,36', 6, C.tronco)
      + agua('M14,42 Q14,70 22,86 Q50,96 78,86 Q86,70 86,42 Q50,54 14,42Z', C.rojo)
      + agua(mancha(50, 42, 36, 12, 5, .05), C.crema)
      + vel('M54,56 Q80,50 86,42 Q86,70 78,86 Q60,90 56,88Z', C.rojoO, { o: .4 })
      + trazo('M20,54 L34,84 L48,56 L62,84 L78,54', 3, PAPEL, { o: .85 })),

    ui_pincel: () => svg(V,
      pincel('M86,12 Q66,32 44,56', 10, C.rojoO)
      + pincel('M46,54 L34,68', 13, C.gris)
      + agua('M32,64 Q24,64 14,90 Q40,86 48,72 Q42,62 32,64Z', AZ)
      + vel('M18,86 Q36,82 46,72 L40,80Z', AZO, { o: .5 })),
    ui_pincel_arcoiris: () => svg(V,
      pincel('M86,12 Q66,32 44,56', 10, C.rojoO)
      + pincel('M46,54 L34,68', 13, C.gris)
      + agua('M30,62 Q22,66 16,82 Q24,84 34,76Z', C.rojo, { f: 'l' })
      + agua('M36,62 Q30,70 24,86 Q34,86 42,74Z', C.sol, { f: 'l' })
      + agua('M44,64 Q38,76 28,90 Q42,86 50,70Z', C.hoja, { f: 'l' })
      + agua('M14,92 Q24,88 28,90 Q20,94 14,92Z', AZ, { f: 'l' })),

    ui_disquete: () => svg(V,
      agua('M14,12 L74,12 L88,26 L88,88 L14,88Z', AZ)
      + vel('M16,64 L88,60 L88,88 L14,88Z', AZO, { o: .4 })
      + agua('M30,12 L68,12 L68,38 L30,38Z', C.gris) + pincel('M58,17 L58,32', 6, AZO, { f: 'l' })
      + agua('M24,54 Q50,52 76,54 L76,86 Q50,88 24,86Z', PAPEL)
      + trazo('M32,66 L68,66 M32,77 L56,77', 3.4, C.rosaO, { o: .9 })),

    ui_papelera: () => svg(V,
      pincel('M40,13 Q50,10 60,13', 6, TEALO, { f: 'l' })
      + agua('M24,30 Q50,26 76,30 Q74,62 70,90 Q50,94 30,90 Q26,62 24,30Z', TEAL)
      + vel('M54,32 Q74,32 76,30 Q74,62 70,90 Q58,92 56,90Z', TEALO, { o: .4 })
      + pincel('M14,22 Q50,18 86,22', 10, TEAL)
      + trazo('M38,40 L40,80 M50,40 L50,80 M62,40 L60,80', 3.4, PAPEL, { o: .85 })),

    ui_teclado: () => svg(V,
      agua('M6,26 Q50,20 94,26 Q96,52 94,78 Q50,82 6,78 Q4,52 6,26Z', C.gris)
      + [0, 1, 2, 3, 4].map(i => agua(mancha(20 + i * 15, 40, 5.6, 5.4, i + 2, .12), [C.rojo, C.sol, C.hoja, AZ, C.violeta][i], { f: 'l' })).join('')
      + [0, 1, 2, 3, 4].map(i => agua(mancha(27 + i * 15, 55, 5.6, 5.4, i + 8, .12), [C.violeta, AZ, C.hoja, C.sol, C.rojo][i], { f: 'l' })).join('')
      + agua('M28,66 Q50,64 72,66 L72,72 Q50,74 28,72Z', PAPEL, { f: 'l' })),

    ui_facil: () => svg(V,
      agua(mancha(50, 50, 42, 42, 13, .035), C.sol)
      + vel(mancha(60, 62, 28, 24, 14, .15), C.solO, { o: .5 })
      + ojo(36, 40, 4.4) + ojo(64, 40, 4.4) + colorete(26, 58, 7) + colorete(74, 58, 7)
      + trazo('M28,58 Q50,84 72,58', 4)),
    ui_dificil: () => svg(V,
      agua(mancha(50, 50, 42, 42, 15, .035), C.sol)
      + vel(mancha(60, 62, 28, 24, 16, .15), C.solO, { o: .5 })
      + trazo(mancha(34, 42, 13, 13, 3, .04), 3.2, LINEA, { o: .85 }) + trazo(mancha(66, 42, 13, 13, 4, .04), 3.2, LINEA, { o: .85 }) + trazo('M47,42 L53,42', 3.2)
      + ojo(34, 43, 3.8) + ojo(66, 43, 3.8)
      + trazo('M38,70 Q50,64 62,70', 3.6)),

    ui_barajar: () => svg(V,
      pincel('M8,30 Q38,30 50,50 Q62,70 76,70', 10, AZ) + head(93, 70, 0, 26, 34, AZ)
      + pincel('M8,70 Q38,70 50,50 Q62,30 76,30', 10, C.naranja) + head(93, 30, 0, 26, 34, C.naranja)),

    ui_varita: () => svg(V,
      pincel('M12,90 L56,46', 9, C.negro)
      + pincel('M12,90 L24,78', 9, PAPEL, { f: 'l' })
      + agua(est(68, 32, 26, 12, -90), C.sol)
      + vel(mancha(72, 38, 12, 10, 4, .15), C.solO, { o: .5 })
      + chispa(86, 76, 7, C.violeta) + chispa(32, 20, 7, C.rosaO) + chispa(88, 8, 5, C.azul)),

    ui_xilofono: () => svg(V,
      [C.rojo, C.naranja, C.sol, C.hoja, AZ, C.violeta].map((c, i) => pincel(`M${15 + i * 14},${14 + i * 4} Q${16 + i * 14},50 ${15 + i * 14},${86 - i * 4}`, 11, c)).join('')
      + trazo('M10,40 Q50,44 90,50', 2.4, LINEA, { o: .35 })),

    ui_estrella: () => svg(V,
      agua(est(50, 54, 46, 22, -90), C.sol)
      + vel(mancha(58, 62, 22, 20, 3, .15), C.solO, { o: .5 })
      + ojo(42, 52, 3.6) + ojo(58, 52, 3.6) + sonrisa(50, 62, 12)),

    ui_cuadro: () => svg(V,
      agua('M18,22 Q50,18 82,22 Q84,50 82,78 Q50,82 18,78 Q16,50 18,22Z', C.cielo)
      + agua('M18,62 Q36,48 52,60 Q68,50 82,60 L82,78 Q50,82 18,78Z', C.hoja)
      + agua(mancha(66, 38, 8, 8, 5, .1), C.sol)
      + pincel('M14,18 Q50,14 86,18 Q88,50 86,82 Q50,86 14,82 Q12,50 14,18Z', 10, C.naranja)),

    ui_cerrar: () => svg(V,
      vel('M22,22 L84,82 M82,20 L20,84', C.grisO, { o: 0 })
      + pincel('M24,24 Q50,52 80,80', 22, PAPEL, { o: 1 }) + pincel('M80,22 Q50,52 22,82', 22, PAPEL, { o: 1 })),

    ui_ordenador: () => svg(V,
      agua('M14,14 Q50,10 86,14 Q88,40 86,66 Q50,70 14,66 Q12,40 14,14Z', C.negro)
      + agua('M22,22 Q50,20 78,22 Q80,40 78,58 Q50,60 22,58 Q20,40 22,22Z', C.cielo)
      + ojo(40, 38, 3) + ojo(60, 38, 3) + sonrisa(50, 46, 10)
      + agua('M6,72 Q50,68 94,72 L90,86 Q50,90 10,86Z', C.gris)
      + vel('M10,80 L90,78 L90,86 Q50,90 10,86Z', C.grisO, { o: .4 })),

    ui_tableta: () => svg(V,
      agua('M26,8 Q50,6 74,8 Q76,50 74,92 Q50,94 26,92 Q24,50 26,8Z', C.violeta)
      + [[38, 26], [60, 26], [38, 48], [60, 48], [38, 70], [60, 70]].map(([x, y], i) => agua(mancha(x, y, 8, 8, i + 3, .12), [C.rojo, C.sol, C.hoja, AZ, C.naranja, C.rosa][i], { f: 'l' })).join('')
      + vel('M54,12 Q74,10 74,12 Q76,50 74,92 Q60,94 56,92Z', carga(C.violeta, .7), { o: .35 })),

    ui_ventana: () => svg(V,
      agua('M12,12 Q50,8 88,12 Q90,50 88,88 Q50,92 12,88 Q10,50 12,12Z', AZ)
      + agua('M22,22 Q34,20 45,22 Q46,34 45,45 Q34,46 22,45 Q21,34 22,22Z', lava(C.cielo, .35), { f: 'l' })
      + agua('M55,22 Q66,20 78,22 Q79,34 78,45 Q66,46 55,45 Q54,34 55,22Z', lava(C.cielo, .35), { f: 'l' })
      + agua('M22,55 Q34,54 45,55 Q46,66 45,78 Q34,79 22,78 Q21,66 22,55Z', lava(C.cielo, .35), { f: 'l' })
      + agua('M55,55 Q66,54 78,55 Q79,66 78,78 Q66,79 55,78 Q54,66 55,55Z', lava(C.cielo, .35), { f: 'l' })
      + trazo('M26,40 L38,26 M59,40 L71,26', 2.6, PAPEL, { o: .85 })),

    ui_aviso: () => svg(V,
      agua('M50,10 Q56,10 60,18 L90,74 Q96,86 84,86 L16,86 Q4,86 10,74 L40,18 Q44,10 50,10Z', C.sol)
      + vel('M60,40 L90,74 Q96,86 84,86 L50,86Z', C.solO, { o: .5 })
      + pincel('M50,36 Q51,48 50,58', 9, C.negro) + punto(50, 73, 5.2, C.negro, .9)),

    ui_nube: () => svg(V,
      agua('M14,70 Q6,58 16,48 Q26,38 36,42 Q40,22 58,24 Q74,26 76,42 Q92,42 94,58 Q94,72 80,72 Q48,76 14,70Z', lava(C.cielo, .4))
      + vel('M16,62 Q50,70 90,62 Q94,72 80,72 Q48,76 14,70Z', C.cieloO, { o: .5 })),

    ui_amanecer: () => svg(V,
      Array.from({ length: 7 }, (_, i) => { const a = Math.PI + (i + .5) * Math.PI / 7, c = Math.cos(a), s = Math.sin(a); return pincel(`M${f1(50 + c * 34)},${f1(66 + s * 34)} L${f1(50 + c * 46)},${f1(66 + s * 46)}`, 7, C.solO, { f: 'l' }); }).join('')
      + agua(mancha(50, 66, 28, 28, 4, .04), C.sol)
      + agua('M4,70 Q28,56 50,62 Q74,56 96,70 L96,90 Q50,94 4,90Z', C.hoja)
      + vel('M4,80 Q50,74 96,80 L96,90 Q50,94 4,90Z', C.hojaO, { o: .5 })),

    ui_espaguetis: () => svg(V,
      agua('M6,66 Q10,56 46,56 Q84,56 88,68 Q84,84 46,86 Q10,84 6,66Z', C.gris)
      + agua('M20,60 Q22,34 46,32 Q70,34 74,60 Q60,70 46,70 Q32,70 20,60Z', C.paja)
      + trazo('M28,56 Q46,40 66,56 M34,64 Q48,52 62,64', 3.2, C.pajaO, { o: .8 })
      + agua(mancha(46, 40, 11, 8, 3, .12), C.rojo)
      + pincel('M84,10 Q78,34 70,58', 5, C.grisO)),

    ui_unicornio: () => svg(V,
      agua('M30,40 Q16,50 20,68 Q14,80 28,86 Q30,66 38,52Z', C.violeta) + agua('M24,34 Q12,40 14,54 Q22,50 30,46Z', C.rosa)
      + agua('M40,34 L38,12 Q48,18 50,30Z', '#F1EEF4')
      + agua('M54,8 Q60,22 62,36 L46,36Z', C.sol)
      + agua(mancha(54, 64, 26, 28, 5, .05), '#F1EEF4')
      + vel(mancha(62, 74, 20, 16, 6, .15), C.grisO, { o: .4 })
      + agua(mancha(60, 80, 15, 10, 7, .1), C.rosa) + ojo(52, 58, 3.6) + punto(56, 80, 1.8, '#B5647F') + punto(65, 80, 1.8, '#B5647F')),

    ui_guitarra: () => svg(V, rot(
      pincel('M50,56 Q51,30 50,10', 8, C.tronco)
      + agua('M44,2 Q50,0 56,2 L56,16 L44,16Z', C.troncoO)
      + K([[50, 50], [62, 52], [70, 60], [64, 70], [72, 80], [72, 92], [60, 98], [50, 96], [40, 98], [28, 92], [28, 80], [36, 70], [30, 60], [38, 52]], C.rojo)
      + vel('M54,76 Q72,76 72,90 Q64,98 52,96Z', C.rojoO, { o: .5 })
      + agua(mancha(50, 74, 7, 7, 5, .1), C.negro) + trazo('M44,90 L56,90', 2.4, PAPEL, { o: .8 })
      + trazo('M47,18 L47,88 M53,18 L53,88', 1.4, LINEA, { o: .5 }), 38, 50, 52)),

    ui_etiqueta: () => svg(V, rot(
      agua('M6,50 Q20,34 34,22 Q60,20 92,26 Q94,50 90,76 Q60,82 34,82 Q20,66 6,50Z', C.rosa)
      + vel('M40,64 Q70,68 90,66 L90,76 Q60,82 34,82Z', C.rosaO, { o: .5 })
      + agua(mancha(25, 50, 5, 5, 3, .1), PAPEL, { f: 'l' })
      + agua(est(62, 50, 17, 8, -90), C.sol), -14)),

    ui_corazon: () => svg(V,
      agua('M50,90 Q12,62 10,36 Q10,12 32,12 Q46,12 50,28 Q54,12 68,12 Q90,12 90,36 Q88,62 50,90Z', C.rojo)
      + vel('M56,38 Q86,34 90,40 Q86,64 50,90 Q64,66 56,38Z', C.rojoO, { o: .5 })
      + trazo('M24,30 Q26,22 34,22', 3.6, PAPEL, { o: .85 })),

    ui_abrazo: () => svg(V,
      agua('M50,66 Q16,42 14,24 Q14,6 32,6 Q44,6 50,20 Q56,6 68,6 Q86,6 86,24 Q84,42 50,66Z', C.rojo)
      + trazo('M32,26 Q36,30 40,26 M60,26 Q64,30 68,26', 2.6)
      + pincel('M8,88 Q14,66 42,68', 14, PIEL) + pincel('M92,88 Q86,66 58,68', 14, PIEL)
      + agua(mancha(46, 68, 10, 8, 3, .1), PIEL) + agua(mancha(54, 68, 10, 8, 4, .1), PIELO)
      + vel('M10,86 Q18,74 38,74 L40,78 Q22,80 14,90Z', PIELO, { o: .4 })),

    ui_punio: () => svg(V,
      K([[22, 34], [44, 30], [70, 32], [80, 44], [80, 66], [72, 84], [48, 88], [28, 84], [20, 62]], PIEL)
      + vel('M54,60 Q80,58 80,66 Q72,84 48,88 Q56,76 54,60Z', PIELO, { o: .45 })
      + trazo('M24,46 Q50,50 78,46 M22,58 Q50,62 80,58 M24,70 Q50,74 76,70', 3.2, PIELO, { o: .8 })
      + agua('M26,60 Q36,54 52,58 Q56,70 46,76 Q32,74 26,60Z', PIEL)
      + chispa(14, 16, 8, C.sol) + chispa(88, 24, 9, C.sol) + chispa(88, 60, 5, C.rosaO)),

    ui_arcoiris: () => svg(V,
      [C.rojo, C.sol, C.hoja, AZ].map((c, i) => { const r = 40 - i * 9.5; return pincel(`M${50 - r},72 A${r},${r} 0 0 1 ${50 + r},72`, 9.5, c, { o: .95 }); }).join('')
      + agua('M4,74 Q4,62 16,62 Q26,56 34,64 Q40,74 36,80 Q20,84 4,80Z', lava(C.cielo, .45)) + agua('M66,74 Q66,62 78,60 Q90,56 96,68 Q98,80 92,82 Q76,84 66,80Z', lava(C.cielo, .45))),

    ui_burbuja: () => svg(V,
      agua(mancha(44, 56, 34, 34, 6, .04), lava(C.cielo, .5))
      + vel('M44,88 Q78,84 78,54 Q82,76 60,90Z', C.violeta, { o: .45 })
      + pincel(mancha(44, 56, 33, 33, 3, .04), 3.4, C.cieloO, { o: .85 })
      + trazo('M24,46 Q28,32 42,28', 4, PAPEL, { o: .95 })
      + pincel(mancha(82, 20, 9, 9, 5, .08), 3.6, C.cieloO, { f: 'l', o: .85 })),

    ui_carpa: () => svg(V,
      pincel('M50,18 L50,6', 3, C.troncoO, { f: 'l' }) + agua('M50,4 L70,8 L50,14Z', C.rojo, { f: 'l' })
      + agua('M12,56 Q10,74 12,90 Q50,94 88,90 Q90,74 88,56Z', C.crema)
      + agua('M24,56 L36,56 L34,90 L22,90Z', C.rojo) + agua('M64,56 L76,56 L78,90 L66,90Z', C.rojo)
      + agua('M40,90 Q42,66 50,60 Q58,66 60,90Z', C.negro)
      + agua('M50,14 Q70,34 94,56 Q50,64 6,56 Q30,34 50,14Z', C.rojo)
      + agua('M50,14 Q46,36 34,60 L48,60 Q50,36 50,14Z', PAPEL, { o: .95 }) + agua('M50,14 Q62,36 74,58 L62,60 Q56,36 50,14Z', PAPEL, { o: .95 })),

    ui_candado: () => svg(V,
      pincel('M32,46 L32,32 Q32,12 50,12 Q68,12 68,32 L68,46', 10, C.grisO)
      + K([[18, 44], [50, 40], [82, 44], [84, 66], [82, 90], [50, 94], [18, 90], [16, 66]], C.sol)
      + vel('M50,70 Q80,60 84,66 L82,90 Q66,92 50,94Z', C.solO, { o: .55 })
      + agua(mancha(50, 62, 7, 7, 4, .08), C.negro) + pincel('M50,64 L50,78', 5, C.negro, { f: 'l' })),

    ui_lapiz: () => svg(V, rot(
      agua('M40,6 Q50,2 60,6 L60,18 L40,18Z', C.rosaO)
      + agua('M39,18 L61,18 L61,28 L39,28Z', C.gris)
      + agua('M40,28 L60,28 L60,74 L40,74Z', C.sol)
      + vel('M52,28 L60,28 L60,74 L52,74Z', C.solO, { o: .5 })
      + agua('M40,74 L60,74 L50,96Z', C.crema)
      + agua('M46,88 L54,88 L50,96Z', C.negro, { f: 'l' }), 40, 50, 50)),
  });
})();
