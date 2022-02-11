import { get as getRepo, create as createRepo } from "/lib/xp/repo";
import { connect, type RepoConnection, type NodeQueryHit, type NodeCreateParams, type RepoNode } from "/lib/xp/node";
import { BRANCH_MASTER } from "/lib/cristin/constants";
import { forceArray } from "/lib/cristin/utils";

export interface CristinNode<Data> {
  _name: string;
  data: Data;
  topics: Array<string>;
}

export function getOrCreateRepoConnection(repoName: string): RepoConnection {
  let repo = getRepo(repoName);

  if (repo === null) {
    repo = createRepo({
      id: repoName,
    });
  }

  return connect({
    repoId: repo.id,
    branch: BRANCH_MASTER,
  });
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
  return getNodeByDataId(connection, name)
    .map((node) => node.id)
    .map((id) => connection.get<NodeData>(id));
}

export function saveToRepo<NodeData>({ data, id, connection }: SaveToRepoParams<NodeData>): NodeData | void {
  if (data) {
    connection.create(getCristinNodeCreateParams<NodeData>(id, data));
    return data;
  }
}

function getCristinNodeCreateParams<NodeData>(id: string, data: NodeData): CristinNode<NodeData> & NodeCreateParams {
  return {
    _indexConfig: {
      default: "fulltext",
    },
    _name: id,
    data,
    topics: [],
  };
}

export interface SaveToRepoParams<NodeData> {
  id: string;
  connection: RepoConnection;
  data?: NodeData;
}
