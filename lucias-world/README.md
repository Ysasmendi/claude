# Lucía's World · Safarrancho OS

Sistema operativo de juguete para niños, en un solo archivo HTML. Colores primarios, botones grandes, sonido 8 bits sintetizado y voz en español.

## Cómo abrirlo

Doble clic en `index.html`. Funciona en cualquier navegador moderno, también en iPad y en el móvil. No necesita internet; con conexión, carga además la tipografía Fredoka.

- La voz usa la lectura en voz alta del propio navegador. Safari y Chrome en Mac y en iPad traen voces en español.
- El botón 🔊 de la barra de abajo silencia todo.

## Apps

| App | Qué hace |
|---|---|
| 🌐 Navegador | Navegador de mentira. Incluye `www.piscinadebolas.es`, una piscina de bolas con físicas reales: gravedad, masa, rebotes y rozamiento. Se pueden coger y lanzar bolas, hacer «¡plof!», provocar un terremoto o activar la gravedad lunar. También incluye `www.burbujas.es`. |
| 🧮 Calculadora | Sumas y restas con botones gigantes. Dibuja la cuenta con frutas y galletas, y la lee en voz alta. Explica los números negativos. |
| 📖 Cuentacuentos | 4 cuentos originales que se leen solos, página a página. |
| 🎵 Música | «Estrellita, ¿dónde estás?» en 8 bits, con la letra iluminada estilo karaoke, 3 velocidades y batería. También incluye un xilófono de 8 notas. |
| 🎭 Guiñoles | Teatro de marionetas con telón, aplausos y voces distintas para cada personaje. Obras: Los tres cerditos, Ricitos de Oro, Hansel y Gretel y Pulgarcito. |
| 🎨 Pintar | Colores, pincel arcoíris, sellos de emojis y opción de guardar el dibujo como imagen. |
| 🧠 Memoria | Juego de parejas en modo fácil o difícil. |
| 🐮 Animales | Al tocar un animal, dice cómo suena. |
| 🤗 Máquina de dar abrasos | Un robot que da abrasos, con brazos que se cruzan, corazones y frases distintas. Cada cierto número de abrasos (un número sorpresa entre 5 y 8) hay uno que no quiere: se enfada y suelta un puñito 👊 «¡POW!»… y luego dice que era broma. Cada 20 abrasos cae una lluvia de corazones. |
| 🗑️ Papelera | Tiene una sorpresa dentro. |

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
- **Xilófono**: tocar Do Do Sol Sol La La Sol (el principio de Estrellita) desata una lluvia de estrellas.
- **Papelera**: el calcetín perdido encuentra a su pareja, que conecta con el cuento del calcetín.
- **Menú 🌈 → Apagar**: «Buenas noches, Lucía» con una nana.

## Cómo añadir cosas

Todo está en `index.html`:

- **Nueva obra de guiñoles**: añadir un objeto a `OBRAS`, con los personajes en `pj` y el guion en `guion`. Cada línea del guion es `[escenario, reparto, quién habla, texto, efecto]`.
- **Nuevo cuento**: añadir un objeto a `CUENTOS`.
- **Nueva app**: crear `Apps.miApp = { nombre, emoji, color, crear(cuerpo) { ... } }` y añadir su id a `ORDEN`.
