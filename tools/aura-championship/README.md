# Liga de Aura dcycle

Miniweb de campeonato eliminatorio (formato Pokémon) para las batallas de aura del equipo.
Un único fichero, `index.html`, sin dependencias más allá de la fuente Inter de Google Fonts.
Se puede abrir directamente en el navegador o publicar como artifact.

## Plantilla

48 combatientes, tomados de los miembros del canal `#general` de Slack y ordenados por
antigüedad de cuenta (el ID de Slack es creciente por fecha de alta).

De los 54 miembros del canal quedan fuera seis:

| Fuera | Motivo |
|---|---|
| Jaime de la Torre | Organiza, no compite |
| Paula Cons | Excluida a petición |
| Álvaro Granados | Excluido a petición |
| Bernardo Frangoulis | Excluido a petición — tiene **dos** cuentas (`@bernardo` y `@bernardo.frangoulis`), ambas fuera |
| `admin@dcycle.io` | Cuenta de servicio, no es una persona |

Carlos Valverde no aparece en el workspace, así que no había nada que excluir.

## Cuadro

48 personas no es potencia de dos, así que el torneo usa un cuadro estándar de **64 plazas**
con 16 huecos vacíos. Las 16 primeras cabezas de serie reciben pase directo a dieciseisavos.

| Ronda | Combates |
|---|---|
| Ronda 1 · Clasificatoria | 16 (+16 pases directos) |
| Ronda 2 · Dieciseisavos | 16 |
| Ronda 3 · Octavos | 8 |
| Ronda 4 · Cuartos | 4 |
| Ronda 5 · Semifinales | 2 |
| Ronda 6 · Final | 1 |
| **Total** | **47** |

## Fichas

Cada persona tiene un **tipo de aura** derivado del título de su perfil de Slack
(Liderazgo, Ventas, Marketing, Diseño, Producto, Ingeniería, Customer, Datos, ESG, Ops).
Quien tiene el título vacío entra como tipo **Salvaje**: 20 de 48 a día de hoy.

Las tres estadísticas — **Aura**, **Lore** y **Drip** — se calculan con un hash FNV-1a
determinista del ID de Slack. La misma persona saca siempre los mismos números, en
cualquier navegador y en cualquier momento. El poder de aura es
`Aura×0,5 + Lore×0,3 + Drip×0,2`.

## Uso

- **Rondas**: pincha en quien gane cada combate. Volver a pinchar deshace el resultado.
- **Simular**: resuelve un combate con las estadísticas más una tirada aleatoria de 0 a 30.
- **Cuadro**: vista completa de las seis rondas, con desplazamiento horizontal.
- **Plantilla**: las 48 fichas con sus estadísticas y movimiento de tipo.
- **Copiar para Slack**: exporta los emparejamientos de la ronda actual en texto plano.
- **Emparejamiento**: por sorteo reproducible (el número de sorteo se muestra abajo) o por
  veteranía, donde las 16 cuentas más antiguas se llevan los pases directos.

Los resultados se guardan en `localStorage` del navegador de cada persona. Cambiar de sorteo
o de criterio de emparejamiento borra los resultados, previa confirmación.

## Actualizar la plantilla

La lista vive en la constante `ROSTER` dentro de `index.html`. Cada entrada es
`{id, h, n, r, t}`: ID de Slack, handle, nombre visible, título y clave de tipo.
Si la plantilla deja de ser 48, hay que revisar `SLOTS` y `ROUNDS` para que el cuadro
siga cuadrando.
