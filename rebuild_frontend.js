const { NodeSSH } = require('node-ssh');
const path = require('path');

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '62.72.32.37',
      username: 'root',
      password: 'Aa7161062.123'
    });

    console.log("Connected to server");

    const frontendPath = '/var/www/acses_scholar';
    const localBase = 'd:\\Complete\\ACSES Scholar';

    const files = [
      'app/(site)/blog/[slug]/page.tsx'
    ];

    for (const f of files) {
      const local = path.join(localBase, f);
      const remote = frontendPath + '/' + f;
      await ssh.putFile(local, remote);
      console.log(`Uploaded ${f}`);
    }

    console.log("Stopping frontend to prevent restart loop...");
    await ssh.execCommand('pm2 stop acses_frontend');

    console.log("Rebuilding frontend...");
    const buildResult = await ssh.execCommand('npm run build', { cwd: frontendPath });
    console.log("Build Output:", buildResult.stdout || buildResult.stderr);

    console.log("Restarting frontend...");
    await ssh.execCommand('pm2 restart acses_frontend');

    console.log("Frontend fix successful!");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();
