import paramiko
import sys

def run():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect('62.72.32.37', username='root', password='Aa7161062.123')
    
    # Toggle DEBUG to True via sed
    client.exec_command("sed -i 's/DJANGO_DEBUG=False/DJANGO_DEBUG=True/' /var/www/acses_backend/.env")
    client.exec_command('systemctl restart acses_backend')
    print("DEBUG set to True and restarted")
    client.close()

if __name__ == "__main__":
    run()
