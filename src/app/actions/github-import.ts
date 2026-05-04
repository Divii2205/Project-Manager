"use server";

import { z } from "zod";

const urlSchema = z.string().trim().url();

const REPO_URL_RE =
  /^https?:\/\/(?:www\.)?github\.com\/([^/]+)\/([^/?#]+?)(?:\.git)?(?:[/?#].*)?$/i;

export type GithubImportResult = {
  url: string;
  owner: string;
  repo: string;
  description: string | null;
  homepage: string | null;
  topics: string[];
  techStack: string[];
  defaultBranch: string;
  readme: string | null;
};

type RepoJson = {
  full_name: string;
  description: string | null;
  homepage: string | null;
  topics?: string[];
  default_branch: string;
  html_url: string;
  message?: string;
};

type ReadmeJson = {
  content?: string;
  encoding?: string;
};

function authHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function importFromGithub(
  url: string,
): Promise<GithubImportResult> {
  const parsed = urlSchema.safeParse(url);
  if (!parsed.success) {
    throw new Error("Please enter a valid URL.");
  }
  const match = parsed.data.match(REPO_URL_RE);
  if (!match) {
    throw new Error("That doesn't look like a github.com repo URL.");
  }
  const owner = match[1]!;
  const repo = match[2]!;

  const headers = authHeaders();

  const repoRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers, cache: "no-store" },
  );

  if (repoRes.status === 404) {
    throw new Error("Repository not found. Is it public?");
  }
  if (repoRes.status === 403) {
    throw new Error(
      "GitHub rate-limited the request. Try again in a few minutes.",
    );
  }
  if (!repoRes.ok) {
    throw new Error(`GitHub API returned ${repoRes.status}.`);
  }

  const repoJson = (await repoRes.json()) as RepoJson;

  const [languagesJson, readmeText] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
      headers,
      cache: "no-store",
    })
      .then((r) =>
        r.ok ? (r.json() as Promise<Record<string, number>>) : {},
      )
      .catch(() => ({}) as Record<string, number>),
    fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers,
      cache: "no-store",
    })
      .then(async (r) => {
        if (!r.ok) return null;
        const j = (await r.json()) as ReadmeJson;
        if (typeof j.content === "string") {
          try {
            return Buffer.from(j.content, "base64").toString("utf8");
          } catch {
            return null;
          }
        }
        return null;
      })
      .catch(() => null),
  ]);

  const techStack = Object.keys(languagesJson).slice(0, 10);
  const topics = Array.isArray(repoJson.topics)
    ? repoJson.topics.slice(0, 20)
    : [];

  return {
    url: repoJson.html_url,
    owner,
    repo,
    description: repoJson.description ?? null,
    homepage:
      repoJson.homepage && repoJson.homepage.length > 0
        ? repoJson.homepage
        : null,
    topics,
    techStack,
    defaultBranch: repoJson.default_branch,
    readme: readmeText,
  };
}
