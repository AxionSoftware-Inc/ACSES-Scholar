const { NodeSSH } = require('node-ssh');
const path = require('path');
const ssh = new NodeSSH();
async function run() {
  await ssh.connect({ host: '62.72.32.37', username: 'root', password: 'Aa7161062.123' });
  const frontendBase = 'd:\\Complete\\ACSES Scholar';
  const remoteBase = '/var/www/acses_scholar';
  const files = [
    'lib/catalog.ts',
    'app/components/features/LessonPlayer.tsx',
    'app/(site)/classes/page.tsx',
    'app/(site)/classes/[classId]/page.tsx',
    'app/(site)/classes/[classId]/[subjectId]/page.tsx',
    'app/(site)/classes/[classId]/[subjectId]/[lessonId]/page.tsx',
    'app/components/layout/Navbar.tsx'
  ];
  for (const f of files) {
    const localPath = path.join(frontendBase, f);
    const remotePath = remoteBase + '/' + f;
    const remoteDir = remotePath.split('/').slice(0, -1).join('/');
    await ssh.execCommand(`mkdir -p ${remoteDir}`);
    await ssh.putFile(localPath, remotePath);
    console.log(`Uploaded ${f}`);
  }
  await ssh.execCommand('rm -rf /var/www/acses_scholar/app/\\(site\\)/admin-panel');
  console.log("Removed remote admin-panel folder");
  process.exit(0);
}
run();
