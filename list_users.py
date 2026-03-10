import paramiko
import sys

def run():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect('62.72.32.37', username='root', password='Aa7161062.123')
    cmd = 'cd /var/www/acses_backend && ./venv/bin/python3 manage.py shell -c "from django.contrib.auth.models import User; print([(u.username, u.is_superuser, u.is_staff) for u in User.objects.all()])"'
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode())
    client.close()

if __name__ == "__main__":
    run()
