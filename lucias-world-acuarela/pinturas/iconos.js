// Pinturas: iconos
(() => {
  const { agua, vel, trazo, pincel, punto, gotas, mancha, liso, pig, carga, lava, svg, C, ojo, sonrisa, colorete, hierba, flor, nubeD, LINEA, PAPEL, azar, f1 } = AQ;
  const sombra = (x, y, rx, o = .35) => vel(mancha(x, y, rx, 8, 2, .1), C.grisO, { o });
  const brillo = (x, y, rx, ry, rot = -30, o = .7) => vel(mancha(x, y, rx, ry, x + y, .12, 8, 0), PAPEL, { o, t: `rotate(${rot} ${x} ${y})` });
  const chispa = (x, y, r, c) => agua(`M${x},${y - r} Q${x + r * .2},${y - r * .2} ${x + r},${y} Q${x + r * .2},${y + r * .2} ${x},${y + r} Q${x - r * .2},${y + r * .2} ${x - r},${y} Q${x - r * .2},${y - r * .2} ${x},${y - r}Z`, c, { f: 'l' });
  const corazon = (x, y, r, c, f) => agua(`M${x},${y + r} C${x - r * 1.5},${y - r * .1} ${x - r * .8},${y - r * 1.1} ${x},${y - r * .35} C${x + r * .8},${y - r * 1.1} ${x + r * 1.5},${y - r * .1} ${x},${y + r}Z`, c, f ? { f } : {});
  const estrella = (x, y, R, r, c, rot = -90, f) => { let d = ''; for (let i = 0; i < 10; i++) { const a = (rot + i * 36) * Math.PI / 180, q = i % 2 ? r : R; d += (i ? 'L' : 'M') + f1(x + Math.cos(a) * q) + ',' + f1(y + Math.sin(a) * q); } return agua(d + 'Z', c, f ? { f } : {}); };

  Object.assign(ILUS, {
    // Navegador: globo azul con continentes verdes y un anillo dorado que lo rodea
    icono_navegador: (o = {}) => svg('0 0 200 200',
      sombra(100, 188, 58)
      + pincel('M17,141 A82,24 -16 0 1 175,95', 9, C.solO)
      + agua(mancha(96, 106, 62, 61, 3, .035), C.azul)
      + vel(mancha(112, 128, 52, 40, 4, .12), carga(C.azul, .8), { o: .4 })
      + agua('M32,66 C48,46 72,44 86,54 C92,60 84,70 76,72 C68,74 70,84 60,88 C52,92 46,102 40,100 C30,96 26,78 32,66Z', C.hoja)
      + agua('M122,56 C136,48 154,58 158,72 C162,86 152,92 148,104 C144,116 150,126 142,138 C132,144 126,134 124,124 C122,112 116,104 120,94 C124,82 116,70 122,56Z', C.hoja)
      + agua('M58,128 C70,120 84,126 84,138 C84,150 76,158 72,170 C62,164 54,142 58,128Z', C.hojaO, { o: .9 })
      + brillo(70, 74, 16, 7, -40, .6)
      + ojo(82, 98, 6) + ojo(112, 98, 6) + colorete(70, 112, 8) + colorete(124, 112, 8) + sonrisa(96, 112, 18)
      + pincel('M17,141 A82,24 -16 0 0 175,95', 9, C.sol)
      + chispa(166, 40, 11, C.sol) + chispa(30, 38, 8, C.sol) + punto(176, 140, 3, C.cieloO, .8)),

    // Calculadora: cuerpo turquesa, pantalla verde con cara y nueve teclas de colores
    icono_calculadora: (o = {}) => {
      const teclas = [C.rojo, C.azul, C.hoja, C.rosaO, C.sol, C.violeta, C.paja, C.naranja, C.rojoO];
      return svg('0 0 200 200',
        sombra(102, 188, 56)
        + agua('M46,30 Q36,100 42,168 Q100,188 158,168 Q164,100 154,30 Q100,14 46,30Z', pig('#19B3B3'))
        + vel('M42,138 Q100,156 160,134 L158,170 Q100,190 42,170Z', carga(pig('#19B3B3'), .75), { o: .4 })
        + agua('M56,38 Q100,30 146,40 Q150,60 146,74 Q100,82 54,74 Q52,56 56,38Z', C.negro)
        + agua('M62,44 Q100,38 140,46 Q142,60 140,68 Q100,74 62,68Z', '#CDE8B8')
        + trazo('M68,62 L80,48', 3, PAPEL, { o: .7 })
        + ojo(88, 54, 3.6) + ojo(112, 54, 3.6) + sonrisa(100, 60, 12) + colorete(80, 62, 5) + colorete(120, 62, 5)
        + teclas.map((c, i) => { const x = 70 + (i % 3) * 30, y = 104 + Math.floor(i / 3) * 29; return agua(mancha(x, y, 12.5, 11, i + 3, .1, 9), c); }).join('')
        + trazo('M64,103 H76 M70,97 V109', 3.4, PAPEL, { o: .95 }) + trazo('M94,103 H106', 3.4, PAPEL, { o: .95 })
        + trazo('M125,128 L136,139 M136,128 L125,139', 3.4, PAPEL, { o: .95 })
        + trazo('M124,157 H138 M124,163 H138', 3.2, PAPEL, { o: .95 }));
    },

    // Cuentos: libro rojo abierto con un castillo que sale de las páginas
    icono_cuentos: (o = {}) => svg('0 0 200 200',
      sombra(100, 184, 80)
      + agua('M100,98 C78,84 44,82 12,92 Q10,130 13,168 C44,158 78,160 100,176 C122,160 156,158 187,168 Q190,130 188,92 C156,82 122,84 100,98Z', C.rojo)
      + agua('M100,92 C78,76 46,76 22,86 Q20,120 23,152 C46,142 78,146 100,160Z', C.crema)
      + agua('M100,92 C122,76 154,76 178,86 Q180,120 177,152 C154,142 122,146 100,160Z', PAPEL)
      + vel('M100,92 L100,160 L112,150 L112,100Z', C.pajaO, { o: .28 })
      + trazo('M32,100 C44,96 56,96 64,98 M32,114 C44,110 54,110 62,112 M168,100 C156,96 146,96 138,98 M168,114 C156,110 148,110 140,112', 2.4, C.grisO, { o: .7 })
      + agua('M66,126 Q64,96 67,66 L86,66 L87,78 L98,76 L100,84 L102,76 L113,78 L114,66 L134,66 Q136,96 134,126Z', C.paja)
      + vel('M104,70 L134,66 Q136,96 134,126 L108,124Z', C.pajaO, { o: .35 })
      + agua('M93,126 L93,110 Q100,100 107,110 L107,126Z', C.tronco)
      + agua(mancha(77, 90, 5, 6, 4, .1), C.cielo, { f: 'l' }) + agua(mancha(123, 90, 5, 6, 5, .1), C.cielo, { f: 'l' })
      + agua('M62,68 L76,32 L92,68Z', C.rosaO) + agua('M108,68 L124,32 L139,68Z', C.violeta)
      + trazo('M76,32 V18 M124,32 V18', 2.4) + agua('M76,18 L88,22 L76,27Z', C.rojoO, { f: 'l' }) + agua('M124,18 L136,22 L124,27Z', C.rojoO, { f: 'l' })
      + estrella(160, 42, 20, 9, C.sol, -80) + chispa(34, 52, 8, C.sol) + chispa(178, 78, 6, PAPEL) + chispa(100, 28, 5, C.sol)),

    // Música: dos notas con cara, corchete azul
    icono_musica: (o = {}) => svg('0 0 200 200',
      sombra(104, 184, 58)
      + pincel('M88,150 L88,64 L164,42 L164,126', 11, C.azul)
      + pincel('M88,92 L164,70', 9, C.azul, { o: .85 })
      + agua(mancha(64, 150, 30, 23, 3, .06, 10, -.38), C.rosaO)
      + agua(mancha(138, 128, 30, 23, 5, .06, 10, -.38), C.violeta)
      + brillo(52, 138, 9, 4, -30, .55) + brillo(126, 116, 9, 4, -30, .55)
      + ojo(54, 150, 4.4) + ojo(72, 144, 4.4) + colorete(48, 160, 6) + colorete(80, 153, 6) + sonrisa(65, 158, 11)
      + ojo(129, 128, 4.4) + ojo(147, 122, 4.4) + colorete(123, 139, 6) + colorete(155, 133, 6) + sonrisa(139, 136, 11)
      + chispa(38, 94, 10, C.sol) + chispa(178, 170, 8, C.sol) + chispa(56, 48, 6, PAPEL)
      + trazo('M26,124 q-8,-10 0,-20 M182,82 q8,10 0,20', 2.8, C.grisO, { o: .7 })),

    // Guiñoles: teatrillo amarillo, telón rojo y un títere con gorro azul
    icono_guinoles: (o = {}) => svg('0 0 200 200',
      sombra(100, 188, 74)
      + agua('M28,182 Q24,110 26,44 Q26,28 42,28 L84,28 Q100,8 116,28 L158,28 Q174,28 174,44 Q176,110 172,182Z', C.sol)
      + vel('M120,40 L174,44 Q176,110 172,182 L136,182Z', C.solO, { o: .4 })
      + agua('M42,46 Q100,40 158,46 Q162,100 158,146 Q100,152 42,146 Q38,100 42,46Z', pig('#4A3FC0'))
      + chispa(66, 100, 5, C.sol) + chispa(140, 96, 4, PAPEL) + chispa(132, 72, 3.5, C.sol)
      + agua('M40,48 L80,48 C70,72 66,98 76,120 C64,124 50,130 40,146Z', C.rojo)
      + agua('M160,48 L120,48 C130,72 134,98 124,120 C136,124 150,130 160,146Z', C.rojo)
      + trazo('M52,54 C50,82 50,110 46,138 M64,54 C60,78 58,98 62,120 M148,54 C150,82 150,110 154,138 M136,54 C140,78 142,98 138,120', 2, C.rojoO, { o: .6 })
      + agua('M78,152 C76,132 84,122 100,122 C116,122 124,132 122,152Z', C.hoja)
      + pincel('M84,130 C72,126 66,116 70,106 M116,130 C128,126 134,116 130,106', 7, C.hoja)
      + agua(mancha(70, 102, 7, 7, 4, .1), C.crema, { f: 'l' }) + agua(mancha(130, 102, 7, 7, 5, .1), C.crema, { f: 'l' })
      + agua(mancha(100, 98, 23, 22, 6, .05), C.crema)
      + agua('M78,86 C82,66 100,52 128,44 C118,58 122,72 122,86 C108,80 94,80 78,86Z', C.azul)
      + agua(mancha(128, 44, 7, 7, 7, .1), C.sol, { f: 'l' })
      + ojo(92, 98, 3.4) + ojo(108, 98, 3.4) + colorete(84, 108, 5) + colorete(116, 108, 5) + agua(mancha(100, 105, 4.5, 4, 8, .1), C.rojo, { f: 'l' }) + sonrisa(100, 111, 12)
      + agua('M22,140 Q100,134 178,140 L176,182 Q100,188 24,182Z', C.rojo)
      + vel('M22,140 Q100,134 178,140 L178,150 Q100,144 22,150Z', C.sol, { o: .7 })
      + estrella(100, 166, 13, 6, C.sol) + chispa(52, 166, 5, C.sol) + chispa(148, 166, 5, C.sol)),

    // Pintar: paleta de madera con seis pegotes de color y un pincel
    icono_pintar: (o = {}) => svg('0 0 200 200',
      sombra(100, 184, 68)
      + agua('M100,42 C152,40 184,74 178,112 C174,138 152,140 140,130 C128,122 112,132 118,150 C124,170 102,176 84,172 C42,166 16,142 18,106 C20,70 54,44 100,42Z', C.tierra)
      + vel('M40,130 Q60,168 100,172 C118,172 120,150 116,140 Q70,160 40,130Z', C.tronco, { o: .4 })
      + agua(mancha(58, 126, 8, 7, 3, .1), PAPEL, { f: 'l' })
      + [[50, 90, 14, C.rojo], [86, 62, 14, C.sol], [128, 62, 14, C.azul], [122, 98, 12, C.hoja], [88, 146, 13, C.rosaO], [88, 104, 11, C.violeta]].map(([x, y, r, c], i) => agua(mancha(x, y, r, r * .85, i + 5, .12, 9), c) + brillo(x - r * .3, y - r * .3, r * .35, r * .2, -30, .5)).join('')
      + pincel('M126,142 L182,58', 8, C.tronco)
      + pincel('M134,130 L148,110', 10, C.grisO)
      + agua('M118,152 Q116,136 128,134 Q142,130 140,142 Q132,154 118,152Z', C.rojoO)
      + chispa(176, 28, 7, C.sol) + chispa(26, 56, 6, C.rosaO)),
    // Memoria: tres cartas sobre la mesa (reverso morado con sol, corazón y estrella)
    icono_memoria: (o = {}) => {
      const carta = (x, y, rot, fondo, dentro, papel = PAPEL, k = 1) => {
        const t = `translate(${x} ${y}) rotate(${rot})`;
        return agua('M-35,-47 Q0,-52 35,-47 Q40,0 35,47 Q0,52 -35,47 Q-40,0 -35,-47Z', papel, { t })
          + agua('M-27,-39 Q0,-43 27,-39 Q31,0 27,39 Q0,43 -27,39 Q-31,0 -27,-39Z', fondo, { t })
          + `<g transform="${t}">${dentro}</g>`;
      };
      let lunares = ''; for (let yy = -28; yy <= 28; yy += 14) for (let xx = -16; xx <= 16; xx += 11) lunares += punto(xx + ((yy / 14) % 2 ? 5 : 0), yy, 2.4, '#B9A2DE', .8);
      return svg('0 0 200 200',
        sombra(100, 186, 70)
        + carta(100, 72, 0, C.violeta, lunares + agua(mancha(0, 0, 16, 15, 3, .1), C.sol) + trazo('M-5,-5 C-5,-11 6,-11 6,-5 C6,0 0,0 0,5', 2.6) + punto(0, 11, 2, LINEA), C.violeta)
        + carta(62, 124, -13, '#F9D6E2', corazon(0, -2, 18, C.rojo) + brillo(-8, -10, 4, 2.5, -30, .6) + chispa(18, -28, 5, C.rosaO))
        + carta(140, 122, 11, '#D5E5F8', estrella(0, 0, 22, 10.5, C.sol) + chispa(-18, 28, 5, C.azul)));
    },

    // Abrazos: robot de cabeza clara, cuerpo turquesa y un corazón en el pecho
    icono_abrasos: (o = {}) => svg('0 0 200 200',
      sombra(100, 188, 54)
      + trazo('M100,32 V18', 3) + agua(mancha(100, 14, 8, 8, 3, .1), C.rojo, { f: 'l' })
      + agua(mancha(86, 176, 9, 8, 4, .1), C.gris) + agua(mancha(114, 176, 9, 8, 5, .1), C.gris)
      + agua('M64,100 Q60,140 64,172 Q100,180 136,172 Q140,140 136,100Q100,92 64,100Z', pig('#19B3B3'))
      + vel('M104,106 Q140,110 136,172 L112,174Z', carga(pig('#19B3B3'), .75), { o: .35 })
      + agua(mancha(50, 62, 8, 8, 6, .1), pig('#19B3B3'), { f: 'l' }) + agua(mancha(150, 62, 8, 8, 7, .1), pig('#19B3B3'), { f: 'l' })
      + pincel('M66,114 C42,116 44,144 80,136', 12, pig('#19B3B3')) + pincel('M134,114 C158,116 156,144 120,136', 12, pig('#19B3B3'))
      + agua(mancha(82, 135, 9, 8, 8, .1), C.gris) + agua(mancha(118, 135, 9, 8, 9, .1), C.gris)
      + agua('M54,50 Q52,30 74,28 L128,28 Q150,30 148,52 Q150,84 130,96 L72,96 Q52,86 54,50Z', C.gris)
      + vel('M110,34 L148,52 Q150,84 130,96 L106,96Z', C.grisO, { o: .4 })
      + agua('M66,42 Q100,36 136,42 Q140,62 134,82 Q100,88 68,82 Q62,62 66,42Z', C.crema)
      + ojo(86, 60, 6) + ojo(114, 60, 6) + colorete(76, 74, 6) + colorete(124, 74, 6) + sonrisa(100, 72, 14)
      + corazon(100, 140, 20, C.rojo) + brillo(88, 128, 6, 4, -35, .55)
      + corazon(36, 36, 8, C.rosaO, 'l') + corazon(168, 110, 7, C.rosaO, 'l')),

    // Bola de discoteca: esfera violeta con facetas de luz, tapa dorada y destellos
    icono_bola: (o = {}) => svg('0 0 200 200',
      sombra(100, 184, 62)
      + agua(mancha(100, 84, 64, 63, 3, .035), C.violeta)
      + vel(mancha(116, 108, 52, 42, 4, .1), carga(C.violeta, .6), { o: .5 })
      + [[78, 60, 18, 12], [124, 70, 16, 14], [66, 100, 14, 14], [104, 98, 16, 12], [136, 104, 12, 14], [92, 130, 14, 10]].map(([x, y, a, b], i) => vel(mancha(x, y, a, b, i + 2, .15), i % 2 ? C.rosa : PAPEL, { o: .5 })).join('')
      + trazo('M54,104 C56,62 112,50 132,80', 3, PAPEL, { o: .7 }) + trazo('M146,64 C150,100 120,136 80,130', 3, C.rosa, { o: .8 })
      + brillo(72, 50, 18, 9, -40, .7)
      + chispa(78, 78, 9, C.sol) + chispa(128, 106, 7, C.sol) + chispa(106, 52, 5, PAPEL)
      + agua('M54,140 C72,152 128,152 146,140 L156,168 C134,180 66,180 44,168Z', C.sol)
      + vel('M54,156 C76,166 124,166 148,156 L152,170 C130,180 70,180 48,170Z', C.solO, { o: .6 })
      + agua('M100,154 L108,163 L100,172 L92,163Z', C.rojo, { f: 'l' })
      + chispa(176, 36, 11, C.sol) + chispa(24, 52, 8, C.sol) + chispa(170, 124, 6, PAPEL)),

    // Hoja de cálculo: cuaderno cuadriculado con cabecera verde, caramelo, estrella y chocolate
    icono_hoja: (o = {}) => svg('0 0 200 200',
      sombra(104, 184, 68)
      + agua('M26,30 Q100,24 176,30 Q180,100 176,176 Q100,182 24,176 Q20,100 26,30Z', PAPEL)
      + vel('M24,52 Q100,48 176,52 L176,176 Q100,182 24,176Z', C.cieloO, { o: .12 })
      + agua('M24,28 Q100,24 176,28 L176,54 Q100,58 24,54Z', pig('#25A84A'))
      + agua('M24,54 Q35,52 46,54 L46,176 Q35,180 24,176Z', C.hoja, { o: .55 })
      + trazo('M46,30 V176 M89,54 V176 M132,54 V176 M26,94 H176 M26,135 H176', 2, C.grisO, { o: .6 })
      + trazo('M60,40 H74 M104,40 H118 M147,40 H161', 3.6, PAPEL, { o: .9 })
      + trazo('M98,70 H120 M98,80 H112 M141,72 H164 M56,114 H78 M141,112 H160 M98,152 H122', 4, C.grisO, { o: .45 })
      + `<g transform="rotate(-14 67 75)">` + agua('M54,75 L40,63 Q44,75 40,87Z', C.sol, { f: 'l' }) + agua('M80,75 L94,63 Q90,75 94,87Z', C.sol, { f: 'l' }) + agua(mancha(67, 75, 15, 12, 3, .1), C.rosaO) + trazo('M58,68 Q66,76 62,86 M68,64 Q76,74 72,86', 2.4, PAPEL, { o: .9 }) + `</g>`
      + estrella(112, 114, 22, 10.5, C.sol) + ojo(106, 113, 2.6) + ojo(118, 113, 2.6) + sonrisa(112, 119, 8) + colorete(102, 119, 3.5) + colorete(122, 119, 3.5)
      + `<g transform="rotate(-12 154 154)">` + agua('M139,133 Q154,130 169,133 L168,172 Q154,175 140,172Z', C.tronco) + trazo('M154,135 V171 M141,152 H167', 2, C.troncoO, { o: .7 }) + agua('M138,156 L144,152 L150,157 L156,152 L162,157 L168,152 L170,156 L170,174 Q154,178 138,174Z', C.rojo) + trazo('M144,166 H164', 3, C.sol, { o: .9 }) + `</g>`),

    // Etiquetas: pistola de etiquetar roja con una pegatina de lunares y una estrella con cara
    icono_etiquetas: (o = {}) => svg('0 0 200 200',
      sombra(84, 186, 52)
      + pincel('M146,92 C166,94 172,80 164,66', 8, C.crema)
      + agua('M30,84 C30,66 46,58 62,58 L128,60 C142,60 148,70 148,82 L148,100 C148,110 140,116 128,116 L98,116 L88,170 C86,178 76,182 66,180 L54,178 C46,176 42,168 44,160 L54,116 L50,116 C38,116 30,108 30,98Z', C.rojo)
      + vel('M100,116 L88,170 C86,178 76,182 66,180 L60,176 C80,176 88,150 92,116Z', C.rojoO, { o: .45 })
      + brillo(56, 70, 14, 5, -5, .5)
      + agua('M146,82 Q154,80 160,82 L160,100 Q154,102 146,100Z', C.grisO, { f: 'l' })
      + agua(mancha(80, 88, 21, 20, 4, .06), PAPEL)
      + Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return punto(80 + 14 * Math.cos(a), 88 + 14 * Math.sin(a), 3, [C.azul, C.sol, C.hoja, C.rosaO][i % 4], .9); }).join('')
      + agua(mancha(80, 88, 6, 6, 5, .1), C.sol, { f: 'l' })
      + estrella(152, 42, 28, 13, C.sol, -78) + brillo(144, 34, 5, 3, -30, .7)
      + ojo(146, 42, 2.8) + ojo(158, 42, 2.8) + sonrisa(152, 49, 8) + colorete(141, 48, 3.5) + colorete(163, 48, 3.5)
      + trazo('M112,30 H96 M116,46 H104 M118,18 L108,12', 2.6, C.grisO, { o: .7 })
      + chispa(184, 72, 7, C.sol) + chispa(126, 10, 5, PAPEL)),

    // Papelera: cubo azul con cara, tapa torcida, papeles arrugados y un folio que asoma
    icono_papelera: (o = {}) => svg('0 0 200 200',
      sombra(100, 188, 60)
      + agua('M22,166 L24,152 L36,146 L48,150 L54,162 L46,176 L30,177Z', PAPEL)
      + trazo('M36,147 L38,160 L25,153 M38,160 L53,162 M38,160 L31,176', 1.8, C.grisO, { o: .7 })
      + agua('M52,74 Q100,70 148,74 L140,170 C140,178 136,182 130,182 L70,182 C64,182 60,178 60,170Z', C.azul)
      + vel('M110,76 L148,74 L140,170 C140,178 136,182 130,182 L108,182Z', carga(C.azul, .75), { o: .4 })
      + trazo('M78,150 L80,170 M100,150 V170 M122,150 L120,170', 3.4, carga(C.azul, .7), { o: .6 })
      + ojo(84, 112, 6.5) + ojo(116, 112, 6.5) + colorete(72, 128, 7) + colorete(128, 128, 7) + sonrisa(100, 126, 16)
      + agua('M134,82 C132,66 150,62 166,66 C170,68 172,72 171,78 L169,104 C178,104 188,110 187,118 C186,126 178,128 168,126 L156,124 C150,122 148,116 150,110 L152,86 C152,80 146,78 134,82Z', PAPEL)
      + trazo('M138,74 H170 M146,86 H172', 3.4, C.rojo, { o: .7 })
      + agua(mancha(188, 118, 10, 9, 3, .1), C.sol, { f: 'l' }) + agua(mancha(150, 124, 9, 8, 4, .1), C.sol, { f: 'l' })
      + `<g transform="rotate(-13 44 72)">` + pincel('M88,52 C88,40 112,40 112,52', 6, C.azul) + agua('M40,74 C40,60 56,52 100,52 C144,52 160,60 160,74Z', pig('#3F86F0')) + trazo('M56,64 C70,58 90,57 104,57', 3.4, PAPEL, { o: .6 }) + `</g>`),

    // Voz: bocadillo de papel con cara y tres arcos de sonido rojo, naranja y amarillo
    icono_voz: (o = {}) => svg('0 0 200 200',
      sombra(84, 180, 54)
      + agua('M80,32 C118,32 142,54 142,86 C142,118 118,138 82,138 C74,138 66,137 60,135 L34,156 C32,158 28,156 29,153 L40,128 C26,118 18,104 18,86 C18,54 44,32 80,32Z', PAPEL)
      + vel('M60,128 C98,142 140,124 142,92 C142,118 118,138 82,138 L60,135Z', C.cieloO, { o: .45 })
      + vel('M20,100 C20,118 30,128 40,128 L34,156 L60,135 C40,134 22,122 20,100Z', C.cielo, { o: .5 })
      + brillo(50, 52, 14, 6, -30, .9)
      + ojo(64, 78, 6.5) + ojo(98, 78, 6.5) + colorete(52, 98, 8) + colorete(110, 98, 8)
      + agua('M68,96 Q82,116 96,96 Q82,102 68,96Z', C.rojoO)
      + pincel('M150.4,74.6 A14,14 0 0 1 150.4,93.4', 6, C.rojo) + pincel('M160.1,66 A27,27 0 0 1 160.1,102', 6, C.naranja) + pincel('M169.7,57.2 A40,40 0 0 1 169.7,110.8', 6, C.sol)),
    // Piscina de bolas: bañera turquesa llena de bolas, flotador rosa y un patito que asoma
    web_piscina: (o = {}) => {
      const bola = (x, y, r, c, i) => agua(mancha(x, y, r, r * .95, i + 3, .08, 9), c, { f: 'l' }) + brillo(x - r * .3, y - r * .35, r * .35, r * .2, -35, .6);
      const cb = [C.rojo, C.azul, C.sol, C.hoja];
      return svg('0 0 200 160',
        sombra(100, 148, 84)
        + agua('M14,80 Q12,100 16,116 Q100,152 184,116 Q188,100 186,80 Q100,106 14,80Z', pig('#19B3B3'))
        + vel('M100,108 Q150,104 186,80 Q188,100 184,116 Q150,134 100,140Z', carga(pig('#19B3B3'), .75), { o: .35 })
        + trazo('M58,104 V126 M100,110 V134 M142,104 V126', 2.6, carga(pig('#19B3B3'), .7), { o: .55 })
        + agua('M24,74 Q100,56 176,74 Q176,88 100,96 Q24,88 24,74Z', carga(pig('#19B3B3'), .55))
        + pincel('M20,78 A80,22 0 0 1 180,78', 11, C.rosaO)
        + [[54, 66], [76, 62], [98, 60], [120, 62], [150, 64], [64, 46], [87, 42], [109, 44], [96, 26]].map(([x, y], i) => bola(x, y, 10, cb[(i + 1) % 4], i)).join('')
        // patito
        + agua('M136,70 C136,58 146,54 156,56 C160,50 166,49 168,52 C166,56 166,58 166,62 C168,70 160,76 150,76 C142,76 136,74 136,70Z', C.sol)
        + agua(mancha(146, 42, 15, 14.5, 4, .07), C.sol) + brillo(140, 34, 5, 3, -30, .7)
        + agua('M133,44 C123,41 117,46 119,50 C122,54 129,54 134,50Z', C.naranja, { f: 'l' })
        + ojo(141, 38, 3.4) + colorete(148, 49, 4)
        + [[50, 80], [70, 84], [91, 81], [112, 85], [133, 80], [152, 81]].map(([x, y], i) => bola(x, y, 10.5, cb[(i + 2) % 4], i + 9)).join('')
        + pincel('M20,78 A80,22 0 0 0 180,78', 11, C.rosaO)
        + bola(30, 136, 10, C.sol, 20) + bola(174, 140, 9.5, C.rojo, 21) + bola(30, 26, 9, C.azul, 22)
        + trazo('M42,32 Q50,30 58,36', 2.4, C.grisO, { o: .6 }));
    },

    // Pompas de jabón: varita morada con aro dorado y pompas de reflejos
    web_burbujas: (o = {}) => {
      const pompa = (x, y, r, i) => vel(mancha(x, y, r, r, i + 2, .04, 12), C.cielo, { o: .5 })
        + vel(mancha(x + r * .22, y + r * .22, r * .7, r * .7, i + 5, .06, 12), C.violeta, { o: .3 })
        + trazo(mancha(x, y, r, r, i + 2, .03, 12), Math.max(1.6, r * .08), C.cieloO, { o: .55 })
        + brillo(x - r * .38, y - r * .42, r * .3, r * .16, -40, .95)
        + (r > 12 ? trazo(`M${f1(x + r * .5)},${f1(y + r * .55)} q${f1(r * .2)},${f1(-r * .25)} ${f1(r * .1)},${f1(-r * .5)}`, 2, PAPEL, { o: .8 }) : '');
      return svg('0 0 200 160',
        sombra(70, 150, 40, .25)
        + `<g transform="rotate(42 46 128)">` + agua('M31,100 Q38,98 46,100 L47,160 Q38,164 30,160Z', C.violeta) + trazo('M30,116l16,-4M30,132l16,-4M30,148l16,-4', 3.6, C.rosaO, { o: .9 }) + `</g>`
        + vel(mancha(72, 88, 18, 22, 3, .08, 10, 0), C.cielo, { o: .4, t: 'rotate(-40 72 88)' })
        + pincel(mancha(72, 88, 18, 22, 4, .05, 12), 7, C.sol, { t: 'rotate(-40 72 88)' })
        + brillo(68, 80, 8, 3.5, -40, .6)
        + pompa(128, 62, 34, 1) + pompa(174, 108, 17, 2) + pompa(150, 18, 10, 3) + pompa(184, 52, 7, 4) + pompa(104, 120, 9, 5) + pompa(92, 46, 6, 6)
        + chispa(176, 146, 6, C.sol) + chispa(24, 30, 7, C.sol) + chispa(42, 52, 4, PAPEL));
    },

    // Palacio de Lucía: castillo rosa con tres torres, corona dorada, puerta y setos floridos
    web_secreta: (o = {}) => {
      const torre = (x, cx) => agua(`M${x},146 Q${x - 2},110 ${x},72 Q${cx},76 ${x + 32},72 Q${x + 34},110 ${x + 32},146Z`, C.rosa)
        + vel(`M${cx + 6},74 L${x + 32},72 Q${x + 34},110 ${x + 32},146 L${cx + 6},146Z`, C.rosaO, { o: .3 })
        + agua(`M${x - 6},74 L${cx},24 L${x + 38},74 Q${cx},82 ${x - 6},74Z`, C.rosaO)
        + trazo(`M${cx},26 V10`, 2.2) + agua(`M${cx},10 l12,3 l-12,5Z`, C.sol, { f: 'l' })
        + agua(`M${cx - 7},114 V102 Q${cx},92 ${cx + 7},102 V114Z`, C.cielo, { f: 'l' });
      return svg('0 0 200 160',
        sombra(100, 148, 82)
        + agua('M56,86 L66,80 L66,76 L76,76 L76,84 L124,84 L124,76 L134,76 L134,84 L144,84 L146,148 L56,148Z', C.rosa)
        + torre(30, 46) + torre(138, 154)
        + trazo('M35,86h8M50,122h8M142,86h8M156,122h8M66,106h6M128,106h6', 2, C.rosaO, { o: .7 })
        + agua('M78,148 Q76,100 78,50 Q100,46 122,50 Q124,100 122,148Z', C.rosa)
        + vel('M104,50 L122,50 Q124,100 122,148 L104,148Z', C.rosaO, { o: .3 })
        + agua('M76,52 L74,22 L88,34 L100,14 L112,34 L126,22 L124,52Z', C.sol)
        + punto(74, 20, 4, PAPEL, .95) + punto(100, 12, 4.5, PAPEL, .95) + punto(126, 20, 4, PAPEL, .95) + punto(100, 42, 4, C.rosaO, .95)
        + corazon(100, 80, 10, C.rojo, 'l')
        + agua('M86,148 V126 A14,14 0 0 1 114,126 V148Z', C.tronco) + trazo('M100,114 V148', 2, C.troncoO, { o: .6 }) + punto(95, 134, 2, C.sol) + punto(105, 134, 2, C.sol)
        + corazon(16, 40, 7, C.rosaO, 'l') + corazon(184, 34, 8, C.rosaO, 'l') + corazon(182, 100, 5.5, C.rosaO, 'l')
        + chispa(188, 124, 6, C.sol) + chispa(12, 130, 5, C.sol) + chispa(62, 14, 5, PAPEL) + chispa(140, 10, 4.5, C.sol)
        + agua('M16,148 Q16,134 28,136 Q36,126 46,138 Q54,140 52,148Z', C.hoja) + agua('M148,148 Q148,138 158,138 Q166,128 176,138 Q186,136 184,148Z', C.hojaO)
        + punto(38, 142, 2.6, PAPEL, .95) + punto(28, 144, 2.2, C.rosaO, .9) + punto(162, 142, 2.6, PAPEL, .95) + punto(172, 144, 2.2, C.rosaO, .9));
    },

    // Corona con joyas: oro, terciopelo rojo, perlas y gemas
    web_corona: (o = {}) => {
      const perla = (x, y, r) => agua(mancha(x, y, r, r, x, .06, 9), PAPEL, { f: 'l' }) + trazo(mancha(x, y, r, r, x, .06, 9), 1.4, C.grisO, { o: .6 }) + brillo(x - r * .3, y - r * .3, r * .3, r * .2, -30, .9);
      const gema = (x, y, rx, ry, c) => agua(mancha(x, y, rx, ry, x + y, .08, 8), c, { f: 'l' }) + trazo(`M${f1(x - rx * .5)},${f1(y - ry * .1)} l${f1(rx * .3)},${f1(-ry * .45)}`, 2, PAPEL, { o: .8 });
      return svg('0 0 200 160',
        sombra(100, 146, 66)
        + agua('M46,102 Q56,40 100,12 Q146,40 154,102Z', C.rojo)
        + vel('M100,14 Q146,40 154,102 L100,102Z', C.rojoO, { o: .35 })
        + agua('M44,136 Q100,148 156,136 L162,110 L168,58 L142,90 L132,46 L114,86 L100,30 L86,86 L68,46 L58,90 L32,58 L38,110Z', C.sol)
        + vel('M38,110 Q100,124 162,110 L156,136 Q100,148 44,136Z', C.solO, { o: .55 })
        + trazo('M38,110 Q100,124 162,110', 2.6, C.solO, { o: .8 })
        + brillo(62, 72, 3, 11, 20, .6)
        + perla(32, 56, 7) + perla(68, 44, 7) + perla(100, 27, 8) + perla(132, 44, 7) + perla(168, 56, 7)
        + corazon(100, 86, 12, C.rosaO) + gema(68, 94, 6, 7, C.cielo) + gema(132, 94, 6, 7, C.cielo)
        + gema(100, 128, 11, 8, C.rojo) + gema(70, 124, 8, 6.5, C.hoja) + gema(130, 124, 8, 6.5, C.azul)
        + chispa(20, 98, 8, C.sol) + chispa(182, 92, 7, C.sol) + chispa(178, 22, 5.5, PAPEL) + chispa(24, 24, 5, C.sol));
    },

    // 404: el perrito merendando una galleta, con un vaso de leche
    web_merendar: (o = {}) => {
      const orejaC = C.tronco, cuerpo = C.tierra;
      return svg('0 0 240 180',
        sombra(116, 170, 86)
        + agua('M154,152 C172,148 180,128 172,112 C184,112 192,134 186,152 C182,162 168,166 156,164Z', cuerpo)
        + agua(mancha(82, 162, 21, 11, 3, .08), cuerpo) + agua(mancha(154, 162, 21, 11, 4, .08), cuerpo)
        + agua('M74,168 C66,134 86,100 118,100 C150,100 170,134 162,168 Q118,180 74,168Z', cuerpo)
        + vel('M130,108 C156,116 168,140 162,168 L120,176Z', C.tronco, { o: .3 })
        + agua('M93,120 A7,7 0 0 0 104,116 A8,8 0 0 0 118,114 A8.5,8.5 0 0 0 132.5,109 A29,29 0 1 1 93,120Z', C.naranja)
        + vel('M118,126 A29,29 0 0 1 132,109 A29,29 0 1 1 100,150Z', C.pajaO, { o: .35 })
        + [[106, 134, 4], [130, 126, 4.5], [124, 148, 4], [102, 152, 3.5], [142, 142, 3.2]].map(([x, y, r], i) => agua(mancha(x, y, r, r * .8, i + 3, .15, 8), '#8E6A52', { f: 'l' })).join('')
        + agua(mancha(88, 140, 11, 13, 5, .1), cuerpo, { f: 'l' }) + agua(mancha(148, 138, 11, 13, 6, .1), cuerpo, { f: 'l' })
        + agua('M76,34 C56,32 44,54 46,80 C48,100 60,108 70,102 C78,96 82,66 86,44Z', orejaC)
        + agua('M160,34 C180,32 192,54 190,80 C188,100 176,108 166,102 C158,96 154,66 150,44Z', orejaC)
        + agua(mancha(118, 62, 48, 40, 7, .05), cuerpo)
        + vel(mancha(142, 50, 16, 14, 8, .15), C.tronco, { o: .5 })
        + agua(mancha(118, 86, 24, 15, 9, .06), C.crema)
        + agua('M110,74 Q118,69 126,74 Q126,81 118,83 Q110,81 110,74Z', C.negro)
        + trazo('M118,83 v4 M107,89 Q112,96 118,89 Q124,96 129,89', 2.6, LINEA, { o: .8 })
        + trazo('M87,59 Q95,48 103,59 M133,59 Q141,48 149,59', 3.4, LINEA, { o: .85})
        + colorete(84, 78, 9) + colorete(152, 78, 9)
        + [[100, 106, 2.4], [140, 98, 2.4], [56, 168, 3.2], [44, 160, 2.4], [186, 170, 3], [122, 176, 2.6]].map(([x, y, r]) => punto(x, y, r, C.naranja, .85)).join('')
        + agua('M198,114 H228 L224 168 H202Z', PAPEL) + agua('M196,102 Q214,98 234,102 L233,130 Q214,134 196,130Z', C.cielo, { o: .8 })
        + trazo('M205,138 v24', 2.4, PAPEL, { o: .9 }) + vel('M214,114 H228 L224 168 H214Z', C.cieloO, { o: .25 })
        + agua(mancha(30, 160, 13, 12, 10, .08), C.naranja) + punto(26, 156, 2.6, '#8E6A52') + punto(35, 164, 2.4, '#8E6A52')
        + chispa(36, 28, 6, C.sol) + chispa(206, 30, 7, C.sol) + chispa(222, 76, 4.5, PAPEL));
    },
    // Lupa sobre el mundo: globito azul con tierra verde, visto a través de una lupa dorada
    web_lupa_mundo: (o = {}) => svg('0 0 100 100',
      agua(mancha(40, 42, 30, 29, 3, .05), C.azul)
      + agua('M14,34 C20,24 32,24 36,30 C40,36 34,42 30,44 C28,50 22,54 16,50 C13,46 13,40 14,34Z', C.hoja)
      + agua('M42,18 C48,13 58,16 58,22 C55,27 48,26 43,24Z', C.hoja, { f: 'l' })
      + agua('M44,52 C50,48 58,50 61,56 C62,64 56,70 52,72 C47,67 45,60 44,52Z', C.hoja, { f: 'l' })
      + brillo(27, 26, 7, 3.5, -30, .6)
      + pincel('M74,75 L89,90', 7, C.rojo)
      + agua(mancha(60, 60, 17, 17, 5, .04), C.cielo, { o: .7 })
      + agua('M54,50 C60,46 68,50 69,56 C68,62 62,66 56,64 C52,60 52,54 54,50Z', C.hoja, { f: 'l', o: .9 })
      + pincel(mancha(60, 60, 18, 18, 6, .03, 11), 4.4, C.solO)
      + trazo('M49,55 A12,12 0 0 1 56,48', 2.6, PAPEL, { o: .9 })
      + trazo('M70,72 l6,6', 1.4, C.grisO, { o: .6 })
      + chispa(86, 14, 5, C.sol) + chispa(12, 84, 4, C.sol)),

    // Pato de goma: patito amarillo de perfil
    pato_goma: (o = {}) => svg('0 0 100 100',
      sombra(52, 94, 38, .3)
      + agua('M14,52 C10,44 12,36 16,34 C20,42 26,48 34,50 C40,46 52,46 62,50 C74,54 86,58 88,70 C88,84 74,92 52,92 C30,92 14,84 12,70 C11,62 12,56 14,52Z', C.sol)
      + vel('M30,86 C54,96 84,84 88,68 C88,84 74,92 52,92Z', C.solO, { o: .5 })
      + agua('M34,66 C40,58 56,58 64,64 C66,72 58,80 46,80 C38,80 32,74 34,66Z', C.solO, { f: 'l', o: .85 })
      + trazo('M44,72 Q52,75 58,70', 1.4, C.solO, { o: .9 })
      + agua(mancha(60, 32, 19, 18, 4, .06), C.sol)
      + brillo(52, 22, 6, 3, -30, .7)
      + agua('M74,33 C82,29 91,31 92,37 C91,42 84,44 76,42Z', C.naranja, { f: 'l' })
      + trazo('M77,38.5 Q84,39.5 91,37.5', 1.2, LINEA, { o: .8 })
      + ojo(66, 28, 2.8) + colorete(68, 39, 4)
      + trazo('M52,14 Q54,9 60,12 M20,36 l-4,-5', 1.6, LINEA, { o: .7 })),

    // Pompa de jabón: una burbuja grande con reflejos
    burbuja_jabon: (o = {}) => svg('0 0 100 100',
      vel(mancha(50, 50, 44, 44, 3, .03, 12), C.cielo, { o: .5 })
      + vel(mancha(58, 58, 32, 32, 5, .06, 12), C.violeta, { o: .3 })
      + vel(mancha(40, 40, 24, 24, 7, .06, 12), C.rosa, { o: .2 })
      + trazo(mancha(50, 50, 44, 44, 3, .03, 12), 1.8, C.cieloO, { o: .6 })
      + brillo(32, 28, 10, 5, -40, .95)
      + trazo('M78,62 q4,-8 2,-16', 2.2, PAPEL, { o: .85 })),

    // Cursor: mano que señala con el dedo, puño azul
    cursor_mano: (o = {}) => svg('0 0 60 60',
      agua('M18,30 V9 C18,4 26,4 26,9 V24 C27,21 33,21 34,25 C35,22 41,22 42,26 C43,24 49,24 49,29 V40 C49,50 42,56 33,56 C24,56 18,52 15,46 L9,36 C7,32 12,29 15,32Z', C.crema)
      + vel('M38,30 C44,28 49,30 49,34 V40 C49,50 42,56 33,56 L30,52 C40,50 40,40 38,30Z', C.tierra, { o: .5 })
      + trazo('M26,24 V32 M34,25 V32 M42,26 V33', 1.4, C.pajaO, { o: .8 })
      + agua('M21,47 Q34,44 47,48 L46,56 Q34,58 22,56Z', C.azul)),

    // Bola de discoteca: esfera plateada de facetas con cuerda y destellos
    disco_bola: (o = {}) => {
      const r = azar(7); let fac = '';
      const tonos = [C.grisO, C.gris, PAPEL, C.cielo, C.violeta, C.rosa, C.sol];
      for (let i = 0; i < 12; i++) { const a = r() * 6.28, q = Math.sqrt(r()) * 34; fac += vel(mancha(60 + Math.cos(a) * q, 88 + Math.sin(a) * q, 9 + r() * 5, 8 + r() * 5, i + 2, .15, 6), tonos[2 + Math.floor(r() * 5)], { o: .55 }); }
      return svg('0 0 120 140',
        sombra(60, 136, 28, .3)
        + trazo('M60,2 V30', 3, C.grisO, { o: .9 }) + agua(mancha(60, 9, 3.4, 5.5, 2, .1), C.gris, { f: 'l' }) + agua(mancha(60, 23, 3.4, 5.5, 3, .1), C.gris, { f: 'l' })
        + agua('M51,32 L69,32 L72,44 L48,44Z', C.grisO, { f: 'l' })
        + agua(mancha(60, 88, 44, 44, 3, .03), '#DCE5F2')
        + vel(mancha(74, 104, 36, 32, 4, .1), C.grisO, { o: .6 })
        + fac
        + trazo('M30,80 Q60,92 90,80 M24,98 Q60,112 96,98 M60,48 Q50,88 60,130 M60,48 Q74,88 60,130', 1.4, C.grisO, { o: .5 })
        + brillo(44, 66, 12, 7, -40, .85)
        + chispa(41, 64, 7, PAPEL) + chispa(86, 80, 4, PAPEL) + chispa(78, 108, 4.5, PAPEL) + chispa(14, 58, 6, C.sol) + chispa(108, 48, 5, C.rosaO) + chispa(110, 118, 4, C.azul) + chispa(10, 112, 3.5, C.sol));
    },

    // Dino que corre con la boca abierta: cuerpo verde, barriga lima, espinas naranjas
    dino_corre: (o = {}) => {
      const V = pig('#3DA84A'), VO = carga(V, .78), BL = '#E3F0A8';
      return svg('0 0 220 160',
        sombra(108, 150, 70, .3)
        + trazo('M10,38 H30 M4,48 H20 M2,100 H22', 3.4, C.grisO, { o: .7 })
        + agua('M78,92 L60,116 L46,124 C40,128 42,136 48,135 L66,131 C70,130 72,127 70,123 L94,102Z', VO)
        + [[38, 61, -4], [60, 60, -10], [84, 52, -18], [108, 44, -14], [130, 41, -4]].map(([x, y, a]) => agua(`M${x - 8},${y + 4} Q${x},${y - 15} ${x + 8},${y + 4}Z`, C.naranja, { f: 'l', t: `rotate(${a} ${x} ${y})` })).join('')
        + agua('M8,60 C30,64 52,66 70,62 C92,54 118,42 146,44 C162,46 170,58 170,72 C170,94 156,108 132,112 C110,116 86,112 72,98 C56,84 32,72 10,68 C4,67 3,61 8,60Z', V)
        + agua('M60,88 C80,108 110,116 140,108 C156,102 166,90 170,76 C168,98 154,112 130,114 C100,118 74,110 60,88Z', BL, { o: .85 })
        + punto(100, 64, 4.5, VO, .6) + punto(118, 55, 3.2, VO, .6) + punto(82, 72, 3.2, VO, .6)
        + trazo('M82,102 q4,3 8,4 M100,110 q4,2 8,2.4 M120,112 q4,0 8,-1', 1.8, C.pajaO, { o: .7 })
        + agua('M86,86 C92,68 124,70 126,92 C127,102 122,110 116,112 L132,128 L148,130 C154,131 154,140 148,141 H126 C121,141 119,137 121,133 L104,116 C90,114 82,100 86,86Z', V)
        + trazo('M135,141 v-5 M141,141 v-5', 2, LINEA, { o: .7 })
        + agua('M154,58 L208,54 L200,84 C184,80 168,72 154,66Z', C.rojoO)
        + agua('M162,72 C176,72 190,78 198,84 C184,84 170,80 162,72Z', C.rosaO, { f: 'l' })
        + agua('M152,64 C166,72 184,80 198,82 C206,83 206,92 198,94 C178,96 160,88 148,76Z', V)
        + agua('M150,74 C166,84 184,90 204,90 L204,96 C180,96 160,90 150,78Z', BL, { f: 'l', o: .8 })
        + agua('M170,72 L173,66 L176,73Z M184,78 L187,72 L190,79Z M172,58 L175,64 L178,58Z M186,57 L189,63 L192,56Z', PAPEL, { f: 'l' })
        + agua('M146,54 C144,30 162,14 186,14 C204,14 216,24 216,40 C216,50 212,56 206,58 C188,60 170,60 152,62Z', V)
        + brillo(166, 26, 9, 4, -20, .6)
        + ojo(184, 33, 4.4) + trazo('M172,20 q10,-6 21,-1', 3, LINEA, { o: .85 }) + punto(208, 30, 2, LINEA, .8) + colorete(165, 50, 6)
        + agua('M154,92 Q160,102 170,100 L168,106 Q158,106 150,96Z', V, { f: 'l' }) + trazo('M170,100 l4,-4 M170,100 l5,1', 1.8, LINEA, { o: .8 }));
    },
/*FIN*/
  });
})();
