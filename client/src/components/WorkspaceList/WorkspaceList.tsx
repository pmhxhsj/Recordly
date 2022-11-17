import React from "react";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router";
import cn from "classnames";

import Workspace from "components/Workspace";
import WorkspaceSkeleton from "components/Skeleton/WorkspaceSkeleton";

import { IWorkspace } from "types/workspace";

const WorkspaceList = ({
  isLoadingData,
  isFavoritesPage,
  isTagPage,
  isFolderDetailPage,
}: {
  isLoadingData: boolean;
  isFavoritesPage?: boolean;
  isTagPage?: boolean;
  isFolderDetailPage?: boolean;
}) => {
  const navigate = useNavigate();

  // store에서 workspaceList 상태 가져오기
  const workspaceList: IWorkspace[] = useSelector(
    (state: any) => state.workspace.workspaceList
  );
  const filteredWorkspaces = isFolderDetailPage
    ? workspaceList
    : workspaceList.filter(
        (workspace: IWorkspace) => workspace.folder === null
      );

  const moveWorkSpacePage = (id: string): void => {
    navigate(`/workspace/${id}`);
  };

  /**
   * workspace 시간에 대해 어제,오늘 표시해주는 handler
   */
  const formatWorkspaceDate = (
    date: string
  ): React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > => {
    const filterDate: string[] = date.substring(5, 16).split("T");
    const now: Date = new Date();

    const today: string = [now.getMonth() + 1, now.getDate()].join("");
    const yesterDay: string = [now.getMonth() + 1, now.getDate() - 1].join("");

    return (
      <div
        className={cn("d-flex", "justify-content-center", "align-items-center")}
      >
        {filterDate.map((v: string) => {
          if (v.split("-").map(Number).join("") === today) {
            return <span>Today</span>;
          } else if (v.split("-").map(Number).join("") === yesterDay) {
            return <span>Yesterday</span>;
          } else {
            return (
              <span className={"ms-1"} key={v + now}>
                {v}
              </span>
            );
          }
        })}
      </div>
    );
  };

  return (
    <>
      {isLoadingData
        ? new Array(50).fill(1).map((v) => <WorkspaceSkeleton />)
        : filteredWorkspaces.map((workspace: IWorkspace) => (
            <Workspace
              key={workspace._id}
              uid={workspace._id}
              title={workspace.title}
              folderId={workspace.folder}
              tagList={workspace.tags}
              editedAt={workspace.editedAt}
              favorites={workspace.favorites}
              isFavoritesPage={isFavoritesPage}
              isTagPage={!!isTagPage}
              moveWorkSpacePage={moveWorkSpacePage}
              formatWorkspaceDate={formatWorkspaceDate}
            />
          ))}
    </>
  );
};

export default WorkspaceList;
