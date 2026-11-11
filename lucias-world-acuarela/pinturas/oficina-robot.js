// Pinturas: oficina-robot
(() => {
  const { agua, vel, trazo, pincel, punto, gotas, mancha, liso, pig, carga, lava, svg, C, ojo, sonrisa, colorete, hierba, flor, nubeD, LINEA, PAPEL, azar, f1 } = AQ;
  // rectángulo de agua: esquinas redondeadas y lados que bailan un poco
  const rect = (x, y, w, h, s = 1, j = 1.4) => { const r = azar(s * 7 + 3), q = () => (r() - .5) * 2 * j;
    return liso([[x + w * .22, y + q()], [x + w * .78, y + q()], [x + w + q(), y + h * .22], [x + w + q(), y + h * .78], [x + w * .78, y + h + q()], [x + w * .22, y + h + q()], [x + q(), y + h * .78], [x + q(), y + h * .22]]); };
  const suelo = (x, y, rx) => vel(mancha(x, y, rx, 9, x + rx, .1), C.grisO, { o: .35 });
  const corazon = (cx, cy, s, rot = 0) => liso([[0, .92], [-.62, .3], [-1, -.2], [-.72, -.78], [-.26, -.8], [0, -.42], [.26, -.8], [.72, -.78], [1, -.2], [.62, .3]].map(([x, y]) => { const c = Math.cos(rot), n = Math.sin(rot); return [cx + (x * c - y * n) * s, cy + (x * n + y * c) * s]; }));
  const T = {
    madera: pig('#C98A4B'), maderaC: '#D9A66A', maderaO: carga(pig('#C98A4B'), .8), azulO: carga(C.azul, .8),
    verde: '#A7CF8E', turq: pig('#2EC4B6'), turqO: carga(pig('#2EC4B6'), .85), marron: pig('#8B5A2B'), marronO: carga(pig('#8B5A2B'), .85),
    morado: pig('#8E4EE0'), moradoO: carga(pig('#8E4EE0'), .85), cuero: pig('#B5733A'),
    luz: lava(C.gris, .55), tinta: '#4A3E58', tecla: lava(C.grisO, .3), teal: pig('#2EC4B6'), rojoV: '#C9605F',
  };
  const salto = ' stroke-dasharray="4 5"';

  // ---------- Pieza del robot: ayudantes ----------
  const CO = pig('#FF6B5A'), COo = carga(CO, .82), TEAL = pig('#17A9AE'), TEALo = carga(TEAL, .84), AMA = C.sol, AMAo = C.solO, FG = '#2F6B4A', GLv = '#9BDDA4';
  const pill = (x, y) => agua(rect(x - 6.5, y - 10, 13, 20, x + y, .6), FG, { f: 'l' }) + punto(x - 2, y - 5, 1.9, PAPEL, .85);
  const rubor = (o = .45, c = '#EE8FA8') => vel(mancha(17, 47, 8, 5, 3, .15), c, { o }) + vel(mancha(83, 47, 8, 5, 4, .15), c, { o });
  const trazoF = (d, w = 4.6) => trazo(d, w, FG, { o: .9 });
  const cara = b => svg('0 0 100 70', `<g transform="translate(50 35) scale(1.08) translate(-50 -35)">${b}</g>`);

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
  });
})();
