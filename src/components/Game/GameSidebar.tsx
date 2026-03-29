import { useTranslation } from "react-i18next";
import type { Word } from "../../utils/types.js";
import Wordslist from "../Wordslist/Wordslist.js";

type GameSidebarProps = {
  words: Word[];
};

export default function GameSidebar({ words }: GameSidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className="hidden h-full flex-col md:flex">
      <div className="flex flex-col gap-2 border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_#000]">
        <h2 className="mb-2 border-b-2 border-black pb-1 text-xs font-black tracking-widest uppercase">
          {t("words")} ({words.length})
        </h2>
        <div className="max-h-[60vh] overflow-y-auto">
          <Wordslist words={words} />
        </div>
      </div>
    </aside>
  );
}
