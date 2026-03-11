import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('62.72.32.37', username='root', password='Aa7161062.123')
client.exec_command("sed -i 's/DJANGO_DEBUG=True/DJANGO_DEBUG=False/' /var/www/acses_backend/.env")
client.exec_command('systemctl restart acses_backend')
client.close()
print("DEBUG set to False and restarted")
