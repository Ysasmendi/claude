// Pinturas: objetos
(() => {
  const { agua, vel, trazo, pincel, punto, gotas, mancha, liso, pig, carga, lava, svg, C, ojo, sonrisa, colorete, hierba, flor, nubeD, LINEA, PAPEL, azar, f1 } = AQ;
  // Ayudantes locales
  const sombra = (cx, cy, rx, s = 2) => vel(mancha(cx, cy, rx, 9, s, .1), C.grisO, { o: .35 });
  const chispa = (x, y, r, c = C.solO) => agua(`M${x},${y - r} Q${x + r * .15},${y - r * .15} ${x + r},${y} Q${x + r * .15},${y + r * .15} ${x},${y + r} Q${x - r * .15},${y + r * .15} ${x - r},${y} Q${x - r * .15},${y - r * .15} ${x},${y - r}Z`, c, { f: 'l' });
  const brillo = (x, y, rx, ry, rot = 0) => `<path d="${mancha(x, y, rx, ry, x + y, .1)}" fill="${PAPEL}" opacity=".7" filter="url(#§l)" transform="rotate(${rot} ${x} ${y})"/>`;
  Object.assign(ILUS, {
    // Casa de madera: pared de tablones, tejado pardo, chimenea gris y ventana con flores
    obj_casa_madera: () => svg('0 0 200 200',
      sombra(100, 180, 76)
      + pincel('M147,70 L151,30 L162,26', 9, C.gris)
      + agua('M42,178 Q44,140 46,98 Q100,92 156,92 Q158,140 160,178 Q100,184 42,178Z', C.tronco)
      + trazo('M45,118 Q100,112 157,112 M44,138 Q100,134 158,133 M43,158 Q100,155 159,154', 2.2, C.troncoO, { o: .6 })
      + vel('M42,150 Q100,156 160,148 L160,178 Q100,184 42,178Z', C.troncoO, { o: .3 })
      + agua('M20,110 Q58,72 98,30 Q140,66 180,102 Q140,94 100,97 Q60,98 20,110Z', C.troncoO)
      + vel('M98,30 Q140,66 180,102 Q140,94 102,97Z', carga(C.troncoO, .7), { o: .35 })
      + agua('M68,178 Q66,150 70,134 Q86,122 102,132 Q104,156 102,178Z', C.paja)
      + trazo('M82,130 Q80,155 82,177 M92,128 Q92,152 93,176', 1.6, C.pajaO, { o: .6 }) + punto(96, 156, 2.6, C.troncoO)
      + agua(mancha(132, 128, 15, 14, 3, .06), C.cielo) + trazo('M132,114 v28 M118,128 h28', 2, C.troncoO)
      + agua('M114,144 Q132,141 150,142 L150,151 Q132,152 114,154Z', C.tronco)
      + punto(122, 141, 3.6, C.rojo, .9) + punto(132, 140, 3.6, C.rosa, .9) + punto(142, 140, 3.6, C.sol, .9)
      + agua('M54,74 L80,66 L84,80 L58,88Z', C.paja, { f: 'l' })
      + hierba(34, 182, 13, C.hojaO) + hierba(168, 182, 12, C.hojaO, -1)),

    // Casa de ladrillo: pared roja, tejado azul, chimenea con humo, puerta verde
    obj_casa_ladrillo: () => svg('0 0 200 200',
      sombra(100, 182, 76, 3)
      + agua(mancha(166, 26, 17, 11, 4, .12), PAPEL) + vel(mancha(170, 30, 14, 6, 5, .1), C.cieloO, { o: .4 })
      + agua('M134,92 L136,52 L158,50 L156,100Z', C.rojoO)
      + agua('M30,180 Q34,140 36,104 Q100,98 166,104 Q168,142 172,180 Q100,186 30,180Z', C.rojo)
      + [[40, 112, 40], [42, 150, 40], [100, 112, 40], [98, 150, 40]].map(([x, y, w], i) => trazo(`M${x},${y} Q${x + w},${y - 4} ${x + w * 1.8},${y}`, 1.6, C.rojoO, { o: .55 })).join('')
      + vel('M30,160 Q100,166 172,158 L172,180 Q100,186 30,180Z', C.rojoO, { o: .3 })
      + agua('M14,108 Q56,70 94,38 Q136,72 188,108 Q140,100 100,102 Q56,104 14,108Z', C.azul)
      + vel('M94,38 Q136,72 188,108 Q140,100 102,102Z', carga(C.azul, .7), { o: .35 })
      + agua('M86,182 Q84,150 88,136 Q100,124 114,136 Q116,158 114,182Z', C.hoja) + punto(108, 160, 2.4, C.sol)
      + agua('M44,142 Q44,128 46,122 Q64,118 76,122 Q78,134 76,144Z', C.crema) + trazo('M60,120 v24 M44,132 h32', 1.8, C.rojoO)
      + agua('M124,142 Q124,128 126,122 Q144,118 156,122 Q158,134 156,144Z', C.crema) + trazo('M140,120 v24 M124,132 h32', 1.8, C.rojoO)),

    // Casa de chocolate: pared y tejado de chocolate, nata, piruleta y bastón de caramelo
    obj_casa_chocolate: () => svg('0 0 200 200',
      sombra(100, 182, 76, 4)
      + agua('M46,180 Q48,140 50,108 Q100,104 150,108 Q152,142 154,180 Q100,186 46,180Z', C.tronco)
      + vel('M46,150 Q100,158 154,150 L154,180 Q100,186 46,180Z', C.troncoO, { o: .35 })
      + agua('M126,66 L128,40 L146,38 L146,76Z', C.troncoO) + agua('M124,42 Q136,30 150,40 Q138,46 124,42Z', PAPEL)
      + agua('M24,116 Q60,76 98,32 Q138,72 176,116 Q100,106 24,116Z', C.troncoO)
      + agua('M98,32 Q112,40 124,60 Q108,52 100,66 Q92,52 74,62 Q86,44 98,32Z', PAPEL) + vel('M80,62 Q100,70 118,60 L112,70 Q100,78 84,70Z', C.cieloO, { o: .4 })
      + agua('M30,114 Q34,126 40,116 Q46,130 54,114 Q64,128 72,114 Q82,126 92,114 Q104,128 114,114 Q124,126 134,114 Q144,128 152,114 Q162,126 170,114 Q100,106 30,114Z', PAPEL)
      + punto(70, 90, 4.4, C.rojoO, .9) + punto(96, 76, 4.4, C.hojaO, .9) + punto(126, 90, 4.4, C.solO, .9) + punto(112, 100, 3.4, C.violeta, .9)
      + agua('M88,180 L88,148 Q100,128 112,148 L112,180Z', carga(C.tierra, .7)) + punto(106, 160, 2.2, C.sol)
      + agua(mancha(70, 144, 12, 12, 3, .06), C.crema) + trazo('M70,134 v20 M60,144 h20', 1.4, C.troncoO)
      + agua(mancha(130, 144, 12, 12, 4, .06), C.crema) + trazo('M130,134 v20 M120,144 h20', 1.4, C.troncoO)
      + trazo('M170,176 L168,134 Q170,122 180,128', 5, PAPEL, { o: .95 }) + trazo('M170,170 l-1,-12 M169,148 l0,-12', 5, C.rojoO, { o: .8 })
      + trazo('M32,176 L34,150', 3, C.tierra, { o: .9 }) + agua(mancha(30, 140, 15, 15, 5, .08), C.rosa) + trazo('M24,138 Q30,132 36,140 Q30,146 26,142', 1.8, C.rosaO)),

    // Casa: pared crema, tejado rojo, puerta azul con corazón, arbusto
    obj_casa: () => svg('0 0 200 200',
      sombra(100, 184, 74, 5)
      + agua('M46,102 L50,74 L66,72 L64,98Z', C.gris)
      + pincel('M56,70 Q52,50 66,42', 4, C.grisO, { f: 'l' })
      + agua('M42,182 Q44,146 46,102 Q100,98 154,102 Q156,146 158,182 Q100,188 42,182Z', C.crema)
      + vel('M42,160 Q100,166 158,160 L158,182 Q100,188 42,182Z', C.pajaO, { o: .35 })
      + agua('M26,108 Q62,70 100,34 Q140,70 176,108 Q100,98 26,108Z', C.rojo)
      + vel('M100,34 Q140,70 176,108 Q136,100 104,100Z', C.rojoO, { o: .4 })
      + agua(mancha(100, 76, 9, 9, 6, .08), C.cielo, { f: 'l' }) + trazo('M100,66 v20 M90,76 h20', 1.4, C.rojoO)
      + agua('M86,184 Q84,152 88,138 Q100,126 114,138 Q116,160 114,184Z', C.azul) + agua('M100,150 Q94,144 94,150 Q94,156 100,160 Q106,156 106,150 Q106,144 100,150Z', C.rojo, { f: 'l' })
      + agua('M54,148 Q54,132 56,126 Q70,124 80,126 L80,148Z', C.cielo) + vel('M56,126 L64,126 L58,146 L54,146Z', C.rosa, { o: .8 }) + vel('M80,126 L72,126 L78,146 L80,146Z', C.rosa, { o: .8 })
      + agua('M120,148 L120,126 Q132,124 146,126 Q146,138 146,148Z', C.cielo) + vel('M120,126 L128,126 L122,146 L120,146Z', C.rosa, { o: .8 }) + vel('M146,126 L138,126 L144,146 L146,146Z', C.rosa, { o: .8 })
      + agua(mancha(168, 160, 20, 20, 7, .12), C.hoja) + vel(mancha(172, 168, 12, 10, 8, .1), C.hojaO, { o: .5 })
      + punto(162, 152, 3, C.rosa, .9) + punto(176, 164, 3, C.rosa, .9)
      + hierba(34, 184, 12, C.hojaO)),

    // Sopa: cuenco azul con lunares, caldo crema, cuchara y vapor
    obj_sopa: () => svg('0 0 200 200',
      sombra(98, 184, 66, 6)
      + trazo('M62,66 Q54,52 64,40 M92,60 Q84,46 94,32 M122,64 Q114,50 124,38', 2.8, C.grisO, { o: .55 })
      + agua('M22,94 Q26,150 66,172 Q98,182 132,172 Q172,150 178,94Z', C.azul)
      + vel('M120,100 Q168,110 176,100 Q170,150 132,172 Q100,180 80,170 Q130,160 120,100Z', carga(C.azul, .7), { o: .35 })
      + agua('M76,176 Q98,184 124,176 L122,186 Q98,190 78,186Z', carga(C.azul, .8), { f: 'l' })
      + agua(mancha(100, 98, 80, 17, 8, .04), C.crema) + vel(mancha(108, 100, 56, 10, 9, .1), C.pajaO, { o: .35 })
      + punto(68, 98, 3.4, C.azul) + punto(128, 104, 3, C.hoja) + punto(86, 106, 2.6, C.rojo) + agua('M112,94 l9,-3 l2,8 l-9,2Z', C.sol, { f: 'l' })
      + [[46, 124], [72, 138], [100, 144], [128, 140], [152, 124]].map(([x, y], i) => punto(x, y, 5.2 - (i % 2), PAPEL, .95)).join('')
      + pincel('M122,98 L158,48', 8, C.gris) + agua(mancha(160, 44, 7, 8, 3, .1), C.grisO, { f: 'l' })),

    // Silla: respaldo con corazón, cojín rojo de lunares, cuatro patas
    obj_silla: () => svg('0 0 200 200',
      sombra(100, 184, 62, 7)
      + agua('M60,120 Q56,70 62,48 Q78,34 100,34 Q124,34 138,50 Q144,76 140,120Z', C.tronco)
      + vel('M112,42 Q142,56 140,120 L114,118Z', C.troncoO, { o: .35 })
      + agua('M100,92 Q84,80 82,68 Q84,56 93,58 Q100,60 100,68 Q102,60 108,58 Q118,56 118,68 Q116,80 100,92Z', C.rojo)
      + pincel('M62,148 Q60,168 64,184', 11, C.troncoO) + pincel('M138,148 Q142,168 140,184', 11, C.troncoO)
      + pincel('M84,150 Q84,168 86,182', 11, C.tronco) + pincel('M118,150 Q118,168 118,182', 11, C.tronco)
      + agua('M42,142 Q38,124 48,118 Q100,112 154,118 Q164,126 158,144 Q100,156 42,142Z', C.rojo)
      + vel('M44,142 Q100,156 158,144 L156,132 Q100,144 44,130Z', C.rojoO, { o: .4 })
      + [[58, 132], [78, 136], [100, 134], [122, 136], [142, 132]].map(([x, y]) => punto(x, y, 3, PAPEL, .95)).join('')),

    // Cama: cabecero y pie de madera, almohada, colcha de retales
    obj_cama: () => svg('0 0 200 200',
      sombra(100, 184, 76, 8)
      + agua('M18,178 Q14,120 18,76 Q20,52 30,50 Q40,52 38,78 Q42,120 40,178Z', C.tronco)
      + agua('M170,178 Q168,140 168,112 Q170,100 180,100 Q190,102 190,114 Q190,146 188,178Z', C.tronco)
      + agua(mancha(29, 52, 11, 10, 3, .1), C.troncoO)
      + agua('M30,110 Q30,98 40,94 Q100,86 176,102 Q178,126 174,140 Q100,146 32,140Z', C.crema)
      + agua('M36,104 Q36,84 50,82 Q74,78 90,86 Q92,106 86,114 Q60,118 40,116Z', PAPEL) + vel('M40,112 Q64,118 88,112 L88,104 Q62,110 38,106Z', C.cieloO, { o: .45 })
      + agua('M92,100 Q132,96 174,106 Q176,128 172,146 Q132,152 94,146Z', C.cielo)
      + [[100, 108, C.rojo], [122, 106, C.sol], [146, 110, C.hoja], [104, 128, C.violeta], [126, 130, C.rosa], [150, 132, C.naranja]].map(([x, y, c], i) => agua(`M${x},${y} l18,-2 l1,18 l-18,2Z`, c, { f: 'l' })).join('')
      + vel('M92,134 Q132,140 174,134 L172,146 Q132,154 94,148Z', C.cieloO, { o: .4 })
      + agua('M32,140 Q100,148 176,140 L176,154 Q100,162 32,154Z', C.tronco)
      + agua('M26,86 Q24,100 26,150 L32,150 Q34,100 32,86Z', C.troncoO, { f: 'l' })
      + agua('M24,60 Q20,68 24,72 Q28,66 24,60Z', C.rojo, { f: 'l' })),

    // Migas: un rastro de cinco trozos de pan que se hacen pequeños
    obj_migas: () => svg('0 0 200 200',
      sombra(100, 182, 64, 9)
      + [[48, 158, 24, 17, 1], [82, 134, 19, 14, 2], [110, 112, 15, 11, 3], [136, 88, 12, 9, 4], [156, 66, 9, 7, 5]].map(([x, y, a, b, s]) =>
        agua(mancha(x, y, a, b, s, .14, 9, -.4), C.crema) + vel(mancha(x + a * .1, y + b * .3, a * .85, b * .55, s + 9, .12, 9, -.4), C.tierra, { o: .6 }) + punto(x - a * .2, y - b * .2, Math.max(1.2, a * .08), C.pajaO, .8)).join('')
      + punto(66, 176, 3, C.troncoO, .8) + punto(100, 150, 2.4, C.troncoO, .8) + punto(122, 126, 2, C.troncoO, .8) + punto(150, 96, 2, C.troncoO, .7)),

    // Piedras: cinco cantos blancos y unas chispas
    obj_piedras: () => svg('0 0 200 200',
      sombra(100, 164, 70, 10)
      + [[56, 132, 30, 18, 1, C.gris, 10], [96, 138, 34, 20, 2, PAPEL, -8], [146, 126, 26, 16, 3, C.gris, 6], [102, 108, 22, 14, 4, PAPEL, 4], [136, 148, 20, 12, 5, C.gris, 0]].map(([x, y, a, b, s, c, r]) =>
        agua(mancha(x, y, a, b, s, .1), c, { t: `rotate(${r} ${x} ${y})` }) + vel(mancha(x + 4, y + b * .45, a * .8, b * .5, s + 7, .1), C.grisO, { o: .5, t: `rotate(${r} ${x} ${y})` })).join('')
      + chispa(46, 98, 8, C.solO) + chispa(124, 82, 9, C.solO) + chispa(168, 112, 6, C.sol) + chispa(76, 158, 5, C.sol)
      + punto(40, 150, 2.6, C.troncoO, .8) + punto(168, 142, 2, C.troncoO, .8) + punto(86, 92, 2.2, C.troncoO, .8)),

    // Jaula: cúpula de barrotes ocres, base roja, anilla y percha
    obj_jaula: () => svg('0 0 200 200',
      sombra(100, 184, 66, 11)
      + vel('M54,150 Q50,90 80,50 Q100,38 120,50 Q150,90 146,150Z', C.paja, { o: .4 })
      + [-44, -30, -15, 0, 15, 30, 44].map((d, i) => trazo(`M${100 + d * 1.1},152 Q${100 + d * 1.5},96 ${100 + d * .08},42`, 3.2, carga(C.pajaO, .8), { o: .9 })).join('')
      + trazo('M56,118 Q100,128 144,118', 2.4, C.pajaO, { o: .75 }) + trazo('M70,92 Q100,98 130,92', 2.2, C.pajaO, { o: .7 })
      + trazo('M62,132 L138,130', 3.2, C.tronco, { o: .8 })
      + agua(mancha(100, 28, 9, 9, 3, .1), C.sol, { f: 'l' }) + trazo('M100,36 v8', 2.4, C.pajaO)
      + agua('M46,150 Q100,144 154,150 Q158,172 150,180 Q100,188 50,180 Q42,170 46,150Z', C.rojo)
      + vel('M50,170 Q100,180 152,168 L150,180 Q100,188 50,180Z', C.rojoO, { o: .45 })
      + agua('M46,152 Q100,146 154,152 L154,158 Q100,154 46,158Z', C.sol, { f: 'l' })
      + chispa(28, 62, 7, C.solO) + chispa(176, 50, 8, C.solO)),
    // Tesoro: cofre de madera con herrajes de oro rebosante de monedas y gemas
    obj_tesoro: () => svg('0 0 200 200',
      sombra(100, 184, 72, 12)
      + agua('M38,124 Q34,74 100,64 Q166,74 162,124Z', C.troncoO)
      + agua(mancha(100, 104, 56, 28, 3, .08), C.sol) + vel(mancha(112, 112, 40, 14, 4, .1), C.solO, { o: .5 })
      + [[66, 100], [88, 90], [118, 92], [142, 104], [104, 106], [78, 114]].map(([x, y], i) => agua(mancha(x, y, 11, 11, i + 2, .08), i % 2 ? C.sol : C.solO, { f: 'l' }) + trazo(`M${x - 4},${y} q4,-5 8,0`, 1.4, C.pajaO, { o: .7 })).join('')
      + agua('M82,96 L90,74 L100,88 L110,72 L118,96Z', C.sol, { f: 'l' }) + punto(100, 90, 2.6, C.rojo)
      + agua('M54,92 l8,-10 l8,10 l-8,10Z', C.rojo, { f: 'l' }) + agua('M130,86 l8,-8 l8,8 l-8,10Z', C.cielo, { f: 'l' }) + agua(mancha(116, 112, 5, 5, 4, .1), C.hoja, { f: 'l' })
      + agua('M34,122 Q100,114 166,122 L164,182 Q100,188 36,182Z', C.tronco)
      + vel('M34,160 Q100,166 164,158 L164,182 Q100,188 36,182Z', C.troncoO, { o: .35 })
      + agua('M34,122 Q100,114 166,122 L166,134 Q100,128 34,134Z', C.sol)
      + agua('M44,124 L44,182 L58,182 L58,125Z', C.sol) + agua('M142,124 L142,182 L156,182 L156,124Z', C.sol)
      + agua('M86,134 Q100,128 114,134 L112,164 Q100,170 88,164Z', C.sol) + punto(100, 148, 4, C.troncoO) + trazo('M100,150 v10', 2.4, C.troncoO)
      + agua(mancha(26, 178, 7, 7, 8, .1), C.sol, { f: 'l' }) + agua(mancha(170, 178, 9, 7, 9, .1), C.sol, { f: 'l' }) + agua(mancha(184, 176, 7, 6, 10, .1), C.solO, { f: 'l' })
      + chispa(166, 62, 7, C.solO) + chispa(32, 106, 5, C.sol)),

    // Botas: un par de botas moradas de siete leguas, con puños amarillos y estrellita
    obj_botas: () => svg('0 0 200 200',
      sombra(100, 184, 70, 13)
      + agua('M46,34 L88,32 Q92,70 90,112 Q80,150 100,158 Q70,158 52,152 Q50,90 46,34Z', C.violeta, { o: .85 })
      + agua('M44,28 L90,26 L92,44 L84,38 L78,46 L68,38 L58,46 L48,38Z', C.sol)
      + agua('M78,48 L120,46 Q124,92 122,126 Q158,132 172,158 Q180,176 164,180 L84,180 Q80,110 78,48Z', C.violeta)
      + vel('M104,52 Q124,92 122,126 Q158,132 172,158 Q180,176 164,180 L114,180 Q116,120 104,52Z', carga(C.violeta, .72), { o: .4 })
      + agua('M76,44 L124,42 L126,62 L116,54 L108,64 L98,54 L88,64 L80,54Z', C.sol)
      + agua('M80,148 L170,152 Q176,168 164,182 L84,182Z', C.tronco)
      + agua('M84,128 Q100,124 118,128 L118,138 Q100,134 84,138Z', C.tronco, { f: 'l' }) + agua('M96,126 h12 v12 h-12Z', C.sol, { f: 'l' })
      + chispa(144, 164, 7, C.sol)
      + trazo('M22,142 h26 M26,154 h20 M30,166 h14', 2.4, C.grisO, { o: .5 })
      + chispa(158, 36, 8, C.solO) + chispa(172, 76, 6, C.sol) + chispa(146, 100, 5, C.sol)),

    // Cesta de mimbre con paño de cuadros, un pastelito y una manzana
    obj_cesta: () => svg('0 0 200 200',
      sombra(100, 186, 62, 14)
      + pincel('M46,118 Q40,24 100,22 Q162,24 154,118', 8, C.tronco)
      + agua(mancha(112, 106, 16, 11, 3, .1), C.crema) + agua(mancha(138, 100, 15, 15, 4, .08), C.rojo) + vel(mancha(142, 106, 9, 9, 5, .1), C.rojoO, { o: .5 })
      + trazo('M138,86 q2,-6 8,-8', 1.8, C.troncoO) + agua('M143,84 q8,-8 14,-4 q-4,8 -14,4Z', C.hoja, { f: 'l' })
      + agua('M76,96 Q80,70 96,72 Q112,70 112,96Z', C.rosa) + agua('M82,76 Q96,58 108,76Z', PAPEL) + punto(96, 66, 4.4, C.rojo)
      + agua('M40,114 Q44,164 64,180 Q100,188 138,180 Q158,164 162,114Q100,106 40,114Z', C.tierra)
      + trazo('M50,132 q6,-6 12,0 t12,0 t12,0 t12,0 t12,0 t12,0 t12,0 t12,0 M52,152 q6,-6 12,0 t12,0 t12,0 t12,0 t12,0 t12,0 t12,0 M62,170 q6,-6 12,0 t12,0 t12,0 t12,0 t12,0 t12,0', 1.8, C.tronco, { o: .65 })
      + vel('M110,114 Q158,112 162,114 Q158,164 138,180 Q110,184 96,182 Q120,160 110,114Z', C.tronco, { o: .4 })
      + agua('M34,108 Q60,104 92,108 L90,136 Q86,160 76,156 Q70,144 66,160 Q50,152 42,134Z', PAPEL)
      + [0, 1, 2].map(i => vel(`M${36 + i * 18},110 L${50 + i * 18},110 L${50 + i * 14},150 L${36 + i * 14},150Z`, C.rojo, { o: .5 })).join('')
      + [0, 1, 2, 3].map(i => vel(`M34,${112 + i * 11} L92,${112 + i * 11} L92,${120 + i * 11} L34,${120 + i * 11}Z`, C.rojo, { o: .35 })).join('')),

    // Escoba: mango de madera, tira roja y cerdas de paja abiertas
    obj_escoba: () => svg('0 0 200 200',
      sombra(100, 186, 62, 15)
      + pincel('M138,32 L108,132', 8, C.tronco) + agua(mancha(138, 30, 6, 6, 3, .1), C.troncoO, { f: 'l' })
      + agua('M100,128 Q112,122 124,128 L168,184 Q130,190 98,184 Q62,190 50,184 Q80,160 100,128Z', C.paja)
      + vel('M118,126 L168,184 Q140,188 112,184 Q124,150 118,126Z', C.pajaO, { o: .4 })
      + trazo('M98,150 Q84,168 70,182 M108,150 L104,182 M116,146 L132,182 M120,140 L152,182', 2, C.pajaO, { o: .7 })
      + agua('M96,124 Q112,116 128,126 L126,140 Q110,132 94,140Z', C.rojo)),

    // Moneda: disco de oro con estrella y un destello
    obj_moneda: () => svg('0 0 200 200',
      sombra(100, 184, 66, 16)
      + agua(mancha(104, 106, 76, 74, 2, .03), C.solO)
      + agua(mancha(100, 100, 74, 72, 3, .03), C.sol)
      + vel(mancha(122, 122, 50, 44, 4, .1), C.solO, { o: .55 })
      + trazo(mancha(100, 100, 56, 54, 5, .03), 3, C.pajaO, { o: .7 })
      + agua('M100,60 L111,88 L140,90 L117,108 L126,138 L100,121 L74,138 L83,108 L60,90 L89,88Z', C.solO)
      + brillo(70, 64, 14, 6, -40) + punto(48, 112, 2.4, C.pajaO, .7) + punto(54, 142, 2.4, C.pajaO, .7) + punto(150, 144, 2.4, C.pajaO, .7)
      + chispa(166, 38, 10, PAPEL) + chispa(40, 156, 6, C.solO)),

    // Lazo: dos lazadas rojas, nudo y dos colas
    obj_lazo: () => svg('0 0 200 200',
      sombra(100, 186, 60, 17)
      + agua('M92,112 Q70,150 54,172 L84,162 L102,128Z', C.rojoO) + agua('M108,112 Q130,150 150,176 L122,160 L98,128Z', C.rojo)
      + agua('M96,98 Q64,48 24,60 Q12,86 28,116 Q60,122 96,102Z', C.rojo)
      + agua('M104,98 Q136,48 178,62 Q192,86 174,116 Q142,122 104,102Z', C.rojo)
      + vel('M96,100 Q64,70 30,74 Q26,100 36,114 Q64,118 96,102Z', C.rojoO, { o: .45 }) + vel('M104,100 Q138,70 172,76 Q176,100 168,114 Q140,118 104,102Z', C.rojoO, { o: .45 })
      + brillo(52, 76, 14, 5, -16) + brillo(152, 76, 14, 5, 16)
      + agua(mancha(100, 104, 17, 18, 4, .08), C.rojoO) + brillo(96, 98, 6, 3.4, -20)),

    // Guitarra: caja naranja, mástil, clavijero y corazón pegado
    obj_guitarra: () => svg('0 0 200 200',
      sombra(100, 186, 50, 18)
      + `<g transform="rotate(24 100 100)">`
      + pincel('M100,104 L100,22', 11, C.tronco)
      + agua('M90,18 Q92,6 102,6 Q112,8 110,22 L108,32 L92,32Z', C.troncoO) + punto(86, 18, 3, C.crema, .9) + punto(114, 14, 3, C.crema, .9) + punto(86, 28, 3, C.crema, .9)
      + agua('M100,92 Q132,86 134,116 Q136,134 126,146 Q146,162 140,184 Q120,204 98,200 Q70,204 58,184 Q54,162 74,146 Q64,134 66,116 Q68,86 100,92Z', C.naranja)
      + vel('M110,130 Q138,160 140,184 Q120,204 100,200 Q122,176 110,130Z', C.rojoO, { o: .35 })
      + agua(mancha(100, 146, 14, 14, 4, .06), carga(C.troncoO, .6)) + trazo(mancha(100, 146, 18, 18, 5, .05), 2.6, C.sol, { o: .8 })
      + trazo('M96,22 L98,128 M102,22 L102,128', 1.2, PAPEL, { o: .8 })
      + agua('M92,176 L112,172 L112,180 L92,184Z', C.tronco, { f: 'l' })
      + `</g>`
      + agua('M68,150 Q60,142 62,138 Q66,134 70,138 Q74,134 78,138 Q80,144 70,154Z', C.rosa, { f: 'l' })),

    // Banquete: mantel de cuadros, plato con pollo asado, uvas y una naranja
    obj_banquete: () => svg('0 0 200 200',
      sombra(100, 184, 78, 19)
      + agua('M14,138 Q100,126 186,138 Q190,168 182,184 Q100,194 18,184 Q10,164 14,138Z', PAPEL)
      + [0, 1, 2, 3, 4, 5, 6, 7].map(i => vel(`M${22 + i * 22},132 L${34 + i * 22},132 L${32 + i * 22},192 L${20 + i * 22},192Z`, C.rojo, { o: .4 })).join('')
      + [0, 1, 2, 3].map(i => vel(`M12,${140 + i * 13} L190,${140 + i * 13} L190,${148 + i * 13} L12,${148 + i * 13}Z`, C.rojo, { o: .35 })).join('')
      + agua(mancha(100, 146, 66, 17, 3, .05), PAPEL) + vel(mancha(104, 150, 58, 11, 4, .08), C.grisO, { o: .45 })
      + agua('M46,126 Q40,100 60,92 Q80,80 112,84 Q142,90 148,114 Q150,132 126,138 Q90,142 56,136Z', C.naranja)
      + vel('M100,92 Q142,92 148,116 Q148,134 126,138 Q100,140 90,134 Q120,128 100,92Z', C.rojoO, { o: .35 })
      + agua('M44,112 Q26,100 34,86 Q46,86 54,102Z', C.paja) + brillo(78, 98, 12, 5, -10)
      + agua(mancha(32, 108, 12, 10, 5, .1), C.sol, { f: 'l' })
      + agua('M54,130 q-12,6 -22,2 q8,-8 22,-2Z', C.hoja, { f: 'l' }) + agua('M138,126 q10,-10 22,-8 q-6,12 -22,8Z', C.hoja, { f: 'l' })
      + [[160, 100], [172, 104], [150, 108], [162, 114], [174, 118], [158, 126], [168, 130]].map(([x, y], i) => agua(mancha(x, y, 7.4, 7.4, i + 3, .08), i % 2 ? C.violeta : lava(C.violeta, .1), { f: 'l' })).join('')
      + trazo('M162,94 q2,-12 12,-16', 2, C.troncoO)
      + agua(mancha(168, 140, 9, 9, 9, .08), C.naranja, { f: 'l' })),

    // Huevo: cascarón crema con pecas y una grieta
    obj_huevo: () => svg('0 0 200 200',
      sombra(100, 186, 62, 20)
      + agua('M100,16 Q148,22 160,92 Q166,160 122,176 Q96,184 70,176 Q36,160 42,96 Q54,24 100,16Z', C.crema)
      + vel('M126,26 Q160,60 160,100 Q166,160 122,176 Q96,184 80,178 Q130,160 130,100 Q132,50 126,26Z', C.tierra, { o: .45 })
      + vel(mancha(76, 124, 20, 24, 6, .2), C.grisO, { o: .22 })
      + [[70, 70], [112, 62], [58, 110], [128, 100], [86, 136], [112, 150], [140, 134], [72, 156]].map(([x, y], i) => agua(mancha(x, y, 3.2 + i % 3, 2.6 + i % 2, i + 4, .15), C.tierra, { f: 'l' })).join('')
      + trazo('M114,32 L122,48 L110,56 L122,70 L112,76', 2.4, C.troncoO, { o: .7 })
      + brillo(66, 52, 10, 20, 26)),

    // Ramo de flores: amapola, margarita y flores pequeñas con lazo rosa
    obj_flores: () => svg('0 0 200 200',
      sombra(100, 190, 34, 21)
      + [['M100,166 Q96,120 98,66', 6], ['M100,168 Q76,130 54,98', 5], ['M102,168 Q122,128 146,96', 5], ['M98,170 Q62,142 36,126', 5], ['M102,170 Q138,142 164,124', 5]].map(([d, w]) => pincel(d, w, C.hoja)).join('')
      + agua('M104,134 q16,-14 26,-6 q-8,16 -26,6Z', C.hojaO, { f: 'l' }) + agua('M92,140 q-16,-12 -26,-4 q8,14 26,4Z', C.hojaO, { f: 'l' })
      + [0, 1, 2, 3, 4].map(i => agua(mancha(98 + Math.cos(i * 1.257 + .3) * 18, 56 + Math.sin(i * 1.257 + .3) * 16, 17, 15, i + 3, .12), C.rojo)).join('') + agua(mancha(98, 56, 9, 8, 9, .1), carga(C.rojoO, .6), { f: 'l' }) + punto(98, 56, 3, C.negro)
      + [0, 1, 2, 3, 4, 5, 6].map(i => agua(mancha(54 + Math.cos(i * .898) * 15, 94 + Math.sin(i * .898) * 15, 8, 7, i + 11, .1), PAPEL, { f: 'l' })).join('') + agua(mancha(54, 94, 8, 8, 4, .1), C.sol, { f: 'l' })
      + [0, 1, 2, 3, 4].map(i => agua(mancha(146 + Math.cos(i * 1.257) * 8, 94 + Math.sin(i * 1.257) * 8, 7, 7, i + 21, .12), C.azul, { f: 'l' })).join('') + punto(146, 94, 3, C.sol)
      + [0, 1, 2, 3, 4].map(i => agua(mancha(36 + Math.cos(i * 1.257) * 8, 124 + Math.sin(i * 1.257) * 8, 7, 7, i + 31, .12), C.rosa, { f: 'l' })).join('') + punto(36, 124, 3, C.rojoO)
      + [0, 1, 2, 3, 4].map(i => agua(mancha(164 + Math.cos(i * 1.257) * 8, 122 + Math.sin(i * 1.257) * 8, 7, 7, i + 41, .12), C.sol, { f: 'l' })).join('') + punto(164, 122, 3, C.naranja)
      + agua('M98,162 Q76,150 74,168 Q86,176 100,168Z', C.rosa) + agua('M102,162 Q124,150 126,168 Q114,176 100,168Z', C.rosa)
      + agua(mancha(100, 166, 7, 7, 5, .1), C.rosaO) + agua('M96,170 L88,190 L98,186Z', C.rosa, { f: 'l' }) + agua('M104,170 L114,190 L104,186Z', C.rosa, { f: 'l' })),
    // FIN
  });
})();
