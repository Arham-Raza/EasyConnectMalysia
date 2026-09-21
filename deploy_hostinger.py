import os
import posixpath
import stat
from datetime import datetime, timezone
from pathlib import Path

import paramiko


HOST = "147.93.78.243"
PORT = 65002
USERNAME = "u405159329"
DOMAIN_ROOT = "/home/u405159329/domains/easyconnect.my"
LIVE_ROOT = f"{DOMAIN_ROOT}/public_html"
BACKUP_ROOT = "/home/u405159329/site-backups"
LOCAL_ROOT = Path(__file__).resolve().parent

PUBLIC_ENTRIES = [
    ".htaccess",
    "404.html",
    "about",
    "contact",
    "css",
    "home",
    "images",
    "index.html",
    "js",
    "llm.txt",
    "llms.txt",
    "privacy-policy",
    "products",
    "refurbishment-policy",
    "resources",
    "robots.txt",
    "sitemap.xml",
    "solutions",
    "terms-and-conditions",
]


def run_checked(client, command):
    _, stdout, stderr = client.exec_command(command)
    code = stdout.channel.recv_exit_status()
    output = stdout.read().decode("utf-8", errors="replace")
    error = stderr.read().decode("utf-8", errors="replace")
    if code != 0:
        raise RuntimeError(f"Remote command failed ({code}): {error or output}")
    return output.strip()


def mkdirs(sftp, remote_path):
    parts = remote_path.strip("/").split("/")
    current = ""
    for part in parts:
        current += "/" + part
        try:
            sftp.stat(current)
        except FileNotFoundError:
            sftp.mkdir(current)


def upload_tree(sftp, local_path, remote_path):
    if local_path.is_dir():
        mkdirs(sftp, remote_path)
        for child in local_path.iterdir():
            upload_tree(sftp, child, posixpath.join(remote_path, child.name))
    else:
        mkdirs(sftp, posixpath.dirname(remote_path))
        sftp.put(str(local_path), remote_path)


def main():
    key_file = Path.home() / ".ssh" / "id_rsa_hostinger"
    pkey = None
    if key_file.exists():
        try:
            pkey = paramiko.RSAKey.from_private_key_file(str(key_file))
        except Exception:
            pkey = None

    password = os.environ.get("EC_SSH_PASSWORD")
    if not pkey and not password:
        raise RuntimeError("Neither ~/.ssh/id_rsa_hostinger nor EC_SSH_PASSWORD is available")

    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    staging = f"{DOMAIN_ROOT}/public_html_staging_{stamp}"
    backup = f"{BACKUP_ROOT}/easyconnect-public_html-{stamp}"

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    connect_kwargs = {
        "hostname": HOST,
        "port": PORT,
        "username": USERNAME,
        "timeout": 45,
        "banner_timeout": 45,
        "auth_timeout": 45,
    }
    if pkey:
        connect_kwargs["pkey"] = pkey
    else:
        connect_kwargs["password"] = password

    client.connect(**connect_kwargs)

    try:
        resolved = run_checked(client, f"readlink -f '{DOMAIN_ROOT}'")
        if resolved != DOMAIN_ROOT:
            raise RuntimeError(f"Unexpected domain root: {resolved}")

        run_checked(client, f"mkdir -p '{BACKUP_ROOT}' '{staging}'")
        sftp = client.open_sftp()
        try:
            for entry in PUBLIC_ENTRIES:
                local_path = LOCAL_ROOT / entry
                if not local_path.exists():
                    raise FileNotFoundError(local_path)
                upload_tree(sftp, local_path, posixpath.join(staging, entry))
        finally:
            sftp.close()

        run_checked(client, f"test -f '{staging}/index.html' -a -f '{staging}/css/style.css' -a -f '{staging}/about/index.html'")
        run_checked(client, f"mv '{LIVE_ROOT}' '{backup}'")
        try:
            run_checked(client, f"mv '{staging}' '{LIVE_ROOT}'")
        except Exception:
            run_checked(client, f"mv '{backup}' '{LIVE_ROOT}'")
            raise

        print(f"DEPLOYED={LIVE_ROOT}")
        print(f"BACKUP={backup}")
    finally:
        client.close()


if __name__ == "__main__":
    main()
