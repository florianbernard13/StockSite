# app/assets.py
import json
from pathlib import Path
from flask import current_app, url_for

_manifest_cache = None

def _load_manifest():
    global _manifest_cache
    if _manifest_cache is not None:
        return _manifest_cache
    manifest_path = current_app.config.get("VITE_MANIFEST_PATH",
                                           Path(current_app.static_folder) / "manifest.json")
    try:
        _manifest_cache = json.loads(manifest_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        _manifest_cache = {}
    return _manifest_cache

def vite_asset(path: str) -> str:
    path = path.lstrip("/")
    vite_server = current_app.config.get("VITE_DEV_SERVER")
    if vite_server:
        return f"{vite_server.rstrip('/')}/{path}"
    manifest = _load_manifest()
    if manifest and path in manifest:
        return url_for("static", filename=manifest[path]["file"])
    return url_for("static", filename=path)
