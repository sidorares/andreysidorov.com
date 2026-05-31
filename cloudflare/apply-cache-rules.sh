#!/usr/bin/env bash
# Apply Cache Rules from cloudflare/cache-rules.rules.json
#
# flarectl does not manage Cache Rules (only legacy Page Rules list). This script uses:
#   - Cloudflare API (curl) — resolve zone ID, deploy rules (works with zone-scoped tokens)
#   - flarectl (optional) — post-apply cache purge
#
# Requires: curl, jq (flarectl optional, for purge only)
# Auth: CF_API_TOKEN or CLOUDFLARE_API_TOKEN with Zone → Cache Rules → Edit
#
# Usage:
#   ./cloudflare/apply-cache-rules.sh [zone-name|zone-id] [--dry-run] [--no-purge]
#   CLOUDFLARE_ZONE_ID=... ./cloudflare/apply-cache-rules.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RULES_FILE="${ROOT}/cloudflare/cache-rules.rules.json"
ZONE_NAME="andreysidorov.com"
DRY_RUN=false
DO_PURGE=true

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --no-purge) DO_PURGE=false ;;
    --*) ;;
    *) ZONE_NAME="$arg" ;;
  esac
done

TOKEN="${CLOUDFLARE_API_TOKEN:-${CF_API_TOKEN:-}}"
if [[ -z "$TOKEN" ]]; then
  echo "error: set CLOUDFLARE_API_TOKEN or CF_API_TOKEN" >&2
  exit 1
fi

for cmd in curl jq; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "error: missing required command: $cmd" >&2
    exit 1
  fi
done

if [[ ! -f "$RULES_FILE" ]]; then
  echo "error: rules file not found: $RULES_FILE" >&2
  exit 1
fi

# 32-char hex Cloudflare zone ID
is_zone_id() {
  [[ "$1" =~ ^[a-fA-F0-9]{32}$ ]]
}

resolve_zone_id() {
  local name_or_id="$1"

  if is_zone_id "$name_or_id"; then
    echo "$name_or_id"
    return 0
  fi

  if [[ -n "${CLOUDFLARE_ZONE_ID:-}" ]]; then
    echo "$CLOUDFLARE_ZONE_ID"
    return 0
  fi

  echo "==> Resolving zone ID (Cloudflare API)" >&2
  local resp
  resp="$(curl -sS -G "https://api.cloudflare.com/client/v4/zones" \
    --data-urlencode "name=${name_or_id}" \
    --data-urlencode "status=active" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json")"

  if ! echo "$resp" | jq -e '.success == true' >/dev/null 2>&1; then
    echo "error: zones API lookup failed:" >&2
    echo "$resp" | jq '.' >&2 2>/dev/null || echo "$resp" >&2
    return 1
  fi

  local id
  id="$(echo "$resp" | jq -r --arg n "$name_or_id" '
    [.result[] | select(.name == $n) | .id][0] // .result[0].id // empty
  ')"

  if [[ -n "$id" ]]; then
    echo "$id"
    return 0
  fi

  # flarectl may use different credentials (e.g. API key in shell profile)
  if command -v flarectl >/dev/null 2>&1; then
    echo "==> Resolving zone ID (flarectl fallback)" >&2
    local flare_id
    flare_id="$(flarectl --json zone info "$name_or_id" 2>/dev/null | jq -r '.[0].ID // .[0].id // empty' || true)"
    if [[ -n "$flare_id" ]]; then
      echo "$flare_id"
      return 0
    fi
  fi

  echo "error: could not resolve zone ID for ${name_or_id}" >&2
  echo "  - Check the zone name and that the token can read this zone (Zone → Zone → Read)." >&2
  echo "  - Or pass the zone ID directly, or set CLOUDFLARE_ZONE_ID." >&2
  echo "  - flarectl returned empty when the token lacks zone list access (common with narrow API tokens)." >&2
  return 1
}

echo "==> Resolving zone"
ZONE_ID="$(resolve_zone_id "$ZONE_NAME")"
if is_zone_id "$ZONE_NAME"; then
  echo "    zone ID: $ZONE_ID"
else
  echo "    zone: $ZONE_NAME ($ZONE_ID)"
fi

RULES_PAYLOAD="$(jq '{ rules: .rules }' "$RULES_FILE")"
ENTRYPOINT="https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/rulesets/phases/http_request_cache_settings/entrypoint"
RULESETS="https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/rulesets"

CREATE_PAYLOAD="$(jq -n \
  --argjson rules "$(jq '.rules' "$RULES_FILE")" \
  '{
    name: "andreysidorov.com cache rules",
    description: "GitHub Pages origin (repo cloudflare/cache-rules.rules.json)",
    kind: "zone",
    phase: "http_request_cache_settings",
    rules: $rules
  }')"

api_error_code() {
  echo "$1" | jq -r '.errors[0].code // empty' 2>/dev/null || true
}

echo "==> Current cache rules entrypoint (GET)"
CURRENT="$(curl -sS "$ENTRYPOINT" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")"

ENTRYPOINT_EXISTS=true
if echo "$CURRENT" | jq -e '.success == true' >/dev/null 2>&1; then
  EXISTING_COUNT="$(echo "$CURRENT" | jq '.result.rules | length')"
  echo "    existing rules: $EXISTING_COUNT"
elif [[ "$(api_error_code "$CURRENT")" == "10003" ]]; then
  ENTRYPOINT_EXISTS=false
  echo "    no entrypoint yet (first-time setup for this zone)"
else
  echo "error: could not read cache rules entrypoint:" >&2
  echo "$CURRENT" | jq '.' >&2 2>/dev/null || echo "$CURRENT" >&2
  echo >&2
  echo "Ensure the API token has: Zone → Cache Rules → Edit (and Account Rulesets → Edit)." >&2
  exit 1
fi

if $DRY_RUN; then
  if $ENTRYPOINT_EXISTS; then
    echo "==> Dry run — would PUT entrypoint (replace all rules in this phase):"
  else
    echo "==> Dry run — would POST zone ruleset (create entrypoint + rules):"
  fi
  echo "$RULES_PAYLOAD" | jq '.rules[] | {description, expression, action, action_parameters}'
  exit 0
fi

if $ENTRYPOINT_EXISTS; then
  echo "==> Applying cache rules (PUT entrypoint — replaces all rules in this phase)"
  RESPONSE="$(curl -sS "$ENTRYPOINT" \
    -X PUT \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    --data "$RULES_PAYLOAD")"
else
  echo "==> Creating cache rules entrypoint (POST zone ruleset)"
  RESPONSE="$(curl -sS "$RULESETS" \
    -X POST \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    --data "$CREATE_PAYLOAD")"

  if ! echo "$RESPONSE" | jq -e '.success == true' >/dev/null 2>&1; then
    echo "    POST did not succeed, retrying PUT entrypoint..."
    RESPONSE="$(curl -sS "$ENTRYPOINT" \
      -X PUT \
      -H "Authorization: Bearer ${TOKEN}" \
      -H "Content-Type: application/json" \
      --data "$RULES_PAYLOAD")"
  fi
fi

if ! echo "$RESPONSE" | jq -e '.success == true' >/dev/null 2>&1; then
  echo "error: apply failed:" >&2
  echo "$RESPONSE" | jq '.' >&2
  exit 1
fi

APPLIED="$(echo "$RESPONSE" | jq '.result.rules | length')"
echo "    applied $APPLIED rule(s)"

if $DO_PURGE; then
  PURGE_ZONE="$ZONE_NAME"
  if is_zone_id "$ZONE_NAME"; then
    PURGE_ZONE="$(echo "$RESPONSE" | jq -r '.result.name // empty')"
    PURGE_ZONE="${PURGE_ZONE:-andreysidorov.com}"
  fi
  if command -v flarectl >/dev/null 2>&1; then
    echo "==> Purging zone cache (flarectl zone purge --everything)"
    flarectl zone purge --zone="$PURGE_ZONE" --everything
    echo "    purge requested"
  else
    echo "==> Purging zone cache (API)"
    curl -sS -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
      -H "Authorization: Bearer ${TOKEN}" \
      -H "Content-Type: application/json" \
      --data '{"purge_everything":true}' | jq -e '.success == true' >/dev/null
    echo "    purge requested"
  fi
fi

echo "==> Done. Verify with:"
echo "    curl -sI \"https://andreysidorov.com/\" | grep -iE 'cf-cache-status|cache-control'"
echo "    curl -sI \"https://andreysidorov.com/assets/<hash>.js\" | grep -iE 'cf-cache-status|cache-control'"
