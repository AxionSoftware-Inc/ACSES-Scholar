import paramiko
import sys

def run():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect('62.72.32.37', username='root', password='Aa7161062.123')
    
    file_content = """[Unit]
Description=Gunicorn instance to serve ACSES Backend
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/acses_backend
ExecStart=/var/www/acses_backend/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 --access-logfile - --error-logfile - project.wsgi:application

[Install]
WantedBy=multi-user.target"""
    
    with client.open_sftp() as sftp:
        with sftp.file('/etc/systemd/system/acses_backend.service', 'w') as f:
            f.write(file_content)
    
    client.exec_command('systemctl daemon-reload')
    client.exec_command('systemctl restart acses_backend')
    print("Updated service with logging and restarted")
    client.close()

if __name__ == "__main__":
    run()
