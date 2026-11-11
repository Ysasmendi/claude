// Pinturas: piezas que antes se dibujaban a mano sobre lienzo o con degradados (bolas de la piscina, bola de cristal)
(() => {
  const { agua, vel, trazo, punto, mancha, pig, carga, svg, PAPEL } = AQ;
  const COLORES = ['#E63027', '#FFD21F', '#1F5FD6', '#25A84A', '#FF8A1F', '#FF5FA2', '#8B3FD9', '#FFFFFF'];
  const bola = (c, i) => { const p = c === '#FFFFFF' ? '#EDEAF2' : pig(c);
    return svg('0 0 100 100', agua(mancha(50, 50, 43, 43, i + 3, .035, 12), p) + vel(mancha(60, 64, 28, 24, i + 9, .2), carga(p, .78), { o: .4 })
      + `<path d="${mancha(35, 32, 9, 6, i + 5, .2)}" fill="${PAPEL}" opacity=".85" transform="rotate(-30 35 32)"/>` + trazo('M22,62 q6,14 20,18', 1.6, carga(p, .6), { o: .5 })); };
  const pinturas = {};
  COLORES.forEach((c, i) => { pinturas['bola_' + i] = () => bola(c, i); });
  // La bola de cristal: una gran aguada violeta con aguas claras, remolino y destellos
  pinturas.bola_cristal = () => svg('0 0 200 200',
    agua(mancha(100, 100, 92, 92, 4, .025, 14), '#C3AEE8')
    + vel(mancha(118, 124, 62, 56, 6, .2), '#8E6CC4', { o: .5 }) + vel(mancha(70, 70, 44, 36, 8, .25), '#F3B4D0', { o: .35 })
    + trazo('M58,112 C60,70 116,58 136,88 C150,110 124,128 106,116 C94,108 102,92 114,98', 3, PAPEL, { o: .75 })
    + `<path d="${mancha(64, 56, 20, 11, 9, .2)}" fill="${PAPEL}" opacity=".8" transform="rotate(-32 64 56)"/>`
    + punto(140, 60, 3, PAPEL, .9) + punto(150, 134, 2.4, PAPEL, .8) + punto(60, 140, 2, PAPEL, .8));
  Object.assign(ILUS, pinturas);
})();
