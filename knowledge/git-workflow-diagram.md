# Git Workflow — Concepts Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        REMOTE (GitHub / GitLab)                     │
│                                                                     │
│  ┌──────────────────────┐         ┌──────────────────────┐         │
│  │  Original Repository │         │   Forked Repository  │         │
│  │  (upstream)          │◄════════│   (origin)           │         │
│  │                      │  Pull   │                      │         │
│  │  main ──○──○──○──○   │ Request │  main ──○──○──○──○   │         │
│  │              │       │════════►│              │       │         │
│  │         feature-branch│        │         feature-branch│         │
│  │              ○──○    │         │              ○──○──○ │         │
│  └──────────┬───────────┘         └──────────┬───────────┘         │
│             │                                │                     │
│             │          FORK                  │                     │
│             │  (full copy of a repo          │                     │
│             │   under your account)          │                     │
└─────────────┼────────────────────────────────┼─────────────────────┘
              │                                │
              │  pull                    push  │  pull
              │  fetch                         │  fetch
              ▼                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          LOCAL MACHINE                               │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Local Repository (.git)                   │   │
│  │                                                              │   │
│  │  main ──○──○──○──○              BRANCH                      │   │
│  │              │              (create a parallel               │   │
│  │              └── feature ──○──○──○   line of work)          │   │
│  │                                 │                            │   │
│  │              MERGE              │                            │   │
│  │         (combine branches) ─────┘                            │   │
│  │                                                              │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                             │                                       │
│                    git add  │  (stage changes)                      │
│                             ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     Staging Area (Index)                      │  │
│  │              Files marked for next commit                     │  │
│  └──────────────────────────┬───────────────────────────────────┘  │
│                             │                                       │
│                  git commit │  (save snapshot)                      │
│                             ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     Working Directory                         │  │
│  │              Your actual files on disk                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                         OPERATIONS SUMMARY
═══════════════════════════════════════════════════════════════════════

  OPERATION        DIRECTION              WHAT IT DOES
  ─────────        ─────────              ────────────
  commit           Local only             Save staged changes as a
                   (Working → Repo)       snapshot in local history

  push             Local → Remote         Upload local commits to
                                          the remote repository

  pull             Remote → Local         Download remote commits and
                   (= fetch + merge)      merge them into local branch

  fetch            Remote → Local         Download remote commits
                                          WITHOUT merging

  branch           Local (or Remote)      Create a parallel line of
                                          development

  merge            Local                  Combine two branches into
                                          one (integrate changes)

  fork             Remote only            Copy an entire repository
                                          under your own account

  pull request     Remote only            Ask the original repo to
  (PR)                                    review & merge your changes

═══════════════════════════════════════════════════════════════════════


TYPICAL WORKFLOW:

  1. FORK ──► the original repo (once)
  2. CLONE ──► to your local machine (once)
  3. BRANCH ──► create a feature branch
  4. Edit files in working directory
  5. git ADD ──► stage changes
  6. COMMIT ──► save snapshot locally
  7. PUSH ──► upload to your fork
  8. PULL REQUEST ──► propose changes to original repo
  9. MERGE ──► maintainer accepts your PR
 10. PULL ──► sync latest changes back to local
```
