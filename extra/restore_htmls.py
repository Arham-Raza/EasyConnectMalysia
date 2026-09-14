import paramiko
import os
import posixpath
import stat
from pathlib import Path

HOST = "147.93.78.243"
PORT = 65002
USERNAME = "u405159329"
BACKUP_DIR = "/home/u405159329/site-backups/easyconnect-public_html-20260825-101253"
LOCAL_ROOT = Path("E:/Clients/Muhammad Numair/Development/EasyConnectSolutions/EasyConnectMalaysia")

password = os.environ.get("EC_SSH_PASSWORD", "Fu24YEhFs@")

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USERNAME, password=password, timeout=45)

sftp = client.open_sftp()

def download_htmls(remote_path, local_dir):
    for item in sftp.listdir_attr(remote_path):
        rpath = posixpath.join(remote_path, item.filename)
        lpath = local_dir / item.filename
        if stat.S_ISDIR(item.st_mode):
            lpath.mkdir(exist_ok=True)
            download_htmls(rpath, lpath)
        elif item.filename.endswith(".html"):
            print(f"Restoring {lpath}")
            sftp.get(rpath, str(lpath))

download_htmls(BACKUP_DIR, LOCAL_ROOT)
sftp.close()
client.close()
