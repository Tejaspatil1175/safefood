const port = process.env.PORT || 4000;
const url = `http://localhost:${port}/api/v1/health/ready`;

async function checkHealth() {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      console.log(`[HEALTHCHECK OK] status: ${data.status}, db: ${data.db}`);
      process.exit(0);
    } else {
      console.error(`[HEALTHCHECK FAILED] HTTP ${res.status}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`[HEALTHCHECK ERROR] ${err.message}`);
    process.exit(1);
  }
}

checkHealth();
