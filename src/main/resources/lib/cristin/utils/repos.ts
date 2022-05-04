import { get as getRepo, create as createRepo } from "/lib/xp/repo";
import { run } from "/lib/xp/context";
import { connect, type RepoConnection, type NodeQueryHit, type NodeCreateParams, type RepoNode } from "/lib/xp/node";
import { BRANCH_MASTER, DEFAULT_PERMISSIONS } from "/lib/cristin/constants";
import { forceArray } from "/lib/cristin/utils";

export interface CristinNode<Data> {
  _name: string;
  data: Data;
  topics?: Array<string>;
  hidden?: boolean;
}

export function ensureRepoExist(repoName: string): boolean {
  const repo = getRepo(repoName);
  const repoExisted = repo !== null;

  if (!repoExisted) {
    createRepo({
      id: repoName,
      rootPermissions: DEFAULT_PERMISSIONS,
    });
  }

  return repoExisted;
}

export function getNodeByDataId(connection: RepoConnection, ids: string | Array<string>): ReadonlyArray<NodeQueryHit> {
  const values = forceArray(ids);

  return connection.query({
    count: values.length,
    filters: {
      boolean: {
        must: {
          hasValue: {
            values,
            field: "_name",
          },
        },
        mustNot: {
          ids: {
            values: ["000-000-000-000"],
          },
        },
      },
    },
  }).hits;
}

export function getEntriesByName<NodeData>(repoId: string, name: Array<string>): Array<NodeData & RepoNode> {
  const connection = connect({ repoId, branch: BRANCH_MASTER });
  const res = getNodeByDataId(connection, name);
  return forceArray(connection.get<NodeData>(res.map((node) => node.id)));
}

export function saveToRepo<NodeData>({ data, id, connection, repoId }: SaveToRepoParams<NodeData>): NodeData | void {
  if (data) {
    try {
      run(
        {
          repository: repoId,
          branch: BRANCH_MASTER,
          user: {
            idProvider: "system",
            login: "su",
          },
        },
        () => connection.create(getCristinNodeCreateParams<NodeData>(id, data))
      );
    } catch (e) {
      log.error(`Could not create content in repo "${repoId}" with id: "${id}"`, e);
    }

    return data;
  }
}

function getCristinNodeCreateParams<NodeData>(id: string, data: NodeData): CristinNode<NodeData> & NodeCreateParams {
  return {
    _indexConfig: {
      default: "fulltext",
    },
    _inheritsPermissions: true,
    _name: id,
    data,
    topics: [],
  };
}

export interface SaveToRepoParams<NodeData> {
  id: string;
  connection: RepoConnection;
  repoId: string;
  data?: NodeData;
}
