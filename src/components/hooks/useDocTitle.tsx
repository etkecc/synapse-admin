import { useEffect } from "react";

// Appends title to the base title from a data attribute; workaround also used in index.tsx and AdminLayout.tsx.
export const useDocTitle = (title: string) => {
  useEffect(() => {
    const baseTitle = document.head.dataset.baseTitle || document.title;
    document.title = `${title} - ${baseTitle}`;
  }, [title]);
};
