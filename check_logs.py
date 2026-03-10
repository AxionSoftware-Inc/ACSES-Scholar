import paramiko
import sys

def run():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect('62.72.32.37', username='root', password='Aa7161062.123')
    stdin, stdout, stderr = client.exec_command('tail -n 100 /var/log/nginx/access.log | grep django-admin')
    print(stdout.read().decode())
    client.close()

if __name__ == "__main__":
    run()
