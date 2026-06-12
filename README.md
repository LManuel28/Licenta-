# Pipeline CI/CD pentru testarea automată și verificarea securității unei aplicații web

**Proiect lucrare de licență – TramEvents Formular**

---

## Cuprins

1. [Descrierea proiectului](#1-descrierea-proiectului)
2. [Arhitectura proiectului](#2-arhitectura-proiectului)
3. [Structura fișierelor](#3-structura-fișierelor)
4. [Tehnologii folosite](#4-tehnologii-folosite)
5. [Instalare și rulare locală](#5-instalare-și-rulare-locală)
6. [Rularea testelor](#6-rularea-testelor)
7. [Linting și analiză statică](#7-linting-și-analiză-statică)
8. [Docker – containerizare cu Nginx](#8-docker--containerizare-cu-nginx)
9. [Scanare securitate cu Trivy](#9-scanare-securitate-cu-trivy)
10. [Scanare secrete cu Gitleaks](#10-scanare-secrete-cu-gitleaks)
11. [Pipeline GitHub Actions – CI/CD](#11-pipeline-github-actions--cicd)
12. [Diagrama pipeline-ului](#12-diagrama-pipeline-ului)
13. [Rezultate și interpretare](#13-rezultate-și-interpretare)
14. [Comenzi de referință rapidă](#14-comenzi-de-referință-rapidă)

---

## 1. Descrierea proiectului

Acest proiect implementează un pipeline CI/CD complet pentru o aplicație web statică reală — formularul de organizare evenimente al companiei **TramEvents**. Scopul academic este demonstrarea practică a conceptelor de:

- **Integrare continuă (CI)** — verificarea automată a calității codului la fiecare commit
- **Testare automată în browser** — simularea interacțiunilor utilizatorului real
- **Analiză statică** — detectarea erorilor de sintaxă HTML și JavaScript înainte de deployment
- **Securitate DevSecOps** — scanare automată pentru vulnerabilități și secrete expuse
- **Containerizare** — împachetarea aplicației într-o imagine Docker reprodusă consistent

Pipeline-ul execută automat:
- validarea codului HTML și JavaScript;
- teste funcționale cu Playwright;
- scanare de secrete cu Gitleaks;
- construirea imaginii Docker;
- scanare de vulnerabilități cu Trivy.

Aplicația web este un formular multi-step cu logică dinamică: în funcție de tipul evenimentului selectat (nuntă, corporate, majorat, etc.), formularul adaptează câmpurile afișate. Această complexitate face testarea automată deosebit de relevantă.

---

## 2. Arhitectura proiectului

```
Developer ──push──► GitHub Repository
                          │
                    GitHub Actions
                          │
              ┌───────────┼───────────┐
              │           │           │
          Linting      Playwright   Gitleaks
        HTMLHint+ESLint  Tests     (secrete)
              │           │           │
              └───────────┴───────────┘
                          │
                    Docker Build
                          │
                    Trivy Scan
                    (vulnerabilități)
                          │
                    ✅ Pipeline OK
```

**Fluxul complet:**
1. Dezvoltatorul face `git push` pe branch `main` sau `develop`
2. GitHub Actions pornește automat pipeline-ul
3. Se verifică calitatea codului (HTMLHint, ESLint)
4. Se rulează testele automate Playwright în browsere reale (Chromium, Firefox)
5. Gitleaks scanează istoricul Git după secrete expuse (parole, chei API, tokeni)
6. Se construiește imaginea Docker cu Nginx
7. Trivy scanează imaginea Docker după vulnerabilități CVE cunoscute
8. Un summary vizual al rezultatelor apare în interfața GitHub

---

## 3. Structura fișierelor

```
licenta-tramevents-ci-cd/
│
├── app/                          # Aplicația web statică
│   ├── index.html             # Formularul HTML multi-step
│   ├── style.css                 # Stilurile CSS (separate din HTML)
│   ├── script.js                 # Logica JavaScript (separată din HTML)
│   └── logo.png                  # Logo TramEvents (adaugă manual)
│
├── tests/
│   └── formular.spec.js          # Teste automate Playwright (10 scenarii)
│
├── .github/
│   └── workflows/
│       └── ci.yml                # Pipeline GitHub Actions (5 job-uri)
│
├── Dockerfile                    # Configurație container Nginx Alpine
├── playwright.config.js          # Configurație Playwright (browsere, timeout)
├── package.json                  # Dependențe Node.js și scripturi npm
├── .eslintrc.json                # Reguli ESLint pentru JavaScript
├── .htmlhintrc                   # Reguli HTMLHint pentru HTML
├── .gitleaks.toml                # Configurație scanare secrete Gitleaks
├── .gitignore                    # Fișiere excluse din Git
└── README.md                     # Documentație (acest fișier)
```

---

## 4. Tehnologii folosite

| Categorie | Tehnologie | Versiune | Rol |
|-----------|-----------|---------|-----|
| Aplicație | HTML5 / CSS3 / JavaScript (ES2021) | — | Formularul web static |
| Servire locală | `serve` (npm) | ^14.2 | Server HTTP local pentru development |
| Testare | **Playwright** | ^1.44 | Testare automată în browser real |
| Linting HTML | **HTMLHint** | ^1.1.4 | Verificare sintaxă și reguli HTML |
| Linting JS | **ESLint** | ^8.57 | Analiză statică JavaScript |
| Containerizare | **Docker** + **Nginx Alpine** | nginx:1.27-alpine | Împachetare și servire producție |
| Scanare CVE | **Trivy** (Aqua Security) | latest | Vulnerabilități în imagini Docker |
| Scanare secrete | **Gitleaks** | v2 | Secrete expuse în codul sursă |
| CI/CD | **GitHub Actions** | — | Automatizare pipeline |
| Sistem operare runner | Ubuntu Latest (GitHub-hosted) | — | Mediu de execuție CI |

---

## 5. Instalare și rulare locală

### Cerințe preliminare

- **Node.js** ≥ 18.0.0 ([nodejs.org](https://nodejs.org))
- **Git** ([git-scm.com](https://git-scm.com))
- **Docker Desktop** ([docker.com](https://www.docker.com/products/docker-desktop)) *(opțional, pentru testare Docker)*

### Pași de instalare

```bash
# 1. Clonează repository-ul
git clone https://github.com/USERUL_TAU/licenta-tramevents-ci-cd.git
cd licenta-tramevents-ci-cd

# 2. Instalează dependențele Node.js
npm install

# 3. Instalează browsere Playwright (Chromium + Firefox)
npx playwright install chromium firefox

# 4. Adaugă logo-ul (dacă ai fișierul)
cp /calea/catre/logo.png app/logo.png
```

### Pornire server local

```bash
# Pornește serverul HTTP pe portul 8080
npm run serve
# sau
npx serve app -p 8080

# Accesează în browser:
# http://localhost:8080/index.html
```

---

## 6. Rularea testelor

### Toate testele (Chromium + Firefox, headless)

```bash
npm test
# sau
npx playwright test
```

### Testele cu browser vizibil (pentru debugging)

```bash
npm run test:headed
# sau
npx playwright test --headed
```

### Rulare test specific

```bash
npx playwright test --grep "telefonul acceptă"
npx playwright test --grep "butonul Next"
```

### Rulare doar pe Chromium

```bash
npx playwright test --project=chromium
```

### Deschide raportul HTML după teste

```bash
npx playwright show-report
```

### Descrierea testelor implementate

| # | Test | Ce verifică |
|---|------|------------|
| 1 | Pagina se deschide | Titlul paginii conține "TramEvents" |
| 2 | Heading și formular există | `h1.main-heading` și `#mainForm` sunt vizibile |
| 3 | Logo există | `.logo-circle` este vizibil |
| 4 | Câmpuri obligatorii pasul 1 | `eventType`, `Nume organizator`, `Email`, `Telefon` |
| 5 | Telefon respinge litere | `fill('abc')` → valoarea rămâne goală |
| 6 | Telefon maxlength=9 | Atribut HTML verificat |
| 7 | Data câmpului are `min` setat | JS setează `min` = data de azi |
| 8 | Next ascuns la start | `btn-hidden` clasa prezentă înainte de completare |
| 9 | Next apare după completare | Apare doar când toate câmpurile sunt completate |
| 10 | Flux Majorat complet | Completare pași 1→2→3 cu date reale |
| 11 | Nuntă afișează câmpuri specifice | `Zona mireasă`, `Zona mire` vizibile |
| 12 | Corporate nu afișează câmpuri nuntă | `Zona mireasă` ascunsă pentru Corporate |
| 13 | Panoul pasului 3 diferă per tip | `panel-4-corporate` activ, `panel-4-nunta` ascuns |
| 14 | Stepper pasul 1 activ la start | `#dot-1` are clasa `active` |
| 15 | Stepper se actualizează | `#dot-1` → `done`, `#dot-2` → `active` după Next |
| 16 | Butonul Back funcționează | Revine la panoul anterior |

---

## 7. Linting și analiză statică

### HTMLHint – verificare HTML

```bash
npm run lint:html
# sau
npx htmlhint app/index.html --config .htmlhintrc
```

**Reguli activate (`.htmlhintrc`):**
- `tagname-lowercase` — tag-uri în litere mici
- `attr-lowercase` — atribute în litere mici
- `attr-value-double-quotes` — valori atribute în ghilimele duble
- `doctype-first` — DOCTYPE obligatoriu
- `tag-pair` — tag-uri deschise trebuie închise
- `id-unique` — ID-uri unice în pagină
- `doctype-html5` — DOCTYPE trebuie să fie HTML5

### ESLint – verificare JavaScript

```bash
npm run lint:js
# sau
npx eslint app/script.js
```

**Reguli activate (`.eslintrc.json`):**
- `no-unused-vars` — variabile declarate dar nefolosite (warning)
- `no-undef` — variabile nedeclarate (warning)
- `eqeqeq` — folosire `===` în loc de `==` (warning)
- `no-var` — folosire `let`/`const` în loc de `var` (warning)
- `no-duplicate-case` — cazuri duplicate în `switch` (error)
- `no-unreachable` — cod inaccesibil (error)

### Rulare ambele lint-uri simultan

```bash
npm run lint
```

---

## 8. Docker – containerizare cu Nginx

### Build imagine Docker

```bash
docker build -t tramevents-formular .
```

### Rulare container local

```bash
docker run -d -p 8080:80 --name tramevents tramevents-formular

# Accesează: http://localhost:8080
```

### Oprire și ștergere container

```bash
docker stop tramevents
docker rm tramevents
```

### Verificare imagine construită

```bash
docker images tramevents-formular
docker inspect tramevents-formular
```

### Ce face Dockerfile-ul

Imaginea este bazată pe `nginx:1.27-alpine` (imagine minimală ~40MB):

1. Elimină configurația default Nginx
2. Copiază fișierele din `app/` în directorul Nginx
3. Configurează Nginx cu:
   - **Security headers** (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
   - **Compresie gzip** pentru CSS și JavaScript
   - **Cache** pentru assets statice (1 an)
   - **Fallback** la `index.html` pentru URL-uri necunoscute
4. Expune portul 80
5. Adaugă **healthcheck** automat

---

## 9. Scanare securitate cu Trivy

[Trivy](https://trivy.dev) (Aqua Security) este un scanner open-source de vulnerabilități pentru imagini Docker, fișiere de configurare și sisteme de fișiere.

### Instalare Trivy local

**Linux / WSL:**
```bash
sudo apt-get install wget apt-transport-https gnupg lsb-release
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | \
  sudo tee /etc/apt/sources.list.d/trivy.list
sudo apt-get update && sudo apt-get install trivy
```

**macOS:**
```bash
brew install trivy
```

**Windows (via Docker):**
```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image tramevents-formular:latest
```

### Scanare imagine locală

```bash
# Afișare vulnerabilități HIGH și CRITICAL
trivy image --severity HIGH,CRITICAL tramevents-formular:latest

# Toate vulnerabilitățile (ALL)
trivy image tramevents-formular:latest

# Export raport JSON
trivy image --format json --output trivy-report.json tramevents-formular:latest

# Export raport SARIF (pentru GitHub Security tab)
trivy image --format sarif --output trivy-results.sarif tramevents-formular:latest
```

### Interpretarea rezultatelor

| Severitate | Culoare | Acțiune recomandată |
|-----------|---------|---------------------|
| CRITICAL | 🔴 Roșu | Actualizare imediată obligatorie |
| HIGH | 🟠 Portocaliu | Actualizare în sprint-ul curent |
| MEDIUM | 🟡 Galben | Planificare actualizare |
| LOW | 🟢 Verde | Monitorizare |

Folosind `nginx:alpine`, imaginea are un număr foarte mic de pachete instalate, reducând drastic suprafața de atac față de `nginx:latest` bazat pe Debian.

---

## 10. Scanare secrete cu Gitleaks

[Gitleaks](https://github.com/gitleaks/gitleaks) detectează secrete hardcodate în codul sursă: parole, chei API, tokeni de acces, credențiale AWS/GCP, etc.

### Instalare Gitleaks local

**Linux / WSL:**
```bash
# Via binary (recomandat)
curl -sSfL https://github.com/gitleaks/gitleaks/releases/latest/download/gitleaks_linux_x64.tar.gz | \
  tar -xz && sudo mv gitleaks /usr/local/bin/
```

**macOS:**
```bash
brew install gitleaks
```

**Windows:**
```bash
# Descarcă binarul de pe https://github.com/gitleaks/gitleaks/releases
# sau via Chocolatey:
choco install gitleaks
```

### Rulare scanare locală

```bash
# Scanare întregul repository (incluzând istoricul Git)
gitleaks detect --source . --config .gitleaks.toml

# Scanare fără raport (doar exit code)
gitleaks detect --source . --no-git

# Scanare cu raport JSON
gitleaks detect --source . --report-format json --report-path gitleaks-report.json

# Scanare commit specific
gitleaks detect --source . --log-opts="HEAD~5..HEAD"
```

### Cum funcționează

Gitleaks caută în codul sursă și în istoricul Git după pattern-uri predefinite (regex) pentru sute de tipuri de secrete:
- Chei AWS (`AKIA...`)
- Tokeni GitHub (`ghp_...`)
- Chei private RSA/SSH
- Credențiale baze de date
- Tokeni JWT
- Și sute de alți furnizori cloud

Configurația `.gitleaks.toml` din proiect adaugă reguli personalizate și excluderi relevante pentru contextul TramEvents.

---

## 11. Pipeline GitHub Actions – CI/CD

### Configurare repository GitHub

```bash
# 1. Creează repository pe GitHub (github.com → New repository)
# Nume: licenta-tramevents-ci-cd
# Vizibilitate: Public (pentru GitHub Actions gratuit fără limite)

# 2. Inițializează Git local
git init
git add .
git commit -m "feat: proiect initial licenta TramEvents CI/CD"

# 3. Conectează la GitHub
git remote add origin https://github.com/USERUL_TAU/licenta-tramevents-ci-cd.git
git branch -M main
git push -u origin main
```

### Structura pipeline-ului (`.github/workflows/ci.yml`)

Pipeline-ul are **5 job-uri** care rulează în ordine definită:

```
push/PR
   │
   ├─► Job 1: lint          (HTMLHint + ESLint)
   │         │
   │         ▼ (dacă lint trece)
   ├─► Job 2: test          (Playwright Chromium + Firefox)
   │         │
   └─► Job 3: gitleaks      (rulează în paralel cu lint)
             │
             ▼ (dacă test trece)
         Job 4: docker-security  (Docker Build + Trivy)
             │
             ▼ (întotdeauna)
         Job 5: summary     (raport final)
```

### Costul pe GitHub Actions

Toate resursele folosite sunt **100% gratuite**:

| Resursă | Plan Free GitHub | Consum estimat |
|---------|-----------------|----------------|
| Minutes/lună | 2000 min | ~3-5 min/rulare |
| Storage artifacts | 500 MB | ~50 MB/rulare |
| Gitleaks Action | Gratuit (open-source) | — |
| Trivy | Gratuit (open-source) | — |
| Playwright | Gratuit | — |

### Vizualizare rezultate

Accesează `https://github.com/USERUL_TAU/licenta-tramevents-ci-cd/actions` pentru a vedea:
- **Status fiecărui job** (verde/roșu)
- **Logs complete** pentru debugging
- **Artifacts** (raport Playwright HTML, imagine Docker)
- **Summary** vizual cu tabelul rezultatelor
- **Security tab** (pentru raportul Trivy SARIF)

---

## 12. Diagrama pipeline-ului

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions Runner                         │
│                    (ubuntu-latest)                               │
│                                                                  │
│  ┌─────────────────┐      ┌─────────────────────────────────┐   │
│  │   JOB: lint     │      │        JOB: gitleaks            │   │
│  │                 │      │                                  │   │
│  │ npm ci          │      │ git clone --fetch-depth=0        │   │
│  │ htmlhint        │      │ gitleaks detect                  │   │
│  │ eslint          │      │                                  │   │
│  └────────┬────────┘      └─────────────────────────────────┘   │
│           │ needs: lint                                          │
│           ▼                                                      │
│  ┌─────────────────┐                                            │
│  │   JOB: test     │                                            │
│  │                 │                                            │
│  │ npm ci          │                                            │
│  │ playwright      │                                            │
│  │ install         │                                            │
│  │ playwright test │                                            │
│  │ (Chromium +     │                                            │
│  │  Firefox)       │                                            │
│  └────────┬────────┘                                            │
│           │ needs: test                                          │
│           ▼                                                      │
│  ┌──────────────────────┐                                       │
│  │  JOB: docker-        │                                       │
│  │  security            │                                       │
│  │                      │                                       │
│  │ docker build         │                                       │
│  │ trivy image          │                                       │
│  │ (HIGH + CRITICAL)    │                                       │
│  │ upload SARIF         │                                       │
│  └──────────┬───────────┘                                       │
│             │ needs: all (always)                               │
│             ▼                                                    │
│  ┌──────────────────┐                                           │
│  │  JOB: summary    │                                           │
│  │  GitHub Summary  │                                           │
│  └──────────────────┘                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Rezultate și interpretare

### Ce înseamnă un pipeline verde ✅

Un pipeline complet verde garantează că:
- Codul HTML respectă standardele W3C (fără tag-uri greșite, ID-uri duplicate, etc.)
- Codul JavaScript nu conține erori de sintaxă sau variabile nedeclarate
- Toate cele 16 scenarii de testare automată trec în Chromium și Firefox
- Nu există secrete (parole, chei API) expuse în codul sursă sau istoricul Git
- Imaginea Docker nu conține vulnerabilități CRITICE cunoscute
- Aplicația poate fi containerizată și servită consistent

### Beneficiile CI/CD pentru proiectul TramEvents

**Fără pipeline CI/CD:**
- Erori HTML/JS descoperite târziu (la deployment sau de utilizatori)
- Secrete expuse accidental pot rămâne nedescoperite luni de zile
- Vulnerabilități în dependențe necunoscute
- Testare manuală incompletă și inconsistentă

**Cu pipeline CI/CD:**
- Orice bug detectat automat în < 5 minute de la commit
- Zero toleranță pentru secrete în cod (blocaj automat)
- Vizibilitate completă asupra stării aplicației la orice moment
- Confidence ridicat la deployment (dacă trec testele, merge în producție)

---

## 14. Comenzi de referință rapidă

```bash
# ── SETUP INIȚIAL ──────────────────────────────────────────────
npm install                              # Instalare dependențe
npx playwright install chromium firefox  # Instalare browsere

# ── DEVELOPMENT ────────────────────────────────────────────────
npm run serve                            # Server local port 8080
# http://localhost:8080/index.html

# ── TESTARE ────────────────────────────────────────────────────
npm test                                 # Toate testele (headless)
npm run test:headed                      # Cu browser vizibil
npx playwright test --grep "telefon"     # Test specific după nume
npx playwright test --project=chromium   # Doar Chromium
npx playwright show-report               # Deschide raportul HTML

# ── LINTING ────────────────────────────────────────────────────
npm run lint                             # Ambele (HTML + JS)
npm run lint:html                        # Doar HTMLHint
npm run lint:js                          # Doar ESLint

# ── DOCKER ─────────────────────────────────────────────────────
docker build -t tramevents-formular .    # Build imagine
docker run -d -p 8080:80 tramevents-formular  # Rulare container
docker stop $(docker ps -q)             # Oprire containere active

# ── TRIVY ──────────────────────────────────────────────────────
trivy image tramevents-formular:latest   # Scanare completă
trivy image --severity CRITICAL tramevents-formular:latest  # Doar critice

# ── GITLEAKS ───────────────────────────────────────────────────
gitleaks detect --source . --config .gitleaks.toml  # Scanare secrete

# ── GIT / GITHUB ACTIONS ───────────────────────────────────────
git add . && git commit -m "feat: ..." && git push  # Declanșează pipeline
```

---

## Autor

Proiect realizat în scopul lucrării de licență.  
Aplicație web: [TramEvents](https://tramevents.ro)

---

*Documentație generată pentru lucrarea de licență – Implementarea unui pipeline CI/CD pentru testarea automată și verificarea securității unei aplicații web.*
