const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '62.72.32.37',
      username: 'root',
      password: 'Aa7161062.123'
    });
    console.log("Connected.");

    console.log("Removing /root/var/www/ACSES...");
    await ssh.execCommand('rm -rf /root/var/www/ACSES');
    
    console.log("Cleanup complete.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
