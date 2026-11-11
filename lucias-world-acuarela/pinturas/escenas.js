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

    // ============================== DULCE ==============================
    escena_dulce: () => { const rs = ['#E98E86', '#F2D06B', '#8FB4E8', '#F2B3C4'];
      let s = cielo('#EBDDF2', 470) + vel('M-20,-20 H1020 V220 Q500,290 -20,220Z', '#F4C8DC', { o: .5 }) + vel(mancha(250, 280, 280, 60, 3, .2), C.violeta, { o: .3 })
        + agua(mancha(780, 70, 54, 52, 2, .05), '#F8E3A3', { f: 's' }) + nubeD(230, 100, 1.3, 2).replace(new RegExp(PAPEL, 'g'), '#FBE9F1') + nubeD(620, 50, 1.1, 4).replace(new RegExp(PAPEL, 'g'), '#FBE9F1') + nubeD(920, 190, .9, 6).replace(new RegExp(PAPEL, 'g'), '#FBE9F1')
        + agua('M-20,400 Q200,340 420,380 Q640,420 860,350 Q950,330 1020,350 L1020,620 L-20,620Z', '#D6C6EC', { o: .9 })
        + suelo(440, '#BFE3D2') + suelo(486, '#F6D3E2', .8);
      // piruletas y algodones de azúcar lejos
      [[360, 390, 0.7], [540, 380, .8], [620, 420, .6]].forEach(([x, y, k], i) => { s += trazo(`M${x},${y} V${y + 60 * k}`, 3, '#EAD2DC', { o: .9 }) + agua(mancha(x, y - 8, 22 * k * 1.4, 22 * k * 1.4, i + 3, .08), ['#F2B3C4', '#BFE3D2', '#B9A2DE'][i]); });
      // caramelo grande rosa (algodón)
      s += pincel('M770,470 Q776,380 770,330', 16, '#F6F0F0') + trazo('M764,460 l12,-20 M764,420 l12,-20 M764,380 l12,-20', 5, C.rojo, { o: .8 })
        + agua(mancha(770, 290, 64, 54, 11, .1), '#F4BCD0') + agua(mancha(730, 316, 36, 30, 12, .1), '#F4BCD0') + agua(mancha(812, 312, 38, 30, 13, .1), '#F8CCDB') + vel(mancha(790, 320, 40, 26, 14, .2), '#DE8AA5', { o: .35 });
      // casita de jengibre
      s += agua('M158,470 Q160,430 164,400 Q220,388 276,396 Q282,430 284,470Z', '#D9B48C') + vel('M158,440 L284,436 L284,470 L158,470Z', '#B58A66', { o: .3 })
        + agua('M120,410 Q190,330 214,300 Q250,340 312,404 Q290,408 270,398 Q214,360 160,398 Q140,410 120,410Z', '#B58A66') + agua('M126,404 Q190,336 214,310 Q248,346 304,398 Q270,392 214,350 Q170,392 126,404Z', PAPEL, { o: .95 })
        + agua('M190,470 L190,430 Q206,414 222,430 L222,470Z', '#F2B3C4') + agua(mancha(172, 420, 11, 12, 6, .1), PAPEL) + agua(mancha(262, 420, 11, 12, 7, .1), PAPEL)
        + agua(mancha(214, 342, 12, 12, 5, .1), '#E98E86') + trazo('M206,342 h16 M214,334 v16', 2, PAPEL);
      // piruletas con espirales
      [[70, 440, 1, '#9FD6D6'], [930, 450, 1.1, '#9FD6D6']].forEach(([x, y, k, c], i) => { s += pincel(`M${x},${y + 90} V${y}`, 12 * k, '#FBF1F5') + agua(mancha(x, y - 24, 46 * k, 46 * k, 31 + i, .06), c) + pincel(`M${x},${y - 24} q10,-12 18,0 q-4,22 -26,18 q-26,-8 -12,-34 q22,-22 44,0`, 6, PAPEL, { o: .9 }); });
      s += [[330, 484], [440, 504], [700, 498]].map(([x, y], i) => agua(`M${x - 18},${y} Q${x - 18},${y - 28} ${x},${y - 28} Q${x + 18},${y - 28} ${x + 18},${y}Z`, rs[i % 4], { f: 'l' })).join('');
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

    // ============================== OSOS ==============================
    escena_osos: () => {
      let s = agua('M-20,-20 H1020 V500 H-20Z', '#F6E1B0', { f: 's', o: 1 }) + vel('M-20,-20 H1020 V120 Q500,170 -20,120Z', C.paja, { o: .5 });
      // papel pintado: florecitas sueltas
      const r = azar(3); for (let i = 0; i < 34; i++) { const x = 20 + (i % 9) * 120 + (Math.floor(i / 9) % 2) * 60 + r() * 12, y = 40 + Math.floor(i / 9) * 76; if (y < 330) s += vel(mancha(x, y, 9, 9, i + 2, .2), C.naranja, { o: .55 }) + punto(x, y, 2, C.rojoO, .5); }
      // friso de madera y suelo
      s += agua('M-20,330 Q300,318 560,328 Q820,338 1020,322 L1020,500 L-20,500Z', C.tierra) + vel('M-20,330 Q500,324 1020,322 L1020,346 Q500,350 -20,348Z', C.troncoO, { o: .35 })
        + [[60, 130], [260, 130], [460, 130], [660, 130], [860, 130]].map(([x], i) => trazo(`M${x},362 Q${x + 60},356 ${x + 120},362 V470 Q${x + 60},474 ${x},470Z`, 2.4, C.troncoO, { o: .5 })).join('')
        + agua('M-20,486 Q300,470 560,482 Q820,494 1020,476 L1020,620 L-20,620Z', C.tronco, { o: .9 });
      // ventana redonda con cortinas
      s += agua('M150,70 Q146,200 156,330 L210,326 Q198,190 206,70Z', C.rojo, { o: .85 }) + agua('M370,70 Q374,200 364,330 L316,326 Q330,190 322,70Z', C.rojo, { o: .85 })
        + agua(mancha(260, 200, 106, 106, 6, .04), C.troncoO) + agua(mancha(260, 200, 90, 90, 7, .04), C.cielo) + agua('M200,270 Q214,206 236,170 Q260,240 300,270 Q270,290 230,284Z', C.hoja, { f: 'l' }) + agua('M276,260 Q290,214 304,196 Q324,232 330,260Z', C.hojaO, { f: 'l' })
        + trazo('M170,200 H350 M260,110 V290', 4, C.troncoO, { o: .75 });
      // estante con tarros y reloj de cuco
      s += agua('M410,260 L520,258 L522,270 L412,272Z', C.tronco) + agua(mancha(440, 240, 14, 16, 8, .1), C.naranja, { f: 'l' }) + agua(mancha(472, 244, 11, 13, 9, .1), C.naranja, { f: 'l' }) + agua('M434,224 h12 v5 h-12Z', C.rojo, { f: 'l' })
        + agua('M570,66 Q620,24 664,66 L670,100 L566,100Z', C.tronco) + agua(mancha(618, 160, 50, 58, 10, .06), C.tierra) + agua(mancha(618, 160, 38, 42, 11, .05), PAPEL) + trazo('M618,160 V140 M618,160 L634,168', 2.6) + vel(mancha(626, 180, 34, 30, 12, .2), C.pajaO, { o: .4 })
        + trazo('M606,214 V250 M630,214 V256', 2, C.troncoO) + agua(mancha(606, 258, 7, 10, 13, .1), C.sol, { f: 'l' }) + agua(mancha(630, 264, 7, 10, 14, .1), C.sol, { f: 'l' });
      // chimenea con fuego
      s += agua('M796,350 Q800,300 800,262 L970,262 Q972,300 976,350Z', C.gris) + [[820, 296], [880, 292], [930, 300], [846, 330], [912, 332]].map(([x, y], i) => vel(mancha(x, y, 20, 12, 20 + i, .2), C.grisO, { o: .4 })).join('')
        + agua('M780,262 L990,262 L992,282 L778,282Z', C.tronco) + agua('M826,500 L826,372 Q886,330 944,372 L944,500Z', C.troncoO)
        + agua('M846,500 Q842,450 868,420 Q870,452 884,440 Q890,410 902,396 Q930,440 920,500Z', C.naranja) + agua('M866,500 Q864,466 886,448 Q900,470 906,500Z', C.sol)
        + agua(mancha(840, 244, 14, 16, 15, .1), C.naranja, { f: 'l' }) + agua(mancha(872, 248, 12, 14, 16, .1), C.naranja, { f: 'l' }) + agua('M928,230 q4,-12 8,0 v24 h-8z', PAPEL, { f: 'l' }) + punto(932, 224, 3, C.sol, .95);
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

    // ============================== ABUELA ==============================
    escena_abuela: () => { const r = azar(8);
      let s = agua('M-20,-20 H1020 V470 H-20Z', '#F8E5EA', { f: 's', o: 1 });
      for (let i = 0; i < 40; i++) { const x = 30 + (i % 10) * 100 + Math.floor(i / 10) % 2 * 50 + r() * 14, y = 40 + Math.floor(i / 10) * 70; s += agua(mancha(x, y, 8, 8, i + 3, .2), C.rosa, { f: 'l', o: .85 }) + trazo(`M${x},${y + 8} v12`, 2, C.hojaO, { o: .6 }); }
      // friso verde
      s += agua('M-20,300 Q300,290 560,298 Q820,306 1020,292 L1020,470 L-20,470Z', '#CDE6C6') + vel('M-20,300 Q500,294 1020,292 L1020,316 Q500,320 -20,318Z', C.hojaO, { o: .4 })
        + [[40], [300], [560], [800]].map(([x]) => trazo(`M${x},330 Q${x + 80},324 ${x + 160},330 V430 Q${x + 80},436 ${x},430Z`, 2, C.hojaO, { o: .45 })).join('');
      // cuadro oval
      s += agua(mancha(225, 90, 50, 60, 5, .05), C.paja) + agua(mancha(225, 90, 40, 50, 6, .05), PAPEL) + agua(mancha(225, 82, 14, 14, 7, .1), C.rosaO) + trazo('M225,98 V126', 2.4, C.hojaO) + agua('M205,128 h40 l-4,14 h-32Z', C.violeta, { f: 'l' });
      // ventana con cortinas
      s += agua('M470,70 L640,70 L644,250 L466,250Z', C.troncoO) + agua('M482,82 L630,82 L632,238 L480,238Z', C.cielo) + agua('M480,200 Q540,176 632,196 L632,238 L480,238Z', C.hoja, { f: 'l' }) + trazo('M556,82 V238 M480,160 H632', 3.4, PAPEL, { o: .95 })
        + agua('M456,56 Q452,150 466,250 L520,240 Q500,150 508,60Z', '#FBF1F1') + agua('M654,56 Q660,150 646,250 L594,240 Q614,150 604,60Z', '#FBF1F1') + [[480, 110], [490, 170], [630, 120], [622, 180]].map(([x, y], i) => punto(x, y, 3, C.rosa, .8)).join('')
        + trazo('M440,52 Q550,40 670,52', 5, C.tronco, { o: .85 }) + pincel('M510,160 Q530,168 552,160 M606,160 Q586,168 568,160', 5, C.rosa, { f: 'l' });
      // cuadro cuadrado
      s += agua('M744,50 L910,46 L914,150 L748,154Z', C.tronco) + agua('M756,62 L900,58 L902,142 L758,146Z', C.cielo) + agua('M756,112 Q820,90 902,112 L902,142 L758,146Z', C.prado, { f: 'l' }) + punto(790, 84, 8, C.sol, .95);
      // cama a la derecha
      s += agua('M840,150 Q850,100 900,102 Q960,100 1020,130 L1020,380 L840,380Z', C.tronco) + agua('M860,290 Q930,270 1020,284 L1020,380 L858,380Z', '#F1EEF4') + vel('M860,310 Q940,298 1020,312 L1020,380 L858,380Z', C.cieloO, { o: .3 })
        + agua('M870,248 Q930,226 1010,240 L1010,284 Q930,274 870,290Z', '#FBF6F3') + trazo('M880,320 q40,-10 80,0 M880,346 q40,-10 80,0', 2.4, C.rosaO, { o: .6 });
      // mesilla y lámpara
      s += agua('M770,320 L840,320 L840,400 L770,400Z', C.tierra) + trazo('M780,350 h50', 2.4, C.troncoO, { o: .6 }) + agua('M790,260 L818,260 L824,296 L784,296Z', C.rosa) + trazo('M804,296 V320', 2.6, C.troncoO);
      // mecedora a la izquierda
      s += trazo('M70,130 V300', 8, C.tronco, { o: .9 }) + agua('M90,300 Q130,200 210,210 Q250,230 240,330 L108,334Z', C.rosa, { o: 0 }) + agua('M70,260 Q160,210 250,260 L240,318 Q160,282 90,320Z', '#E98E86') + trazo('M86,206 Q170,170 250,214 V310', 7, C.tronco, { o: .9 }) + trazo('M60,350 Q140,390 280,350', 7, C.tronco, { o: .9 })
        + agua('M52,150 L94,150 L88,230 Q70,242 56,230Z', C.cielo) + trazo('M56,170 h36 M56,190 h34', 3, C.rosa, { o: .8 }) + pincel('M72,130 V150', 6, C.tronco);
      // cesto de lana
      s += agua('M330,340 Q330,300 380,300 Q430,300 430,340 L424,380 L338,380Z', C.paja) + agua(mancha(360, 292, 18, 18, 3, .1), C.rosa, { f: 'l' }) + agua(mancha(396, 288, 16, 16, 4, .1), C.azul, { f: 'l' }) + trazo('M338,320 h86 M342,350 h80', 2, C.pajaO, { o: .7 });
      // suelo: alfombra rosa
      s += agua('M-20,452 Q300,432 560,446 Q820,460 1020,438 L1020,620 L-20,620Z', '#E6B2C0') + vel('M-20,452 Q300,432 560,446 Q820,460 1020,438 L1020,474 Q500,486 -20,474Z', C.rosaO, { o: .3 });
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

    // ============================== CASTILLO ==============================
    escena_castillo: () => { const r = azar(33);
      let s = agua('M-20,-20 H1020 V480 H-20Z', '#F2E6C9', { f: 's', o: 1 }) + vel('M-20,-20 H1020 V140 Q500,190 -20,140Z', C.paja, { o: .35 });
      for (let j = 0; j < 7; j++) { const y = 40 + j * 66; s += trazo(`M-10,${y} Q250,${y - 6} 500,${y + 4} T1010,${y - 4}`, 2, C.pajaO, { o: .4 }); for (let i = 0; i < 8; i++) s += trazo(`M${f1(i * 130 + (j % 2) * 65 + r() * 20)},${y} v62`, 2, C.pajaO, { o: .35 }); }
      // ventanas altas con arco
      [[170], [830]].forEach(([x], i) => { s += agua(`M${x - 70},330 L${x - 70},130 Q${x - 66},40 ${x},30 Q${x + 66},40 ${x + 70},130 L${x + 70},330Z`, C.gris) + agua(`M${x - 54},320 L${x - 54},136 Q${x - 50},60 ${x},50 Q${x + 50},60 ${x + 54},136 L${x + 54},320Z`, C.cielo) + trazo(`M${x},50 V320 M${x - 54},150 H${x + 54} M${x - 54},230 H${x + 54}`, 3, C.grisO, { o: .8 }) + trazo(`M${x - 50},160 l100,70 M${x + 50},160 l-100,70`, 1.8, C.grisO, { o: .5 }); });
      // cortina roja y trono
      s += agua('M380,-10 L620,-10 Q630,200 640,430 L360,430 Q372,200 380,-10Z', C.rojo) + vel('M520,-10 L620,-10 Q630,200 640,430 L540,430 Q560,200 520,-10Z', C.rojoO, { o: .35 }) + trazo('M420,0 Q430,200 420,420 M580,0 Q570,200 580,420', 2.6, C.rojoO, { o: .6 })
        + agua('M440,380 L444,250 Q500,200 556,250 L560,380Z', C.sol) + agua('M458,380 L460,266 Q500,230 540,266 L542,380Z', C.rojo) + agua(liso([[470, 200], [480, 170], [492, 196], [500, 164], [508, 196], [520, 170], [530, 200]]), C.sol) + agua('M420,380 h160 v22 h-160Z', C.sol) + agua('M440,402 h120 v22 h-120Z', PAPEL)
        + agua(mancha(500, 296, 8, 8, 3, .1), C.azul, { f: 'l' });
      // lámpara
      s += trazo('M500,-10 V40', 2.4, C.pajaO) + pincel('M420,60 Q500,100 580,60', 8, C.sol) + [440, 480, 520, 560].map(x => agua(`M${x - 5},60 h10 v-22 h-10Z`, PAPEL, { f: 'l' }) + punto(x, 34, 4, C.naranja, .95)).join('');
      // columnas con estandarte
      [[300], [700]].forEach(([x]) => { s += agua(`M${x - 22},-10 L${x + 22},-10 L${x + 20},400 L${x - 20},400Z`, PAPEL) + vel(`M${x + 4},-10 L${x + 22},-10 L${x + 20},400 L${x + 4},400Z`, C.grisO, { o: .35 }) + agua(`M${x - 34},60 L${x + 34},60 L${x + 30},190 L${x},170 L${x - 30},190Z`, C.rojo) + agua(`M${x - 12},100 l6,-12 l6,8 l6,-8 l6,12Z`, C.sol, { f: 'l' }) + agua(`M${x - 30},392 h60 v24 h-60Z`, C.sol); });
      // suelo ajedrezado
      s += agua('M-20,466 Q300,450 560,462 Q820,476 1020,452 L1020,620 L-20,620Z', '#F4EFE3') + [0, 1, 2].map(j => [...Array(11)].map((_, i) => (i + j) % 2 ? vel(mancha(i * 100 + j * 20, 490 + j * 36, 46, 17, i + j * 11 + 4, .12, 4, .78), C.gris, { o: .5 }) : '').join('')).join('');
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
