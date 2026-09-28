# MetaGames CMS — Backend

A PHP 8 + PDO/MySQL backend that replaces the static `src/data/*.json` files with a
database-driven, session-authenticated admin panel. The public landing page (`src/index.html`)
now reads its content from a small JSON API instead of the JSON files.

> **⚠️ Not yet tested against a live database — see "Before you push" below.** All PHP files have
> been syntax-checked (`php -l`) but the CRUD flow has not been exercised against a real MySQL
> instance yet. Whoever connects this to a database next should run through the checklist below
> before merging/pushing.

## Project structure

```
config/
  database.php          <- PDO singleton (getPDO()) — fill in your DB credentials here

includes/
  auth.php               <- requireLogin() (redirects, for HTML pages)
                              requireApiLogin() (401 JSON, for API endpoints)
                              isLoggedIn()
  function.php            <- sanitize(), sanitizeValue(), jsonResponse(), getRequestBody(),
                              getArrayFields(), getSectionContent(), saveSectionContent()
  crud.php                <- handleSectionCrud(): shared GET/POST/PATCH/DELETE router used by
                              every api/admin/{section}.php file

api/
  public/
    get_section.php       <- GET ?section=navbar -> public JSON (landing page reads this)
  admin/                  <- session-gated (requireApiLogin(), 401 JSON if not logged in)
    navbar.php
    header.php
    emblem.php
    news.php
    effects.php
  auth/                   <- not session-gated (you can't require a session to log in)
    register.php          <- POST {username, password} -> create admin
    login.php              <- POST {username, password} -> start session
    logout.php              <- POST -> destroy session

src/
  admin/                  <- HTML pages only, zero SQL, zero json_encode()
    login.php
    register.php
    logout.php
    index.php              <- dashboard, links to all 5 sections
    sections/
      navbar.php, header.php, emblem.php, news.php, effects.php
  js/
    admin/                 <- admin-only JS, separate from the public site's src/js tree
      services.js           <- apiGet/apiPost/apiPatch/apiDelete
      utilities.js            <- showToast(), escHtml()
      components/
        ObjectEditor.js       <- reusable: any object/scalar field, Read + Update
        ArrayEditor.js         <- reusable: any list field, full CRUD
      pages/
        navbar.js, header.js, emblem.js, news.js, effects.js
    sections/, core/, effects/  <- unchanged public site JS (now fetches from the API)
  data/                    <- old static JSON files; no longer read by the site, kept for reference

setup.sql                 <- run once to create the DB, both tables, and seed content
```

## Requirements

- PHP 8+ with the `pdo_mysql` extension enabled
- MySQL 5.7+/8.0 or MariaDB (the `page_sections.content` column uses the native `JSON` type)
- Node.js (only needed if you edit Tailwind classes and want to rebuild `src/output.css`)

## Setup

1. **Create the database.** Run `setup.sql` once against your MySQL server:
   ```
   mysql -u root -p < setup.sql
   ```
   or paste its contents into phpMyAdmin. This creates the `metagames_cms` database, the
   `admins` and `page_sections` tables, and seeds `page_sections` with the content that used to
   live in `src/data/*.json`.

2. **Configure the connection.** Edit `config/database.php` and set `DB_HOST`, `DB_NAME`,
   `DB_USER`, `DB_PASS` for your environment. Everything else reads through the single
   `getPDO()` function, so this is the only place credentials live.

3. **Serve the project from its root**, e.g.:
   ```
   php -S localhost:8000
   ```
   (or drop the folder into XAMPP/WAMP's `htdocs`). All API and asset paths are root-relative
   (`/api/...`), so the document root must be the project root, not `src/`.

4. **Create the first admin account.** Visit `/src/admin/register.php`, pick a username and an
   8+ character password, then log in at `/src/admin/login.php`. You'll land on
   `/src/admin/index.php`, the dashboard.

5. **(Only if you change admin page markup)** rebuild the Tailwind CSS so new utility classes
   actually exist in `src/output.css`:
   ```
   npm install
   npm run build:css
   ```

## How content flows

- **Public site** (`src/index.html` + `src/js/sections/*.js`, `src/js/effects/*.js`) fetches
  `GET /api/public/get_section.php?section=<name>` — no auth required, read-only.
- **Admin dashboard** (`src/admin/**`) is markup + `<script type="module">` only. Every mutation
  goes through `fetch()` to `/api/admin/{section}.php` — the browser never navigates on save,
  per the "no HTML form submissions for data mutations" rule. Auth pages (login/register/logout)
  follow the same rule: they `fetch()` to `/api/auth/*.php` rather than doing a native form POST.
- **`api/admin/{section}.php`** files are ~10 lines each: require the shared includes, call
  `requireApiLogin()` (401 JSON, never a redirect, if there's no valid session), then delegate to
  `handleSectionCrud()` in `includes/crud.php`, which does the actual GET/POST/PATCH/DELETE work
  against that one `page_sections` row.

## The CRUD rule

Only fields whose value is a JSON **list** support Create and Delete. Plain object/scalar fields
support Read and Update only — enforced server-side in `handleSectionCrud()` via
`getArrayFields()` (`array_is_list()` under the hood), not just hidden in the admin UI.

| Section | List fields (Create/Delete + Update) | Object/scalar fields (Update only) |
|---|---|---|
| navbar | `links` | `logo`, `cta` |
| header | `colors` | `title`, `scrollEffect` |
| emblem | `stops` | — |
| news | `items` | — |
| effects | — | `reveal`, `progressBar`, `tilt` |

`emblem` and `news` were originally bare JSON arrays in their `.json` files; they're stored here
wrapped in an object (`{"stops": [...]}` / `{"items": [...]}`) so the list-field CRUD rule has
somewhere to attach. `header`'s old array-of-one-object shape (`[{ id, title, colors,
scrollEffect }]`) was flattened to a plain object (dropping the redundant `id`, since the DB row
already has one).

## API reference

All admin/auth endpoints accept and return `application/json`. Admin endpoints require an active
session (`requireApiLogin()` → `401 {"error": "Unauthorized."}` if missing).

| Method | Endpoint | Body | Notes |
|---|---|---|---|
| GET | `/api/public/get_section.php?section=<name>` | — | public, read-only |
| GET | `/api/admin/<section>.php` | — | full section content |
| POST | `/api/admin/<section>.php` | `{field, item}` | append to a list field; `422` if `field` isn't a list |
| PATCH | `/api/admin/<section>.php` | `{field, value}` | replace a whole field |
| PATCH | `/api/admin/<section>.php` | `{field, value, index}` | replace one item of a list field |
| DELETE | `/api/admin/<section>.php` | `{field, index}` | remove one item from a list field |
| POST | `/api/auth/register.php` | `{username, password}` | password ≥ 8 chars; `409` on duplicate username |
| POST | `/api/auth/login.php` | `{username, password}` | starts the session |
| POST | `/api/auth/logout.php` | — | destroys the session |

`<section>` is one of `navbar`, `header`, `emblem`, `news`, `effects`.

## Security notes

- **Prepared statements everywhere** — every query in `includes/function.php`/`crud.php`/the
  `api/auth/*` files uses PDO `?` placeholders; no user input is concatenated into SQL.
- **Passwords** are hashed with `password_hash($password, PASSWORD_DEFAULT)` and checked with
  `password_verify()` — never stored or compared as plaintext, and never run through `sanitize()`
  (that would corrupt the raw password before hashing).
- **All other string input** (usernames, and every string field going into `page_sections`) is
  run through `sanitize()` (`strip_tags` + `trim` + `htmlspecialchars`) via `sanitizeValue()`,
  which walks nested arrays/objects recursively.
- **Session gating**: `api/admin/*` endpoints return `401` JSON for an invalid/missing session —
  never a redirect (a redirect from a `fetch()` call would just get silently followed and produce
  a confusing non-JSON response). `src/admin/*` HTML pages use the redirecting `requireLogin()`
  instead, since a human is meant to land on the actual login page.

## Before you push

The DB/CRUD flow has been syntax-checked but **not run against a live MySQL instance** in this
environment (no reachable local MySQL server with known credentials). Whoever connects a real
database next should, before merging:

1. Run `setup.sql` against a fresh MySQL instance and fill in `config/database.php`.
2. Register an admin account, then log in.
3. For each of the 5 sections: load its admin page, edit an object field (Save), add a new list
   item, edit an existing list item, delete a list item — confirm the toast fires and the row
   re-renders in place without a full page reload.
4. Confirm `GET /api/admin/<section>.php` returns `401 {"error":"Unauthorized."}` when hit
   without a logged-in session (e.g. in a private/incognito window).
5. Open `src/index.html` and confirm every section (header stripe/title, navbar links, news,
   emblem wheel, sports/games effects) still renders — now sourced from the DB via
   `/api/public/get_section.php` instead of the old static JSON files.
6. Try a POST/DELETE against a non-list field (e.g. `{"field":"logo","item":{...}}` on navbar) —
   confirm it's rejected with `422`, not silently accepted.
