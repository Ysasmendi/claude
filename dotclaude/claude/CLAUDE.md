# Memoria de usuario

Este fichero se enlaza en `~/.claude/CLAUDE.md` y se carga en **todas** tus
sesiones locales de Claude Code, en cualquier proyecto y en cualquier Mac.

Lo que va aqui: reglas que valen siempre, independientemente del repo en el que
estes. Preferencias de idioma, convenciones de commit, formato de moneda, cosas
que no quieres repetir.

Lo que NO va aqui: nada especifico de un proyecto. Eso va en el `CLAUDE.md` del
propio repo, que se versiona con el.

Ojo: Claude escribe en este fichero cuando usas el atajo `#` para anadir a
memoria. Como es un symlink al repo, esa escritura entra en el repo — que es lo
que queremos — pero si algun dia `./doctor.sh` te dice que ha dejado de ser un
symlink, es que Claude lo reemplazo en vez de editarlo en sitio.
