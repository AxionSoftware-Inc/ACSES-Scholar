const { NodeSSH } = require('node-ssh');
const path = require('path');
const fs = require('fs');

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '62.72.32.37',
      username: 'root',
      password: 'Aa7161062.123'
    });

    // 1. Upload Backend Files
    await ssh.putFile('d:\\Complete\\ACSES Scholar\\Quantum uz backend\\application\\models.py', '/var/www/acses_backend/application/models.py');
    await ssh.putFile('d:\\Complete\\ACSES Scholar\\Quantum uz backend\\application\\serializers.py', '/var/www/acses_backend/application/serializers.py');
    await ssh.putFile('d:\\Complete\\ACSES Scholar\\seed.py', '/var/www/acses_backend/seed.py');
    console.log("Uploaded Backend Files");

    // 2. Upload Frontend Files
    const frontendBase = 'd:\\Complete\\ACSES Scholar';
    const remoteBase = '/var/www/acses_scholar';
    const files = [
      'lib/catalog.ts',
      'app/components/features/LessonPlayer.tsx',
      'app/(site)/classes/page.tsx',
      'app/(site)/classes/[classId]/page.tsx',
      'app/(site)/classes/[classId]/[subjectId]/page.tsx',
      'app/(site)/classes/[classId]/[subjectId]/[lessonId]/page.tsx'
    ];

    for (const f of files) {
      const localPath = path.join(frontendBase, f);
      const remotePath = remoteBase + '/' + f;
      const remoteDir = remotePath.split('/').slice(0, -1).join('/');
      await ssh.execCommand(`mkdir -p ${remoteDir}`);
      await ssh.putFile(localPath, remotePath);
      console.log(`Uploaded ${f}`);
    }

    // 3. Migrations
    console.log("Running migrations...");
    const migResult = await ssh.execCommand('./venv/bin/python3 manage.py makemigrations && ./venv/bin/python3 manage.py migrate', { cwd: '/var/www/acses_backend' });
    console.log(migResult.stdout || migResult.stderr);

    // 4. Seed
    console.log("Running seed...");
    const seedResult = await ssh.execCommand('./venv/bin/python3 seed.py', { cwd: '/var/www/acses_backend' });
    console.log(seedResult.stdout || seedResult.stderr);

    // 5. Restart Backend
    console.log("Restarting Backend...");
    await ssh.execCommand('systemctl restart acses_backend');

    // 6. Rebuild Frontend
    console.log("Rebuilding Frontend (this takes a while)...");
    const buildResult = await ssh.execCommand('npm run build && pm2 restart acses_frontend', { cwd: '/var/www/acses_scholar' });
    console.log(buildResult.stdout || buildResult.stderr);

    console.log("All tasks completed!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
