
const GITHUB_ACCESS_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

/**
 * Invites a user as a collaborator to a GitHub repository.
 * @param repo The repository in "owner/repo" format.
 * @param username The GitHub username to invite.
 * @returns The response data or throws an error.
 */
export async function inviteCollaborator(repo: string, username: string) {
  if (!GITHUB_ACCESS_TOKEN) {
    throw new Error("Missing GITHUB_ACCESS_TOKEN");
  }

  const url = `https://api.github.com/repos/${repo}/collaborators/${username}`;
  
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_ACCESS_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      permission: "pull", // 'pull' allows reading (cloning), 'push' allows writing. 'pull' is safer for customers.
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("GitHub Invite Error:", errorData);
    throw new Error(errorData.message || "Failed to invite collaborator");
  }

  return response.json(); // May be empty for 204 No Content (if already invited/added)
}
