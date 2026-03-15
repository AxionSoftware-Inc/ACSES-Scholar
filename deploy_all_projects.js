const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const projects = [
  { name: 'architecture', folder: 'Architecture', port: 3002 },
  { name: 'dirac', folder: 'Dirac', port: 3003 },
  { name: 'greenhouse', folder: 'GreenHouse', port: 3004 },
  { name: 'ket-studio', folder: 'Ket-Studio-Web', port: 3005 },
  { name: 'quantum-circuit', folder: 'Quantum-Circuit', port: 3006 },
  { name: 'shakhrisabz', folder: 'Shakhrisabz', port: 3007 },
  { name: 'acses-v1', folder: 'ACSES', port: 3008 }
];

async function run() {
  try {
    await ssh.connect({
      host: '62.72.32.37',
      username: 'root',
      password: 'Aa7161062.123'
    });
    console.log("Connected to server...");

    for (const p of projects) {
      const cwd = `/root/var/www/${p.folder}`;
      console.log(`\n>>> Processing ${p.name.toUpperCase()} in ${cwd}`);

      // 1. Check node_modules
      console.log(`Checking dependencies for ${p.name}...`);
      const checkNM = await ssh.execCommand('ls node_modules', { cwd });
      if (checkNM.code !== 0) {
        console.log(`Installing dependencies for ${p.name} (this may take time)...`);
        await ssh.execCommand('npm install', { cwd });
      }

      // 2. Build
      console.log(`Building ${p.name}...`);
      const build = await ssh.execCommand('npm run build', { cwd });
      if (build.code !== 0) {
        console.log(`Build FAILED for ${p.name}`);
        console.log(build.stderr || build.stdout);
        continue; // Skip starting if build failed
      }
      console.log(`Build successful for ${p.name}`);

      // 3. Start with PM2
      console.log(`Starting ${p.name} on port ${p.port}...`);
      await ssh.execCommand(`pm2 delete ${p.name}`).catch(() => {}); // ignore error if doesn't exist
      const start = await ssh.execCommand(`pm2 start npm --name "${p.name}" -- start -- -p ${p.port}`, { cwd });
      
      if (start.code === 0) {
        console.log(`${p.name} is now LIVE on port ${p.port}`);
      } else {
        console.log(`Failed to start ${p.name}`);
        console.log(start.stderr);
      }
    }

    console.log("\nAll project processing complete!");
    const list = await ssh.execCommand('pm2 list');
    console.log(list.stdout);
    process.exit(0);

  } catch (err) {
    console.error("Critical Error:", err);
    process.exit(1);
  }
}

run();
