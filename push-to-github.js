import { Octokit } from '@octokit/rest'
import fs from 'fs';
import path from 'path';

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function main() {
  try {
    const octokit = await getUncachableGitHubClient();
    
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`Logged in as: ${user.login}`);
    
    const repoName = 'repaircode';
    
    let repo;
    try {
      const { data: existingRepo } = await octokit.repos.get({
        owner: user.login,
        repo: repoName
      });
      repo = existingRepo;
      console.log(`Repository ${repoName} already exists`);
    } catch (e) {
      if (e.status === 404) {
        console.log(`Creating repository: ${repoName}`);
        const { data: newRepo } = await octokit.repos.createForAuthenticatedUser({
          name: repoName,
          description: 'RepairCode project',
          private: false,
          auto_init: false
        });
        repo = newRepo;
        console.log(`Created repository: ${repo.html_url}`);
      } else {
        throw e;
      }
    }
    
    const files = [
      'README.md', 
      'main.py', 
      'package.json', 
      'package-lock.json',
      'push-to-github.js',
      'attached_assets/branding-1765023504899.json'
    ];
    
    for (const fileName of files) {
      if (fs.existsSync(fileName)) {
        const content = fs.readFileSync(fileName, 'utf8');
        const contentBase64 = Buffer.from(content).toString('base64');
        
        let sha;
        try {
          const { data: existing } = await octokit.repos.getContent({
            owner: user.login,
            repo: repoName,
            path: fileName
          });
          sha = existing.sha;
        } catch (e) {
          if (e.status !== 404) throw e;
        }
        
        await octokit.repos.createOrUpdateFileContents({
          owner: user.login,
          repo: repoName,
          path: fileName,
          message: `Add/Update ${fileName}`,
          content: contentBase64,
          sha: sha
        });
        console.log(`Pushed: ${fileName}`);
      }
    }
    
    console.log(`\nDone! Repository: ${repo.html_url}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
