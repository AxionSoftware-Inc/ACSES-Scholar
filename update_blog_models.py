import paramiko
import os
import sys

host = '62.72.32.37'
user = 'root'
password = 'Aa7161062.123'
backend_path = '/var/www/acses_backend'

def deploy():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to {host}...")
        client.connect(host, username=user, password=password)
        
        with client.open_sftp() as sftp:
            files_to_upload = [
                'application/models.py',
                'application/serializers.py',
                'application/views.py',
                'application/urls.py',
                'application/admin.py'
            ]
            
            for file_rel in files_to_upload:
                local_path = os.path.join('ACSES Scholar backend', file_rel)
                remote_path = f"{backend_path}/{file_rel}"
                print(f"Uploading {local_path} -> {remote_path}")
                sftp.put(local_path, remote_path)
        
        # Run migrations
        print("Running migrations on server...")
        commands = [
            f"cd {backend_path} && venv/bin/python3 manage.py makemigrations application",
            f"cd {backend_path} && venv/bin/python3 manage.py migrate",
            "systemctl restart acses_backend"
        ]
        
        for cmd in commands:
            print(f"Executing: {cmd}")
            stdin, stdout, stderr = client.exec_command(cmd)
            print(stdout.read().decode())
            print(stderr.read().decode(), file=sys.stderr)
            
        print("Deployment and migration successful!")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    deploy()
