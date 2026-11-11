// Pinturas: fondo-animales
(() => {
  const { agua, vel, trazo, pincel, punto, gotas, mancha, liso, pig, carga, lava, svg, C, ojo, sonrisa, colorete, hierba, flor, nubeD, LINEA, PAPEL, azar, f1 } = AQ;
  const suelo = (x, y, rx, s = 2) => vel(mancha(x, y, rx, 8, s, .1), C.grisO, { o: .35 });
  // destello de cuatro puntas, de un solo pincel
  const brillo = (x, y, r, c) => agua(`M${x},${y - r} Q${x + r * .18},${y - r * .18} ${x + r},${y} Q${x + r * .18},${y + r * .18} ${x},${y + r} Q${x - r * .18},${y + r * .18} ${x - r},${y} Q${x - r * .18},${y - r * .18} ${x},${y - r}Z`, c, { f: 'l' });
  // moneda de oro: mancha y aro
  const moneda = (x, y, r, s) => agua(mancha(x, y, r, r * .9, s, .1), C.sol, { f: 'l' }) + trazo(mancha(x, y, r * .62, r * .55, s + 1, .08), 1.2, C.solO, { o: .7 });
  const VERDE = pig('#25A84A'), VERDEO = carga(VERDE, .78), SOCK = C.crema, PIEL = pig('#F7CDB0'), PELO = pig('#E8782A');

  // La olla de oro se usa sola y en brazos del duende que corre
  const olla = (ox, oy, k) => `<g transform="translate(${ox} ${oy}) scale(${k})">`
    + agua('M48,114 L38,136 L62,126Z', C.negro, { f: 'l' }) + agua('M112,114 L122,136 L98,126Z', C.negro, { f: 'l' })
    + pincel('M30,72 Q10,70 14,92 Q18,104 34,98', 6, C.grisO) + pincel('M130,72 Q150,70 146,92 Q142,104 126,98', 6, C.grisO)
    + agua('M26,64 Q20,100 50,118 Q80,128 110,118 Q140,100 134,64Z', C.negro)
    + vel(mancha(106, 100, 26, 20, 3, .2), carga(C.negro, .6), { o: .45 })
    + agua(mancha(54, 88, 10, 18, 4, .15), lava(C.negro, .5), { f: 'l', o: .8 })
    + agua(liso([[34, 40], [48, 24], [74, 16], [104, 20], [124, 36], [132, 58], [100, 68], [60, 68]]), C.sol)
    + vel(mancha(106, 46, 22, 16, 6, .2), C.solO, { o: .5 })
    + moneda(46, 46, 9, 20) + moneda(112, 42, 9, 21) + moneda(86, 40, 9, 22) + moneda(56, 36, 9, 7) + moneda(80, 26, 9, 8) + moneda(104, 34, 9, 9) + moneda(70, 52, 9, 10) + moneda(96, 54, 8.5, 11) + moneda(122, 54, 8.5, 12)
    + pincel('M22,66 Q80,80 138,64', 9, carga(C.negro, .85))
    + moneda(32, 62, 10, 13)
    + agua(mancha(146, 118, 13, 4.5, 14, .12), C.sol, { f: 'l' }) + agua(mancha(22, 120, 12, 4, 15, .12), C.sol, { f: 'l' })
    + `</g>`;

  const pajaro = up => {
    const F = 'w1';
    const cuerpo = liso([[22, 44], [30, 28], [46, 24], [62, 34], [80, 40], [90, 54], [76, 68], [54, 70], [32, 62]]);
    const ala = up
      ? 'M50,44 Q46,24 62,8 Q70,4 74,12 Q82,12 82,20 Q88,22 84,30 Q76,44 50,44Z'
      : 'M52,52 Q48,70 58,84 Q64,88 67,80 Q74,82 74,76 Q80,74 76,66 Q70,54 52,52Z';
    const fijo = s => s.replace(/#§w\d/g, '#§w1');
    return svg('0 0 120 90',
      fijo(agua('M84,50 L112,36 Q112,48 104,54 L112,62 Q100,68 88,62Z', C.rojoO, { f: F })
      + agua('M38,26 Q34,16 44,12 Q42,18 47,23 Q48,16 54,15 Q50,20 50,26Z', C.rojoO, { f: 'l' })
      + agua(cuerpo, C.rojo, { f: F })
      + agua(mancha(52, 63, 22, 7, 5, .1), C.crema, { f: F, o: .9 })
      + vel(mancha(70, 52, 18, 12, 6, .2), C.rojoO, { o: .4 })
      + agua('M24,40 L8,45 L24,50Z', C.naranja, { f: 'l' })
      + ojo(37, 40, 4.4) + colorete(44, 51, 5)
      + agua(ala, C.rojoO, { f: F, o: .95 })
      + trazo(up ? 'M58,38 Q64,26 70,14' : 'M56,58 Q60,70 64,80', 2, lava(C.rojoO, .5), { o: .7 })));
  };

  Object.assign(ILUS, {
    // Luna dormida con gorro de dormir azul; las zetas suben
    luna: () => svg('0 0 200 200', `<g class="cara-luna">`
      + agua(mancha(98, 110, 67, 65, 3, .035), '#F7E8A8')
      + vel(mancha(122, 134, 46, 36, 4, .15), C.solO, { o: .38 })
      + [[58, 140, 9], [140, 142, 7], [46, 106, 5], [148, 114, 4.5], [100, 166, 5.5]].map(([x, y, r], i) => vel(mancha(x, y, r, r * .85, i + 5, .15), C.solO, { o: .55 })).join('')
      + trazo('M66,106 Q76,116 87,106', 2.6) + trazo('M110,106 Q120,116 130,106', 2.6)
      + colorete(64, 128, 9) + colorete(132, 128, 9) + sonrisa(98, 132, 18)
      + agua('M38,84 Q34,44 80,24 Q122,12 156,34 Q176,48 182,70 Q164,58 150,70 Q110,62 38,84Z', C.azul)
      + vel('M110,30 Q160,34 180,68 Q164,58 150,70 Q130,50 110,30Z', carga(C.azul, .75), { o: .4 })
      + brillo(80, 46, 6, C.sol) + brillo(118, 38, 5, C.sol) + brillo(146, 52, 4.5, C.sol) + brillo(62, 64, 4, C.sol)
      + agua('M34,88 Q28,74 44,68 Q92,56 154,70 Q170,74 162,90 Q100,74 34,88Z', PAPEL) + vel('M44,80 Q100,68 156,80 L162,90 Q100,74 34,88Z', C.cieloO, { o: .4 })
      + agua(mancha(178, 78, 11, 11, 7, .1), PAPEL) + vel(mancha(180, 82, 8, 6, 8, .2), C.cieloO, { o: .4 })
      + trazo('M150,140 h12 l-12,12 h12', 3.2, C.violeta, { o: .9 }) + trazo('M170,124 h8 l-8,8 h8', 3, C.violeta, { o: .9 })
      + `</g>`),

    // Duende de pie: sombrero verde, barba naranja, un brazo saluda
    duende: () => svg('0 0 160 220',
      suelo(80, 212, 44, 3)
      + pincel('M70,178 L70,200', 9, SOCK) + pincel('M92,178 L92,200', 9, SOCK)
      + trazo('M65,184 h10 M65,192 h10 M87,184 h10 M87,192 h10', 2.6, VERDE, { o: .9 })
      + agua('M52,208 Q52,198 68,198 L76,204 Q76,213 62,213 Q52,213 52,208Z', C.negro) + agua('M110,208 Q110,198 94,198 L86,204 Q86,213 100,213 Q110,213 110,208Z', C.negro)
      + pincel('M60,118 L40,142 L51,155', 11, VERDE)
      + pincel('M102,116 L121,118 L125,100', 11, VERDE)
      + agua('M54,104 Q80,96 108,104 Q120,140 112,180 Q82,186 50,180 Q42,140 54,104Z', VERDE)
      + vel('M90,104 Q110,108 112,180 Q100,184 92,182Z', VERDEO, { o: .45 })
      + trazo('M62,120 Q58,150 60,170 M96,126 Q98,150 96,170', 1.6, VERDEO, { o: .6 })
      + pincel('M48,144 Q80,152 114,144', 8, C.negro) + agua(mancha(82, 148, 7, 6.5, 4, .1), C.sol, { f: 'l' })
      + agua(mancha(52, 157, 6.5, 6.5, 5, .1), PIEL, { f: 'l' }) + agua(mancha(126, 92, 8, 8, 6, .1), PIEL, { f: 'l' })
      + agua(mancha(80, 66, 28, 24, 7, .05), PIEL)
      + agua('M52,70 Q50,102 80,112 Q110,102 108,70 Q94,86 80,82 Q66,86 52,70Z', PELO)
      + trazo('M62,92 Q66,100 72,104 M88,104 Q96,100 100,92', 1.8, carga(PELO, .6), { o: .8 })
      + trazo('M62,78 Q70,72 78,78 M82,78 Q90,72 98,78', 2, carga(PELO, .6), { o: .85 })
      + ojo(70, 62, 3.4) + ojo(90, 62, 3.4) + agua(mancha(80, 70, 5, 4.5, 10, .1), pig('#E58A84'), { f: 'l' }) + colorete(60, 72, 5) + colorete(100, 72, 5)
      + agua(mancha(50, 66, 5, 8, 11, .1), PIEL, { f: 'l' }) + agua(mancha(110, 66, 5, 8, 12, .1), PIEL, { f: 'l' })
      + agua(mancha(80, 46, 36, 8, 13, .08), VERDEO)
      + agua('M56,46 Q52,20 60,8 Q80,2 100,8 Q108,20 104,46Z', VERDE)
      + pincel('M56,38 Q80,44 104,38', 7, C.negro) + agua(mancha(80, 40, 6, 5.5, 14, .1), C.sol, { f: 'l' })
      + trazo('M66,18 Q70,24 68,30', 1.6, VERDEO) + flor(100, 22, VERDEO, 3.4)),

    // Duende corriendo con la olla de oro, rayas de velocidad y polvo
    duende_corre: () => svg('0 0 200 220',
      suelo(102, 212, 66, 3)
      + trazo('M10,112 H38 M4,134 H30 M14,156 H36', 3.6, C.grisO, { o: .45 })
      + agua(mancha(30, 203, 5, 4.5, 3, .1), PAPEL, { f: 'l' }) + agua(mancha(38, 200, 7, 6, 4, .1), PAPEL, { f: 'l' }) + agua(mancha(21, 207, 3.5, 3, 5, .1), PAPEL, { f: 'l' })
      + pincel('M88,176 L76,192 L60,188', 9, SOCK) + pincel('M106,176 L122,190 L124,200', 9, SOCK)
      + agua('M46,186 Q48,176 62,180 L70,192 Q66,200 54,196Z', C.negro) + agua('M118,204 Q122,196 134,200 Q142,206 138,212 Q124,214 118,210Z', C.negro)
      + pincel('M108,128 L140,128 L164,134', 10, VERDE)
      + `<g transform="translate(14 -2) rotate(12 80 180)">`
      + agua('M58,104 Q82,96 108,104 Q116,142 110,178 Q82,184 56,178 Q50,142 58,104Z', VERDE)
      + vel('M90,104 Q108,106 110,178 Q98,182 92,180Z', VERDEO, { o: .45 })
      + pincel('M54,142 Q82,150 112,142', 8, C.negro) + agua(mancha(84, 146, 6.5, 6, 4, .1), C.sol, { f: 'l' }) + `</g>`
      + `<g transform="translate(22 0) rotate(8 80 120)">`
      + agua(mancha(80, 66, 28, 24, 7, .05), PIEL)
      + agua('M52,70 Q50,102 80,112 Q110,102 108,70 Q94,86 80,82 Q66,86 52,70Z', PELO)
      + agua(mancha(80, 76, 17, 5, 8, .12), PELO)
      + trazo('M62,78 Q70,72 78,78 M82,78 Q90,72 98,78', 2, carga(PELO, .6), { o: .85 }) + ojo(70, 62, 3.4) + ojo(90, 62, 3.4) + agua(mancha(80, 70, 4.5, 4, 10, .1), pig('#E58A84'), { f: 'l' }) + colorete(64, 72, 5) + colorete(96, 72, 5)
      + agua(mancha(80, 46, 36, 8, 13, .08), VERDEO)
      + agua('M56,46 Q52,20 60,8 Q80,2 100,8 Q108,20 104,46Z', VERDE)
      + pincel('M56,38 Q80,44 104,38', 7, C.negro) + agua(mancha(80, 40, 6, 5.5, 14, .1), C.sol, { f: 'l' })
      + `</g>`
      + olla(100, 98, .48)
      + agua(mancha(166, 137, 6.5, 6.5, 6, .1), PIEL, { f: 'l' })
      + pincel('M96,132 L100,148 L110,140', 9, VERDE) + agua(mancha(111, 138, 6.5, 6.5, 7, .1), PIEL, { f: 'l' })
      + moneda(150, 80, 6, 3) + moneda(176, 94, 5, 4) + brillo(160, 70, 4, C.solO)),

    olla_oro: () => svg('0 0 160 140',
      suelo(80, 132, 62, 3)
      + olla(0, 0, 1)
      + brillo(30, 22, 11, C.solO) + brillo(146, 28, 13, C.solO) + brillo(124, 8, 7, C.sol)),

    // Avioneta con pancarta en blanco; la hélice (class helice) vibra
    avioneta: () => svg('0 0 400 120',
      agua('M8,26 Q40,14 76,20 Q110,28 146,22 Q180,16 212,26 L210,96 Q176,90 144,102 Q110,110 76,94 Q40,88 10,100 Q16,62 8,26Z', PAPEL)
      + vel('M54,22 Q70,58 66,92 L84,94 Q88,56 74,20Z', C.cieloO, { o: .3 }) + vel('M138,24 Q150,60 142,100 L162,100 Q168,60 152,22Z', C.cieloO, { o: .3 })
      + vel('M10,80 Q80,90 210,86 L210,96 Q176,90 144,102 Q110,110 76,94 Q40,88 10,100Z', C.cieloO, { o: .35 })
      + trazo('M212,24 L212,100', 5, C.tronco, { o: .85 })
      + trazo('M214,28 L262,60 M214,96 L262,62', 2, C.grisO, { o: .8 })
      + agua('M262,50 Q258,24 266,20 Q280,26 292,50Z', C.sol)
      + agua('M296,38 Q284,34 274,40 Q264,38 258,34 Q268,26 282,24 Q292,24 298,30Z', C.rojo)
      + agua('M262,50 Q296,38 340,40 Q372,42 374,60 Q372,78 346,80 Q298,82 262,68Z', C.rojo)
      + vel('M270,66 Q320,76 366,70 Q360,80 346,80 Q298,82 262,68Z', C.rojoO, { o: .5 })
      + pincel('M268,60 Q320,64 370,58', 5, C.sol, { o: .9 })
      + agua('M318,46 L324,34 Q330,34 336,46Z', C.cielo, { f: 'l' })
      + pincel('M322,76 L326,92', 3.6, C.negro) + agua(mancha(326,98,9,8.5,4,.08), C.negro, { f: 'l' }) + punto(326, 98, 3, C.gris, .9)
      + agua(mancha(318, 68, 34, 8, 5, .1), C.sol) + vel(mancha(326, 70, 22, 4, 6, .1), C.solO, { o: .5 })
      + agua(mancha(304, 30, 11, 11, 7, .06), PIEL, { f: 'l' }) + agua('M292,30 Q290,16 304,15 Q318,16 316,28 Q306,24 292,30Z', C.tronco, { f: 'l' })
      + agua(mancha(300, 23, 4, 4, 8, .1), C.cielo, { f: 'l' }) + agua(mancha(309, 22, 4, 4, 9, .1), C.cielo, { f: 'l' }) + punto(309, 31, 1.8, '#4A3E58', .9)
      + colorete(312, 36, 3.4) + trazo('M304,37 q4,3 8,0', 1.6)
      + agua('M364,48 Q378,52 378,60 Q378,68 364,72Z', C.gris, { f: 'l' })
      + `<g class="helice">` + agua(mancha(382, 60, 5, 35, 11, .06), C.tronco) + vel(mancha(382, 60, 3, 28, 12, .06), C.troncoO, { o: .4 }) + agua(mancha(382, 60, 5.5, 5.5, 13, .1), C.rojoO, { f: 'l' }) + `</g>`),

    // Globo: el color de la opción (o.color) se aguada con la caja
    globo: (o = {}) => { const c = pig(o.color || '#E63027'), co = carga(c, .8);
      return svg('0 0 100 180',
        trazo('M50,114 Q42,126 52,138 Q60,150 48,162 Q42,170 50,176', 2.2, C.grisO, { o: .8 })
        + agua('M50,104 L42,118 Q50,121 58,118Z', co, { f: 'l' })
        + agua('M50,10 Q78,10 90,36 Q96,66 76,92 Q64,104 50,106 Q36,104 24,92 Q4,66 10,36 Q22,10 50,10Z', c)
        + vel('M72,24 Q94,50 80,88 Q68,104 52,106 Q80,84 72,24Z', co, { o: .45 })
        + agua(mancha(32, 36, 6, 12, 5, .12, 8, .5), PAPEL, { f: 'l', o: .7 }) + punto(28, 62, 2.4, PAPEL, .6)); },

    pajaro: () => pajaro(true),
    pajaro_abajo: () => pajaro(false),

    // Platillo volante con un marciano verde en la cúpula
    ovni: () => svg('0 0 200 140',
      suelo(100, 132, 50, 4)
      + agua('M44,94 Q52,122 100,122 Q148,122 156,94Z', C.grisO)
      + pincel('M70,110 Q100,118 130,110', 4, C.sol, { o: .9 })
      + trazo('M90,36 L84,22 M110,36 L116,22', 2.4, C.verdeO || C.hojaO) + punto(83, 20, 4.4, C.rosaO, .95) + punto(117, 20, 4.4, C.rosaO, .95)
      + agua('M76,86 Q76,70 100,68 Q124,70 124,86Z', C.hoja)
      + agua(mancha(100, 50, 23, 20, 3, .06), C.hoja) + vel(mancha(112, 58, 14, 10, 4, .2), C.hojaO, { o: .5 })
      + ojo(91, 48, 5) + ojo(109, 48, 5) + colorete(82, 60, 4.5) + colorete(118, 60, 4.5) + sonrisa(100, 59, 11)
      + pincel('M80,76 Q68,72 68,56', 5, C.hoja) + agua(mancha(68, 53, 5, 5, 5, .1), C.hoja, { f: 'l' })
      + vel('M54,86 Q50,40 74,20 Q100,8 126,20 Q150,40 146,86Z', C.cielo, { o: .6 }) + trazo('M54,86 Q50,40 74,20 Q100,8 126,20 Q150,40 146,86', 2.2, LINEA, { o: .8 })
      + pincel('M66,58 Q68,38 90,24', 4, PAPEL, { f: 'l', o: .85 }) + trazo('M136,48 Q140,58 140,66', 2.4, PAPEL, { o: .8 })
      + agua('M12,88 Q20,70 100,68 Q180,70 188,88 Q180,106 100,108 Q20,106 12,88Z', C.gris)
      + vel('M30,92 Q100,112 176,92 Q160,108 100,108 Q40,108 30,92Z', C.grisO, { o: .5 })
      + trazo('M32,84 Q100,74 170,84', 2.4, PAPEL, { o: .8 })
      + [C.sol, C.rojo, C.hoja, C.rosa, C.azul, C.sol, C.rojo].map((c, i) => { const a = (160 - i * 23.3) * Math.PI / 180; return agua(mancha(100 + 70 * Math.cos(a), 91 + 10 * Math.sin(a), 5.5, 5, i + 3, .1), c, { f: 'l' }); }).join('')),

    // Cohete: morro rojo, cuerpo claro, ventanilla dorada y llama
    cohete: () => svg('0 0 140 220',
      agua('M70,158 Q48,182 70,214 Q92,182 70,158Z', C.naranja, { f: 'l' }) + agua('M70,166 Q58,184 70,202 Q82,184 70,166Z', C.sol, { f: 'l' })
      + agua('M52,150 L88,150 L84,164 L56,164Z', C.grisO, { f: 'l' })
      + agua('M42,106 Q24,118 18,162 L46,146Z', C.rojo) + agua('M98,106 Q116,118 122,162 L94,146Z', C.rojo)
      + vel('M42,106 Q24,118 18,162 L30,154Z', C.rojoO, { o: .5 })
      + agua('M70,14 Q98,40 102,100 Q104,130 98,152 Q70,158 42,152 Q36,130 38,100 Q42,40 70,14Z', C.crema)
      + vel('M84,30 Q102,62 102,110 Q104,134 98,152 L84,152Z', C.cieloO, { o: .35 })
      + agua('M70,14 Q90,28 98,52 Q70,46 42,52 Q50,28 70,14Z', C.rojo)
      + pincel('M38,128 Q70,134 102,128', 11, C.azul)
      + agua(mancha(70, 82, 19, 19, 4, .05), C.sol) + agua(mancha(70, 82, 12.5, 12.5, 5, .05), C.cielo, { f: 'l' }) + punto(65, 77, 3, PAPEL, .9)),

    // Estrella sonriente de cinco puntas
    estrella: () => { const P = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = (i % 2 ? 24 : 45) * (1 + ((i * 37) % 7 - 3) * .012); P.push([50 + r * Math.cos(a), 54 + r * Math.sin(a)]); }
      return svg('0 0 100 100',
        agua(liso(P), C.sol) + vel(mancha(60, 64, 26, 20, 4, .2), C.solO, { o: .5 })
        + agua(mancha(38, 38, 5, 3, 5, .15), PAPEL, { f: 'l', o: .7 })
        + ojo(41, 55, 3.6) + ojo(59, 55, 3.6) + colorete(33, 64, 4.5) + colorete(67, 64, 4.5) + sonrisa(50, 64, 9)); }
  });

  // ---- Animales: gorditos y sentados, como el cerdito y la vaca ----
  const ojoB = (x, y, r = 6.5) => agua(mancha(x, y, r, r, x + y, .06), PAPEL, { f: 'l' }) + punto(x + 1, y + 1, r * .52, '#4A3E58', .95) + punto(x + 2.2, y - .6, r * .17, PAPEL, 1);
  const bigotes = (x, y, w, s = 1) => [-6, 2, 10].map(d => trazo(`M${x + s * 8},${y + d * .4} Q${x + s * w * .6},${y + d * .5 - 3} ${x + s * w},${y + d}`, 1.4, LINEA, { o: .6 })).join('');
  const MARRON = pig('#B5733A'), MARRONO = carga(MARRON, .8);
  Object.assign(ILUS, {
    // Perrito crema con orejas caídas marrones y collar azul
    animal_perro: () => svg('0 0 200 200',
      suelo(100, 178, 60, 3)
      + pincel('M146,150 Q168,144 162,118', 8, C.tierra)
      + agua(mancha(100, 142, 46, 38, 3, .06), C.crema)
      + agua(mancha(76, 174, 12, 9, 4, .1), C.crema) + agua(mancha(124, 174, 12, 9, 5, .1), C.crema)
      + trazo('M76,160 v14 M124,160 v14 M100,152 v18', 1.6, C.tierra, { o: .7 })
      + agua('M60,50 Q36,58 42,102 Q64,104 72,72Z', C.tronco) + agua('M140,50 Q164,58 158,102 Q136,104 128,72Z', C.tronco)
      + agua(mancha(100, 88, 46, 42, 6, .05), C.crema)
      + vel(mancha(80, 76, 22, 22, 7, .15), C.tierra, { o: .6 })
      + agua(mancha(100, 108, 22, 15, 8, .08), PAPEL) + agua(mancha(100, 98, 8, 6, 9, .1), C.negro, { f: 'l' })
      + agua('M92,114 Q100,134 108,114Z', C.rosaO, { f: 'l' }) + trazo('M100,106 v8 M88,112 Q94,118 100,114 Q106,118 112,112', 1.8)
      + ojo(80, 82, 4.2) + ojo(120, 82, 4.2) + colorete(64, 100, 9) + colorete(136, 100, 9)
      + pincel('M66,128 Q100,148 134,128', 7, C.azul) + agua(mancha(100, 142, 5, 5, 10, .1), C.sol, { f: 'l' })
      + trazo('M110,56 q6,-6 12,-2 M78,60 q-4,-6 -10,-4', 1.6, C.tronco, { o: .8 })),

    // Gatito naranja de rayas, cola enroscada
    animal_gato: () => svg('0 0 200 200',
      suelo(100, 178, 58, 3)
      + pincel('M148,160 Q184,160 176,124 Q172,106 160,112', 9, C.naranja)
      + agua(mancha(100, 142, 44, 38, 3, .06), C.naranja)
      + agua(mancha(78, 174, 12, 9, 4, .1), C.naranja) + agua(mancha(122, 174, 12, 9, 5, .1), C.naranja)
      + agua(mancha(100, 150, 22, 26, 11, .1), PAPEL, { o: .9 })
      + trazo('M62,128 q8,4 10,12 M64,148 q8,2 10,8 M138,128 q-8,4 -10,12 M136,148 q-8,2 -10,8', 2.2, C.pajaO, { o: .85 })
      + agua('M54,60 Q50,28 62,22 Q80,34 84,54Z', C.naranja) + agua('M146,60 Q150,28 138,22 Q120,34 116,54Z', C.naranja)
      + vel('M60,54 Q58,36 64,30 Q74,38 76,52Z', C.rosa, { o: .8 }) + vel('M140,54 Q142,36 136,30 Q126,38 124,52Z', C.rosa, { o: .8 })
      + agua(mancha(100, 90, 50, 44, 6, .05), C.naranja)
      + trazo('M100,48 v14 M88,50 l3,12 M112,50 l-3,12 M54,84 q10,2 14,8 M146,84 q-10,2 -14,8', 2.2, C.pajaO, { o: .9 })
      + agua(mancha(100, 108, 24, 15, 8, .08), PAPEL)
      + ojo(78, 82, 4.8) + ojo(122, 82, 4.8) + colorete(62, 102, 9) + colorete(138, 102, 9)
      + agua('M94,98 L106,98 L100,106Z', C.rosaO, { f: 'l' }) + trazo('M100,106 v6 M90,114 Q100,118 100,112 Q100,118 110,114', 1.6)
      + bigotes(100, 106, 52, 1) + bigotes(100, 106, 52, -1)),

    // Patito amarillo que saluda con el ala
    animal_pato: () => svg('0 0 200 200',
      suelo(100, 178, 56, 3)
      + agua(mancha(106, 142, 48, 38, 3, .06), C.sol)
      + agua('M76,176 Q66,184 82,186 Q96,184 90,176Z', C.naranja, { f: 'l' }) + agua('M118,176 Q108,184 124,186 Q138,184 132,176Z', C.naranja, { f: 'l' })
      + agua('M60,132 Q40,110 48,92 Q60,92 64,108 Q72,120 74,132Z', C.sol) + vel('M52,108 Q56,120 70,130', C.solO, { o: .6 })
      + vel(mancha(124, 152, 26, 18, 6, .15), C.solO, { o: .4 })
      + agua(mancha(100, 82, 42, 40, 7, .05), C.sol)
      + trazo('M96,44 Q92,34 100,32 M102,44 Q108,36 104,30', 1.8, C.solO)
      + agua(mancha(100, 104, 26, 11, 8, .08), C.naranja) + trazo('M82,104 Q100,110 118,104 M94,100 h.5 M106,100 h.5', 1.6, C.rojoO)
      + ojo(78, 78, 4.4) + ojo(122, 78, 4.4) + colorete(62, 98, 9) + colorete(138, 98, 9)),

    // Ovejita de lana en nubes, cara gris
    animal_oveja: () => svg('0 0 200 200',
      suelo(100, 180, 56, 3)
      + agua(mancha(76, 170, 8, 14, 4, .1), C.negro) + agua(mancha(124, 170, 8, 14, 5, .1), C.negro)
      + agua(liso([[52, 128], [58, 108], [80, 100], [104, 96], [128, 102], [146, 114], [150, 138], [138, 160], [112, 168], [84, 168], [60, 156]]), PAPEL)
      + vel(mancha(124, 148, 28, 18, 6, .2), C.cieloO, { o: .5 }) + vel(mancha(66, 134, 12, 16, 7, .2), C.cieloO, { o: .35 })
      + trazo('M70,128 q6,-8 12,0 M104,140 q6,-8 12,0 M120,116 q6,-8 12,0', 1.6, C.grisO, { o: .7 })
      + agua('M60,84 Q34,74 42,92 Q50,100 66,98Z', C.rosa) + agua('M140,84 Q166,74 158,92 Q150,100 134,98Z', C.rosa)
      + agua(mancha(100, 88, 34, 34, 8, .05), '#9A93A8')
      + agua(liso([[70, 62], [76, 44], [92, 38], [108, 38], [124, 46], [132, 62], [112, 58], [92, 60]]), PAPEL)
      + ojoB(86, 86, 7) + ojoB(114, 86, 7) + agua(mancha(100, 100, 7, 5, 9, .1), C.rosaO, { f: 'l' }) + colorete(70, 100, 7) + colorete(130, 100, 7)
      + sonrisa(100, 110, 14) + trazo('M82,40 q6,-8 12,-2 M110,40 q6,-8 12,0', 1.6, C.grisO, { o: .7 })),

    // Gallo de cola larga y colorida
    animal_gallo: () => svg('0 0 200 200',
      suelo(100, 184, 54, 3)
      + pincel('M122,128 Q164,110 168,58', 12, C.azul) + pincel('M126,138 Q176,134 176,92', 11, C.hoja) + pincel('M126,150 Q170,164 178,126', 10, C.violeta)
      + trazo('M86,170 v12 M112,170 v12 M78,184 h14 M104,184 h14', 3, C.naranja, { o: .9 })
      + agua(liso([[64, 112], [78, 96], [104, 98], [128, 114], [130, 144], [112, 168], [86, 170], [70, 150]]), C.naranja)
      + vel(mancha(112, 152, 20, 14, 5, .2), C.rojoO, { o: .4 })
      + agua(mancha(100, 134, 20, 14, 6, .1, 10, .4), C.pajaO) + trazo('M88,132 Q100,142 114,130', 1.8, C.rojoO, { o: .8 })
      + agua('M78,62 L78,102 L100,104 L100,60Z', C.sol) + vel('M82,64 L82,100 L98,102Z', C.naranja, { o: .4 })
      + agua(mancha(88, 62, 24, 24, 7, .06), C.sol)
      + agua(liso([[72, 44], [74, 28], [82, 36], [88, 22], [96, 34], [104, 28], [102, 46]]), C.rojo)
      + agua('M64,64 L50,70 L64,76Z', C.naranja, { f: 'l' }) + agua(mancha(70, 82, 5, 9, 8, .1), C.rojo, { f: 'l' })
      + ojo(82, 58, 4) + colorete(96, 70, 6)),

    // Gallina marrón con su pollito
    animal_gallina: () => svg('0 0 200 200',
      suelo(104, 182, 60, 3)
      + agua(liso([[56, 112], [60, 80], [82, 62], [112, 64], [136, 82], [142, 114], [132, 150], [106, 172], [78, 172], [58, 150]]), C.tierra)
      + agua(mancha(94, 138, 26, 28, 4, .08), C.crema)
      + trazo('M82,128 q6,6 12,0 q6,6 12,0 M80,142 q6,6 12,0 q6,6 12,0', 1.6, C.tronco, { o: .8 })
      + agua('M138,86 L164,66 L156,92 L170,96 L140,112Z', C.tronco)
      + agua(mancha(116, 126, 20, 26, 5, .1, 10, .4), C.tronco) + trazo('M106,120 Q120,132 124,144', 1.8, C.troncoO, { o: .8 })
      + agua(liso([[86, 66], [88, 48], [96, 56], [102, 42], [108, 56], [116, 50], [114, 68]]), C.rojo)
      + ojo(86, 84, 4.4) + ojo(112, 84, 4.4) + agua('M92,92 L106,92 L99,104Z', C.sol, { f: 'l' }) + agua(mancha(99, 108, 4, 6, 6, .1), C.rojo, { f: 'l' })
      + colorete(74, 98, 7) + colorete(124, 98, 7)
      + trazo('M88,170 v10 M112,170 v10 M82,180 h12 M106,180 h12', 2.8, C.naranja, { o: .9 })
      + agua(mancha(168, 176, 13, 12, 8, .08), C.sol) + agua('M156,174 L148,178 L156,181Z', C.naranja, { f: 'l' }) + punto(162, 172, 2.2, '#4A3E58', .95)),

    // Caballito marrón de crines claras
    animal_caballo: () => svg('0 0 200 200',
      suelo(100, 184, 54, 3)
      + pincel('M144,128 Q176,150 164,180', 10, C.paja)
      + pincel('M70,150 L70,176', 12, C.tronco) + pincel('M92,152 L92,176', 12, C.tronco) + pincel('M122,152 L122,176', 12, C.tronco) + pincel('M144,148 L146,176', 12, C.tronco)
      + agua(mancha(70, 178, 9, 5, 3, .1), C.negro, { f: 'l' }) + agua(mancha(122, 178, 9, 5, 4, .1), C.negro, { f: 'l' }) + agua(mancha(92, 178, 9, 5, 5, .1), C.negro, { f: 'l' }) + agua(mancha(146, 178, 9, 5, 6, .1), C.negro, { f: 'l' })
      + agua(liso([[54, 124], [62, 108], [96, 102], [136, 108], [152, 128], [146, 152], [100, 158], [62, 152]]), C.tronco)
      + vel(mancha(124, 142, 26, 14, 7, .2), C.troncoO, { o: .4 })
      + agua('M72,56 Q64,22 76,14 Q86,28 90,46Z', C.tronco) + agua('M128,56 Q136,22 124,14 Q114,28 110,46Z', C.tronco)
      + agua('M92,28 Q124,24 130,60 Q136,100 118,112 Q132,76 92,28Z', C.paja)
      + agua(liso([[74, 50], [80, 32], [100, 28], [120, 34], [124, 56], [120, 80], [100, 88], [80, 80]]), C.tronco)
      + agua(mancha(100, 86, 22, 15, 8, .08), C.crema) + punto(92, 88, 2.6, C.troncoO, .9) + punto(108, 88, 2.6, C.troncoO, .9)
      + trazo('M92,42 Q100,36 108,42', 2, C.paja)
      + ojo(86, 62, 4) + ojo(114, 62, 4) + colorete(78, 78, 6) + colorete(122, 78, 6)),

    // León con melena de manchas naranjas
    animal_leon: () => svg('0 0 200 200',
      suelo(100, 182, 58, 3)
      + pincel('M148,150 Q174,148 170,116', 7, C.sol) + agua(mancha(170, 112, 8, 10, 3, .1), C.naranja, { f: 'l' })
      + agua(mancha(100, 142, 42, 36, 4, .06), C.sol)
      + agua(mancha(78, 174, 12, 9, 5, .1), C.sol) + agua(mancha(122, 174, 12, 9, 6, .1), C.sol)
      + agua(liso([[100, 22], [128, 30], [152, 48], [162, 80], [154, 112], [132, 128], [100, 134], [68, 128], [46, 112], [38, 80], [48, 48], [72, 30]]), C.naranja)
      + trazo('M60,46 q8,10 4,22 M140,46 q-8,10 -4,22 M48,90 q10,2 14,12 M152,90 q-10,2 -14,12 M100,30 q4,8 0,16', 2, C.pajaO, { o: .9 })
      + agua(mancha(66, 62, 12, 12, 7, .1), C.sol) + agua(mancha(134, 62, 12, 12, 8, .1), C.sol)
      + agua(mancha(100, 90, 34, 32, 9, .05), C.sol)
      + agua(mancha(100, 108, 22, 14, 10, .08), PAPEL) + agua('M93,98 L107,98 L100,106Z', C.rosaO, { f: 'l' }) + trazo('M100,106 v6 M90,114 Q100,120 100,112 Q100,120 110,114', 1.6)
      + ojo(82, 84, 4.2) + ojo(118, 84, 4.2) + colorete(68, 102, 8) + colorete(132, 102, 8)),

    // Elefantito gris con orejas rosas y trompa enroscada
    animal_elefante: () => svg('0 0 200 200',
      suelo(100, 180, 58, 3)
      + agua(mancha(100, 142, 44, 38, 3, .06), C.gris)
      + agua(mancha(76, 174, 13, 9, 4, .1), C.gris) + agua(mancha(124, 174, 13, 9, 5, .1), C.gris)
      + trazo('M72,174 v-3 M80,174 v-3 M120,174 v-3 M128,174 v-3', 2, C.grisO)
      + agua(mancha(48, 84, 30, 38, 6, .08), C.gris) + agua(mancha(152, 84, 30, 38, 7, .08), C.gris)
      + vel(mancha(50, 86, 18, 26, 8, .1), C.rosa, { o: .8 }) + vel(mancha(150, 86, 18, 26, 9, .1), C.rosa, { o: .8 })
      + agua(mancha(100, 84, 40, 36, 10, .05), C.gris)
      + pincel('M100,96 Q96,126 118,130 Q130,128 126,118', 15, C.gris)
      + vel(mancha(86, 100, 14, 8, 11, .2), C.grisO, { o: .4 })
      + trazo('M96,110 q8,2 10,0 M98,120 q8,2 10,0', 1.4, C.grisO, { o: .7 })
      + ojo(82, 78, 4.2) + ojo(118, 78, 4.2) + colorete(70, 98, 8) + colorete(130, 98, 8)),

    // Monito con plátano y cola enroscada
    animal_mono: () => svg('0 0 200 200',
      suelo(100, 182, 56, 3)
      + pincel('M70,160 Q30,170 30,134 Q30,108 52,114', 9, MARRON)
      + agua(mancha(100, 140, 38, 36, 3, .06), MARRON)
      + agua(mancha(100, 148, 22, 24, 4, .1), C.crema)
      + agua(mancha(76, 174, 13, 9, 5, .1), MARRON) + agua(mancha(126, 174, 13, 9, 6, .1), MARRON)
      + pincel('M130,134 Q150,126 154,104', 9, MARRON) + agua('M152,112 Q160,92 170,90 Q172,100 164,118Z', C.sol)
      + agua(mancha(56, 82, 15, 15, 7, .1), MARRON) + agua(mancha(144, 82, 15, 15, 8, .1), MARRON)
      + vel(mancha(56, 82, 8, 8, 9, .1), C.crema, { o: .8 }) + vel(mancha(144, 82, 8, 8, 10, .1), C.crema, { o: .8 })
      + agua(mancha(100, 82, 42, 38, 11, .05), MARRON)
      + agua(liso([[74, 76], [86, 70], [100, 78], [114, 70], [126, 76], [128, 98], [114, 112], [100, 116], [86, 112], [72, 98]]), C.crema)
      + trazo('M96,98 h.5 M104,98 h.5 M90,106 Q100,112 110,106', 2.2)
      + ojo(86, 80, 4) + ojo(114, 80, 4) + colorete(72, 98, 6) + colorete(128, 98, 6)
      + trazo('M88,50 q8,-8 14,0 q4,-6 10,0', 1.6, MARRONO, { o: .8 })),

    // Ranita verde de ojos saltones
    animal_rana: () => svg('0 0 200 200',
      suelo(100, 180, 62, 3)
      + agua(liso([[40, 150], [38, 126], [60, 102], [100, 96], [140, 102], [162, 126], [160, 150], [140, 170], [100, 174], [60, 170]]), C.hoja)
      + agua(mancha(100, 150, 24, 22, 4, .1), lava(C.prado, .3))
      + agua(mancha(48, 168, 22, 9, 5, .1), C.hoja) + agua(mancha(152, 168, 22, 9, 6, .1), C.hoja)
      + trazo('M62,170 v-8 M72,170 v-8 M128,170 v-8 M138,170 v-8', 2, C.hojaO, { o: .8 })
      + agua('M52,142 Q44,120 62,106 Q70,128 74,150Z', C.hojaO) + agua('M148,142 Q156,120 138,106 Q130,128 126,150Z', C.hojaO)
      + agua(liso([[50, 96], [56, 78], [76, 72], [100, 74], [124, 72], [144, 78], [150, 96], [138, 114], [100, 122], [62, 114]]), C.hoja)
      + agua(mancha(70, 66, 20, 20, 7, .06), C.hoja) + agua(mancha(130, 66, 20, 20, 8, .06), C.hoja)
      + ojoB(70, 64, 12) + ojoB(130, 64, 12)
      + vel(mancha(122, 108, 30, 14, 9, .2), C.hojaO, { o: .4 })
      + punto(94, 92, 1.8, C.hojaO, .9) + punto(106, 92, 1.8, C.hojaO, .9)
      + trazo('M66,104 Q100,126 134,104', 2.2) + agua('M92,114 Q100,126 108,114Z', C.rosaO, { f: 'l' })
      + colorete(54, 100, 7) + colorete(146, 100, 7)),

    // Búho en su rama, ojos enormes
    animal_buho: () => svg('0 0 200 200',
      suelo(100, 186, 66, 3)
      + pincel('M26,170 Q100,160 176,168', 12, C.tronco) + pincel('M170,167 Q184,160 188,150', 6, C.tronco) + agua('M178,160 Q190,150 192,160 Q186,166 178,160Z', C.hoja, { f: 'l' })
      + trazo('M36,172 Q80,166 130,170', 1.6, C.troncoO, { o: .7 })
      + agua(liso([[54, 110], [58, 76], [80, 54], [120, 54], [142, 76], [146, 110], [136, 146], [108, 166], [92, 166], [64, 146]]), MARRON)
      + agua(mancha(100, 126, 28, 32, 4, .08), C.crema)
      + trazo('M88,114 l6,6 l6,-6 M100,126 l6,6 l6,-6 M82,128 l6,6 l6,-6 M92,142 l6,6 l6,-6', 1.6, C.tronco, { o: .8 })
      + agua('M56,92 Q44,112 54,140 Q64,126 68,100Z', MARRONO) + agua('M144,92 Q156,112 146,140 Q136,126 132,100Z', MARRONO)
      + agua('M60,66 Q54,38 62,28 Q80,38 90,56Z', MARRON) + agua('M140,66 Q146,38 138,28 Q120,38 110,56Z', MARRON)
      + agua(mancha(80, 82, 20, 20, 6, .06), C.crema) + agua(mancha(120, 82, 20, 20, 7, .06), C.crema)
      + agua(mancha(80, 82, 12, 12, 8, .06), C.sol, { f: 'l' }) + agua(mancha(120, 82, 12, 12, 9, .06), C.sol, { f: 'l' })
      + punto(80, 83, 6, '#4A3E58', .95) + punto(120, 83, 6, '#4A3E58', .95) + punto(83, 79, 2, PAPEL, 1) + punto(123, 79, 2, PAPEL, 1)
      + agua('M94,96 L106,96 L100,110Z', C.naranja, { f: 'l' }) + colorete(62, 106, 7) + colorete(138, 106, 7)
      + trazo('M84,166 v6 M92,166 v6 M108,166 v6 M116,166 v6', 2.4, C.naranja)),

    // Lobito gris de pecho blanco
    animal_lobo: () => svg('0 0 200 200',
      suelo(100, 180, 60, 3)
      + pincel('M146,152 Q184,150 178,112', 14, C.grisO)
      + agua(mancha(100, 142, 44, 38, 3, .06), C.gris)
      + agua(mancha(100, 142, 18, 30, 4, .1), PAPEL)
      + agua(mancha(76, 174, 12, 9, 5, .1), C.gris) + agua(mancha(124, 174, 12, 9, 6, .1), C.gris)
      + agua('M52,64 Q42,26 54,14 Q76,30 84,56Z', C.grisO) + agua('M148,64 Q158,26 146,14 Q124,30 116,56Z', C.grisO)
      + vel('M58,56 Q52,34 58,26 Q70,38 74,54Z', C.rosa, { o: .8 }) + vel('M142,56 Q148,34 142,26 Q130,38 126,54Z', C.rosa, { o: .8 })
      + agua(liso([[52, 88], [58, 68], [78, 58], [100, 62], [122, 58], [142, 68], [148, 88], [138, 110], [100, 120], [62, 110]]), C.gris)
      + trazo('M52,92 l10,4 M148,92 l-10,4 M54,102 l10,0 M146,102 l-10,0', 1.8, C.grisO, { o: .8 })
      + agua(mancha(100, 106, 24, 16, 7, .08), PAPEL) + agua(mancha(100, 98, 9, 6, 8, .1), C.negro, { f: 'l' })
      + agua('M94,112 Q100,128 106,112Z', C.rosaO, { f: 'l' }) + trazo('M100,104 v8', 1.6)
      + ojo(82, 82, 4.4) + ojo(118, 82, 4.4) + colorete(66, 100, 8) + colorete(134, 100, 8)),

    // Serpiente verde enroscada con la cabeza en alto
    animal_serpiente: () => svg('0 0 200 200',
      suelo(100, 180, 74, 3)
      + pincel('M170,172 Q150,186 100,184 Q40,182 34,164 Q32,148 76,148 Q120,148 140,160 Q160,170 120,170', 20, C.hoja)
      + pincel('M110,164 Q60,170 50,162', 8, lava(C.prado, .3), { o: .9 })
      + pincel('M122,156 Q70,146 80,126 Q94,110 100,92', 20, C.hoja)
      + vel(mancha(60, 168, 20, 8, 3, .2), C.hojaO, { o: .5 }) + vel(mancha(140, 176, 14, 6, 4, .2), C.hojaO, { o: .5 })
      + agua(mancha(52, 168, 5, 4, 5, .1), C.hojaO, { f: 'l' }) + agua(mancha(110, 180, 5, 4, 6, .1), C.hojaO, { f: 'l' }) + agua(mancha(148, 160, 4.5, 4, 7, .1), C.hojaO, { f: 'l' }) + agua(mancha(84, 130, 4.5, 4, 8, .1), C.hojaO, { f: 'l' })
      + agua(mancha(100, 66, 30, 26, 9, .06), C.hoja) + vel(mancha(112, 74, 16, 12, 10, .2), C.hojaO, { o: .45 })
      + ojoB(88, 60, 6.5) + ojoB(112, 60, 6.5) + colorete(78, 76, 6) + colorete(122, 76, 6)
      + trazo('M88,80 Q100,88 112,80', 1.8) + trazo('M100,88 Q98,98 94,102 M98,96 Q104,100 108,98', 2, C.rojoO)
      + trazo('M86,50 q4,-4 8,0 M106,50 q4,-4 8,0', 1.4, C.hojaO, { o: .7 })),

    // Abeja rayada, alas azuladas
    animal_abeja: () => svg('0 0 200 200',
      suelo(100, 184, 36, 3)
      + trazo('M82,52 Q76,32 66,28 M118,52 Q124,32 134,28', 2.2) + punto(65, 27, 5, C.negro, .95) + punto(135, 27, 5, C.negro, .95)
      + agua(liso([[34, 100], [34, 78], [56, 72], [78, 90], [78, 118], [54, 122]]), PAPEL) + vel(mancha(52, 98, 14, 20, 3, .15), C.cieloO, { o: .55 })
      + agua(liso([[166, 100], [166, 78], [144, 72], [122, 90], [122, 118], [146, 122]]), PAPEL) + vel(mancha(148, 98, 14, 20, 4, .15), C.cieloO, { o: .55 })
      + trazo('M44,84 Q54,96 52,112 M156,84 Q146,96 148,112', 1.3, C.cieloO, { o: .8 })
      + agua(liso([[72, 138], [76, 116], [100, 108], [124, 116], [130, 140], [118, 164], [100, 176], [84, 164]]), C.sol)
      + pincel('M76,136 Q100,146 126,134', 12, C.negro) + pincel('M82,156 Q100,164 120,154', 11, C.negro)
      + agua('M100,174 L96,184 L104,184Z', C.negro, { f: 'l' })
      + pincel('M72,128 Q58,140 66,148', 6, C.sol) + pincel('M128,128 Q142,140 134,148', 6, C.sol)
      + agua(mancha(100, 84, 36, 34, 5, .05), C.sol) + vel(mancha(114, 96, 20, 14, 6, .2), C.solO, { o: .5 })
      + ojo(86, 78, 4.4) + ojo(114, 78, 4.4) + colorete(72, 94, 7) + colorete(128, 94, 7) + sonrisa(100, 92, 12)),

    // Ratoncito de orejas enormes
    animal_raton: () => svg('0 0 200 200',
      suelo(100, 182, 52, 3)
      + pincel('M126,166 Q170,176 176,146 Q178,130 164,128', 5, C.rosaO)
      + agua(mancha(100, 148, 34, 32, 3, .06), C.gris)
      + agua(mancha(100, 154, 18, 20, 4, .1), PAPEL)
      + agua(mancha(78, 176, 11, 7, 5, .1), C.rosa) + agua(mancha(122, 176, 11, 7, 6, .1), C.rosa)
      + agua(mancha(56, 66, 34, 34, 7, .06), C.gris) + agua(mancha(144, 66, 34, 34, 8, .06), C.gris)
      + vel(mancha(58, 68, 22, 22, 9, .1), C.rosa, { o: .85 }) + vel(mancha(142, 68, 22, 22, 10, .1), C.rosa, { o: .85 })
      + agua(mancha(100, 100, 42, 38, 11, .05), C.gris)
      + agua(mancha(100, 112, 20, 14, 12, .08), PAPEL)
      + agua(mancha(100, 106, 7, 6, 13, .1), C.rosaO, { f: 'l' }) + trazo('M100,112 v6 M92,120 Q100,124 100,118 Q100,124 108,120', 1.6)
      + ojo(82, 92, 4.2) + ojo(118, 92, 4.2) + colorete(66, 108, 7) + colorete(134, 108, 7)
      + bigotes(100, 114, 46, 1) + bigotes(100, 114, 46, -1)),
  });
})();
