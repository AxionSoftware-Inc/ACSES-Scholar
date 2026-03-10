import paramiko
import sys

def run():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect('62.72.32.37', username='root', password='Aa7161062.123')
    
    # Check if admin exists and reset to 'admin'
    cmd = 'cd /var/www/acses_backend && ./venv/bin/python3 manage.py shell -c "from django.contrib.auth.models import User; u, _ = User.objects.get_or_create(username=\'admin\'); u.set_password(\'admin\'); u.is_superuser=True; u.is_staff=True; u.is_active=True; u.save(); print(\'Admin user reset to admin/admin\')"'
    stdin, stdout, stderr = client.exec_command(cmd)
    print(stdout.read().decode())
    client.close()

if __name__ == "__main__":
    run()
