import paramiko
import sys

def run():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect('62.72.32.37', username='root', password='Aa7161062.123')
    
    with client.open_sftp() as sftp:
        sftp.put(r'd:\Complete\ACSES Scholar\ACSES Scholar backend\project\settings.py', '/var/www/acses_backend/project/settings.py')
        print("Uploaded settings.py")
    
    client.exec_command('systemctl restart acses_backend')
    client.exec_command('systemctl restart nginx')
    print("Restarted services")
    client.close()

if __name__ == "__main__":
    run()
