import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { Octokit } from "@octokit/rest";

const GITHUB_API_BASE = process.env.GITHUB_API_BASE || "https://api.github.com";

/**
 * Generates a JSON Web Token (JWT) for GitHub App authentication.
 */
function getAppJwt() {
    const appId = process.env.GITHUB_APP_ID;
    const privateKeyBase64 = process.env.GITHUB_APP_PRIVATE_KEY_BASE64;

    if (!appId || !privateKeyBase64) {
        throw new Error("Missing GITHUB_APP_ID or GITHUB_APP_PRIVATE_KEY_BASE64 in environment");
    }

    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iat: now - 60,
        exp: now + 600,
        iss: appId
    };

    const privateKey = Buffer.from(privateKeyBase64, "base64").toString("utf8");

    return jwt.sign(payload, privateKey, { algorithm: "RS256" });
}

/**
 * Returns an Octokit client authenticated as a specific installation.
 */
export async function getInstallationClient(installationId) {
    const appJwt = getAppJwt();

    const res = await fetch(`${GITHUB_API_BASE}/app/installations/${installationId}/access_tokens`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${appJwt}`,
            Accept: "application/vnd.github+json"
        }
    });

    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Failed to get installation access token: ${res.status} ${errorBody}`);
    }

    const json = await res.json();
    return new Octokit({ auth: json.token });
}

/**
 * Returns an Octokit client authenticated with a user access token.
 */
export function getOAuthClient(userAccessToken) {
    return new Octokit({ auth: userAccessToken });
}

/**
 * Lists repositories for the authenticated user.
 */
export async function listUserRepos(octokit) {
    const { data } = await octokit.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: "updated"
    });

    return data.map(r => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        private: r.private,
        owner: r.owner.login,
        default_branch: r.default_branch
    }));
}

/**
 * Lists branches for a specific repository.
 */
export async function listBranches(octokit, owner, repo) {
    const { data } = await octokit.repos.listBranches({
        owner,
        repo,
        per_page: 100
    });

    return data.map(b => b.name);
}

/**
 * Downloads a repository ZIP archive for a specific ref.
 */
export async function downloadRepoZip(octokit, owner, repo, ref) {
    const res = await octokit.request("GET /repos/{owner}/{repo}/zipball/{ref}", {
        owner,
        repo,
        ref
    });

    return Buffer.from(res.data);
}

/**
 * Creates a new branch and a Pull Request.
 */
export async function createBranchAndPr(octokit, { owner, repo, baseBranch, newBranch, title, body }) {
    // 1. Get current base branch SHA
    const { data: baseRef } = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${baseBranch}`
    });

    // 2. Create new branch
    await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${newBranch}`,
        sha: baseRef.object.sha
    });

    // 3. Create Pull Request
    const { data: pr } = await octokit.pulls.create({
        owner,
        repo,
        title,
        head: newBranch,
        base: baseBranch,
        body
    });

    return pr.html_url;
}
