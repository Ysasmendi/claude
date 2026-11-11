// Pinturas: fiesta
(() => {
  const { agua, vel, trazo, pincel, punto, gotas, mancha, liso, pig, carga, lava, svg, C, ojo, sonrisa, colorete, hierba, flor, nubeD, LINEA, PAPEL, azar, f1 } = AQ;
  const AMA = C.sol, AMAO = C.solO, ROJO = C.rojo, ROJOO = C.rojoO, ROSA = C.rosa, ROSAO = C.rosaO, CIELO = '#9CCBEA', CIELOO = C.cieloO, HOJA = C.hoja, HOJAO = C.hojaO, VIO = C.violeta, VIOO = carga(C.violeta, .82), NAR = C.naranja, NARO = carga(C.naranja, .82);
  const LUZ = { f: 'l', o: .85 };
  // sombra de apoyo
  const suelo = (x, y, rx, k = 1) => vel(mancha(x, y, rx, 3.6, 40 + k, .1), C.grisO, { o: .35 });
  // corazón orgánico (r = semiancho); rot en grados
  const corazonD = (cx, cy, r, sd = 1, rot = 0) => {
    const q = azar(sd), a = rot * Math.PI / 180, co = Math.cos(a), si = Math.sin(a);
    const P = [[0, .9], [-.5, .42], [-.98, -.04], [-.92, -.56], [-.5, -.84], [-.16, -.56], [0, -.34], [.16, -.56], [.5, -.84], [.92, -.56], [.98, -.04], [.5, .42]]
      .map(([x, y]) => { x += (q() - .5) * .06; y += (q() - .5) * .06; return [cx + (x * co - y * si) * r, cy + (x * si + y * co) * r]; });
    return liso(P);
  };
  // destello de cuatro puntas, con cintura cóncava
  const destello = (cx, cy, r, sd = 1, rot = 0, fino = .2) => {
    const q = azar(sd), a = rot * Math.PI / 180, P = [];
    for (let i = 0; i < 8; i++) { const ang = a + i * Math.PI / 4, rr = (i % 2 ? fino * r : r) * (1 + (q() - .5) * .1); P.push([cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr]); }
    let d = `M${f1(P[0][0])},${f1(P[0][1])}`;
    for (let i = 0; i < 8; i += 2) { const n = P[(i + 2) % 8], m = P[i + 1]; d += ` Q${f1(m[0])},${f1(m[1])} ${f1(n[0])},${f1(n[1])}`; }
    return d + 'Z';
  };
  // estrella de cinco puntas redondeada
  const estrellaD = (cx, cy, R, r2, sd = 1, rot = -90) => {
    const q = azar(sd), P = [];
    for (let i = 0; i < 10; i++) { const a = (rot + i * 36) * Math.PI / 180, rr = (i % 2 ? r2 : R) * (1 + (q() - .5) * .08); P.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
    return liso(P);
  };
  const brillo = (x, y, rx, ry, rot = -35, o = .8) => agua(mancha(x, y, rx, ry, x + y, .12, 8, rot * Math.PI / 180), PAPEL, { f: 's', o: Math.min(.7, o) });
  // pieza redonda de color con sombra cargada y brillo
  // palo: tallo relleno entre dos puntos (evita pinceladas rectas de caja nula)
  const palo = (x1, y1, x2, y2, w, c, sd = 1) => { const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L * w / 2, ny = dx / L * w / 2, q = azar(sd);
    return agua(liso([[x1 + nx, y1 + ny], [(x1 + x2) / 2 + nx * (1 + q() * .3), (y1 + y2) / 2 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [(x1 + x2) / 2 - nx, (y1 + y2) / 2 - ny * (1 + q() * .3)], [x1 - nx, y1 - ny]]), c, { f: 'l' }); };
  const grano = (x, y, c, rot, sd = 1, k = 3.4) => agua(mancha(x, y, k, k * .48, sd, .1, 8, rot * Math.PI / 180), c, { f: 'l' });
  const onda = (x, y, c, rot, sd) => agua(liso([[-8, 1], [-4, -4.5], [0, 0], [4, 4.5], [8, -1], [8, 2.5], [4, 8], [0, 3.5], [-4, -1], [-8, 4]].map(([a, b]) => [a, b])), c, { f: 'l', t: `translate(${x} ${y}) rotate(${rot})` });
  const girar = (g, a, x, y) => `<g transform="rotate(${a} ${x} ${y})">${g}</g>`;

  Object.assign(ILUS, {
    // Corazón rojo: una mancha, sombra cargada abajo a la derecha, brillo de papel
    fiesta_corazon: () => svg('0 0 100 100',
      agua(corazonD(50, 52, 43, 2), ROJO)
      + vel(mancha(62, 66, 26, 20, 3, .15), ROJOO, { o: .5 })
      + brillo(30, 36, 8, 5)),

    fiesta_corazon_rosa: () => svg('0 0 100 100',
      agua(corazonD(46, 56, 38, 4), ROSA)
      + vel(mancha(58, 68, 22, 17, 5, .15), ROSAO, { o: .5 })
      + brillo(29, 42, 7, 4.5)
      + agua(destello(79, 23, 15, 6), AMA, { f: 'l' }) + agua(destello(17, 17, 8, 7), AMA, { f: 'l' })),

    fiesta_corazones: () => svg('0 0 100 100',
      agua(corazonD(70, 32, 19, 8, 16), ROSA, { f: 'l' }) + vel(mancha(75, 38, 9, 7, 9, .15), ROSAO, { o: .5 })
      + agua(corazonD(40, 60, 31, 9, -14), ROJO) + vel(mancha(50, 72, 17, 13, 10, .15), ROJOO, { o: .5 })
      + brillo(26, 48, 6, 4) + brillo(66, 25, 3.4, 2.2)),

    // Latido: corazón y tres pinceladas de eco a cada lado
    fiesta_corazon_latido: () => svg('0 0 100 100',
      agua('M16,34 Q5,52 16,70 Q11,52 16,34Z', ROSAO, { f: 'l' }) + agua('M84,34 Q95,52 84,70 Q89,52 84,34Z', ROSAO, { f: 'l' })
      + trazo('M6,44 Q3,52 6,60 M94,44 Q97,52 94,60', 2.4, ROSAO, { o: .7 })
      + palo(27, 14, 31, 22, 4, ROSAO, 2) + palo(51, 8, 50, 17, 4, ROSAO, 3) + palo(73, 14, 69, 22, 4, ROSAO, 4)
      + agua(corazonD(50, 55, 33, 11), ROJO) + vel(mancha(60, 66, 19, 15, 12, .15), ROJOO, { o: .5 })
      + brillo(34, 44, 6.5, 4)),

    fiesta_chispa: () => svg('0 0 100 100',
      agua(destello(50, 50, 43, 3, 0, .24), AMA) + vel(mancha(56, 58, 20, 20, 4, .15), AMAO, { o: .5 })
      + agua(destello(81, 19, 8, 5), ROSA, { f: 'l' })),

    fiesta_chispas: () => svg('0 0 100 100',
      agua(destello(40, 59, 34, 6, 0, .24), AMA) + vel(mancha(45, 64, 15, 15, 7, .15), AMAO, { o: .5 })
      + agua(destello(75, 25, 19, 8, 8), ROSA, { f: 'l' })
      + agua(destello(80, 76, 13, 9, -6), CIELO, { f: 'l' })),

    // Confeti: trozos de papel de colores, sueltos
    fiesta_confeti: () => svg('0 0 100 100',
      agua('M20,20 Q30,17 39,20 Q40,27 38,32 Q29,33 21,31Z', ROJO, { t: 'rotate(-25 30 26)' })
      + agua(mancha(60, 17, 6.5, 6, 3, .12), AMA, { f: 'l' })
      + onda(77, 34, CIELO, -10, 1)
      + agua('M41,44 Q50,42 59,45 Q60,52 58,56 Q50,57 42,55Z', VIO, { t: 'rotate(25 50 50)' })
      + agua('M14,64 Q20,58 26,52 Q29,60 30,68 Q22,67 14,64Z', HOJA)
      + agua('M71,59 Q80,57 89,60 Q90,65 88,69 Q80,70 72,68Z', AMA, { t: 'rotate(-40 80 64)' })
      + agua(mancha(40, 80, 6.5, 6, 4, .12), ROSA, { f: 'l' })
      + onda(65, 84, HOJA, 8, 2)
      + agua(mancha(18, 38, 4.2, 4, 5, .12), CIELO, { f: 'l' }) + agua(mancha(86, 44, 3.8, 3.6, 6, .12), ROSA, { f: 'l' })
      + agua('M18,81 Q24,79 30,81 Q30,85 29,87 Q23,88 18,87Z', NAR, { t: 'rotate(30 24 84)', f: 'l' })),

    // Serpentina: espiral de papel, tramos de detrás más oscuros
    fiesta_serpentina: () => {
      const N = 40, q = [];
      for (let i = 0; i <= N; i++) { const t = i / N, a = t * 2 * Math.PI * 3.5; q.push([22 * t + 17 * Math.cos(a), 74 * t + 7.5 * Math.sin(a), Math.sin(a) > 0]); }
      const xs = q.map(p => p[0]), ys = q.map(p => p[1]), mx = Math.min(...xs), Mx = Math.max(...xs), my = Math.min(...ys), My = Math.max(...ys), k = 78 / Math.max(Mx - mx, My - my);
      const P = q.map(p => [50 + (p[0] - (mx + Mx) / 2) * k, 50 + (p[1] - (my + My) / 2) * k, p[2]]);
      let d = liso(P.map(p => [p[0], p[1]]), true), delante = '';
      for (let i = 1; i < P.length - 1; i++) if (P[i][2] && P[i - 1][2] && P[i + 1][2]) delante += (delante ? '' : '') + '';
      const fr = []; let cur = [];
      P.forEach(p => { if (p[2]) cur.push([p[0], p[1]]); else { if (cur.length > 2) fr.push(cur); cur = []; } }); if (cur.length > 2) fr.push(cur);
      return svg('0 0 100 100', pincel(d, 7, carga(ROSA, .85), { f: 'l' }) + fr.map(r => pincel(liso(r, true), 7, ROSA, { f: 'l' })).join(''));
    },

    // Petardo: cucurucho amarillo con rayas rojas y confeti saliendo
    fiesta_petardo: () => svg('0 0 100 100',
      pincel('M54,44 C58,34 50,30 58,22 S64,12 72,10', 4.5, HOJA, { f: 'l' }) + pincel('M58,50 C68,50 70,40 78,42 S88,38 90,30', 4.5, ROSA, { f: 'l' })
      + agua('M64,18 Q70,16 76,18 Q77,22 75,25 Q70,26 65,25Z', CIELO, { f: 'l', t: 'rotate(30 70 22)' })
      + agua(mancha(84, 54, 4.2, 4, 3, .12), AMA, { f: 'l' }) + agua(mancha(44, 22, 3.6, 3.4, 4, .12), VIO, { f: 'l' })
      + agua('M77,15 Q82,14 87,15 Q87,19 86,21 Q82,22 77,21Z', NAR, { f: 'l', t: 'rotate(-25 82 18)' })
      + agua(destello(68, 36, 6, 5), AMA, { f: 'l' }) + agua(destello(88, 70, 5, 6), ROSA, { f: 'l' })
      + suelo(40, 92, 28, 1)
      + agua('M14,88 Q22,66 34,44 Q50,44 60,68 Q40,84 14,88Z', AMA)
      + agua('M21,75 L24,68 L35,79 L28,82Z', ROJO, { f: 'l' })
      + agua('M28,59 L31,53 L51,72 L44,75Z', ROJO, { f: 'l' })
      + vel('M40,60 Q52,62 60,68 Q42,84 20,88Z', AMAO, { o: .4 })
      + agua(mancha(46, 56, 16, 6.5, 6, .08, 10, .78), ROJOO, { o: .85 })),

    // Trofeo: copa amarilla con asas, pie y estrella roja
    fiesta_trofeo: () => svg('0 0 100 100',
      suelo(50, 92, 28, 2)
      + pincel('M27,26 C10,24 10,48 32,50', 6, AMA, { f: 'l' }) + pincel('M73,26 C90,24 90,48 68,50', 6, AMA, { f: 'l' })
      + agua('M44,58 L56,58 L60,76 L40,76Z', AMAO)
      + agua('M30,77 Q30,72 35,72 H65 Q70,72 70,77 V86 Q70,91 65,91 H35 Q30,91 30,86Z', AMA)
      + agua('M40,79 Q50,77 60,79 L60,85 Q50,86 40,85Z', ROJO, { f: 'l' })
      + agua('M24,18 Q50,26 76,18 V34 C76,54 64,62 50,62 C36,62 24,54 24,34Z', AMA)
      + vel('M54,24 Q76,22 76,36 C76,54 64,62 50,62 Q66,52 54,24Z', AMAO, { o: .5 })
      + agua(estrellaD(50, 40, 11, 5.5, 3), ROJO, { f: 'l' })
      + brillo(33, 36, 3.4, 10, 0, .6)),

    // Corona: tres puntas, banda y gemas
    fiesta_corona: () => svg('0 0 100 100',
      suelo(50, 90, 36, 3)
      + agua('M15,76 L13,33 Q22,40 32,54 Q40,38 50,25 Q60,38 68,54 Q78,40 87,33 L85,76Z', AMA)
      + vel('M56,50 Q66,60 68,54 Q78,40 87,33 L85,76 L50,76Z', AMAO, { o: .45 })
      + agua(mancha(13, 31, 5.5, 5.5, 3, .12), AMA, { f: 'l' }) + agua(mancha(50, 21, 6, 6, 4, .12), AMA, { f: 'l' }) + agua(mancha(87, 31, 5.5, 5.5, 5, .12), AMA, { f: 'l' })
      + agua('M13,66 Q50,60 87,66 V80 Q87,86 82,86 H18 Q13,86 13,80Z', AMAO)
      + agua(corazonD(50, 47, 8, 6), ROSA, { f: 'l' })
      + agua(mancha(30, 75, 5, 4.6, 7, .12), CIELO, { f: 'l' }) + agua(mancha(70, 75, 5, 4.6, 8, .12), HOJA, { f: 'l' }) + agua(mancha(50, 75, 6.5, 5.5, 9, .12), ROJO, { f: 'l' })
      + brillo(24, 52, 2.6, 7, 12, .6)),

    // Nota: corchea violeta, cabeza, plica y bandera
    fiesta_nota: () => svg('0 0 100 100',
      palo(50, 16, 52, 72, 7, VIO, 5)
      + agua('M48,14 C50,30 74,30 74,48 C74,56 70,60 66,64 C70,50 62,42 50,40Z', VIO)
      + agua(mancha(36, 74, 16, 11.5, 3, .07, 10, -.35), VIOO)
      + vel(mancha(42, 78, 9, 6, 4, .15), carga(VIO, .65), { o: .4 })
      + brillo(30, 70, 5, 3, -20, .6)),

    // Dos corcheas unidas por una barra
    fiesta_notas: () => svg('0 0 100 100',
      palo(35, 30, 37, 74, 6.5, CIELOO, 5) + palo(81, 20, 83, 64, 6.5, CIELOO, 6)
      + agua('M31,29 L88,15 L88,31 L31,44Z', CIELOO)
      + agua(mancha(26, 76, 14.5, 10.5, 3, .07, 10, -.35), ROSAO)
      + agua(mancha(72, 66, 14.5, 10.5, 4, .07, 10, -.35), VIO)
      + brillo(21, 72, 4.4, 2.6, -20, .6) + brillo(67, 62, 4.4, 2.6, -20, .6)),

    // Bailarín: brazo arriba, pose de baile
    fiesta_bailarin: () => svg('0 0 100 100',
      suelo(52, 92, 26, 4)
      + pincel('M44,62 L36,76 L30,88', 9, C.azul) + pincel('M56,62 L68,72 L72,86', 9, C.azul)
      + agua(mancha(27, 90, 7.5, 4.5, 3, .1), C.negro, { f: 'l' }) + agua(mancha(76, 88, 7.5, 4.5, 4, .1), C.negro, { f: 'l' })
      + pincel('M42,47 L29,55 L38,62', 7, ROJO, { f: 'l' }) + pincel('M58,47 L68,33 L74,19', 7, ROJO, { f: 'l' })
      + agua(mancha(75, 15, 5, 5, 5, .1), '#F0C09E', { f: 'l' }) + agua(mancha(38, 62, 4.4, 4.4, 6, .1), '#F0C09E', { f: 'l' })
      + agua('M38,44 Q50,38 62,44 L63,66 Q50,70 38,66Z', ROJO)
      + vel('M50,50 Q60,52 63,66 Q50,70 40,66Z', ROJOO, { o: .4 })
      + agua(mancha(50, 27, 13, 13, 7, .05), '#F0C09E')
      + agua('M36,29 C33,14 46,8 56,12 C63,10 68,19 65,28 C61,22 52,21 46,22 C42,23 39,25 36,29Z', C.tronco)
      + trazo('M42,30 Q45,27 48,30 M52,30 Q55,27 58,30', 2.2) + sonrisa(50, 34, 9) + colorete(41, 35, 3.6) + colorete(59, 35, 3.6)),

    fiesta_bailarina: () => svg('0 0 100 100',
      suelo(50, 92, 28, 5)
      + pincel('M45,66 L43,86', 6, '#F0C09E', { f: 'l' }) + pincel('M55,66 L68,74 L80,68', 6, '#F0C09E', { f: 'l' })
      + agua(mancha(42, 89, 6.5, 4, 3, .1), ROSAO, { f: 'l' }) + agua(mancha(83, 67, 6, 4, 4, .1), ROSAO, { f: 'l', t: 'rotate(-20 83 67)' })
      + pincel('M42,46 L30,34 L23,21', 6, '#F0C09E', { f: 'l' }) + pincel('M58,46 L70,34 L77,21', 6, '#F0C09E', { f: 'l' })
      + agua(mancha(22, 19, 4.5, 4.5, 5, .1), '#F0C09E', { f: 'l' }) + agua(mancha(78, 19, 4.5, 4.5, 6, .1), '#F0C09E', { f: 'l' })
      + agua('M40,42 Q50,38 60,42 L63,60 Q50,64 37,60Z', ROSA)
      + agua('M34,56 Q50,62 66,56 L84,70 Q76,76 68,72 Q59,78 50,73 Q41,78 33,72 Q25,76 16,70Z', ROSA)
      + vel('M24,68 Q50,76 76,68 L84,70 Q76,76 68,72 Q59,78 50,73 Q41,78 33,72 Q25,76 16,70Z', ROSAO, { o: .5 })
      + agua(mancha(36, 17, 6.5, 6.5, 7, .1), C.tronco, { f: 'l' }) + agua(mancha(64, 17, 6.5, 6.5, 8, .1), C.tronco, { f: 'l' })
      + agua(mancha(50, 27, 13, 13, 9, .05), '#F0C09E')
      + agua('M37,27 C36,14 46,11 50,12 C54,11 64,14 63,27 C60,20 54,18 50,19 C46,18 40,20 37,27Z', C.tronco)
      + agua('M50,14 L43,9 L43,18Z M50,14 L57,9 L57,18Z', ROSAO, { f: 'l' })
      + trazo('M42,30 Q45,27 48,30 M52,30 Q55,27 58,30', 2.2) + sonrisa(50, 34, 8) + colorete(41, 35, 3.6) + colorete(59, 35, 3.6)),

    // Piruleta: disco con espiral rosa y palo
    fiesta_piruleta: () => svg('0 0 100 100',
      suelo(52, 94, 12, 6)
      + palo(50, 62, 51, 93, 5.5, C.crema, 7)
      + agua(mancha(50, 40, 31, 30, 3, .04), AMA)
      + vel(mancha(58, 50, 20, 18, 4, .15), AMAO, { o: .5 })
      + pincel('M50,40 Q57,33 62,40 Q62,52 50,54 Q36,54 34,40 Q36,23 52,21 Q72,23 74,42', 7, ROSA, { f: 'l', o: .95 })
      + brillo(36, 25, 6, 3.4, -35, .65)),

    // Donut: anillo de masa, glaseado rosa y fideos
    fiesta_donut: () => svg('0 0 100 100',
      suelo(52, 92, 36, 7)
      + agua(mancha(50, 50, 41, 39, 3, .04, 12) + mancha(50, 50, 11, 10, 4, .08, 8), C.paja, { x: ' fill-rule="evenodd"' })
      + vel(mancha(60, 64, 28, 18, 5, .15), C.pajaO, { o: .5 })
      + agua(mancha(50, 49, 33, 30, 6, .1, 14) + mancha(50, 50, 14, 12, 7, .08, 8), ROSA, { x: ' fill-rule="evenodd"' })
      + vel(mancha(60, 62, 24, 14, 8, .15), ROSAO, { o: .4 })
      + [[50, 24, 0, AMA], [68, 31, 50, CIELO], [76, 50, 100, VIO], [66, 69, 20, HOJA], [48, 76, 80, AMA], [31, 68, 140, CIELO], [24, 49, 70, VIO], [34, 31, 120, ROJO]]
        .map(([x, y, r, c]) => grano(x, y, c, r, x, 3.8)).join('')
      + brillo(36, 36, 6, 2.6, -35, .6)),

    // Magdalena: papel rayado, tres vueltas de crema rosa y una cereza
    fiesta_magdalena: () => svg('0 0 100 100',
      suelo(50, 93, 30, 8)
      + agua('M21,58 L79,58 L71,91 Q50,94 29,91Z', NAR)
      + pincel('M34,62 L37,89 M46,62 L47,90 M58,62 L57,90 M70,62 L66,88', 3, NARO, { f: 'l', o: .7 })
      + agua(mancha(50, 55, 32, 9, 3, .05), ROSA) + agua(mancha(50, 45, 25, 8.5, 4, .05), ROSA) + agua(mancha(50, 34, 16, 8, 5, .06), ROSA)
      + vel(mancha(58, 56, 22, 6, 6, .1), ROSAO, { o: .5 }) + vel(mancha(56, 46, 16, 5, 7, .1), ROSAO, { o: .45 })
      + [[30, 54, 20, AMA], [66, 53, 40, CIELO], [44, 47, 60, HOJA], [60, 44, 130, VIO], [52, 33, 20, AMA], [38, 56, 100, VIO]]
        .map(([x, y, r, c]) => grano(x, y, c, r, x, 3)).join('')
      + pincel('M51,26 Q54,17 62,16', 2.6, HOJAO, { f: 'l' })
      + agua(mancha(50, 24, 7, 6.6, 8, .08), ROJO, { f: 'l' }) + brillo(47.5, 21.5, 1.9, 1.5, -30, .8)),

    // Trébol de cuatro hojas
    fiesta_trebol: () => svg('0 0 100 100',
      pincel('M50,50 Q54,76 67,91', 5.5, HOJAO, { f: 'l' })
      + [0, 90, 180, 270].map((r, i) => girar(agua(corazonD(50, 27, 19, 3 + i), i % 2 ? HOJA : lava(HOJAO, .1), { f: i % 2 ? 'w0' : 'w1' }) + trazo('M50,39 L50,30', 2, HOJAO, { o: .6 }), r, 50, 46)).join('')
      + agua(mancha(50, 46, 4.6, 4.4, 8, .1), HOJAO, { f: 'l' })),

    // Alien: cabeza verde, antenas y ojos grandes oscuros
    fiesta_alien: () => svg('0 0 100 100',
      pincel('M38,27 Q34,19 29,15 M62,27 Q66,19 71,15', 3.8, HOJAO, { f: 'l' })
      + agua(mancha(28, 13, 5.4, 5.2, 3, .1), AMA, { f: 'l' }) + agua(mancha(72, 13, 5.4, 5.2, 4, .1), AMA, { f: 'l' })
      + agua('M50,22 C76,22 90,38 88,56 C86,76 66,92 50,92 C34,92 14,76 12,56 C10,38 24,22 50,22Z', C.hoja)
      + vel('M68,40 C84,48 84,70 62,86 C52,92 40,92 34,88 C60,86 76,66 68,40Z', HOJAO, { o: .5 })
      + agua(mancha(33, 56, 11.5, 8, 6, .05, 10, .5), C.negro) + agua(mancha(67, 56, 11.5, 8, 7, .05, 10, -.5), C.negro)
      + `<circle cx="30" cy="52.5" r="2.8" fill="${PAPEL}"/><circle cx="64" cy="52.5" r="2.8" fill="${PAPEL}"/>`
      + sonrisa(50, 73, 11) + colorete(24, 70, 5) + colorete(76, 70, 5)),

    // Burbuja: velo azul, reflejos de arcoíris y brillo
    fiesta_burbuja: () => svg('0 0 100 100',
      agua(mancha(50, 50, 40, 39, 3, .03, 12), CIELO, { o: .55 })
      + vel(mancha(58, 60, 28, 26, 4, .1), CIELOO, { o: .4 })
      + pincel('M20,35 A34,34 0 0 1 58,18', 4, ROSA, { f: 'l', o: .85 }) + pincel('M84,60 A34,34 0 0 1 62,84', 4, AMA, { f: 'l', o: .9 })
      + pincel('M30,76 A32,32 0 0 0 52,84', 3.4, HOJA, { f: 'l', o: .85 })
      + agua(mancha(32, 34, 7, 11, 5, .1, 8, .6), PAPEL, { f: 's', o: .9 }) + agua(mancha(66, 27, 3.4, 3.2, 6, .1), PAPEL, { f: 's', o: .9 })),

    // Cien: 100 a pincel rojo con subrayado doble
    fiesta_cien: () => svg('0 0 100 100',
      pincel('M14,31 L25,22 L23,62', 11, ROJO, { f: 'l', o: .95 })
      + pincel(liso([[45, 24], [53, 38], [47, 58], [40, 56], [37, 40]]), 11, ROJO, { f: 'l', o: .95 })
      + pincel(liso([[72, 23], [80, 38], [74, 58], [67, 55], [64, 40]]), 11, ROJO, { f: 'l', o: .95 })
      + pincel('M11,75 Q50,69 89,73', 4.4, ROJOO, { f: 'l' }) + pincel('M18,86 Q52,81 84,84', 3.4, ROJOO, { f: 'l' })),

    // Libro abierto: tapa roja y dos páginas de papel con renglones
    fiesta_libro: () => svg('0 0 100 100',
      suelo(50, 90, 40, 9)
      + agua('M6,34 Q28,28 50,36 Q72,28 94,34 V83 Q72,78 50,86 Q28,78 6,83Z', ROJO)
      + agua('M11,26 Q31,18 50,29 V81 Q31,71 11,77Z', PAPEL) + agua('M50,29 Q69,18 89,26 V77 Q69,71 50,81Z', PAPEL)
      + vel('M11,26 Q31,18 50,29 V81 Q31,71 11,77Z', C.cielo, { o: .35 }) + vel('M50,29 Q69,18 89,26 V77 Q69,71 50,81Z', C.crema, { o: .6 })
      + trazo('M17,37 Q30,31 43,38 M17,47 Q30,41 43,48 M17,57 Q30,51 43,58 M17,67 Q28,62 36,65', 2.2, C.grisO, { o: .7 })
      + agua(corazonD(70, 44, 9, 9), ROSA, { f: 'l' }) + trazo('M58,62 Q70,56 83,59 M58,70 Q66,66 74,67', 2.2, C.grisO, { o: .7 })
      + trazo('M50,30 V80', 2.4, ROJOO, { o: .6 })),

    // Nube sonriente
    fiesta_nube: () => svg('0 0 100 100',
      agua('M24,76 C9,76 7,56 20,52 C18,37 34,31 44,39 C49,24 73,22 79,40 C93,40 97,60 86,68 C88,74 82,77 76,76Z', PAPEL)
      + vel('M20,66 Q50,80 88,64 C97,60 93,42 79,40 C86,56 80,70 62,74 Q40,78 24,76Z', CIELOO, { o: .5 })
      + vel(mancha(46, 44, 24, 12, 5, .2), CIELO, { o: .3 })
      + ojo(42, 56, 3.4) + ojo(62, 56, 3.4) + sonrisa(52, 64, 9) + colorete(34, 63, 5) + colorete(70, 63, 5)),

    // Avión: fuselaje rojo con franja de papel, cabina, ala y hélice
    fiesta_avion: () => svg('0 0 100 100',
      suelo(52, 92, 30, 10)
      + agua('M11,42 L9,22 Q9,16 15,19 L36,42Z', ROJOO)
      + agua('M10,41 L64,40 C78,40 86,46 86,53 C86,60 78,64 66,64 L36,64 C24,64 16,56 10,44Z', ROJO)
      + vel('M20,57 Q50,67 84,58 C82,62 76,65 64,65 L36,65 C28,65 22,62 20,57Z', ROJOO, { o: .5 })
      + pincel('M14,50 Q50,47 84,52', 5, PAPEL, { f: 'l', o: .9 })
      + agua('M46,40 Q48,27 60,27 Q68,27 70,40Z', CIELO, { f: 'l' }) + brillo(54, 33, 2.2, 3.6, 25, .75)
      + agua(mancha(52, 59, 20, 5.2, 4, .08, 10, -.07), AMA)
      + pincel('M60,64 L57,75', 3.4, C.grisO, { f: 'l' }) + agua(mancha(57, 77, 6, 6, 5, .1), C.negro, { f: 'l' })
      + agua('M84,46 Q92,48 92,53 Q92,58 84,60Z', C.gris, { f: 'l' }) + agua(mancha(94, 53, 2.6, 15, 6, .1), C.grisO, { f: 'l', o: .75 })),

    // Globo: una gran mancha de color, nudo y cordel
    fiesta_globo: (o = {}) => { const c = o.c ? pig(o.c) : ROJO, cs = carga(c, .82);
      return svg('0 0 100 100',
        trazo('M50,78 C44,83 56,87 49,94', 2.4, LINEA, { o: .7 })
        + agua('M50,70 L44,79 Q50,77 56,79Z', cs, { f: 'l' })
        + agua('M50,8 C72,8 82,26 80,42 C78,60 62,72 50,72 C38,72 22,60 20,42 C18,26 28,8 50,8Z', c)
        + vel('M64,18 C80,26 82,50 66,64 C60,70 54,72 50,72 C66,56 70,34 64,18Z', cs, { o: .5 })
        + brillo(35, 26, 5, 9, 30, .65) + agua(mancha(32, 42, 2.4, 2.2, 3, .1), PAPEL, { f: 'l', o: .6 })); },

    // Regalo: caja con tapa, cinta y lazo
    fiesta_regalo: () => svg('0 0 100 100',
      suelo(50, 92, 34, 11)
      + agua('M50,32 C38,12 22,18 29,29 C33,34 44,34 50,32Z', ROSA) + agua('M50,32 C62,12 78,18 71,29 C67,34 56,34 50,32Z', ROSA)
      + agua('M18,46 H82 V86 Q82,91 77,91 H23 Q18,91 18,86Z', CIELO)
      + vel('M62,46 H82 V86 Q82,91 77,91 H62Z', CIELOO, { o: .4 })
      + [[28, 58], [34, 78], [70, 62], [68, 80]].map(([x, y], i) => punto(x, y, 2.8, PAPEL, .85)).join('')
      + agua('M44,46 H56 V91 H44Z', ROSA, { f: 'l' })
      + agua('M12,34 Q12,31 15,31 H85 Q88,31 88,34 V46 Q88,48 86,48 H14 Q12,48 12,46Z', CIELO)
      + vel('M60,31 H88 V46 Q88,48 86,48 H60Z', CIELOO, { o: .4 })
      + agua('M44,31 H56 V48 H44Z', ROSA, { f: 'l' })
      + trazo('M45,30 Q36,22 32,25 M55,30 Q64,22 68,25', 2.2, ROSAO, { o: .7 })
      + agua(mancha(50, 31, 5.6, 5.2, 7, .1), ROSAO, { f: 'l' }) + brillo(23, 38, 4, 1.8, 0, .6)),

    // Estrella fugaz: estrella amarilla con carita y tres estelas
    fiesta_estrella_fugaz: () => svg('0 0 100 100',
      pincel('M50,30 Q34,36 20,50', 5, NAR, { f: 'l' }) + pincel('M54,46 Q34,58 14,80', 6, ROSA, { f: 'l' }) + pincel('M66,56 Q54,70 40,84', 5, CIELO, { f: 'l' })
      + agua(estrellaD(65, 36, 28, 14, 5, -75), AMA)
      + vel(mancha(72, 46, 14, 12, 6, .15), AMAO, { o: .5 })
      + ojo(59, 36, 3) + ojo(70, 38, 3) + sonrisa(64.5, 44, 7) + colorete(55, 44, 3.6) + colorete(74, 46, 3.6)
      + agua(destello(86, 72, 6, 7), AMA, { f: 'l' }) + agua(destello(26, 20, 6, 8), ROSA, { f: 'l' })),
  });
})();
