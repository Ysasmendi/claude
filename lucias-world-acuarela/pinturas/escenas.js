// Pinturas: escenas
(() => {
  const { agua, vel, trazo, pincel, punto, gotas, mancha, liso, pig, carga, lava, svg, C, ojo, sonrisa, colorete, hierba, flor, nubeD, LINEA, PAPEL, azar, f1 } = AQ;
  const VB = '0 0 1000 600', PA = ' preserveAspectRatio="xMidYMax slice"';
  const S = b => svg(VB, b, PA);
  const cielo = (c, h = 470) => agua(`M-20,-20 H1020 V${h} H-20Z`, c, { f: 's', o: 1 });
  // suelo: una aguada ancha con borde ondulado
  const suelo = (y, c, k = 1, o) => agua(`M-20,${y} Q250,${y - 26 * k} 500,${y - 4} Q760,${y + 16 * k} 1020,${y - 18 * k} L1020,620 L-20,620Z`, c, o ? { o } : {});
  // copa de árbol: tres manchas que se pisan
  const copa = (x, y, k, s, c1, c2) => agua(mancha(x - 28 * k, y + 8 * k, 40 * k, 34 * k, s, .1), c1) + agua(mancha(x + 30 * k, y + 4 * k, 40 * k, 36 * k, s + 1, .1), c2 || c1, { o: .92 }) + agua(mancha(x, y - 30 * k, 46 * k, 38 * k, s + 2, .1), c1);
  const tronco = (x, y, k, c = C.tronco) => agua(`M${x - 11 * k},${y + 70 * k} Q${x - 6 * k},${y + 30 * k} ${x - 9 * k},${y} L${x + 9 * k},${y} Q${x + 6 * k},${y + 30 * k} ${x + 12 * k},${y + 70 * k}Z`, c);
  // abeto: una mancha de capas puntiagudas pero blanda
  const abeto = (x, y, k, c, s, nieve) => {
    const r = azar(s), j = () => (r() - .5) * 5 * k;
    const P = [[0, -124], [15, -86], [9, -84], [30, -48], [19, -46], [44, -6], [-44, -6], [-19, -46], [-30, -48], [-9, -84], [-15, -86]].map(([a, b]) => [x + a * k + j(), y + b * k + j()]);
    let g = agua(`M${x - 4 * k},${y + 34 * k} L${x + 5 * k},${y + 34 * k} L${x + 4 * k},${y - 8 * k} L${x - 4 * k},${y - 8 * k}Z`, C.troncoO, { f: 'l' }) + agua(liso(P), c) + vel(liso(P.map(([a, b]) => [x + (a - x) * .5 + 12 * k, y + (b - y) * .75 + 4 * k])), carga(c, .75), { o: .3 });
    if (nieve) g += agua(liso([[x, y - 124 * k], [x + 12 * k, y - 92 * k], [x, y - 86 * k], [x - 12 * k, y - 92 * k]]), PAPEL, { f: 'l' }) + agua(liso([[x - 28 * k, y - 50 * k], [x - 8 * k, y - 56 * k], [x + 14 * k, y - 50 * k], [x + 28 * k, y - 52 * k], [x + 32 * k, y - 44 * k], [x, y - 40 * k], [x - 30 * k, y - 42 * k]]), PAPEL, { f: 'l' }) + agua(liso([[x - 40 * k, y - 12 * k], [x - 10 * k, y - 18 * k], [x + 20 * k, y - 12 * k], [x + 42 * k, y - 14 * k], [x + 44 * k, y - 4 * k], [x, y - 2 * k], [x - 42 * k, y - 4 * k]]), PAPEL, { f: 'l' });
    return g;
  };
  const seta = (x, y, k, c, s) => agua(`M${x - 3 * k},${y} Q${x - 4 * k},${y - 14 * k} ${x - 3 * k},${y - 20 * k} L${x + 4 * k},${y - 20 * k} Q${x + 4 * k},${y - 12 * k} ${x + 3 * k},${y}Z`, PAPEL, { f: 'l' })
    + agua(liso([[x - 20 * k, y - 18 * k], [x - 13 * k, y - 34 * k], [x, y - 40 * k], [x + 14 * k, y - 34 * k], [x + 21 * k, y - 18 * k], [x, y - 14 * k]]), c, { f: 'l' })
    + punto(x - 7 * k, y - 28 * k, 2.6 * k, PAPEL, .95) + punto(x + 8 * k, y - 25 * k, 2.2 * k, PAPEL, .95) + punto(x, y - 35 * k, 2 * k, PAPEL, .95);
  const brillo = (x, y, r, c) => vel(mancha(x, y, r, r, x + y, .1), c, { o: .38 });
  // rectángulo de agua con lados que bailan un poco
  const rectO = (x, y, w, h, sd = 1, j = 2) => { const q = azar(sd * 7 + 3), t = () => (q() - .5) * 2 * j, k = Math.min(w, h) * .14; return liso([[x + k, y + t()], [x + w - k, y + t()], [x + w + t(), y + k], [x + w + t(), y + h - k], [x + w - k, y + h + t()], [x + k, y + h + t()], [x + t(), y + h - k], [x + t(), y + k]]); };
  const hierbas = (xs, y, h, c, s0 = 1) => xs.map((x, i) => hierba(x, y + (i % 3) * 4, h * (.8 + (i % 4) * .15), c, i % 2 ? 1 : -1)).join('');

  Object.assign(ILUS, {
    // ============================== BOSQUE ==============================
    escena_bosque: () => S(
      cielo('#F4F2CC')
      + vel('M-20,-20 H1020 V230 Q500,290 -20,230Z', C.prado, { o: .5 })
      + [[330, 0, 520, 450], [540, 0, 700, 450], [700, 0, 830, 440]].map(([a, , b]) => vel(`M${a},-10 L${a + 90},-10 L${b + 80},450 L${b - 60},450Z`, C.sol, { o: .2 })).join('')
      + [[235, 30], [345, 22], [610, 28], [735, 34]].map(([x, w], i) => agua(`M${x - w},-10 L${x + w},-10 Q${x + w + 6},220 ${x + w - 4},440 L${x - w + 2},440 Q${x - w - 4},220 ${x - w},-10Z`, i % 2 ? '#C7CFA6' : '#D2CCAC', { o: .8 }) + trazo(`M${x + 4},20 Q${x + 12},200 ${x},400`, 2.4, C.troncoO, { o: .4 })).join('')
      + suelo(420, C.prado) + suelo(470, C.hoja)
      + agua('M470,620 Q504,530 484,478 Q472,444 498,420 Q502,452 534,484 Q564,540 584,620Z', lava(C.tierra, .35))
      + agua(mancha(250, 438, 62, 24, 41, .12), C.hojaO, { o: .85 }) + agua(mancha(780, 436, 70, 26, 42, .12), C.hojaO, { o: .85 })
      // troncos grandes a los lados
      + agua('M-20,-20 L150,-20 Q166,200 138,330 Q128,400 150,460 L-20,470Z', C.tronco) + vel('M96,-20 L150,-20 Q166,200 138,330 Q128,400 150,460 L110,460 Q92,300 96,-20Z', C.troncoO, { o: .45 })
      + trazo('M46,10 Q56,120 44,230 M92,40 Q100,150 86,260', 2.6, C.troncoO, { o: .6 })
      + agua('M870,-20 L1020,-20 L1020,470 Q930,462 884,440 Q900,320 886,200 Q880,80 870,-20Z', C.tronco) + vel('M870,-20 L910,-20 Q930,200 920,440 L884,440 Q900,320 886,200Z', C.troncoO, { o: .45 })
      + agua(mancha(952, 190, 15, 30, 7, .1), C.troncoO) + trazo('M980,10 Q972,120 982,250', 2.6, C.troncoO, { o: .6 })
      // follaje arriba
      + [[60, 0, 90, 44], [220, -10, 80, 50], [400, -14, 90, 46], [600, -12, 90, 50], [790, -8, 84, 46], [950, 0, 70, 50]].map(([x, y, a, b], i) => agua(mancha(x, y, a, b, 10 + i, .12), i % 2 ? C.hoja : C.hojaO, { o: .9 })).join('')
      + pincel('M196,-10 Q206,40 198,100', 3, C.hojaO, { f: 'l' }) + pincel('M700,-10 Q692,50 702,110', 3, C.hojaO, { f: 'l' })
      + seta(370, 462, .8, C.rojo, 3) + seta(640, 470, 1, C.rojo, 4)
      + flor(420, 505, C.violeta, 7) + flor(590, 512, PAPEL, 6)),

    escena_bosque_frente: () => { const r = azar(14);
      let s = agua('M-20,480 Q220,452 480,470 Q740,486 1020,458 L1020,620 L-20,620Z', C.hojaO) + vel('M-20,540 Q500,520 1020,536 L1020,620 L-20,620Z', carga(C.hojaO, .7), { o: .4 });
      // tronco caído a la izquierda
      s += agua('M-20,430 Q120,404 260,420 Q300,440 290,490 Q150,516 -20,500Z', C.tronco) + vel('M-20,468 Q130,462 288,470 L290,492 Q150,516 -20,500Z', C.troncoO, { o: .5 })
        + agua(mancha(272, 458, 22, 38, 8, .06), C.crema) + trazo('M268,446 q8,6 2,16 M262,438 q18,12 4,30', 1.6, C.pajaO, { o: .7 }) + trazo('M20,440 Q120,432 230,442 M10,470 Q120,466 220,474', 2, C.troncoO, { o: .6 });
      // hierba y helechos
      for (let i = 0; i < 30; i++) { const x = i * 35 + r() * 20 - 5, h = 30 + r() * 34; s += trazo(`M${f1(x)},600 Q${f1(x + (r() - .5) * 14)},${f1(560 - h * .4)} ${f1(x + (r() - .5) * 26)},${f1(560 - h)}`, 4 + r() * 3, [carga(C.hojaO, .7), carga(C.hojaO, .85), C.hojaO][i % 3], { o: .85 }); }
      [[860, 520], [930, 500], [820, 540]].forEach(([x, y], i) => { for (let j = -3; j <= 3; j++) s += trazo(`M${x},${y + 20} Q${x + j * 12},${y - 10 - (3 - Math.abs(j)) * 8} ${x + j * 20},${y - 24 + Math.abs(j) * 8}`, 2.2, carga(C.hojaO, .62), { o: .75 }); });
      s += seta(560, 560, 1.4, C.rojo, 5) + seta(620, 580, 1, C.rojo, 6) + seta(500, 585, .9, C.rojo, 7) + seta(95, 480, .7, C.rojo, 8);
      s += [[400, 540], [700, 548]].map(([x, y], i) => trazo(`M${x},${y + 40} Q${x + 3},${y + 20} ${x},${y}`, 2.4, carga(C.hojaO, .7)) + flor(x, y, [C.violeta, PAPEL][i], 8)).join('');
      return S(s); },

    // ============================== NOCHE ==============================
    escena_noche: () => { const r = azar(5), azul = '#8E94D2', hondo = '#5F66AE', pino = '#6872B8', pinoO = '#4F5AA4';
      let s = cielo(azul, 480) + vel('M-20,-20 H1020 V300 Q500,340 -20,300Z', hondo, { o: .55 }) + vel(mancha(300, 200, 260, 70, 3, .2), hondo, { o: .35 }) + vel(mancha(700, 120, 220, 60, 4, .2), '#A9A4DA', { o: .4 });
      for (let i = 0; i < 34; i++) s += punto(r() * 1000, r() * 300, 1.4 + r() * 1.8, '#F7EFC8', .85);
      [[110, 60], [820, 260], [480, 120]].forEach(([x, y]) => { s += trazo(`M${x},${y - 12} V${y + 12} M${x - 12},${y} H${x + 12}`, 2.4, '#F7EFC8', { o: .9 }); });
      s += agua(mancha(850, 100, 64, 62, 2, .05), '#F7EBC0', { f: 's' }) + agua(mancha(850, 100, 56, 55, 3, .05), '#F7EBC0') + vel(mancha(868, 118, 34, 30, 5, .2), '#E3C98C', { o: .5 }) + punto(832, 86, 7, '#E3C98C', .5) + punto(870, 126, 5, '#E3C98C', .4);
      s += nubeD(190, 110, 1.1, 2).replace(new RegExp(PAPEL, 'g'), '#A7A5DA') + nubeD(700, 150, .9, 6).replace(new RegExp(PAPEL, 'g'), '#A19FD6');
      s += agua('M-20,360 Q200,310 420,350 Q640,390 860,330 Q950,310 1020,330 L1020,620 L-20,620Z', '#6A76B8');
      [[60, 330, 1.3], [170, 360, 1.0], [880, 330, 1.35], [960, 360, 1.1], [330, 380, .6], [650, 380, .6], [740, 372, .5]].forEach(([x, y, k], i) => { s += abeto(x, y, k * (k < .7 ? 1.1 : 1.25), i < 4 ? pinoO : pino, 20 + i); });
      s += agua(mancha(300, 346, 8, 8, 5, .1), '#F6E28A') + brillo(300, 346, 26, '#F6E28A');
      s += suelo(430, '#7DA9CC') + suelo(480, '#6396B8');
      for (let i = 0; i < 14; i++) { const x = 80 + i * 62 + r() * 30, y = 140 + r() * 300; s += punto(x, y, 3.4, '#F6E28A', .95) + brillo(x, y, 14, '#F6E28A'); }
      s += seta(430, 540, 1.1, '#9CCCE0', 3) + flor(560, 520, '#B9B3E4', 6);
      return S(s); },

    escena_noche_frente: () => { const r = azar(21);
      let s = agua('M-20,494 Q250,470 500,488 Q760,504 1020,476 L1020,620 L-20,620Z', '#4B7CA6') + vel('M-20,550 Q500,534 1020,548 L1020,620 L-20,620Z', '#34527F', { o: .45 });
      for (let i = 0; i < 38; i++) { const x = i * 27 + r() * 16 - 8, h = 40 + r() * 56; s += trazo(`M${f1(x)},600 Q${f1(x + (r() - .5) * 12)},${f1(570 - h * .4)} ${f1(x + (r() - .5) * 30)},${f1(575 - h)}`, 4 + r() * 3, ['#2E4A80', '#3A5C93', '#26406F'][i % 3], { o: .9 }); }
      s += seta(300, 580, 1.3, '#9CCCE0', 3);
      [[110, 520], [450, 536], [660, 524], [880, 522]].forEach(([x, y], i) => { s += trazo(`M${x},${y + 70} Q${x + 5},${y + 34} ${x},${y}`, 2.4, '#3F5E93') + agua(mancha(x, y - 6, 8, 11, i + 3, .15), '#B9B3E4', { f: 'l' }); });
      for (let i = 0; i < 9; i++) { const x = 40 + i * 118 + r() * 40, y = 500 + r() * 80; s += punto(x, y, 3.2, '#F6E28A', .95) + brillo(x, y, 13, '#F6E28A'); }
      return S(s); },

    // Reino de caramelo: casita de jengibre grande con adornos, piruletas y algodones de azúcar, camino de confites
    escena_dulce: () => { const r = azar(31), rs = ['#E98E86', '#F2D06B', '#8FB4E8', '#B9A2DE', '#A7CF8E'], PAN = pig('#B5733A'), PANO = carga(PAN, .8), GLAS = '#FBE9F1';
      const baston = (x, y1, y2, w = 9) => pincel(`M${x},${y2} V${y1 + 12} Q${x},${y1} ${x + 12},${y1}`, w, PAPEL) + trazo(`M${x - w * .6},${y2 - 10} l${w * 1.2},-8 M${x - w * .6},${y2 - 50} l${w * 1.2},-8 M${x - w * .6},${y2 - 90} l${w * 1.2},-8`, w * .55, C.rojo, { o: .9 });
      const gominola = (x, y, k, c, i) => agua(`M${x - 14 * k},${y} Q${x - 14 * k},${y - 24 * k} ${x},${y - 24 * k} Q${x + 14 * k},${y - 24 * k} ${x + 14 * k},${y}Z`, c, { f: 'l' }) + punto(x - 4 * k, y - 15 * k, 2.2 * k, PAPEL, .85);
      const piruleta = (x, y, k, c, c2, i) => pincel(`M${x},${y + 150 * k} V${y}`, 11 * k, PAPEL) + trazo(`M${x - 6 * k},${y + 140 * k} l${12 * k},-14 M${x - 6 * k},${y + 100 * k} l${12 * k},-14 M${x - 6 * k},${y + 60 * k} l${12 * k},-14`, 5 * k, C.rojo, { o: .85 })
        + agua(mancha(x, y - 10 * k, 52 * k, 52 * k, 31 + i, .05), c) + pincel(`M${x},${y - 10 * k} q${12 * k},-14 ${22 * k},0 q${-4 * k},${28 * k} ${-32 * k},${22 * k} q${-34 * k},${-8 * k} ${-20 * k},${-44 * k} q${20 * k},${-34 * k} ${56 * k},${-14 * k}`, 7 * k, c2) + brillo(x - 16 * k, y - 28 * k, 8 * k, PAPEL);
      const algodon = (x, y, k, c, i) => pincel(`M${x},${y + 130 * k} Q${x + 6 * k},${y + 60 * k} ${x},${y}`, 12 * k, PAPEL) + trazo(`M${x - 6 * k},${y + 118 * k} l${12 * k},-14 M${x - 6 * k},${y + 80 * k} l${12 * k},-14 M${x - 6 * k},${y + 42 * k} l${12 * k},-14`, 4.5 * k, c, { o: .9 })
        + agua(mancha(x - 34 * k, y - 8 * k, 40 * k, 34 * k, 11 + i, .12), c) + agua(mancha(x + 34 * k, y - 4 * k, 42 * k, 36 * k, 12 + i, .12), lava(c, .15)) + agua(mancha(x, y - 36 * k, 46 * k, 40 * k, 13 + i, .12), c) + gotas(x, y - 20 * k, 44 * k, 8, PAPEL, 3 + i, 2.6 * k);
      let s = cielo('#EBDDF2', 470) + vel('M-20,-20 H1020 V220 Q500,290 -20,220Z', '#F4C8DC', { o: .5 }) + vel(mancha(250, 280, 280, 60, 3, .2), C.violeta, { o: .3 })
        + agua(mancha(850, 80, 54, 52, 2, .05), '#F8E3A3', { f: 's' }) + [[230, 100, 1.3, 2], [600, 56, 1.1, 4], [900, 190, .9, 6]].map(([x, y, k, q]) => nubeD(x, y, k, q).replace(new RegExp(PAPEL, 'g'), GLAS)).join('')
        + agua('M-20,400 Q200,340 420,380 Q640,420 860,350 Q950,330 1020,350 L1020,620 L-20,620Z', '#D6C6EC', { o: .9 })
        + suelo(440, '#BFE3D2') + suelo(490, '#F6D3E2', .8);
      // piruletas y algodones lejanos
      s += piruleta(620, 330, .42, '#9FD6D6', '#FBF1F5', 5) + piruleta(700, 350, .36, C.rosa, '#FBF1F5', 6) + algodon(110, 280, .55, '#F2B3C4', 2) + algodon(960, 300, .5, '#BFE3D2', 4);
      // la casita de jengibre
      const X = 440;
      s += vel(mancha(X, 476, 200, 12, 4, .1), C.grisO, { o: .3 })
        + agua(`M${X - 150},476 L${X - 146},316 H${X + 146} L${X + 150},476Z`, PAN) + vel(`M${X + 40},316 H${X + 146} L${X + 150},476 H${X + 40}Z`, PANO, { o: .35 })
        + agua(`M${X - 146},316 L${X},176 L${X + 146},316Z`, PAN) + agua(mancha(X, 262, 26, 26, 3, .05), PAPEL) + pincel(`M${X},262 q8,-9 15,0 q-3,18 -20,14 q-22,-6 -14,-30 q14,-22 38,-8`, 5, C.rojo)
        + agua(`M${X - 200},322 L${X},114 L${X + 200},322 L${X + 168},334 L${X},176 L${X - 168},334Z`, PANO) + vel(`M${X},114 L${X + 200},322 L${X + 168},334 L${X},176Z`, C.troncoO, { o: .35 })
        // glaseado que gotea del tejado
        + agua(`M${X - 214},326 L${X},102 L${X + 214},326 L${X + 196},344 q-10,-4 -16,12 q-10,-16 -22,-6 q-6,-12 -18,-2 L${X},170 L${X - 158},346 q-10,-14 -20,0 q-10,-12 -18,6 q-8,-14 -22,-4Z`, PAPEL, { o: .95 })
        + [[-150, 286], [-100, 242], [-50, 190], [-10, 144], [50, 164], [100, 214], [150, 270]].map(([dx, dy], i) => gominola(X + dx, dy + 10, 1, rs[i % 5], i)).join('')
        // chimenea de galleta con humo
        + agua(`M${X + 80},210 L${X + 80},150 H${X + 124} V250Z`, PANO) + agua(`M${X + 72},150 H${X + 132} V166 H${X + 72}Z`, PAPEL, { f: 'l' }) + trazo(`M${X + 100},138 q-14,-20 2,-38 q14,-18 -2,-38`, 4, C.grisO, { o: .4 })
        // ventanas de azúcar, puerta rosa con pomo y bastones de caramelo en las esquinas
        + [-92, 92].map((dx, i) => agua(rectO(X + dx - 32, 350, 64, 64, i + 3), C.cielo) + trazo(`M${X + dx},350 V414 M${X + dx - 32},382 H${X + dx + 32}`, 3.4, PAPEL, { o: .95 }) + trazo(rectO(X + dx - 32, 350, 64, 64, i + 3), 5, PAPEL, { o: .9 })).join('')
        + agua(`M${X - 34},476 V398 Q${X},352 ${X + 34},398 V476Z`, '#F2B3C4') + vel(`M${X + 4},366 Q${X + 34},398 ${X + 34},398 V476 H${X + 4}Z`, C.rosaO, { o: .4 }) + agua(mancha(X + 20, 438, 6, 6, 8, .1), C.sol, { f: 'l' }) + trazo(`M${X - 28},396 Q${X},360 ${X + 28},396`, 4, PAPEL, { o: .95 })
        + baston(X - 150, 330, 476, 9) + baston(X + 150, 330, 476, 9)
        + [[-120, 330], [-64, 316], [-36, 460], [64, 460], [120, 322], [136, 456], [-136, 456]].map(([dx, y], i) => punto(X + dx, y, 5, rs[(i + 2) % 5], .95)).join('')
        + trazo(`M${X - 148},322 q18,12 36,0 q18,12 36,0 q18,12 36,0 q18,12 36,0 q18,12 36,0 q18,12 36,0 q18,12 36,0 q18,12 36,0`, 3.4, PAPEL, { o: .95 });
      // camino de confites que serpentea hasta el primer plano
      s += agua(`M${X - 40},476 Q${X - 20},520 ${X + 80},540 Q${X + 220},560 ${X + 280},620 L${X + 470},620 Q${X + 380},520 ${X + 160},496 Q${X + 60},486 ${X + 44},476Z`, '#FBE4EC') + vel(`M${X + 60},500 Q${X + 220},520 ${X + 300},620 L${X + 470},620 Q${X + 380},520 ${X + 160},496Z`, '#E7A8C0', { o: .3 })
        + [[X, 496, 0], [X + 40, 516, 1], [X + 100, 530, 2], [X + 170, 546, 3], [X + 250, 580, 4], [X + 330, 560, 1], [X + 410, 596, 2], [X + 220, 520, 3], [X + 300, 604, 0]].map(([x, y, i]) => agua(mancha(x, y, 9, 7, i + x, .15), rs[i % 5], { f: 'l' })).join('');
      // piruletas gigantes, algodones y gominolas en primer término
      s += piruleta(800, 150, 1.25, '#F4A6B8', '#FBF1F5', 1) + piruleta(90, 190, 1, '#9FD6D6', '#FBF1F5', 2) + algodon(920, 330, .8, '#F4BCD0', 6) + algodon(240, 350, .5, '#BFE3D2', 8);
      s += [[640, 492, 1], [720, 520, 1.2], [80, 520, 1.1], [190, 500, .9], [780, 560, 1], [960, 500, .9]].map(([x, y, k], i) => gominola(x, y, k, rs[i % 5], i)).join('')
        + gotas(500, 540, 460, 40, '#E98E86', 7, 2.4) + gotas(500, 540, 460, 30, '#8FB4E8', 8, 2.4) + gotas(500, 540, 460, 30, '#F2D06B', 9, 2.4);
      return S(s); },
    escena_dulce_frente: () => { const r = azar(31), col = ['#E98E86', '#8FB4E8', '#F2D06B', '#B9A2DE', '#A7CF8E'];
      // base rosa y crema blanca que gotea
      let s = agua('M-20,540 Q300,526 600,538 Q820,546 1020,530 L1020,620 L-20,620Z', '#F2B3C4') + vel('M-20,590 L1020,584 L1020,620 L-20,620Z', '#DE8AA5', { o: .4 });
      let d = 'M-20,488 Q60,470 120,484 Q200,498 300,480 Q400,468 500,484 Q600,498 700,478 Q800,466 900,482 Q960,490 1020,476 L1020,534';
      for (let x = 1020; x > -20; x -= 62) d += ` q-14,34 -26,0 q-12,10 -${Math.round(10 + r() * 20)},${Math.round(-4 + r() * 10)}`;
      s += agua(d + ' L-20,534Z', '#FFF8F0') + vel('M-20,500 Q500,500 1020,492 L1020,520 Q500,524 -20,520Z', C.rosa, { o: .25 });
      for (let i = 0; i < 40; i++) { const x = r() * 1000, y = 500 + r() * 80; s += trazo(`M${f1(x)},${f1(y)} l${f1(Math.cos(i) * 7)},${f1(Math.sin(i) * 7)}`, 2.6, col[i % 5], { o: .9 }); }
      // piruleta y bastones
      s += pincel('M70,590 V460', 12, '#FBF1F5') + agua(mancha(70, 420, 48, 46, 3, .06), '#9FD6D6') + pincel('M70,420 q10,-12 18,0 q-4,22 -26,18 q-26,-8 -12,-34 q22,-22 44,0', 6, PAPEL, { o: .9 })
        + pincel('M930,590 V470', 12, '#FBF1F5') + agua(mancha(930, 436, 44, 42, 4, .06), '#F2B3C4') + pincel('M930,436 q10,-12 18,0 q-4,22 -26,18 q-26,-8 -12,-34 q22,-22 44,0', 6, PAPEL, { o: .9 });
      s += [[330, 488], [560, 480], [760, 486]].map(([x, y], i) => agua(`M${x - 20},${y + 4} Q${x - 20},${y - 28} ${x},${y - 28} Q${x + 20},${y - 28} ${x + 20},${y + 4}Z`, col[i], { f: 'l' }) + vel(`M${x - 12},${y - 8} q12,-12 24,0 v8 h-24z`, PAPEL, { o: .35 })).join('');
      s += pincel('M240,560 V500 Q240,470 266,478', 12, PAPEL) + trazo('M236,550 l10,-14 M238,520 l10,-14', 4, C.rojo, { o: .85 }) + pincel('M660,566 V506 Q660,478 686,486', 12, PAPEL) + trazo('M656,556 l10,-14 M658,526 l10,-14', 4, C.rojo, { o: .85 });
      return S(s); },

    // Casita de los tres osos por dentro: chimenea con fuego vivo en el centro, mesa con tres cuencos y tres sillas
    escena_osos: () => { const r = azar(3), MAD = C.tronco, MADO = C.troncoO, PIE = '#B9AFC4';
      let s = cielo('#F6E1B0', 470) + vel('M-20,-20 H1020 V130 Q500,180 -20,130Z', C.paja, { o: .5 });
      for (let j = 0; j < 4; j++) for (let i = 0; i < 9; i++) { const x = 20 + i * 120 + (j % 2) * 60 + r() * 10, y = 40 + j * 66; s += vel(mancha(x, y, 9, 9, i + j * 9, .2), C.naranja, { o: .35 }); }
      // friso de madera, suelo de tablas y alfombra
      s += agua('M-20,318 Q300,306 560,316 Q820,326 1020,310 L1020,470 L-20,470Z', C.tierra) + vel('M-20,318 Q500,312 1020,310 L1020,334 Q500,338 -20,336Z', MADO, { o: .35 })
        + [60, 260, 460, 660, 860].map(x => trazo(`M${x},352 Q${x + 60},346 ${x + 120},352 V450 Q${x + 60},455 ${x},450Z`, 2.4, MADO, { o: .45 })).join('')
        + agua('M-20,466 Q300,452 560,464 Q820,476 1020,458 L1020,620 L-20,620Z', pig('#C98A4B'), { o: .95 }) + [500, 540, 580].map((y, i) => trazo(`M-10,${y} Q500,${y + (i - 1) * 6} 1010,${y}`, 2, MADO, { o: .35 })).join('')
        + agua(mancha(500, 546, 250, 52, 5, .05), C.rojo) + trazo(mancha(500, 546, 206, 38, 6, .05), 3.4, C.paja, { o: .9, x: ' stroke-dasharray="14 9"' });
      // ventana redonda con cortinas y estante con tarros (a la derecha, encima de la mesa)
      s += agua('M690,70 Q686,160 694,250 L738,248 Q728,150 734,70Z', C.rojo, { o: .85 }) + agua('M906,70 Q910,160 902,250 L858,248 Q870,150 864,70Z', C.rojo, { o: .85 })
        + agua(mancha(798, 150, 80, 80, 6, .04), MADO) + agua(mancha(798, 150, 66, 66, 7, .04), C.cielo) + agua('M742,200 Q756,150 776,120 Q800,180 840,200 Q810,214 770,212Z', C.hoja, { f: 'l' }) + trazo('M740,150 H858 M798,86 V214', 4, MADO, { o: .8 })
        + agua('M120,214 L270,212 L272,226 L122,228Z', MAD) + [[150, 196, 14], [190, 198, 12], [232, 200, 11]].map(([x, y, k], i) => agua(`M${x - k},${y + 14} v-${k + 8} Q${x},${y - k - 14} ${x + k},${y - k - 6} v${k + 20}Z`, C.naranja, { f: 'l' }) + agua(`M${x - k},${y - k - 4} h${2 * k} v6 h-${2 * k}Z`, C.rojo, { f: 'l' })).join('');
      // chimenea de piedra en el centro, con repisa y fuego vivo
      s += vel(mancha(500, 380, 220, 150, 9, .1), C.naranja, { o: .28 })
        + agua('M372,470 Q368,300 376,250 L624,250 Q632,300 628,470Z', PIE) + vel('M560,250 L624,250 Q632,300 628,470 H560Z', C.grisO, { o: .35 })
        + [[396, 290], [460, 282], [536, 286], [600, 290], [412, 330], [490, 322], [572, 328], [398, 372], [470, 366], [556, 370], [606, 364], [404, 420], [610, 418]].map(([x, y], i) => trazo(`M${x - 24},${y} q24,-8 48,0 v22 q-24,6 -48,0Z`, 2, C.grisO, { o: .5 })).join('')
        + agua('M340,226 H660 V256 H340Z', MAD) + vel('M340,246 H660 V256 H340Z', MADO, { o: .4 })
        + [[392, 214, 14], [430, 218, 11], [570, 218, 12]].map(([x, y, k], i) => agua(`M${x - k},${y + 8} v-${k} Q${x},${y - k - 10} ${x + k},${y - k + 2} v${k + 6}Z`, [C.naranja, C.sol, C.azul][i], { f: 'l' })).join('') + agua('M512,226 V190 H526 V226Z', PAPEL, { f: 'l' }) + agua('M514,190 Q519,172 524,190Z', C.naranja, { f: 'l' })
        + agua('M420,470 V330 Q420,292 500,288 Q580,292 580,330 V470Z', '#5B3E30')
        + vel(mancha(500, 430, 80, 60, 4, .2), C.naranja, { o: .7 })
        + pincel('M436,466 L548,444', 12, MADO) + pincel('M456,444 L564,468', 11, MAD)
        + agua('M446,448 Q430,404 462,364 Q468,402 486,392 Q484,350 508,314 Q540,372 536,410 Q556,392 550,372 Q580,404 556,448Z', carga(C.rojo, .85))
        + agua('M464,448 Q454,414 480,384 Q486,414 500,404 Q504,376 520,356 Q544,400 540,448Z', C.naranja)
        + agua('M486,448 Q480,424 498,404 Q508,424 516,418 Q526,432 518,448Z', C.sol)
        + trazo('M448,360 q-6,-16 4,-28 M560,350 q10,-12 4,-30 M508,300 q-4,-16 4,-26', 2.4, C.naranja, { o: .85 }) + punto(452, 330, 2.6, C.sol, .95) + punto(566, 318, 2.4, C.sol, .95) + punto(480, 290, 2.2, C.naranja, .95) + punto(534, 284, 2, C.sol, .95)
        + agua('M372,470 H628 V484 H372Z', PIE, { f: 'l' });
      // mesa con tres cuencos de gachas (grande, mediano y pequeño)
      s += agua('M672,396 Q800,384 940,396 L942,414 Q800,424 670,414Z', MAD) + pincel('M690,414 V500 M920,414 V500', 11, MAD) + trazo('M700,420 L910,420', 2, MADO, { o: .5 });
      [[730, 30, 22, C.azul], [810, 24, 18, C.hoja], [880, 18, 14, C.rojo]].forEach(([x, rx, h, c], i) => { s += agua(`M${x - rx},${392 - h * .5} Q${x - rx + 4},${392 + 8} ${x},${392 + 10} Q${x + rx - 4},${392 + 8} ${x + rx},${392 - h * .5}Z`, c) + agua(mancha(x, 392 - h * .5, rx, 6, i + 4, .08), PAPEL) + vel(mancha(x, 392 - h * .5, rx - 6, 4, i + 8, .1), C.paja, { o: .7 }) + trazo(`M${x - 6},${392 - h - 4} q-6,-12 0,-22 M${x + 6},${392 - h - 4} q6,-12 0,-22`, 2, C.grisO, { o: .5 }); });
      // tres sillas de madera: grande, mediana y pequeña
      [[130, 1, C.rojo], [236, .78, C.azul], [316, .58, C.hoja]].forEach(([x, k, c], i) => { const y = 468, sy = y - 78 * k, w = 46 * k;
        s += pincel(`M${x - w + 4},${sy} V${y} M${x + w - 4},${sy} V${y}`, 9 * k, MAD) + pincel(`M${x - w + 4},${sy} V${sy - 120 * k} M${x + w - 4},${sy} V${sy - 120 * k}`, 9 * k, MAD)
          + agua(`M${x - w},${sy - 118 * k} Q${x},${sy - 134 * k} ${x + w},${sy - 118 * k} V${sy - 62 * k} Q${x},${sy - 72 * k} ${x - w},${sy - 62 * k}Z`, MAD) + agua(mancha(x, sy - 94 * k, 12 * k, 12 * k, i + 3, .15), c, { f: 'l' }) + trazo(`M${x - w * .6},${sy - 70 * k} V${sy - 10 * k} M${x + w * .6},${sy - 70 * k} V${sy - 10 * k}`, 3 * k, MADO, { o: .5 })
          + agua(`M${x - w - 8 * k},${sy - 6 * k} Q${x},${sy - 16 * k} ${x + w + 8 * k},${sy - 6 * k} V${sy + 14 * k} Q${x},${sy + 6 * k} ${x - w - 8 * k},${sy + 14 * k}Z`, c); });
      return S(s); },
    escena_osos_frente: () => { const r = azar(41);
      let s = agua('M-20,486 Q250,470 500,482 Q760,494 1020,474 L1020,620 L-20,620Z', '#F4E8EA') + vel('M-20,486 Q250,470 500,482 Q760,494 1020,474 L1020,500 Q760,520 500,508 Q250,498 -20,512Z', C.rosa, { o: .35 });
      for (let j = 0; j < 4; j++) for (let i = 0; i < 18; i++) if ((i + j) % 2 === 0) s += vel(mancha(30 + i * 58 + j * 8, 512 + j * 34, 26, 15, i + j * 20 + 1, .2, 4, .78), C.rojoO, { o: .42 });
      // sartenes y tarro
      const sarten = (x, y, c, k) => agua(mancha(x, y, 56 * k, 18 * k, x, .08), c) + vel(mancha(x, y + 3, 44 * k, 10 * k, x + 1, .1), PAPEL, { o: .5 }) + pincel(`M${x + 40 * k},${y - 6} L${x + 82 * k},${y - 34 * k}`, 6, C.troncoO) + trazo(`M${x - 10},${y - 24} q-6,-14 4,-24 M${x + 8},${y - 24} q-6,-14 4,-24`, 2, C.gris, { o: .7 });
      s += sarten(110, 482, C.azul, 1) + sarten(300, 478, C.hoja, 1) + sarten(870, 492, C.rosa, .8);
      s += agua('M636,480 Q630,436 640,426 L690,426 Q700,440 694,482Z', C.naranja) + agua(mancha(664, 456, 18, 12, 4, .1), PAPEL, { f: 'l' }) + agua('M632,426 Q664,412 696,426 L694,436 Q664,444 636,436Z', C.azul) + pincel('M680,420 L700,392', 5, C.troncoO);
      s += agua(mancha(965, 470, 40, 26, 9, .12), PAPEL) + vel(mancha(970, 480, 30, 14, 10, .2), C.grisO, { o: .3 });
      return S(s); },

    // ============================== OGRO ==============================
    escena_ogro: () => { const r = azar(7);
      let s = agua('M-20,-20 H1020 V470 H-20Z', '#C9C4D8', { f: 's', o: 1 }) + vel('M-20,-20 H1020 V150 Q500,200 -20,150Z', C.grisO, { o: .35 });
      // junturas de las piedras: líneas de pincel flojas
      for (let j = 0; j < 7; j++) { const y = 50 + j * 62; s += trazo(`M-10,${y} Q250,${y - 8} 500,${y + 4} T1010,${y - 4}`, 2.2, C.grisO, { o: .55 }); for (let i = 0; i < 9; i++) { const x = (i * 118 + (j % 2) * 59 + r() * 20); s += trazo(`M${f1(x)},${y} v${f1(60 + r() * 6)}`, 2.2, C.grisO, { o: .5 }); } }
      for (let i = 0; i < 16; i++) s += vel(mancha(r() * 1000, 40 + r() * 400, 50, 24, i + 2, .2), i % 2 ? C.violeta : C.grisO, { o: .2 });
      // puerta en arco
      s += agua('M492,470 L492,200 Q500,90 600,78 Q700,90 708,200 L708,470Z', C.gris) + agua('M520,470 L520,208 Q528,124 600,112 Q672,124 680,208 L680,470Z', C.tronco) + vel('M600,112 Q672,124 680,208 L680,470 L620,470 Q640,300 600,112Z', C.troncoO, { o: .4 })
        + trazo('M560,120 V470 M600,112 V470 M640,120 V470', 2, C.troncoO, { o: .5 }) + pincel('M522,220 H678 M522,380 H678', 12, C.negro, { o: .75 }) + agua(mancha(652, 300, 17, 17, 6, .06), C.negro) + trazo('M636,300 a16,16 0 1 0 32,0', 4, C.grisO, { o: .8 });
      // antorchas
      [[430, 190], [800, 180]].forEach(([x, y], i) => { s += agua(`M${x - 12},${y + 64} L${x - 18},${y + 30} L${x + 18},${y + 30} L${x + 12},${y + 64}Z`, C.tronco) + agua(`M${x - 18},${y + 30} Q${x - 24},${y - 10} ${x},${y - 48} Q${x + 26},${y - 10} ${x + 18},${y + 30}Z`, C.naranja) + agua(`M${x - 8},${y + 30} Q${x - 10},${y} ${x},${y - 22} Q${x + 12},${y} ${x + 8},${y + 30}Z`, C.sol) + brillo(x, y - 6, 56, C.sol); });
      // silla grande a la izquierda
      s += agua('M60,30 Q58,10 70,0 L250,0 L252,60 L70,66Z', C.tronco) + agua('M84,64 L100,360 L132,360 L128,64Z', C.tronco) + agua('M210,64 L214,360 L246,360 L232,64Z', C.tronco)
        + agua('M44,246 Q150,232 336,248 L340,284 Q190,296 46,286Z', C.tronco) + agua('M70,226 Q150,208 310,226 Q320,246 300,254 Q160,246 76,256Z', C.violeta) + vel('M80,246 Q190,238 304,250 L300,254 Q160,246 76,256Z', carga(C.violeta, .75), { o: .5 })
        + agua('M52,284 L60,380 L100,380 L96,288Z', C.troncoO) + agua('M284,286 L290,380 L330,380 L328,290Z', C.troncoO) + trazo('M90,36 L120,20 M180,30 L240,44', 2.4, C.troncoO, { o: .6 });
      // cuchara colgada
      s += trazo('M408,0 Q412,70 408,130', 4, C.troncoO, { o: .8 }) + agua(mancha(410, 176, 28, 42, 8, .06), C.grisO) + vel(mancha(414, 180, 16, 26, 9, .1), PAPEL, { o: .5 });
      // suelo de losas
      s += agua('M-20,466 Q300,448 560,462 Q820,476 1020,452 L1020,620 L-20,620Z', '#B8B2C8') + vel('M-20,466 Q300,448 560,462 Q820,476 1020,452 L1020,490 Q500,500 -20,490Z', C.grisO, { o: .3 });
      return S(s); },

    escena_ogro_frente: () => { const r = azar(51);
      let s = agua('M-20,488 Q250,470 500,484 Q760,496 1020,476 L1020,620 L-20,620Z', '#B2ACC4') + vel('M-20,556 Q500,544 1020,552 L1020,620 L-20,620Z', C.grisO, { o: .4 });
      for (let i = 0; i < 6; i++) s += trazo(`M${-20 + i * 190},${498 + (i % 2) * 6} q60,-6 120,2`, 2.4, C.grisO, { o: .5 }) + trazo(`M${40 + i * 180},${540} v54`, 2.4, C.grisO, { o: .45 });
      // huesos
      [[140, 530, -12], [260, 548, 18], [350, 520, 8]].forEach(([x, y, a], i) => { s += agua(`M${x - 34},${y} Q${x},${y - 6} ${x + 34},${y} M${x - 34},${y}`, PAPEL, { o: 0 }) + pincel(`M${x - 28},${y} L${x + 28},${y}`, 8, i === 1 ? C.gris : PAPEL, { t: `rotate(${a} ${x} ${y})`, f: 'l' }) + agua(mancha(x - 32, y - 2, 9, 9, i + 2, .15), i === 1 ? C.gris : PAPEL, { f: 'l', t: `rotate(${a} ${x} ${y})` }) + agua(mancha(x + 32, y + 2, 9, 9, i + 5, .15), i === 1 ? C.gris : PAPEL, { f: 'l', t: `rotate(${a} ${x} ${y})` }) + vel(mancha(x, y + 6, 36, 5, i, .1), C.grisO, { o: .4 }); });
      // caldero
      s += vel(mancha(830, 590, 170, 14, 4, .1), C.grisO, { o: .4 }) + agua('M690,420 Q684,520 730,574 Q830,600 934,572 Q984,520 970,420Z', '#6E6286') + vel('M900,430 Q984,500 930,574 Q880,590 860,586 Q930,520 900,430Z', C.negro, { o: .6 }) + vel('M720,450 Q712,500 740,540', PAPEL, { o: .3 })
        + agua(mancha(830, 420, 140, 26, 8, .05), '#4E4562') + agua(mancha(830, 424, 124, 18, 9, .05), '#A7CF70') + [[790, 424, 8], [850, 418, 6], [880, 428, 7]].map(([x, y, rr], i) => agua(mancha(x, y, rr, rr * .7, i, .1), '#D3E8A6', { f: 'l' })).join('')
        + pincel('M820,418 L770,350', 7, C.naranja) + trazo('M770,350 l-10,-12 M770,350 l8,-14', 2.4, C.hojaO) + trazo('M800,380 q-8,-14 6,-26 q8,-14 -4,-26 M870,380 q-8,-14 6,-26 q8,-14 -4,-26', 2.4, C.grisO, { o: .65 })
        + pincel('M880,420 L930,360', 8, PAPEL) + agua(mancha(936, 354, 9, 9, 3, .15), PAPEL, { f: 'l' }) + agua(mancha(924, 366, 9, 9, 4, .15), PAPEL, { f: 'l' })
        + agua('M730,584 q10,14 24,0 M880,586 q12,16 26,0', C.naranja, { o: 0 }) + agua('M740,592 Q770,570 790,596 Z M860,596 Q890,572 920,592 Z', C.naranja, { f: 'l' });
      return S(s); },

    // Dormitorio de la abuela: papel de flores, ventana con cortinas, mecedora, cama con colcha de retales y alfombra
    escena_abuela: () => { const r = azar(8), MAD = C.tronco, MADO = C.troncoO;
      let s = cielo('#F8E5EA', 470);
      // papel pintado de flores y hojitas, en filas desencajadas
      for (let j = 0; j < 4; j++) for (let i = 0; i < 9; i++) { const x = 40 + i * 118 + (j % 2) * 59 + r() * 12, y = 44 + j * 68 + r() * 8; s += flor(x, y, [C.rosa, C.rosaO, PAPEL, C.rosa][(i + j) % 4], 7) + trazo(`M${x + 12},${y + 10} q8,6 14,-2 M${x - 12},${y + 10} q-8,6 -14,-2`, 1.8, C.hojaO, { o: .6 }); }
      // friso verde de madera
      s += agua('M-20,306 Q300,296 560,304 Q820,312 1020,298 L1020,470 L-20,470Z', '#CDE6C6') + vel('M-20,306 Q500,300 1020,298 L1020,324 Q500,328 -20,326Z', C.hojaO, { o: .4 })
        + [60, 300, 540, 780].map(x => trazo(`M${x},350 Q${x + 90},344 ${x + 180},350 V440 Q${x + 90},446 ${x},440Z`, 2.4, C.hojaO, { o: .45 })).join('');
      // suelo de tablas y alfombra ovalada rosa
      s += agua('M-20,466 Q300,452 560,464 Q820,476 1020,458 L1020,620 L-20,620Z', '#E6C79E') + [500, 540, 580].map((y, i) => trazo(`M-10,${y} Q500,${y + (i - 1) * 6} 1010,${y}`, 2, MADO, { o: .3 })).join('')
        + agua(mancha(420, 548, 250, 54, 5, .05), C.rosa) + agua(mancha(420, 548, 196, 38, 6, .05), PAPEL, { o: .8 }) + trazo(mancha(420, 548, 150, 26, 7, .05), 4, C.rosaO, { o: .6 }) + agua(mancha(420, 548, 86, 15, 8, .06), C.rosaO, { o: .6 });
      // ventana con cortinas de encaje atadas
      s += agua(rectO(332, 70, 190, 220, 3, 3), MADO) + agua(rectO(344, 82, 166, 196, 4, 2), C.cielo) + vel('M344,82 H510 V150 Q430,170 344,150Z', PAPEL, { o: .5 })
        + agua(mancha(470, 236, 34, 28, 3, .1), C.hoja, { f: 'l' }) + agua(mancha(380, 250, 40, 24, 5, .1), C.hojaO, { f: 'l' }) + agua(mancha(380, 124, 15, 15, 2, .05), C.sol, { f: 's' })
        + pincel('M427,82 V278 M344,180 H510', 6, PAPEL) + agua(rectO(320, 280, 214, 18, 6, 2), MAD)
        + pincel('M300,70 H554', 6, C.sol)
        + agua('M310,70 Q360,76 352,160 Q346,230 326,300 L296,300 Q312,200 310,70Z', C.rosa) + agua('M544,70 Q494,76 502,160 Q508,230 528,300 L558,300 Q542,200 544,70Z', C.rosa)
        + vel('M310,70 Q330,74 352,100 L326,300 L296,300Z', C.rosaO, { o: .3 }) + pincel('M310,168 Q330,176 352,166 M544,168 Q524,176 502,166', 6, PAPEL)
        + trazo('M316,90 q4,60 -2,120 M338,90 q4,60 -2,120 M538,90 q-4,60 2,120 M516,90 q-4,60 2,120', 1.6, C.rosaO, { o: .5 });
      // cuadros: un óvalo con flores y un paisaje
      s += agua(mancha(210, 150, 46, 60, 3, .04), MAD) + agua(mancha(210, 150, 36, 50, 4, .04), '#FBEFD8') + flor(210, 138, C.rosaO, 9) + trazo('M210,150 V186 M192,172 q18,-8 36,0', 2.4, C.hojaO, { o: .9 }) + agua('M198,186 h24 v10 h-24Z', C.azul, { f: 'l' })
        + agua(rectO(620, 92, 150, 100, 7, 2), MADO) + agua(rectO(630, 102, 130, 80, 8, 2), C.cielo) + agua('M630,160 Q680,128 760,152 V182 H630Z', C.prado) + agua(mancha(742, 124, 9, 9, 3, .1), C.sol, { f: 'l' }) + agua('M676,162 l12,-14 l12,14Z', C.rojo, { f: 'l' });
      // mecedora con cojín, mantita y cesta de lana
      s += pincel('M104,490 Q210,522 322,486', 9, MAD) + pincel('M150,416 L136,488 M296,412 L304,484', 8, MAD)
        + pincel('M156,420 L126,238 M196,420 L172,236', 9, MAD) + pincel('M118,238 Q150,226 184,234', 8, MAD) + pincel('M142,286 H190 M148,330 H198 M152,372 H202', 5, MAD)
        + agua('M138,410 Q220,396 306,408 L300,428 Q214,438 144,432Z', MAD) + agua('M150,398 Q222,384 296,398 L292,414 Q220,424 154,416Z', C.rojo) + punto(184, 404, 3.5, PAPEL, .9) + punto(226, 400, 3.5, PAPEL, .9) + punto(268, 402, 3.5, PAPEL, .9)
        + pincel('M300,414 Q320,440 304,470', 7, MAD) + agua('M150,300 Q176,330 186,380 Q160,392 140,370Z', C.cielo, { o: .9 }) + trazo('M156,320 q14,10 22,40', 2, PAPEL, { o: .8 })
        + agua('M356,470 Q344,438 368,432 H432 Q456,438 444,470Z', C.paja) + trazo('M360,448 H442 M362,460 H440', 2, C.pajaO, { o: .6 }) + agua(mancha(380, 430, 15, 14, 4, .1), C.rosaO, { f: 'l' }) + agua(mancha(416, 428, 14, 13, 5, .1), C.azul, { f: 'l' }) + trazo('M396,432 L420,388 M406,432 L440,392', 2.4, C.grisO, { o: .9 }) + trazo('M380,428 q10,-26 30,-26', 1.6, C.rosaO, { o: .7 });
      // cama: cabecero, almohada, colcha de retales
      s += pincel('M640,456 V396 M860,456 V396', 10, MAD) + agua('M852,470 V282 Q852,250 888,246 Q926,250 926,282 V470Z', MAD) + vel('M900,252 Q926,256 926,282 V470 H900Z', MADO, { o: .4 })
        + agua('M620,404 H880 V456 H620Z', C.crema) + agua(mancha(842, 380, 54, 24, 3, .06), PAPEL) + vel(mancha(852, 388, 38, 12, 4, .1), C.cieloO, { o: .4 })
        + agua('M616,390 Q740,372 864,390 L872,470 Q740,482 612,470Z', C.sol, { o: .9 });
      const col = [C.rosa, C.cielo, C.sol, C.hoja, C.violeta, C.naranja]; for (let j = 0; j < 2; j++) for (let i = 0; i < 6; i++) s += agua(rectO(626 + i * 40, 396 + j * 36, 38, 34, i + j * 6 + 3, 1.6), col[(i + j * 2) % 6], { f: 'l', o: .95 });
      s += trazo('M618,470 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0 q10,10 20,0', 2.6, C.rosaO, { o: .8 }) + pincel('M622,470 V500 M850,470 V500', 8, MAD)
        + agua(rectO(930, 410, 60, 60, 9, 2), MAD) + pincel('M940,470 V500 M980,470 V500', 6, MAD) + trazo('M936,436 h48', 2, MADO, { o: .6 }) + punto(960, 424, 3, C.sol, .95) + pincel('M962,410 V372', 5, C.rosaO) + agua('M934,372 Q962,330 990,372Z', C.rosa);
      return S(s); },
    escena_abuela_frente: () => { const r = azar(61);
      let s = agua('M-20,490 Q250,470 500,484 Q760,498 1020,474 L1020,620 L-20,620Z', '#F0C3CF') + vel('M-20,560 Q500,548 1020,556 L1020,620 L-20,620Z', C.rosaO, { o: .4 });
      for (let i = 0; i < 20; i++) { const x = 20 + i * 52 + (i % 2) * 14, y = 520 + (i % 3) * 30; s += flor(x, y, i % 2 ? C.rojo : PAPEL, 7); }
      // gato dormido
      s += vel(mancha(150, 520, 70, 8, 3, .1), C.grisO, { o: .35 }) + agua('M80,512 Q90,466 140,466 Q196,466 206,510 Q150,524 80,512Z', C.naranja) + agua(mancha(206, 488, 22, 20, 4, .1), C.naranja) + agua('M194,470 L196,452 L210,466Z M218,470 L224,452 L230,472Z', C.naranja, { f: 'l' }) + vel('M96,500 Q150,486 196,500 L196,512 Q150,522 96,512Z', C.pajaO, { o: .35 })
        + trazo('M208,492 q4,3 8,0 M222,492 q4,3 8,0', 1.8) + punto(216, 500, 2, C.rosaO, .9) + trazo('M80,508 Q56,520 70,534', 6, C.naranja, { o: .9 });
      // tapetitos de ganchillo y ovillo
      s += agua(mancha(500, 540, 46, 22, 5, .1), PAPEL) + agua(mancha(820, 540, 46, 22, 6, .1), PAPEL) + [[484, 536], [500, 546], [514, 534], [806, 538], [822, 548], [836, 536]].map(([x, y]) => punto(x, y, 3, C.rosa, .8)).join('')
        + agua(mancha(900, 530, 30, 28, 7, .08), C.violeta) + trazo('M880,520 q20,-8 40,6 M876,534 q24,-4 48,8', 2, carga(C.violeta, .7), { o: .7 }) + trazo('M902,504 Q930,470 940,450 M912,508 Q946,486 960,470', 3, C.LINEA, { o: .6 }) + trazo('M920,556 Q960,580 990,566', 3, C.violeta, { o: .85 });
      return S(s); },
    // ============================== ESTANQUE ==============================
    escena_estanque: () => {
      let s = cielo('#C9E2F4', 470) + vel('M-20,-20 H1020 V180 Q500,240 -20,180Z', C.cieloO, { o: .4 }) + nubeD(280, 90, 1.3, 2) + nubeD(640, 70, 1.5, 4) + nubeD(480, 170, .7, 6)
        + agua('M-20,330 Q120,290 240,320 Q360,286 480,318 Q620,290 760,318 Q900,296 1020,320 L1020,400 L-20,400Z', lava(C.prado, .2), { o: .9 })
        + agua('M-20,360 Q300,340 520,352 Q780,362 1020,344 L1020,500 L-20,500Z', C.cielo) + vel('M-20,380 Q500,370 1020,380 L1020,420 Q500,440 -20,420Z', C.cieloO, { o: .35 })
        + trazo('M240,400 q40,-6 80,0 M640,420 q50,-6 100,0 M440,380 q30,-4 60,0', 2.2, PAPEL, { o: .9 });
      [[300, 430, 1], [470, 410, .7], [680, 440, 1.1], [820, 404, .6]].forEach(([x, y, k], i) => { s += agua(mancha(x, y, 52 * k, 16 * k, i + 4, .1), C.hoja) + vel(mancha(x + 6, y + 3, 36 * k, 8 * k, i + 9, .1), C.hojaO, { o: .5 }); });
      s += agua(liso([[330, 410], [344, 392], [360, 404], [372, 388], [366, 420], [340, 426]]), C.rosa) + agua(liso([[700, 420], [716, 400], [730, 414], [742, 398], [738, 430], [712, 434]]), C.rosa) + punto(352, 410, 3.4, C.sol, .95) + punto(722, 418, 3.4, C.sol, .95);
      // sauces
      [[90, 1], [920, 1.05]].forEach(([x, k], i) => {
        s += agua(`M${x - 14},470 Q${x - 8},330 ${x - 12},250 L${x + 16},250 Q${x + 10},340 ${x + 18},470Z`, C.tronco) + agua(mancha(x, 250, 120 * k, 90 * k, 11 + i, .08), C.hoja) + vel(mancha(x + 30, 290, 90, 70, 12 + i, .12), C.hojaO, { o: .35 });
        for (let j = -4; j <= 4; j++) s += trazo(`M${x + j * 24},${300 - Math.abs(j) * 6} q${j * 2},60 ${-j * 2},${120 + (j % 2) * 20}`, 3, C.hojaO, { o: .7 });
      });
      s += suelo(470, C.prado) + suelo(520, C.hoja, .8);
      return S(s); },

    escena_estanque_frente: () => { const r = azar(71);
      let s = agua('M-20,496 Q250,472 500,490 Q760,508 1020,480 L1020,620 L-20,620Z', C.hoja) + vel('M-20,552 Q500,540 1020,548 L1020,620 L-20,620Z', C.hojaO, { o: .45 });
      for (let i = 0; i < 40; i++) { const x = i * 25 + r() * 16, h = 40 + r() * 60; s += trazo(`M${f1(x)},600 Q${f1(x + (r() - .5) * 16)},${f1(565 - h * .4)} ${f1(x + (r() - .5) * 34)},${f1(570 - h)}`, 4 + r() * 3, [carga(C.hojaO, .62), carga(C.hojaO, .8), C.hojaO][i % 3], { o: .85 }); }
      [[60, 1], [150, .8], [880, 1], [950, .9]].forEach(([x, k], i) => { s += trazo(`M${x},600 Q${x + 8},${540 - 30 * k} ${x + 4},${470 - 30 * k}`, 3.4, carga(C.hojaO, .55), { o: .9 }) + agua(`M${x - 8},${478 - 30 * k} Q${x - 10},${450 - 30 * k} ${x + 4},${440 - 30 * k} Q${x + 18},${450 - 30 * k} ${x + 14},${480 - 30 * k}Z`, C.troncoO, { f: 'l' }); });
      s += [[260, 540], [500, 560], [720, 546]].map(([x, y], i) => trazo(`M${x},${y + 40} Q${x + 4},${y + 20} ${x},${y}`, 2.6, carga(C.hojaO, .7)) + flor(x, y, [PAPEL, C.rosa, C.violeta][i], 9)).join('');
      return S(s); },

    // ============================== CASITA ==============================
    escena_casita: () => { const r = azar(12);
      let s = agua('M-20,-20 H1020 V480 H-20Z', '#E6C79E', { f: 's', o: 1 }) + vel('M-20,-20 H1020 V120 Q500,170 -20,120Z', C.tronco, { o: .3 });
      for (let i = 0; i < 12; i++) { const x = i * 88 + r() * 20; s += trazo(`M${f1(x)},-10 Q${f1(x + 8)},240 ${f1(x - 4)},470`, 2.6, C.troncoO, { o: .45 }); s += vel(`M${f1(x)},-10 L${f1(x + 50)},-10 L${f1(x + 44)},470 L${f1(x - 6)},470Z`, C.troncoO, { o: i % 2 ? .08 : .16 }); }
      // chimenea
      s += agua('M120,-10 L330,-10 Q340,200 350,420 L100,420 Q116,200 120,-10Z', lava(C.tierra, .15)) + [[170, 40], [260, 50], [150, 130], [240, 140], [320, 150], [180, 230], [270, 240]].map(([x, y], i) => vel(mancha(x, y, 30, 16, 30 + i, .2), C.grisO, { o: .45 })).join('')
        + agua('M90,408 L370,408 L372,432 L88,432Z', C.tronco) + agua('M150,440 L150,330 Q220,290 290,330 L290,440Z', C.negro) + agua('M180,440 Q176,400 206,376 Q214,400 232,394 Q240,364 252,350 Q276,400 262,440Z', C.naranja) + agua('M204,440 Q204,414 224,400 Q238,420 240,440Z', C.sol)
        + agua(mancha(180, 392, 12, 14, 5, .1), C.rojo, { f: 'l' });
      // ventana con postigos
      s += agua('M520,150 L700,150 L704,310 L516,310Z', C.troncoO) + agua('M534,164 L688,164 L690,296 L532,296Z', C.cielo) + agua('M532,250 Q600,220 690,244 L690,296 L532,296Z', C.prado, { f: 'l' }) + trazo('M610,164 V296 M532,230 H690', 4, C.tronco, { o: .9 })
        + agua('M470,150 L516,156 L516,312 L470,306Z', '#A8CDC6') + agua('M704,156 L750,150 L750,306 L704,312Z', '#A8CDC6') + agua(mancha(612, 292, 22, 14, 4, .1), C.rojo, { f: 'l' }) + trazo('M520,320 H700', 6, C.tronco);
      // estante con platos
      s += agua('M790,200 L930,198 L932,210 L792,212Z', C.tronco) + agua(mancha(830, 180, 20, 22, 6, .06), PAPEL) + agua(mancha(880, 182, 20, 22, 7, .06), PAPEL) + trazo('M820,180 a10,10 0 1 0 20,0 M870,182 a10,10 0 1 0 20,0', 2.4, C.azul, { o: .85 }) + agua('M906,166 h22 v34 h-22Z', C.paja, { f: 'l' });
      // hierbas colgadas
      [[430, 60], [760, 40], [900, 60]].forEach(([x, y], i) => { s += trazo(`M${x},0 V${y}`, 2, C.troncoO) + agua(`M${x - 10},${y} Q${x},${y + 70} ${x + 10},${y}Z`, i % 2 ? C.violeta : C.hoja, { f: 'l' }); });
      // suelo de tablas
      s += agua('M-20,466 Q300,450 560,462 Q820,476 1020,452 L1020,620 L-20,620Z', C.tronco, { o: .9 }) + vel('M-20,466 Q300,450 560,462 Q820,476 1020,452 L1020,490 Q500,500 -20,490Z', C.troncoO, { o: .3 })
        + trazo('M-20,520 Q500,506 1020,516 M-20,570 Q500,556 1020,566', 2.4, C.troncoO, { o: .5 }) + trazo('M300,466 L270,620 M640,462 L650,620 M900,456 L960,620', 2.2, C.troncoO, { o: .45 });
      return S(s); },

    escena_casita_frente: () => { const r = azar(81);
      let s = agua('M-20,490 Q250,474 500,486 Q760,498 1020,478 L1020,620 L-20,620Z', C.tronco) + vel('M-20,556 Q500,544 1020,552 L1020,620 L-20,620Z', C.troncoO, { o: .4 }) + trazo('M-20,540 Q500,528 1020,536 M120,490 L100,620 M700,490 L720,620', 2.4, C.troncoO, { o: .5 });
      // cesta de patatas a la izquierda
      s += `<g transform="translate(-6 96) scale(.8)">` + agua('M-10,520 Q-4,430 60,424 Q150,420 210,430 Q236,470 222,560 Q120,590 -10,580Z', C.paja) + vel('M130,440 Q220,470 216,560 Q170,580 130,580Z', C.pajaO, { o: .4 }) + trazo('M0,470 Q100,486 220,466 M0,510 Q100,526 224,508 M10,550 Q110,566 220,550', 2.4, C.pajaO, { o: .8 })
        + [[40, 420, 24], [96, 410, 26], [150, 420, 22]].map(([x, y, rr], i) => agua(mancha(x, y, rr, rr * .8, i + 2, .12), C.tierra, { f: 'l' })).join('') + pincel('M10,430 Q90,340 210,430', 8, C.tronco) + `</g>`;
      // taburete
      s += agua('M520,516 Q556,498 600,516 L596,530 Q556,544 520,530Z', C.tronco) + trazo('M528,530 L520,570 M590,530 L598,570', 6, C.troncoO);
      // troncos apilados a la derecha
      [[900, 510], [960, 508], [850, 560], [920, 562], [980, 560], [880, 600]].forEach(([x, y], i) => { s += agua(mancha(x, y, 34, 32, 60 + i, .08), C.tierra) + agua(mancha(x, y, 20, 19, 70 + i, .08), C.crema, { f: 'l' }) + trazo(`M${x - 8},${y} q8,-10 16,0`, 1.8, C.pajaO, { o: .8 }); });
      return S(s); },

    // ============================== GRANJA ==============================
    escena_granja: () => {
      let s = cielo('#C9E2F4', 470) + vel('M-20,-20 H1020 V200 Q500,250 -20,200Z', C.cieloO, { o: .4 }) + agua(mancha(790, 70, 54, 52, 3, .06), C.sol, { f: 's' }) + nubeD(200, 100, 1.2, 2) + nubeD(500, 56, .9, 5) + nubeD(110, 190, .7, 7)
        + agua('M-20,300 Q250,240 520,290 Q780,340 1020,270 L1020,500 L-20,500Z', C.prado) + vel('M300,300 L420,300 L380,420 L200,420Z M560,320 L700,330 L640,420 L480,420Z', C.hoja, { o: .3 })
        + agua('M-20,380 Q300,350 560,372 Q820,392 1020,364 L1020,620 L-20,620Z', C.hoja);
      // molino
      s += agua('M268,290 L290,214 L312,290Z', PAPEL) + vel('M290,214 L312,290 L296,290Z', C.grisO, { o: .4 }) + pincel('M290,214 L246,170 M290,214 L336,174 M290,214 L248,258 M290,214 L336,254', 8, '#E8E4EE') + trazo('M290,214 L246,170 M290,214 L336,174', 2, C.grisO, { o: .6 });
      // granero
      s += agua('M580,380 L584,230 Q640,160 720,190 Q790,170 836,232 L840,380Z', C.rojo) + vel('M720,190 Q790,170 836,232 L840,380 L740,380Z', C.rojoO, { o: .35 }) + agua('M572,240 Q640,150 706,170 Q786,150 848,240 Q790,200 710,200 Q636,196 572,240Z', C.negro, { o: .85 })
        + agua('M640,380 L640,280 L760,280 L760,380Z', PAPEL, { o: .9 }) + trazo('M640,280 L760,380 M760,280 L640,380 M700,280 V380', 5, C.rojoO) + agua(mancha(700, 226, 24, 20, 5, .1), PAPEL) + trazo('M690,238 q10,-16 22,0', 3, C.pajaO) + agua('M588,310 h34 v30 h-34Z', C.azul, { f: 'l' }) + agua('M778,310 h34 v30 h-34Z', C.azul, { f: 'l' });
      // silo
      s += agua('M870,380 L872,180 Q926,150 980,180 L982,380Z', C.gris) + vel('M930,170 Q976,180 982,380 L920,380Z', C.grisO, { o: .4 }) + trazo('M876,230 H978 M876,290 H978', 2.4, C.grisO, { o: .6 });
      // gallinero, pajar
      s += agua('M120,340 L128,290 L226,290 L232,340Z', C.paja) + agua('M108,296 L176,250 L244,296Z', C.rojo) + agua(mancha(166, 322, 12, 14, 8, .1), C.negro, { f: 'l' })
        + agua(mancha(70, 340, 66, 44, 9, .08), C.paja) + trazo('M20,340 q40,-30 100,-10 M30,360 q40,-20 90,-6', 2.4, C.pajaO, { o: .7 });
      // pollitos
      s += agua(mancha(380, 376, 12, 10, 3, .1), PAPEL, { f: 'l' }) + punto(388, 372, 1.8, C.negro, .9) + agua(mancha(440, 380, 11, 9, 4, .1), C.naranja, { f: 'l' });
      return S(s); },

    escena_granja_frente: () => { const r = azar(91);
      let s = agua('M-20,500 Q250,484 500,496 Q760,508 1020,486 L1020,620 L-20,620Z', C.hoja) + vel('M-20,556 Q500,544 1020,552 L1020,620 L-20,620Z', C.hojaO, { o: .45 });
      // valla de madera
      for (let i = 0; i < 16; i++) { const x = i * 66 - 10 + r() * 8; s += agua(`M${x},520 L${x + 4},470 L${x + 22},466 L${x + 30},520 Z`, C.tronco, { f: 'l' }); }
      s += trazo('M-20,490 Q500,478 1020,486 M-20,512 Q500,502 1020,508', 8, C.troncoO, { o: .85 }) + trazo('M-20,486 Q500,474 1020,482', 2.4, C.tronco, { o: .8 });
      for (let i = 0; i < 40; i++) { const x = i * 26 + r() * 14, h = 30 + r() * 40; s += trazo(`M${f1(x)},600 Q${f1(x + (r() - .5) * 14)},${f1(570 - h * .4)} ${f1(x + (r() - .5) * 30)},${f1(575 - h)}`, 4 + r() * 3, [carga(C.hojaO, .62), carga(C.hojaO, .8), C.hojaO][i % 3], { o: .85 }); }
      // girasol
      s += trazo('M70,600 Q64,520 74,440', 5, C.hojaO) + agua('M74,540 Q30,520 20,540 Q50,556 74,548Z', C.hoja, { f: 'l' }) + [0, 1, 2, 3, 4, 5, 6, 7].map(i => agua(mancha(74 + Math.cos(i * .785) * 36, 430 + Math.sin(i * .785) * 36, 14, 14, i + 2, .1), C.sol, { f: 'l' })).join('') + agua(mancha(74, 430, 26, 26, 5, .06), C.tronco) + gotas(74, 430, 18, 8, C.troncoO, 3, 2);
      // lechera
      s += agua('M900,590 Q896,520 904,480 L976,480 Q984,520 980,590Z', C.gris) + agua(mancha(940, 478, 46, 10, 4, .08), C.grisO) + vel('M950,486 Q984,520 980,590 L950,590Z', C.grisO, { o: .4 }) + trazo('M910,520 H976', 2.4, C.grisO, { o: .6 }) + agua('M906,470 Q940,440 976,470Z', C.gris);
      s += [[300, 556], [560, 560], [740, 552]].map(([x, y], i) => trazo(`M${x},${y + 40} Q${x + 4},${y + 20} ${x},${y}`, 2.6, carga(C.hojaO, .7)) + flor(x, y, [PAPEL, C.rojo, C.violeta][i], 8)).join('');
      return S(s); },

    // Sala del trono: piedra cálida, vidrieras altas, estandartes, alfombra roja hasta una tarima con un trono dorado
    escena_castillo: () => { const r = azar(33), ORO = pig('#E2B63E'), OROO = carga(ORO, .8), TRONO = '#E9C45A';
      let s = cielo('#EFE3C8', 470) + vel('M-20,-20 H1020 V150 Q500,200 -20,150Z', C.paja, { o: .3 });
      for (let j = 0; j < 7; j++) { const y = 40 + j * 64; s += trazo(`M-10,${y} Q250,${y - 6} 500,${y + 4} T1010,${y - 4}`, 2, C.pajaO, { o: .35 }); for (let i = 0; i < 8; i++) s += trazo(`M${f1(i * 130 + (j % 2) * 65 + r() * 20)},${y} v60`, 2, C.pajaO, { o: .3 }); }
      // suelo de losas lila, con la alfombra roja al centro
      s += agua('M-20,466 Q300,452 560,462 Q820,474 1020,456 L1020,620 L-20,620Z', '#E7DFEC')
        + [0, 1, 2].map(j => [...Array(11)].map((_, i) => (i + j) % 2 ? vel(mancha(i * 100 + j * 24, 494 + j * 38, 48, 15 + j * 3, i + j * 11 + 4, .12, 4, .78), C.violeta, { o: .3 }) : '').join('')).join('');
      // ventanas altas con arco: vidrieras y rayos de luz sobre las losas
      [190, 810].forEach((x, i) => { const w = 54, d = (a, b) => `M${x - w - b},${a + 300} V${a + 90} Q${x - w - b},${a - 10 - b} ${x},${a - 14 - b} Q${x + w + b},${a - 10 - b} ${x + w + b},${a + 90} V${a + 300}Z`;
        s += vel(`M${x - w},330 L${x + w},330 L${x + (i ? -150 : 150) + w * 1.6},520 L${x + (i ? -150 : 150) - w * 1.6},520Z`, C.sol, { o: .22 })
          + agua(d(60, 14), C.gris) + agua(d(60, 0), C.cielo) + vel(d(60, -10), C.azul, { o: .25 })
          + trazo(`M${x},48 V360 M${x - w},140 H${x + w} M${x - w},230 H${x + w}`, 3.4, C.grisO, { o: .85 }) + trazo(`M${x - w + 6},150 l${w * 2 - 12},70 M${x + w - 6},150 l${-w * 2 + 12},70`, 1.8, C.grisO, { o: .5 })
          + agua(`M${x - w - 26},358 H${x + w + 26} V384 H${x - w - 26}Z`, C.gris); });
      // estandartes rojos con corona, colgados de una barra dorada
      [330, 670].forEach((x, i) => { s += pincel(`M${x - 40},22 H${x + 40}`, 7, ORO) + agua(`M${x - 34},30 L${x + 34},30 L${x + 32},262 L${x},228 L${x - 32},262Z`, C.rojo) + vel(`M${x + 6},30 L${x + 34},30 L${x + 32},262 L${x},228Z`, C.rojoO, { o: .4 })
        + trazo(`M${x - 28},40 V240 M${x + 28},40 V240`, 3, ORO, { o: .85 }) + agua(`M${x - 16},120 L${x - 20},92 L${x - 8},106 L${x},84 L${x + 8},106 L${x + 20},92 L${x + 16},120Z`, TRONO, { f: 'l' }) + punto(x, 100, 3, C.azul, .9); });
      // tarima de dos escalones y alfombra
      s += agua('M330,500 L352,466 H648 L670,500Z', '#D5C7B3') + agua('M330,500 H670 V520 H330Z', '#BFAF9A')
        + agua('M372,466 L388,436 H612 L628,466Z', '#E4D8C6') + agua('M372,466 H628 V478 H372Z', '#C9BAA4')
        + agua('M452,466 L448,436 H552 L548,466Z', C.rojo) + agua('M440,520 L452,466 H548 L560,520Z', C.rojo) + agua('M410,620 L440,520 H560 L590,620Z', C.rojo) + vel('M500,466 L548,466 L560,520 L590,620 L520,620Z', C.rojoO, { o: .35 })
        + trazo('M452,466 L440,520 L410,620 M548,466 L560,520 L590,620', 4, ORO, { o: .9 }) + trazo('M440,520 H560', 2.4, ORO, { o: .6 });
      // trono dorado
      s += agua('M434,430 V232 Q436,172 500,166 Q564,172 566,232 V430Z', TRONO) + vel('M520,170 Q564,176 566,232 V430 H520Z', OROO, { o: .4 })
        + agua('M456,420 V250 Q458,206 500,202 Q542,206 544,250 V420Z', C.rojo) + vel('M500,206 Q542,208 544,250 V420 H500Z', C.rojoO, { o: .4 })
        + [[470, 222], [500, 210], [530, 222], [462, 290], [538, 290], [462, 360], [538, 360]].map(([x, y]) => punto(x, y, 3.2, TRONO, .95)).join('') + agua(mancha(500, 262, 11, 11, 3, .1), C.azul, { f: 'l' })
        + agua(`M474,170 L468,138 L486,154 L500,128 L514,154 L532,138 L526,170Z`, TRONO) + punto(500, 152, 3, C.rojo, .95)
        + agua('M426,336 Q424,312 442,312 Q460,312 458,336 V430 H428Z', TRONO) + agua('M574,336 Q576,312 558,312 Q540,312 542,336 V430 H572Z', TRONO)
        + agua('M440,376 Q500,362 560,376 L564,408 Q500,424 436,408Z', C.rojo) + vel('M500,370 Q540,372 562,378 L564,408 Q530,418 500,418Z', C.rojoO, { o: .4 })
        + agua('M432,408 H568 V432 H432Z', TRONO) + agua(mancha(444, 436, 12, 7, 5, .1), ORO, { f: 'l' }) + agua(mancha(556, 436, 12, 7, 6, .1), ORO, { f: 'l' });
      // luz de las velas: un par de candelabros bajos junto a la tarima
      [296, 704].forEach((x, i) => { s += pincel(`M${x},500 V440`, 7, ORO) + agua(`M${x - 14},506 H${x + 14} L${x + 8},494 H${x - 8}Z`, ORO, { f: 'l' }) + agua(`M${x - 8},446 H${x + 8} V420 H${x - 8}Z`, PAPEL, { f: 'l' }) + agua(`M${x - 5},420 Q${x},398 ${x + 5},420Z`, C.naranja, { f: 'l' }) + vel(mancha(x, 420, 34, 34, 7 + i, .1), C.sol, { o: .4 }); });
      return S(s); },
    escena_castillo_frente: () => { const r = azar(101);
      let s = agua('M-20,494 Q250,478 500,490 Q760,502 1020,482 L1020,620 L-20,620Z', '#F6F0E4') + vel('M-20,540 Q500,528 1020,536 L1020,620 L-20,620Z', C.gris, { o: .35 });
      for (let j = 0; j < 3; j++) for (let i = 0; i < 12; i++) if ((i + j) % 2) s += vel(mancha(i * 90 + j * 25, 520 + j * 30, 40, 15, i + j * 13 + 2, .15, 4, .78), C.grisO, { o: .35 });
      s += pincel('M-20,500 Q250,488 500,498 Q760,508 1020,490', 12, C.hoja) + [...Array(18)].map((_, i) => agua(mancha(i * 58 + 10, 496 + (i % 2) * 4, 7, 7, i + 3, .15), C.rojo, { f: 'l' })).join('');
      // macetas con arbolitos
      [[60, 1], [940, 1]].forEach(([x], i) => { s += agua(`M${x - 40},600 L${x - 44},530 Q${x},516 ${x + 44},530 L${x + 40},600Z`, C.sol) + vel(`M${x + 8},530 Q${x + 44},530 ${x + 40},600 L${x + 10},600Z`, C.solO, { o: .4 }) + trazo(`M${x},530 V430`, 6, C.troncoO) + agua(mancha(x, 400, 56, 50, 40 + i, .08), C.hoja) + vel(mancha(x + 14, 416, 38, 30, 44 + i, .1), C.hojaO, { o: .35 }) + [[-20, 390], [18, 408], [0, 372]].map(([dx, y], j) => agua(mancha(x + dx, y, 7, 7, j + i, .1), C.rosa, { f: 'l' })).join(''); });
      return S(s); },

    // ============================== INVIERNO ==============================
    escena_invierno: () => {
      let s = cielo('#E4ECF5', 470) + vel('M-20,-20 H1020 V220 Q500,280 -20,220Z', C.cieloO, { o: .3 }) + vel(mancha(300, 120, 300, 70, 3, .2), C.violeta, { o: .2 }) + agua(mancha(620, 80, 40, 38, 3, .05), '#FBF3DA', { f: 's', o: .9 })
        + agua('M-20,330 Q120,270 220,300 Q330,230 440,300 Q560,250 680,320 Q800,260 920,300 L1020,310 L1020,420 L-20,420Z', '#D8E0EE', { o: .9 }) + agua('M120,300 L220,230 L320,300Z M560,300 L670,226 L780,310Z', PAPEL, { o: .8 })
        + agua('M-20,380 Q300,350 560,370 Q820,390 1020,362 L1020,620 L-20,620Z', '#F4F6FB');
      // lago helado
      s += agua(mancha(400, 456, 190, 36, 6, .08), '#CFE4F2') + trazo('M280,450 q40,-8 90,0 M420,466 q50,-8 100,0', 2.2, PAPEL, { o: .9 });
      // cabaña
      s += agua('M640,380 L644,340 L720,340 L724,380Z', C.tronco) + agua('M632,346 Q680,314 732,346Z', PAPEL) + agua('M660,380 L660,356 h22 v24Z', C.sol, { f: 'l' }) + trazo('M706,330 q-6,-14 6,-24 q8,-12 -2,-22', 2.4, C.grisO, { o: .6 });
      // abetos con nieve
      [[70, 380, 1.5, 1], [190, 400, 1.1, 2], [900, 390, 1.6, 3], [800, 410, 1.1, 4], [540, 360, .5, 5], [460, 360, .4, 6]].forEach(([x, y, k, i]) => { s += abeto(x, y, k, i % 2 ? C.hojaO : '#8EC09A', 60 + i, true); });
      return S(s); },

    escena_invierno_frente: () => { const r = azar(111);
      let s = agua('M-20,500 Q100,462 200,490 Q300,456 420,490 Q540,460 660,492 Q780,462 900,490 Q960,470 1020,480 L1020,620 L-20,620Z', '#F6F8FC') + vel('M-20,540 Q500,520 1020,534 L1020,620 L-20,620Z', C.cieloO, { o: .35 });
      s += agua('M-20,540 Q150,500 300,534 Q420,510 540,540 Q700,506 860,538 Q960,520 1020,534 L1020,620 L-20,620Z', '#EDF1F8') + vel('M-20,570 Q500,556 1020,566 L1020,620 L-20,620Z', C.cieloO, { o: .3 });
      s += trazo('M60,580 q40,-8 90,0 M420,590 q40,-8 100,0 M760,576 q40,-8 100,0', 2.4, C.cieloO, { o: .7 });
      s += agua(mancha(180, 506, 40, 26, 5, .1), C.hojaO) + agua(mancha(206, 512, 22, 18, 6, .1), C.hoja) + agua('M148,500 Q180,480 214,496 Q200,490 180,494 Q160,490 148,500Z', PAPEL, { f: 'l' }) + [[170, 504], [196, 498], [208, 512]].map(([x, y]) => punto(x, y, 4, C.rojoO, .95)).join('');
      for (let i = 0; i < 18; i++) s += trazo(`M${f1(r() * 1000)},${f1(480 + r() * 120)} l4,0 M${f1(r() * 1000)},${f1(500 + r() * 90)} l0,4`, 2.2, C.cieloO, { o: .5 });
      return S(s); },

    // ============================== RIO ==============================
    escena_rio: () => {
      let s = cielo('#C9E2F4', 470) + vel('M-20,-20 H1020 V180 Q500,240 -20,180Z', C.cieloO, { o: .4 }) + nubeD(240, 80, 1.3, 2) + nubeD(640, 56, 1.5, 4) + nubeD(920, 160, .8, 6)
        + agua('M-20,330 Q250,280 520,320 Q780,360 1020,300 L1020,500 L-20,500Z', C.prado) + agua('M-20,380 Q300,350 560,372 Q820,392 1020,364 L1020,620 L-20,620Z', C.hoja);
      // casita lejana
      s += agua('M720,330 L724,300 L780,300 L784,330Z', PAPEL) + agua('M712,304 L752,270 L792,304Z', C.rojo) + agua('M744,330 V312 h14 v18Z', C.tronco, { f: 'l' }) + trazo('M780,276 q-4,-12 6,-20', 2.2, C.grisO, { o: .6 }) + copa(830, 310, .45, 8, C.hoja) + copa(690, 316, .4, 9, C.hojaO);
      // río
      s += agua('M-20,430 Q200,400 420,410 Q640,420 820,430 Q940,436 1020,420 L1020,500 Q800,490 560,486 Q300,486 -20,500Z', C.cielo) + vel('M-20,460 Q500,450 1020,460 L1020,500 L-20,500Z', C.cieloO, { o: .4 }) + trazo('M120,452 q40,-6 80,0 M560,462 q50,-6 100,0 M820,448 q30,-4 60,0', 2.2, PAPEL, { o: .9 });
      // puente
      s += agua('M330,444 Q480,380 650,440 L644,456 Q480,404 336,462Z', C.tronco) + trazo('M360,440 V400 M420,420 V384 M490,408 V372 M560,412 V376 M620,430 V394', 4, C.troncoO) + trazo('M344,404 Q490,340 640,396', 5, C.tronco);
      // árboles laterales
      [[90, 1.4], [920, 1.5]].forEach(([x, k], i) => { s += tronco(x, 210, k) + copa(x, 190, k * 1.2, 20 + i, i ? C.hoja : C.hoja, C.hojaO); });
      s += [[60, 200], [100, 160], [130, 230]].map(([x, y]) => agua(mancha(x, y, 8, 8, x, .1), C.naranja, { f: 'l' })).join('');
      return S(s); },

    escena_rio_frente: () => { const r = azar(121);
      let s = agua('M-20,490 Q250,470 500,486 Q760,502 1020,478 L1020,620 L-20,620Z', C.hoja) + vel('M-20,552 Q500,540 1020,548 L1020,620 L-20,620Z', C.hojaO, { o: .45 });
      for (let i = 0; i < 40; i++) { const x = i * 25 + r() * 14, h = 36 + r() * 56; s += trazo(`M${f1(x)},600 Q${f1(x + (r() - .5) * 16)},${f1(565 - h * .4)} ${f1(x + (r() - .5) * 32)},${f1(570 - h)}`, 4 + r() * 3, [carga(C.hojaO, .6), carga(C.hojaO, .8), C.hojaO][i % 3], { o: .85 }); }
      // piedras
      s += agua(mancha(160, 520, 50, 32, 5, .1), C.gris) + vel(mancha(170, 530, 36, 16, 6, .1), C.grisO, { o: .5 }) + agua(mancha(840, 524, 56, 34, 7, .1), C.gris) + vel(mancha(852, 534, 40, 16, 8, .1), C.grisO, { o: .5 }) + agua(mancha(150, 504, 16, 7, 9, .1), C.hojaO, { f: 'l' });
      s += [[300, 548], [520, 556], [700, 544], [950, 540]].map(([x, y], i) => trazo(`M${x},${y + 40} Q${x + 4},${y + 20} ${x},${y}`, 2.6, carga(C.hojaO, .7)) + flor(x, y, [C.azul, PAPEL, C.rosa, C.sol][i], 8)).join('');
      [[40, 560], [980, 540]].forEach(([x, y]) => { for (let j = -2; j <= 2; j++) s += trazo(`M${x},${y + 40} Q${x + j * 8},${y - 10} ${x + j * 12},${y - 50}`, 3, carga(C.hojaO, .55), { o: .85 }); });
      return S(s); },
  });
})();
