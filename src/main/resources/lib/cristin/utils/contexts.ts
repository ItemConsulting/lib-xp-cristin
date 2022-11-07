import { run } from "/lib/xp/context";
import { connect, type RepoConnection, type ConnectParams } from "/lib/xp/node";

export function connectToRepoAsAdmin(source: ConnectParams): RepoConnection {
  return run(
    {
      repository: source.repoId,
      branch: source.branch,
      principals: ["role:system.admin"],
    },
    () => connect(source)
  );
}
