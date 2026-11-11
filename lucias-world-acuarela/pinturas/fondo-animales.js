// Pinturas: fondo-animales
(() => {
  const { agua, vel, trazo, pincel, punto, gotas, mancha, liso, pig, carga, lava, svg, C, ojo, sonrisa, colorete, hierba, flor, nubeD, LINEA, PAPEL, azar, f1 } = AQ;
  const suelo = (x, y, rx, s = 2) => vel(mancha(x, y, rx, 8, s, .1), C.grisO, { o: .35 });
  // destello de cuatro puntas, de un solo pincel
  const brillo = (x, y, r, c) => agua(`M${x},${y - r} Q${x + r * .18},${y - r * .18} ${x + r},${y} Q${x + r * .18},${y + r * .18} ${x},${y + r} Q${x - r * .18},${y + r * .18} ${x - r},${y} Q${x - r * .18},${y - r * .18} ${x},${y - r}Z`, c, { f: 'l' });
  // moneda de oro: mancha y aro
  const moneda = (x, y, r, s) => agua(mancha(x, y, r, r * .9, s, .1), C.sol, { f: 'l' }) + trazo(mancha(x, y, r * .62, r * .55, s + 1, .08), 1.2, C.solO, { o: .7 });
  const VERDE = pig('#25A84A'), VERDEO = carga(VERDE, .78), PIEL = pig('#F7CDB0'), PELO = pig('#E8782A');

  // La olla de oro se usa sola y en brazos del duende que corre
  const olla = (ox, oy, k) => `<g transform="translate(${ox} ${oy}) scale(${k})">`
    + agua('M48,114 L38,136 L62,126Z', C.negro, { f: 'l' }) + agua('M112,114 L122,136 L98,126Z', C.negro, { f: 'l' })
    + pincel('M30,72 Q10,70 14,92 Q18,104 34,98', 6, C.grisO) + pincel('M130,72 Q150,70 146,92 Q142,104 126,98', 6, C.grisO)
    + agua('M26,64 Q20,100 50,118 Q80,128 110,118 Q140,100 134,64Z', C.negro)
    + vel(mancha(106, 100, 26, 20, 3, .2), carga(C.negro, .6), { o: .45 })
    + agua(mancha(54, 88, 10, 18, 4, .15), lava(C.negro, .5), { f: 'l', o: .8 })
    + agua(liso([[34, 40], [48, 24], [74, 16], [104, 20], [124, 36], [132, 58], [100, 68], [60, 68]]), C.sol)
    + vel(mancha(106, 46, 22, 16, 6, .2), C.solO, { o: .5 })
    + moneda(56, 36, 9, 7) + moneda(80, 26, 9, 8) + moneda(104, 34, 9, 9) + moneda(70, 52, 9, 10) + moneda(96, 54, 8.5, 11) + moneda(122, 54, 8.5, 12)
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
    return svg('0 0 120 90',
      agua('M84,50 L112,36 Q112,48 104,54 L112,62 Q100,68 88,62Z', C.rojoO, { f: F })
      + agua('M38,26 Q34,16 44,12 Q42,18 47,23 Q48,16 54,15 Q50,20 50,26Z', C.rojoO, { f: 'l' })
      + agua(cuerpo, C.rojo, { f: F })
      + agua(mancha(52, 63, 22, 7, 5, .1), C.crema, { f: F, o: .9 })
      + vel(mancha(70, 52, 18, 12, 6, .2), C.rojoO, { o: .4 })
      + agua('M24,40 L8,45 L24,50Z', C.naranja, { f: 'l' })
      + ojo(37, 40, 4.4) + colorete(44, 51, 5)
      + agua(ala, C.rojoO, { f: F, o: .95 })
      + trazo(up ? 'M58,38 Q64,26 70,14' : 'M56,58 Q60,70 64,80', 2, lava(C.rojoO, .5), { o: .7 }));
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
      + pincel('M70,176 L70,200', 9, '#E3EEDC') + pincel('M90,176 L90,200', 9, '#E3EEDC')
      + trazo('M66,184 h8 M66,192 h8 M86,184 h8 M86,192 h8', 2.6, VERDE, { o: .8 })
      + agua('M54,208 Q54,198 68,198 L74,202 Q76,212 64,212 Q54,212 54,208Z', C.negro) + agua('M106,208 Q106,198 92,198 L86,202 Q84,212 96,212 Q106,212 106,208Z', C.negro)
      + pincel('M60,116 L42,142 L52,154', 11, VERDE)
      + pincel('M102,114 L120,116 L124,100', 11, VERDE)
      + agua('M56,104 Q80,96 106,104 Q114,142 108,178 Q80,184 54,178 Q48,142 56,104Z', VERDE)
      + vel('M88,104 Q106,106 108,178 Q96,182 90,180Z', VERDEO, { o: .45 })
      + pincel('M52,142 Q80,150 110,142', 8, C.negro) + agua(mancha(82, 146, 6.5, 6, 4, .1), C.sol, { f: 'l' })
      + agua(mancha(53, 156, 6.5, 6.5, 5, .1), PIEL, { f: 'l' }) + agua(mancha(125, 92, 8, 8, 6, .1), PIEL, { f: 'l' })
      + agua('M76,106 L84,108 L82,120 L78,120Z', C.paja, { f: 'l', o: .8 })
      + agua(mancha(80, 66, 24, 22, 7, .05), PIEL)
      + agua('M56,68 Q56,98 80,108 Q104,98 104,68 Q92,84 80,80 Q68,84 56,68Z', PELO)
      + agua(mancha(80, 76, 17, 5, 8, .12), PELO)
      + vel(mancha(96, 94, 12, 8, 9, .2), carga(PELO, .75), { o: .4 })
      + ojo(71, 63, 3.2) + ojo(89, 63, 3.2) + agua(mancha(80, 70, 4.5, 4, 10, .1), pig('#E58A84'), { f: 'l' }) + colorete(64, 72, 5) + colorete(96, 72, 5)
      + agua(mancha(54, 66, 5, 8, 11, .1), PIEL, { f: 'l' }) + agua(mancha(106, 66, 5, 8, 12, .1), PIEL, { f: 'l' })
      + agua(mancha(80, 46, 33, 8, 13, .08), VERDEO)
      + agua('M58,46 Q55,22 62,10 Q80,4 98,10 Q105,22 102,46Z', VERDE)
      + vel('M88,12 Q102,22 102,46 L90,46Z', VERDEO, { o: .4 })
      + pincel('M58,38 Q80,43 102,38', 7, C.negro) + agua(mancha(80, 40, 6, 5.5, 14, .1), C.sol, { f: 'l' })
      + flor(98, 22, VERDEO, 3.4)),

    // Duende corriendo con la olla de oro, rayas de velocidad y polvo
    duende_corre: () => svg('0 0 200 220',
      suelo(102, 212, 66, 3)
      + trazo('M10,112 H38 M4,134 H30 M14,156 H36', 3.6, C.grisO, { o: .45 })
      + agua(mancha(30, 203, 5, 4.5, 3, .1), PAPEL, { f: 'l' }) + agua(mancha(38, 200, 7, 6, 4, .1), PAPEL, { f: 'l' }) + agua(mancha(21, 207, 3.5, 3, 5, .1), PAPEL, { f: 'l' })
      + pincel('M88,176 L76,192 L60,188', 9, '#E3EEDC') + pincel('M106,176 L122,190 L124,200', 9, '#E3EEDC')
      + agua('M46,186 Q48,176 62,180 L70,192 Q66,200 54,196Z', C.negro) + agua('M118,204 Q122,196 134,200 Q142,206 138,212 Q124,214 118,210Z', C.negro)
      + pincel('M108,128 L140,128 L164,134', 10, VERDE)
      + `<g transform="translate(14 -2) rotate(12 80 180)">`
      + agua('M58,104 Q82,96 108,104 Q116,142 110,178 Q82,184 56,178 Q50,142 58,104Z', VERDE)
      + vel('M90,104 Q108,106 110,178 Q98,182 92,180Z', VERDEO, { o: .45 })
      + pincel('M54,142 Q82,150 112,142', 8, C.negro) + agua(mancha(84, 146, 6.5, 6, 4, .1), C.sol, { f: 'l' }) + `</g>`
      + `<g transform="translate(22 0) rotate(8 80 120)">`
      + agua(mancha(80, 66, 24, 22, 7, .05), PIEL)
      + agua('M56,68 Q56,98 80,108 Q104,98 104,68 Q92,84 80,80 Q68,84 56,68Z', PELO)
      + agua(mancha(80, 76, 17, 5, 8, .12), PELO)
      + ojo(71, 63, 3.2) + ojo(89, 63, 3.2) + agua(mancha(80, 70, 4.5, 4, 10, .1), pig('#E58A84'), { f: 'l' }) + colorete(64, 72, 5) + colorete(96, 72, 5)
      + agua(mancha(80, 46, 33, 8, 13, .08), VERDEO)
      + agua('M58,46 Q55,22 62,10 Q80,4 98,10 Q105,22 102,46Z', VERDE)
      + pincel('M58,38 Q80,43 102,38', 7, C.negro) + agua(mancha(80, 40, 6, 5.5, 14, .1), C.sol, { f: 'l' })
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
      + vel('M60,18 Q76,56 70,92 M142,22 Q158,60 148,100', C.cieloO, { o: .0 })
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
      + agua('M54,86 Q50,40 74,20 Q100,8 126,20 Q150,40 146,86Z', C.cielo, { o: .38 })
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
})();
