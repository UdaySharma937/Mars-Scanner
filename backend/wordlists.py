"""
MarsScanner - Wordlist Engine
=============================
Generates MASSIVE (100,000+) wordlists for subdomain and directory
enumeration entirely in-memory (no huge static files needed), by
intelligently combining curated base words with prefixes, suffixes
and numeric ranges.

Every scan always uses the FULL generated wordlist - there is no
"choose a list size" option exposed anywhere. The size itself is
intentionally never exposed to the frontend/UI.
"""

from __future__ import annotations
from functools import lru_cache
from typing import List

# --------------------------------------------------------------------------
# SUBDOMAIN BASE WORDS (curated, real-world common subdomains)
# --------------------------------------------------------------------------
SUBDOMAIN_BASE_WORDS: List[str] = [
    "www", "www1", "www2", "www3", "mail", "mail1", "mail2", "webmail", "smtp",
    "pop", "pop3", "imap", "imap4", "ns", "ns1", "ns2", "ns3", "ns4", "dns",
    "dns1", "dns2", "ftp", "ftps", "sftp", "admin", "administrator", "portal",
    "blog", "shop", "store", "api", "api1", "api2", "apiv1", "apiv2", "dev",
    "develop", "development", "staging", "stage", "test", "testing", "demo",
    "beta", "alpha", "secure", "ssl", "vpn", "remote", "cloud", "cdn", "static",
    "assets", "img", "images", "image", "video", "videos", "media", "m",
    "mobile", "app", "apps", "web", "web1", "web2", "web3", "server", "host",
    "hosting", "panel", "cpanel", "whm", "webdisk", "autodiscover",
    "autoconfig", "mx", "mx1", "mx2", "smtp1", "smtp2", "pop1", "imap1",
    "ns5", "ns6", "support", "help", "helpdesk", "status", "monitor",
    "monitoring", "grafana", "kibana", "elastic", "jenkins", "gitlab",
    "github", "git", "svn", "repo", "repository", "docker", "k8s",
    "kubernetes", "ci", "cd", "build", "deploy", "uat", "qa", "preprod",
    "prod", "production", "internal", "intranet", "extranet", "partner",
    "partners", "client", "clients", "customer", "customers", "account",
    "accounts", "billing", "payment", "payments", "pay", "checkout", "cart",
    "order", "orders", "news", "forum", "forums", "community", "wiki", "docs",
    "documentation", "kb", "knowledgebase", "faq", "legal", "privacy",
    "careers", "jobs", "about", "contact", "info", "sales", "marketing",
    "promo", "campaign", "newsletter", "email", "exchange", "owa", "outlook",
    "office", "sso", "auth", "login", "signin", "signup", "register",
    "profile", "dashboard", "root", "superadmin", "manage", "management",
    "backend", "erp", "crm", "hr", "finance", "accounting", "inventory",
    "pos", "graphql", "rest", "soap", "ws", "websocket", "socket", "push",
    "notify", "notifications", "alert", "alerts", "log", "logs", "logging",
    "metrics", "analytics", "stats", "statistics", "report", "reports",
    "data", "database", "db", "db1", "db2", "mysql", "postgres", "mongo",
    "redis", "cache", "memcache", "search", "elasticsearch", "solr", "es",
    "queue", "kafka", "rabbitmq", "mq", "worker", "workers", "cron",
    "scheduler", "batch", "job", "jobs2", "task", "tasks", "file", "files",
    "upload", "uploads", "download", "downloads", "gallery", "stream",
    "streaming", "live", "tv", "radio", "music", "game", "games", "play",
    "player", "chat", "messenger", "sms", "voip", "call", "calls",
    "conference", "meeting", "zoom", "webinar", "event", "events",
    "calendar", "schedule", "booking", "reservation", "ticket", "tickets",
    "service", "services", "sandbox", "trial", "free", "premium", "pro",
    "plus", "vip", "gold", "local", "localhost", "home", "homepage", "main",
    "default", "site", "website", "mysite", "gateway", "proxy", "lb",
    "loadbalancer", "firewall", "access", "cert", "certs", "ca", "pki",
    "key", "keys", "token", "oauth", "oauth2", "idp", "saml", "ldap", "ad",
    "dc", "dc1", "dc2", "git2", "jira", "confluence", "bamboo", "bitbucket",
    "teamcity", "nexus", "artifactory", "sonar", "sonarqube", "vault",
    "consul", "terraform", "ansible", "puppet", "chef", "nagios", "zabbix",
    "newrelic", "datadog", "sentry", "splunk", "cdn1", "cdn2", "assets1",
    "assets2", "static1", "static2", "img1", "img2", "images1", "images2",
    "video1", "image1", "photos", "photo", "docs1", "wiki1", "api3", "apidoc",
    "swagger", "openapi", "v1", "v2", "v3", "edge", "origin", "core",
    "central", "hub", "gate", "router", "switch", "node", "node1", "node2",
    "cluster", "pool", "farm", "zone", "region", "us", "eu", "asia", "uk",
    "in", "au", "ca2", "de", "fr", "jp", "cn", "br", "mx2site", "ru", "it",
    "es2", "nl", "se", "no", "dk", "fi", "pl", "pt", "gr", "tr", "ae", "sg",
    "hk", "kr", "tw", "th", "vn", "id", "my", "ph", "za", "ng", "eg", "sa",
]

# --------------------------------------------------------------------------
# DIRECTORY / FILE BASE WORDS (curated, common web paths)
# --------------------------------------------------------------------------
DIRECTORY_BASE_WORDS: List[str] = [
    "admin", "administrator", "login", "logout", "wp-admin", "wp-content",
    "wp-includes", "wp-login", "backup", "backups", "config", "configs",
    "conf", ".git", ".svn", ".env", ".htaccess", ".htpasswd", "api", "apis",
    "uploads", "upload", "images", "image", "img", "css", "js", "scripts",
    "script", "includes", "include", "inc", "lib", "libs", "library", "src",
    "source", "test", "tests", "testing", "tmp", "temp", "cache", "data",
    "database", "db", "sql", "logs", "log", "private", "public", "secure",
    "hidden", "secret", "secrets", "dashboard", "panel", "cpanel",
    "phpmyadmin", "myadmin", "pma", "webmail", "mail", "cgi-bin", "download",
    "downloads", "files", "file", "docs", "documentation", "doc", "assets",
    "static", "media", "video", "videos", "audio", "fonts", "font", "vendor",
    "node_modules", "bin", "build", "dist", "release", "old", "old-site",
    "new", "new-site", "dev", "development", "staging", "stage", "beta",
    "demo", "sample", "samples", "example", "examples", "install",
    "installer", "setup", "config.php", "configuration", "settings",
    "system", "sys", "core", "modules", "module", "plugins", "plugin",
    "themes", "theme", "templates", "template", "layout", "layouts",
    "components", "component", "widgets", "widget", "api-docs", "swagger",
    "graphql", "rest", "soap", "ws", "websocket", "users", "user", "accounts",
    "account", "profile", "profiles", "members", "member", "register",
    "signup", "forgot-password", "reset-password", "password", "auth",
    "oauth", "token", "tokens", "session", "sessions", "cart", "checkout",
    "order", "orders", "invoice", "invoices", "payment", "payments",
    "billing", "shop", "store", "catalog", "products", "product", "category",
    "categories", "search", "sitemap", "sitemap.xml", "robots.txt",
    "crossdomain.xml", "humans.txt", "security.txt", "manifest.json",
    "package.json", "composer.json", "readme", "readme.md", "license",
    "changelog", "changelog.md", "error", "error_log", "debug", "debug.log",
    "phpinfo", "phpinfo.php", "info", "info.php", "test.php", "shell",
    "shell.php", "upload.php", "uploader", "filemanager", "file-manager",
    "ftp", "sftp", "ssh", "vpn", "proxy", "status", "health", "healthz",
    "ping", "version", "version.txt", "changelog.txt", "install.php",
    "update", "updates", "upgrade", "migrate", "migration", "migrations",
    "seed", "seeds", "fixtures", "mock", "mocks", "stub", "stubs", "report",
    "reports", "export", "exports", "import", "imports", "archive",
    "archives", "zip", "backup.zip", "backup.sql", "dump", "dump.sql",
    "db.sql", "database.sql", "site.zip", "www.zip", "web.config",
    "application", "app", "apps", "mobile", "m", "amp", "cms", "blog",
    "forum", "forums", "community", "wiki", "kb", "faq", "help", "support",
    "contact", "about", "terms", "privacy", "legal", "careers", "jobs",
    "news", "press", "media-kit", "partners", "affiliates", "docs-api",
    "console", "control-panel", "controlpanel", "manage", "management",
    "monitor", "monitoring", "metrics", "analytics", "stats", "statistics",
    "tracking", "tracker", "webhook", "webhooks", "callback", "callbacks",
    "cron", "crontab", "scheduler", "queue", "jobs-queue", "worker",
    "workers", "internal", "intranet", "extranet", "staging-api", "v1", "v2",
    "v3", "beta-api", "sandbox", "playground", "lab", "labs", "tools",
    "utilities", "util", "utils", "misc", "other", "extra", "xtra",
]

EXT_NONE = ""
SUBDOMAIN_PREFIXES = [
    "", "dev", "test", "stage", "staging", "uat", "qa", "old", "new", "beta",
    "alpha", "demo", "internal", "corp", "backup", "secure", "prod",
    "preprod", "admin", "app", "web", "api", "cloud", "edge", "legacy",
    "archive", "sandbox", "mirror", "cluster", "node",
]

DIRECTORY_EXTENSIONS = [
    "", ".php", ".html", ".htm", ".asp", ".aspx", ".jsp", ".json", ".xml",
    ".txt", ".bak", ".old", ".zip", ".tar.gz", ".sql", ".log", ".env",
    ".yml", ".yaml", ".config", ".conf", ".ini", "/",
]


def _expand(base_words: List[str], prefixes: List[str] | None, suffixes: List[str] | None,
            numbers_range: int, target: int, joiner: str = "-") -> List[str]:
    """
    Build a large, de-duplicated, priority-ordered wordlist.
    Priority order (best candidates first, filler combinations after):
      1. plain base words
      2. prefix + word combinations
      3. word + suffix combinations
      4. word + number combinations (fills up to `target`)
    """
    seen = set()
    result: List[str] = []

    def add(word: str) -> bool:
        if word and word not in seen:
            seen.add(word)
            result.append(word)
        return len(result) >= target

    # 1. plain words
    for w in base_words:
        if add(w):
            return result

    # 2. prefix + word
    if prefixes:
        for p in prefixes:
            if not p:
                continue
            for w in base_words:
                if add(f"{p}{joiner}{w}"):
                    return result

    # 3. word + suffix
    if suffixes:
        for w in base_words:
            for s in suffixes:
                if add(f"{w}{s}"):
                    return result

    # 4. word + number (fills the remainder to guarantee 100,000+ entries)
    for w in base_words:
        for n in range(numbers_range):
            if add(f"{w}{n}"):
                return result

    return result


@lru_cache(maxsize=1)
def get_subdomain_wordlist() -> List[str]:
    """Returns 100,000+ unique subdomain candidates (cached after first call)."""
    return _expand(
        base_words=SUBDOMAIN_BASE_WORDS,
        prefixes=SUBDOMAIN_PREFIXES,
        suffixes=["-old", "-new", "-backup", "-test", "-dev", "-v1", "-v2", "01", "02", "1", "2", "3"],
        numbers_range=2000,
        target=120_000,
        joiner="-",
    )


@lru_cache(maxsize=1)
def get_directory_wordlist() -> List[str]:
    """Returns 100,000+ unique directory/file candidates (cached after first call)."""
    base_with_ext: List[str] = []
    for w in DIRECTORY_BASE_WORDS:
        for ext in DIRECTORY_EXTENSIONS:
            base_with_ext.append(f"{w}{ext}")

    return _expand(
        base_words=base_with_ext,
        prefixes=["old", "new", "backup", "test", "dev", "staging", "v1", "v2", "hidden", "private"],
        suffixes=["_old", "_new", "_backup", "_bak", "_copy", "_test", "_dev", "_v1", "_v2"],
        numbers_range=2000,
        target=110_000,
        joiner="_",
    )


def wordlist_sizes() -> dict:
    """Internal helper (used only in backend logs / health checks, never sent to the UI)."""
    return {
        "subdomains": len(get_subdomain_wordlist()),
        "directories": len(get_directory_wordlist()),
    }
