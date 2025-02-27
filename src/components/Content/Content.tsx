﻿import styles from "~/components/Content/Content.module.scss";
import Tag from "~/components/Tag/Tag";
import Group from "~/components/Group/Group";
import AdditionalGroup from "~/components/Group/AdditionalGroup";
import { Dispatch, SetStateAction } from "react";
import { DragObjectTag } from "~/types/dragAndDrop";
import { Group as GroupType } from "~/types/group";
import { useDrop } from "react-dnd/dist/hooks/useDrop/useDrop";
import { ITEM_TYPES } from "~/constants/dragAndDrop";

type Props = {
  mainTags: DragObjectTag[];
  subTags: DragObjectTag[];
  groups: GroupType[];
  setMainTags: Dispatch<SetStateAction<DragObjectTag[]>>;
  setSubTags: Dispatch<SetStateAction<DragObjectTag[]>>;
  setGroups: Dispatch<SetStateAction<GroupType[]>>;
};

export default function Content({
  mainTags,
  subTags,
  groups,
  setMainTags,
  setSubTags,
  setGroups,
}: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, drop] = useDrop<DragObjectTag>(() => ({
    accept: ITEM_TYPES.TAG,
    drop: (droppedTag) => {
      if (droppedTag.isMainTag) {
        setMainTags((prev) => {
          if (!prev.find((tag) => tag.id === droppedTag.id)) {
            return [...prev, droppedTag];
          }
          return prev;
        });
      } else {
        setSubTags((prev) => {
          if (!prev.find((tag) => tag.id === droppedTag.id)) {
            return [...prev, droppedTag];
          }
          return prev;
        });
      }

      setGroups((prev) => {
        return droppedTag.isMainTag
          ? prev.map((group, index) => {
              if (droppedTag.id === group.main.id) {
                return { main: {}, sub: prev[index].sub };
              }
              return prev[index];
            })
          : prev.map((group) => {
              const subTags = group.sub.filter(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (tag) => droppedTag.id !== tag.id,
              );
              return {
                main: group.main,
                sub: subTags.length > 0 ? subTags : [{}],
              };
            });
      });
    },
  }));

  return (
    <main className={styles.main}>
      <div className={styles.tagBox} ref={drop}>
        <div className={styles.tagMainBox}>
          {mainTags.map((mainTag) => {
            return (
              <Tag
                key={`main-tag${mainTag.id}`}
                id={mainTag.id || "0"}
                text={mainTag.name || ""}
                isMainTag
                info={mainTag.info}
              />
            );
          })}
        </div>
        <div className={styles.tagSubBox}>
          {subTags.map((subTag) => {
            return (
              <Tag
                key={`sub-tag${subTag.id}`}
                id={subTag.id || "0"}
                text={subTag.name || ""}
                info={subTag.info}
              />
            );
          })}
        </div>
      </div>
      <div className={styles.groupBox}>
        {groups.map((group, index) => {
          return (
            <Group
              key={index}
              componentId={index}
              group={group}
              setMainTags={setMainTags}
              setSubTags={setSubTags}
              setGroups={setGroups}
            />
          );
        })}
        <AdditionalGroup setGroups={setGroups} />
      </div>
    </main>
  );
}
