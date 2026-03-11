import paramiko
import os

def run():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect('62.72.32.37', username='root', password='Aa7161062.123')
    
    with client.open_sftp() as sftp:
        # Backend
        sftp.put(r'd:\Complete\ACSES Scholar\Quantum uz backend\application\models.py', '/var/www/acses_backend/application/models.py')
        sftp.put(r'd:\Complete\ACSES Scholar\Quantum uz backend\application\serializers.py', '/var/www/acses_backend/application/serializers.py')
        print("Uploaded models/serializers")
        
        sftp.put(r'd:\Complete\ACSES Scholar\seed.py', '/var/www/acses_backend/seed.py')
        print("Uploaded seed.py")
        
        # Frontend
        frontend_base = r'd:\Complete\ACSES Scholar'
        remote_base = '/var/www/acses_scholar'
        
        # Files to upload
        files = [
            'lib/catalog.ts',
            'app/components/features/LessonPlayer.tsx',
            'app/(site)/classes/page.tsx',
            'app/(site)/classes/[classId]/page.tsx',
            'app/(site)/classes/[classId]/[subjectId]/page.tsx',
            'app/(site)/classes/[classId]/[subjectId]/[lessonId]/page.tsx'
        ]
        
        for f in files:
            local_path = os.path.join(frontend_base, f.replace('/', os.sep))
            remote_path = remote_base + '/' + f
            # Ensure remote directory exists
            remote_dir = '/'.join(remote_path.split('/')[:-1])
            client.exec_command(f"mkdir -p {remote_dir}")
            sftp.put(local_path, remote_path)
            print(f"Uploaded {f}")
            
    # Run migrations
    print("Running migrations...")
    stdin, stdout, stderr = client.exec_command('cd /var/www/acses_backend && ./venv/bin/python3 manage.py makemigrations && ./venv/bin/python3 manage.py migrate')
    print(stdout.read().decode('utf-8', errors='ignore'))
    
    # Run seed
    print("Running seed script...")
    stdin, stdout, stderr = client.exec_command('cd /var/www/acses_backend && ./venv/bin/python3 seed.py')
    print(stdout.read().decode('utf-8', errors='ignore'))
    print(stderr.read().decode('utf-8', errors='ignore'))
    
    # Restart Backend
    print("Restarting backend...")
    client.exec_command('systemctl restart acses_backend')
    
    # Rebuild Frontend
    print("Rebuilding frontend...")
    stdin, stdout, stderr = client.exec_command('cd /var/www/acses_scholar && npm run build && pm2 restart acses_frontend')
    print(stdout.read().decode('utf-8', errors='ignore'))
    print(stderr.read().decode('utf-8', errors='ignore'))
    
    print("All done!")
    client.close()

if __name__ == "__main__":
    run()
