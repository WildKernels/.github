#!/usr/bin/env python3
"""Aggregate contributors from 4 primary kernels + kernel_patches into profile README."""
import json, os, re, sys, time, urllib.request, urllib.error
from datetime import datetime, timezone

# Explicit repo list as requested: 4 primary kernels + kernel_patches
REPOS = [
    "GKI_KernelSU_SUSFS",
    "Sultan_KernelSU_SUSFS",
    "Samsung_KernelSU_SUSFS",
    "OnePlus_KernelSU_SUSFS",
    "kernel_patches",
]
ORG = os.environ.get("ORG", "WildKernels")
README = os.environ.get("README_PATH", "profile/README.md")
TOKEN = os.environ.get("GITHUB_TOKEN", "") or os.environ.get("GH_TOKEN", "")

START = "<!-- CONTRIBUTORS_START -->"
END = "<!-- CONTRIBUTORS_END -->"
API = "https://api.github.com"
HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "wildkernels-contributors",
}
if TOKEN:
    HEADERS["Authorization"] = f"Bearer {TOKEN}"

def api_get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                if resp.status == 204:
                    return [], resp.headers
                body = resp.read().decode().strip()
                if not body:
                    return [], resp.headers
                data = json.loads(body)
                remaining = resp.headers.get("X-RateLimit-Remaining")
                if remaining and int(remaining) < 10:
                    reset = int(resp.headers.get("X-RateLimit-Reset", "0"))
                    wait = max(0, reset - int(time.time())) + 2
                    print(f"  rate limit low ({remaining}), waiting {wait}s", file=sys.stderr)
                    time.sleep(min(wait, 60))
                return data, resp.headers
        except urllib.error.HTTPError as e:
            if e.code in (403, 429) and attempt < 2:
                retry = e.headers.get("Retry-After")
                wait = int(retry) if retry and retry.isdigit() else 2 ** attempt * 5
                print(f"  HTTP {e.code} on {url}, retry {attempt+1} in {wait}s: {e.read().decode()[:200]}", file=sys.stderr)
                time.sleep(wait)
                continue
            if e.code in (404, 204):
                return [], {}
            raise
    raise RuntimeError(f"failed GET {url}")

def list_contributors(org, repo):
    contribs = []
    page = 1
    while True:
        url = f"{API}/repos/{org}/{repo}/contributors?per_page=100&page={page}&anon=false"
        try:
            data, _ = api_get(url)
        except urllib.error.HTTPError as e:
            if e.code in (204, 404):
                return []
            print(f"  warn {org}/{repo}: HTTP {e.code}", file=sys.stderr)
            return []
        if not data or not isinstance(data, list):
            break
        for u in data:
            if u.get("type") == "Bot":
                continue
            login = u.get("login")
            if not login or login.endswith("[bot]"):
                continue
            contribs.append({"login": login, "contributions": int(u.get("contributions", 0))})
        if len(data) < 100:
            break
        page += 1
        time.sleep(0.2)
    return contribs

def build_grid(contributors):
    contributors.sort(key=lambda x: (-x["total"], x["login"].lower()))
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    cols = 7
    lines = []
    lines.append('<table>')
    for i in range(0, len(contributors), cols):
        chunk = contributors[i:i+cols]
        lines.append('  <tr>')
        for c in chunk:
            login = c["login"]
            img = f"https://github.com/{login}.png?size=80"
            lines.append(f'    <td align="center"><a href="https://github.com/{login}" title="{login} ({c["total"]} contributions)"><img src="{img}" width="50" height="50" alt="" style="border-radius:50%;" /><br /><sub><b>{login}</b></sub></a></td>')
        if len(chunk) < cols:
            for _ in range(cols - len(chunk)):
                lines.append('    <td></td>')
        lines.append('  </tr>')
    lines.append('</table>')
    lines.append(f'<p align="center"><sub><b>{len(contributors)}</b> contributors &middot; updated {now}</sub></p>')
    return "\n".join(lines)

def main():
    print(f"Aggregating {len(REPOS)} repos: {', '.join(REPOS)}", file=sys.stderr)
    merged = {}
    for repo in REPOS:
        print(f"Fetching {ORG}/{repo} ...", file=sys.stderr)
        contribs = list_contributors(ORG, repo)
        print(f"  {len(contribs)} contributors", file=sys.stderr)
        for c in contribs:
            login = c["login"]
            if login not in merged:
                merged[login] = {"login": login, "total": 0}
            merged[login]["total"] += c["contributions"]
        time.sleep(0.3)
    contributors = list(merged.values())
    print(f"Merged {len(contributors)} unique", file=sys.stderr)
    grid = build_grid(contributors)
    if not os.path.exists(README):
        print(f"README not found at {README}", file=sys.stderr)
        return 1
    text = open(README, encoding="utf-8").read()
    if START not in text or END not in text:
        # Insert new Contributors section before Donations if markers missing
        insert = f"\n## \U0001f465 **Contributors**\n\n{START}\n{grid}\n{END}\n\n"
        # find Donations heading
        m = re.search(r"## \u2764\ufe0f?\s*\*?\*?Donations", text)
        if m:
            pos = m.start()
            text = text[:pos] + insert + text[pos:]
            print(f"Inserted Contributors section before Donations", file=sys.stderr)
        else:
            text = text + "\n" + insert
    else:
        pat = re.compile(re.escape(START)+r".*?"+re.escape(END), re.DOTALL)
        text, n = pat.subn(f"{START}\n{grid}\n{END}", text, count=1)
        print(f"Replaced {n} marker block(s)", file=sys.stderr)
    open(README, "w", encoding="utf-8").write(text)
    print(f"Wrote {README}", file=sys.stderr)
    return 0

if __name__ == "__main__":
    sys.exit(main())
