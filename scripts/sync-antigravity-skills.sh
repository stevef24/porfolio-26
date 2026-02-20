#!/usr/bin/env bash

set -euo pipefail

AGENT_SKILLS_DIR="${AGENT_SKILLS_DIR:-$HOME/.agents/skills}"
CODEX_SKILLS_DIR="${CODEX_SKILLS_DIR:-$HOME/.codex/skills}"
ANTI_GRAVITY_ROOT="${ANTI_GRAVITY_ROOT:-$HOME/.gemini/antigravity}"

TARGET_DIRS=(
  "$ANTI_GRAVITY_ROOT/skills"
  "$ANTI_GRAVITY_ROOT/global_skills"
)

if [[ ! -d "$AGENT_SKILLS_DIR" ]]; then
  echo "Missing agent skills directory: $AGENT_SKILLS_DIR" >&2
  exit 1
fi

if [[ ! -d "$CODEX_SKILLS_DIR" ]]; then
  echo "Missing codex skills directory: $CODEX_SKILLS_DIR" >&2
  exit 1
fi

tmp_candidates="$(mktemp)"
tmp_resolved="$(mktemp)"

cleanup() {
  rm -f "$tmp_candidates" "$tmp_resolved"
}
trap cleanup EXIT

collect_skills() {
  local root="$1"
  while IFS= read -r -d '' skill_file; do
    local skill_dir skill_name
    skill_dir="${skill_file%/SKILL.md}"
    skill_name="$(basename "$skill_dir")"
    printf '%s\t%s\n' "$skill_name" "$skill_dir"
  done < <(find "$root" -type f -name SKILL.md -print0)
}

# Codex first so codex-owned skills win on name conflicts.
{
  collect_skills "$CODEX_SKILLS_DIR"
  collect_skills "$AGENT_SKILLS_DIR"
} > "$tmp_candidates"

# Keep first entry per skill name.
awk -F '\t' '!seen[$1]++' "$tmp_candidates" > "$tmp_resolved"

skill_count="$(wc -l < "$tmp_resolved" | tr -d ' ')"
if [[ "$skill_count" -eq 0 ]]; then
  echo "No skills found to sync." >&2
  exit 1
fi

for target in "${TARGET_DIRS[@]}"; do
  mkdir -p "$target"

  while IFS= read -r -d '' existing; do
    rm -rf "$existing"
  done < <(find "$target" -mindepth 1 -maxdepth 1 -print0)

  while IFS=$'\t' read -r skill_name skill_dir; do
    ln -sfn "$skill_dir" "$target/$skill_name"
  done < "$tmp_resolved"

  broken_links="$(find "$target" -maxdepth 1 -mindepth 1 -type l ! -exec test -e {} \; -print)"
  if [[ -n "$broken_links" ]]; then
    echo "Broken links detected in $target:" >&2
    echo "$broken_links" >&2
    exit 1
  fi

  echo "Synced $(find "$target" -mindepth 1 -maxdepth 1 | wc -l | tr -d ' ') skills -> $target"
done
