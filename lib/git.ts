import { execSync } from 'node:child_process';

export function gitCommitAndPush(message: string) {
  execSync('git add blogs blog.sqlite', { stdio: 'inherit' });
  try {
    execSync(`git commit -m ${JSON.stringify(message)}`, { stdio: 'inherit' });
  } catch {
    // nothing to commit
  }
  execSync('git push origin main', { stdio: 'inherit' });
}
