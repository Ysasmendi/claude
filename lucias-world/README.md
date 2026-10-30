# Lucía's World · Safarrancho OS

Sistema operativo de juguete para niños, en un solo archivo HTML. Colores primarios, botones grandes, sonido 8 bits sintetizado y voz en español o inglés.

Todo está dibujado a mano en SVG dentro del propio archivo: iconos, botones, animales, decorados, marionetas, el robot de los abrasos, cuentos, celebraciones y visiones de la bola de cristal. En el código los textos pueden llevar emojis por comodidad, pero en pantalla nunca se ve ninguno: un traductor los cambia al momento por su dibujo (tabla `EMOJI_DIBUJO`).

Está publicado en: https://ysasmendi.github.io/claude/lucias-world/

## Cómo abrirlo

Doble clic en `index.html`, o abrir el enlace de arriba. Funciona en cualquier navegador moderno, también en iPad y en el móvil. No necesita internet; con conexión, carga además la tipografía Fredoka.

- **Idioma:** el botón 🌐 de la barra de abajo (o el del arranque, o el menú 🌈) cambia entre español e inglés. La elección se guarda y no depende del idioma del navegador.
- **Voz:** usa la lectura en voz alta del navegador y elige a propósito una voz del idioma de la web. En **Menú 🌈 → Voz** se ve qué voz se está usando, se puede probar y elegir otra, y vienen los pasos para instalar una voz española si el aparato no tiene ninguna (si no la hay, el navegador lee el español con una voz inglesa y suena con acento).
- **Sonido:** el botón del altavoz silencia todo. Mientras el OS está encendido suena un siseo inaudible (−85 dB) que mantiene despierta la salida de audio, para que altavoces y auriculares no hagan «pop» al acabar cada frase de la voz.

## Apps

| App | Qué hace |
|---|---|
| 🌐 Navegador | Navegador de mentira. Incluye `www.piscinadebolas.es`, una piscina de bolas con físicas reales: gravedad, masa, rebotes y rozamiento. Se pueden coger y lanzar bolas, hacer «¡plof!», provocar un terremoto o activar la gravedad lunar. También incluye `www.burbujas.es`. |
| 🧮 Calculadora | Sumas y restas con botones gigantes. Dibuja la cuenta con frutas y galletas, y la lee en voz alta. Explica los números negativos. |
| 📖 Cuentacuentos | 8 cuentos originales que se leen solos, página a página. |
| 🎵 Música | «Estrellita, ¿dónde estás?» (en inglés, «Twinkle, Twinkle, Little Star») en 8 bits, con la letra iluminada estilo karaoke, 3 velocidades y batería. También incluye un xilófono de 8 notas. |
| 🎭 Guiñoles | «Safarrancho Studios»: películas con marionetas de fieltro (ojos de pelota de ping-pong, bocaza que se abre al hablar, brazos con varilla que gesticulan). Cabecera de estudio, decorados pintados con primer plano, cámara que se acerca a quien habla, fundidos a negro entre escenas, foco de luz, partículas (pétalos, hojas, nieve, luciérnagas…), bocadillos pegados a cada personaje, voz distinta para cada uno, narrador en off con subtítulos y música propia de cada escena (más tensa cuando sale el malo). 8 películas de unos 40 planos, basadas en los cuentos originales: Los tres cerditos, Ricitos de Oro, Hansel y Gretel, Pulgarcito, Caperucita Roja, La ratita presumida, Los músicos de Bremen y El patito feo. |
| 🎨 Pintar | Colores, pincel arcoíris, sellos de emojis y opción de guardar el dibujo como imagen. |
| 🧠 Memoria | Juego de parejas en modo fácil o difícil. |
| 🐮 Animales | 18 animales dibujados a mano: al tocar uno suena su grabación de verdad y luego la voz dice cómo hace. En inglés, la vaca dice «moo». |
| 🤗 Máquina de dar abrasos | Un robot que da abrasos, con brazos que se cruzan, corazones y frases distintas. Cada cierto número de abrasos (un número sorpresa entre 5 y 8) hay uno que no quiere: se enfada y suelta un puñito 👊 «¡POW!»… y luego dice que era broma. |
| 🔮 Bola de cristal | La Brujita Lucía y su bola mágica predicen el futuro: qué pasará mañana, qué vas a comer, qué serás de mayor o una sorpresa. |
| 🍬 Hoja de chuches | Una hoja de cálculo como Excel donde solo se pintan chuches. Al escribir, cada consonante pinta un 🍬, cada vocal una 🍫 y cada número una ⭐. La barra de fórmulas enseña qué tecla era (`=CARAMELO("m")`), y abajo están los totales (`=CONTAR(🍬)`). Se guarda sola. |
| 🏷️ Etiquetadora | Juego estilo Doom en un pasillo de oficina, con Estrellita en modo heavy metal. Te mueves con las flechas o WASD y disparas con la barra espaciadora. En tablet hay cruceta y botón de disparo en pantalla, y también se puede tocar donde quieras disparar. Las teclas 1 y 2 cambian de munición (⭐ o 🍬). |
| 🗑️ Papelera | Tiene una sorpresa dentro. |

## Cosas que pasan en el fondo

Cada 12–28 segundos, cuando no hay ninguna app abierta, pasa algo en el escritorio, según el fondo elegido:

- **Cielo:** un duende va al final del arcoíris, coge su olla de oro y sale corriendo. También pasan una avioneta con la pancarta «¡Hola, Lucía!», globos y pájaros que aletean. El sol tiene cara: si lo tocas, canta.
- **Noche:** estrellas fugaces, un cohete y un platillo volante con su rayo. La luna duerme con gorro: si la tocas, suena una nana.
- **Bloques:** los bloques cambian de color, y a veces sube un globo.

Casi todo se puede tocar: el duende protesta, la estrella fugaz te deja pedir un deseo, los globos explotan y el ovni saluda.

## Easter eggs (spoiler para adultos)

- **Clic en el fondo del escritorio**, fuera de las cajas: «¡BOING!» con sonido de muelle.
- **Clic en una caja**: más o menos 1 de cada 7 veces sale un muñeco con muelle en lugar de abrirse la app.
- **Lluvia de caramelos**: cae sola cada 1,5–4 minutos.
- **5 toques seguidos en el logo**: lluvia de estrellas.
- **3 toques seguidos en el reloj**: un dinosaurio cruza la pantalla.
- **Escribir `lucia`** con el teclado: saludo con coronas y corazones.
- **Código Konami** (↑ ↑ ↓ ↓ ← → ← → B A): modo disco. Repetirlo lo apaga.
- **Navegador**: escribir `lucia` o `safarrancho` en la barra de direcciones abre la web secreta. Cualquier dirección inventada lleva a una página «que se ha ido a merendar».
- **Piscina de bolas**: hay un pato 🦆 que flota y hace «¡cuac!» si lo tocas.
- **Calculadora**: un resultado de 100 lanza una fiesta. 0 + 0 dice «¡NADA!». Pulsar «=» muchas veces seguidas hace que se enfade.
- **Xilófono**: tocar Do Do Sol Sol La La Sol (el principio de Estrellita) desata una lluvia de estrellas. Tocar La Sol Fa Fa Fa Do Fa Sol La (el principio de «Cara al sol») hace caer solecitos sonrientes; funciona en cualquier tono.
- **Bola de cristal**: tocar a la Brujita lanza un «¡Abracadabra, pata de cabra!». Cada 7 preguntas, la bola se marea.
- **Hoja de chuches**: escribir `lucia` da 🍬🍫🍬🍫🍫 y una lluvia de coronas. Una fila entera de números provoca una lluvia de estrellas, y la hoja entera de vocales, un empacho de chocolate.
- **Etiquetadora**: de vez en cuando pasa el jefe 🧑‍💼; si lo etiquetas, sale corriendo. Cada 25 etiquetas eres «Empleada del mes». Escribir `iddqd` (el truco de modo dios del Doom original) activa el disparo triple.
- **Guiñoles**: tocar una marioneta la hace saltar.
- **Sol del escritorio**: tocarlo hace sonar el «Cara al sol» en 8 bits, con lluvia de soles.
- **Papelera**: el calcetín perdido encuentra a su pareja, que conecta con el cuento del calcetín.
- **Menú 🌈 → Apagar**: «Buenas noches, Lucía» con una nana.

## Cómo añadir cosas

Todo está en `index.html`. Los textos van en los dos idiomas con `T('español', 'english')`.

- **Nueva película de guiñoles**: añadir un objeto a `OBRAS`. Cada plano del guion es `[escenario, reparto, quién habla, texto ES, texto EN, efecto, música]`; si quién habla va vacío, es el narrador. La música es opcional (`pastoral`, `misterio`, `noche`, `dulce`, `hogar`, `peligro`, `agua`, `invierno`, `fiesta`, `triste`); si no se pone, se elige según el escenario. Las marionetas nuevas se diseñan con una ficha en `MUP` (piel, orejas, nariz, pelo, sombrero, ropa, extras).
- **Nuevo dibujo**: añadir una función a `ILUS` que devuelva un SVG. Donde se use, `dibujo('nombre', '🙂')` lo pinta, o pone el emoji si el dibujo no existe.
- **Nuevo cuento**: añadir un objeto a `CUENTOS`, con páginas `[escena, texto ES, texto EN]`.
- **Nueva app**: crear `Apps.miApp = { nombre, en, emoji, color, crear(cuerpo) { ... } }` y añadir su id a `ORDEN`.

## Créditos de los sonidos de animales

Grabaciones reales, recortadas a 1–2,5 segundos, normalizadas y con fundidos suaves. Todas son de dominio público o CC0, salvo el cerdo (CC BY 3.0) y el mono (CC BY 4.0), que piden citar al autor. La serpiente no tiene grabación: su siseo está sintetizado.

- vaca — Cow moos 3 (BigSoundBank #2383) — Joseph Sardin (BigSoundBank) — CC0 1.0 — https://bigsoundbank.com/cow-moos-3-s2383.html
- perro — Barking dog (BigSoundBank #0916) — Joseph Sardin (BigSoundBank) — CC0 1.0 — https://bigsoundbank.com/barking-dog-s0916.html
- gato — Meow of a Siamese cat - freemaster2.wav — freemaster2 (Freesound) — CC0 — https://commons.wikimedia.org/wiki/File:Meow_of_a_Siamese_cat_-_freemaster2.wav
- pato — Ducks (BigSoundBank #0276) — Joseph Sardin (BigSoundBank) — CC0 1.0 — https://bigsoundbank.com/ducks-s0276.html
- oveja — Sheep bleating.ogg — earthcalling (pdsounds.org) — Public domain — https://commons.wikimedia.org/wiki/File:Sheep_bleating.ogg
- cerdo — Pig grunt - Erdie.ogg (grunt repeated twice) — erdie — CC BY 3.0 — https://commons.wikimedia.org/wiki/File:Pig_grunt_-_Erdie.ogg
- gallo — Medium rooster crowing.ogg — alys (pdsounds.org) — Public domain — https://commons.wikimedia.org/wiki/File:Medium_rooster_crowing.ogg
- gallina — Hen announcing shes lain an egg.ogg — alys (pdsounds.org) — Public domain — https://commons.wikimedia.org/wiki/File:Hen_announcing_shes_lain_an_egg.ogg
- caballo — Wiehern.ogg — Hü. — Public domain — https://commons.wikimedia.org/wiki/File:Wiehern.ogg
- leon — Lion raring-sound1TamilNadu178.ogg — த*உழவன் (Info-farmer) — Public domain — https://commons.wikimedia.org/wiki/File:Lion_raring-sound1TamilNadu178.ogg
- elefante — Elephant voice - trumpeting.ogg — தகவலுழவன் (Info-farmer) — CC0 — https://commons.wikimedia.org/wiki/File:Elephant_voice_-_trumpeting.ogg
- mono — Pant-hoot call made by a male chimpanzee.ogg — Pawel Fedurek et al. (supplementary audio of the article at https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5674848/) — CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Pant-hoot_call_made_by_a_male_chimpanzee.ogg
- rana — PigFrog EvergladesNP (Lithobates grylio) — NPS Natural Sounds & Night Skies Division — Public domain (US NPS) — https://commons.wikimedia.org/wiki/File:PigFrog_EvergladesNP.ogg (same recording, downloaded from https://www.nps.gov/subjects/sound/sounds-pigfrog.htm)
- buho — Tawny Owl 2 (BigSoundBank #1764) — Joseph Sardin (BigSoundBank) — CC0 1.0 — https://bigsoundbank.com/tawny-owl-2-s1764.html
- lobo — Wolf (Denali National Park) - NPS Sound Gallery — U.S. National Park Service — Public domain (US NPS) — https://www.nps.gov/subjects/sound/sounds-wolf.htm
- abeja — Bee (Yosemite National Park) - NPS Sound Gallery — U.S. National Park Service — Public domain (US NPS) — https://www.nps.gov/subjects/sound/sounds-bee.htm
- raton — Mouse screams (BigSoundBank #0459), 5 squeaks spliced — Joseph Sardin (BigSoundBank) — CC0 1.0 — https://bigsoundbank.com/mouse-screams-s0459.html
