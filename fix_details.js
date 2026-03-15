const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '62.72.32.37',
      username: 'root',
      password: 'Aa7161062.123'
    });
    console.log("Connected...");

    const cwd = '/root/var/www/Quantum-Uz';
    
    // Upload the fixed api logic
    console.log("Uploading smart api logic...");
    await ssh.putFile('d:\\Complete\\ACSES Scholar\\api_smart.ts', `${cwd}/lib/api.ts`);

    // Rebuild
    console.log("Rebuilding frontend...");
    const build = await ssh.execCommand('npm run build', { cwd });
    console.log("Build finished.");
    
    // Restart
    console.log("Restarting frontend...");
    await ssh.execCommand('pm2 restart quantum-frontend');
    
    console.log("DONE! Detail pages should work now.");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
