# Shows help
default:
    @just --list --justfile {{ justfile() }}

# build the app
build: __install
    @-rm -rf dist
    @yarn run build --base=./

update:
    yarn upgrade-interactive
    @echo "Cleaning up node_modules and reinstalling to avoid potential issues..."
    -rm -rf node_modules
    -rm yarn.lock
    yarn install --network-timeout=300000

# run the app in a development mode
run:
    @yarn start --host 0.0.0.0

# run dev stack and start the app in a development mode
run-dev:
    @echo "Starting the database..."
    @docker-compose -f docker/docker-compose-dev.yml up -d postgres
    @echo "Starting Synapse..."
    @docker-compose -f docker/docker-compose-dev.yml up -d synapse
    @echo "Starting Mock OIDC provider..."
    @docker-compose -f docker/docker-compose-dev.yml up -d mock-oidc
    @echo "Starting Matrix Authenitcation Service..."
    @docker-compose -f docker/docker-compose-dev.yml up -d mas
    @echo "Starting nginx reverse proxy (Synapse and MAS)..."
    @docker-compose -f docker/docker-compose-dev.yml up -d nginx
    @echo "Starting Element Web..."
    @docker-compose -f docker/docker-compose-dev.yml up -d element
    @echo "Ensure admin user is registered..."
    @docker-compose -f docker/docker-compose-dev.yml exec mas mas-cli manage register-user --yes --admin -p admin admin || true
    @echo "Starting the pre-built (prod version) of the Ketesa app on http://localhost:8008/admin ..."
    @docker-compose -f docker/docker-compose-dev.yml up -d ketesa-prod
    @echo "Starting the app..."
    @yarn start --host 0.0.0.0

logs-dev *flags:
    @docker-compose -f docker/docker-compose-dev.yml logs -f {{ flags }}

# stop the dev stack
stop-dev:
    @docker-compose -f docker/docker-compose-dev.yml down

# register a user in the dev stack
register-user localpart password *admin:
    docker-compose -f docker/docker-compose-dev.yml exec mas mas-cli manage register-user --yes {{ if admin =="1" {"--admin"} else {"--no-admin"} }} -p {{ password }} {{ localpart }}

comment-guard:
    #!/usr/bin/env sh
    set -u
    out=$(
      git ls-files -- '*.go' '*.rs' '*.ts' '*.tsx' '*.py' '*.cpp' \
      | while IFS= read -r f; do
          case "$f" in
            */vendor/*|vendor/*) continue ;;
            */node_modules/*|node_modules/*) continue ;;
            */mocks/*|mocks/*) continue ;;
            */automock/*|automock/*) continue ;;
            */target/*|target/*) continue ;;
            */dist/*|dist/*) continue ;;
            */build/*|build/*) continue ;;
            *.pb.go) continue ;;
            */docs/docs.go) continue ;;
          esac
          [ -f "$f" ] || continue
          if head -n 10 "$f" | grep -qE '^(//|#) Code generated .* DO NOT EDIT\.$'; then
            continue
          fi
          case "$f" in *.py) ispy=1 ;; *) ispy=0 ;; esac
          awk -v PY="$ispy" -v DQ='"""' -v SQ="'''" '
            function report(ln, msg) { printf "%s:%d: %s\n", FILENAME, ln, msg }
            function chk(n) { if (length($0) > MAXLEN) report(n, "comment over " MAXLEN " chars") }
            BEGIN { MAXLEN = 120; MAXDOC = 5 }
            {
              t = $0
              sub(/^[ \t]+/, "", t)
              if (PY == "1") {
                if (in_doc) {
                  doc_lines++
                  chk(NR)
                  if (index($0, QT) > 0) {
                    in_doc = 0
                    if (doc_lines > MAXDOC) report(doc_start, "docstring over " MAXDOC " lines; keep it short")
                  }
                  next
                }
                p = t
                while (length(p) > 3 && index("rRbBuUfF", substr(p, 1, 1)) > 0) p = substr(p, 2)
                q = ""
                if (substr(p, 1, 3) == DQ) { q = DQ } else if (substr(p, 1, 3) == SQ) { q = SQ }
                if (q != "") {
                  if (index(substr(p, 4), q) > 0) { chk(NR); run = 0; next }
                  in_doc = 1; QT = q; doc_lines = 1; doc_start = NR; chk(NR); run = 0; next
                }
                if (substr(t, 1, 1) == "#") {
                  if (substr(t, 1, 2) == "#!") { run = 0; next }
                  if (t ~ /^#[ \t]*(noqa|nosec|type:|pragma:|fmt:|isort:|pylint:|mypy:|ruff:|flake8:|coding[:=]|-\*-)/) { run = 0; next }
                  chk(NR)
                  run++
                  if (run == 1) run_start = NR
                  if (run == 2) report(run_start, "multi-line comment; single-line only")
                } else {
                  run = 0
                }
                next
              }
              if (in_block) {
                chk(NR)
                if (index($0, "*/") > 0) {
                  in_block = 0
                  report(block_start, "multi-line /* */ comment; single-line only")
                }
                next
              }
              if (substr(t, 1, 2) == "/*") {
                if (index(substr(t, 3), "*/") > 0) { chk(NR); run = 0; next }
                in_block = 1; block_start = NR; chk(NR); next
              }
              if (substr(t, 1, 2) == "//") {
                if (t ~ /^\/\/[ \t]*$/) { next }
                if (t ~ /^\/\/[a-z]+:/ || t ~ /^\/\/(line|export|cgo|sys)[ \t]/ || t ~ /^\/\/\/[ \t]*</ || t ~ /^\/\/[ \t]*@[A-Za-z]/) { run = 0; next }
                chk(NR)
                run++
                if (run == 1) run_start = NR
                if (run == 2) report(run_start, "multi-line comment; single-line only")
                next
              }
              run = 0
            }
          ' "$f"
        done
    )
    if [ -n "$out" ]; then
      printf '%s\n' "$out" | sort
      echo "comment-guard: FAIL (single-line comments only, max 120 chars, docstrings max 5 lines)"
      exit 1
    fi

# run fixers, formatters, linters, and tests in a strict order
test: comment-guard
    @echo "Making linter happy..."
    @yarn -s run fix --quiet
    @echo "Formatting code..."
    @yarn -s run format --log-level warn
    @echo "Type-checking code..."
    @yarn -s run typecheck
    @echo "Running tests..."
    @yarn -s run test --silent
    @echo "All checks passed successfully!"

# run the app in a production mode
run-prod: build
    @python -m http.server -d dist 1313

# install the project
__install:
    @yarn install --immutable --network-timeout=300000
