import { get as getRepo, create as createRepo } from "/lib/xp/repo";
import { connect, type RepoConnection, type NodeQueryResultHit, type CreateNodeParams, type Node } from "/lib/xp/node";
import { BRANCH_MASTER, DEFAULT_PERMISSIONS } from "/lib/cristin/constants";
import { forceArray, notNullOrUndefined } from "/lib/cristin/utils";
import { connectToRepoAsAdmin } from "/lib/cristin/utils/contexts";

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

export function getNodeByDataId(
  connection: RepoConnection,
  ids: string | Array<string>
): ReadonlyArray<NodeQueryResultHit> {
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

export function getEntriesByName<NodeData>(repoId: string, names: Array<string>): Array<Node<NodeData>> {
  const connection = connect({ repoId, branch: BRANCH_MASTER });
  const res = getNodeByDataId(connection, names);
  const ids = res.map((node) => node.id);

  return forceArray(connection.get<NodeData>(ids)).filter(notNullOrUndefined);
}

export function saveToRepo<NodeData>({ data, id, repoId }: SaveToRepoParams<NodeData>): NodeData | void {
  if (data) {
    try {
      const connection = connectToRepoAsAdmin({
        repoId,
        branch: BRANCH_MASTER,
      });
      connection.create(getCristinNodeCreateParams<NodeData>(id, data));
      connection.refresh("ALL");
    } catch (e) {
      log.error(`Could not create content in repo "${repoId}" with id: "${id}"`, e);
    }

    return data;
  }
}

function getCristinNodeCreateParams<NodeData>(id: string, data: NodeData): CristinNode<NodeData> & CreateNodeParams {
  return {
    // _indexConfig: {
    //   default: "fulltext",
    // },
    _inheritsPermissions: true,
    _name: id,
    _parentPath: "/",
    data,
    topics: [],
  };
}

export interface SaveToRepoParams<NodeData> {
  id: string;
  repoId: string;
  data?: NodeData;
}
