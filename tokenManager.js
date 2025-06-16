import fs from 'fs';
import path from 'path';

let cachedEnv = null;

function loadEnvFile() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const envFile = path.join(process.cwd(), '.env.local');
  const envData = {};

  if (fs.existsSync(envFile)) {
    const content = fs.readFileSync(envFile, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (match) {
        let [, key, value] = match;
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        envData[key] = value;
      }
    }
  }

  cachedEnv = envData;
  return envData;
}

export async function getToken(service) {
  const env = { ...process.env, ...loadEnvFile() };

  switch (service) {
    case 'github':
      return env.GITHUB_TOKEN || env.GH_TOKEN || null;
    case 'cloudflare':
      return env.CLOUDFLARE_API_TOKEN || env.CF_API_TOKEN || null;
    default:
      throw new Error(`Unsupported service: ${service}`);
  }
}

// If executed directly, output tokens for debugging.
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      const githubToken = await getToken('github');
      console.log('✅ GitHub Token:', githubToken);

      const cloudflareToken = await getToken('cloudflare');
      console.log('✅ Cloudflare Token:', cloudflareToken);
    } catch (error) {
      console.error('❌ Error while testing tokens:', error);
    }
  })();
}
