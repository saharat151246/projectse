const { execSync } = require('child_process');
try {
  console.log("NETSTAT OUTPUT:");
  const netstat = execSync('netstat -ano | findstr :5000').toString();
  console.log(netstat);
  const lines = netstat.trim().split('\n');
  for (const line of lines) {
    if (line.includes('LISTENING')) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      console.log(`FOUND PID: ${pid}`);
      const wmic = execSync(`wmic process where processid=${pid} get commandline`).toString();
      console.log(`COMMAND LINE for ${pid}:`, wmic);
    }
  }
} catch (e) {
  console.log("Error:", e.message);
}
