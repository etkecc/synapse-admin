import { useEffect } from "react";

/**
 * Custom hook to set the document title dynamically.
 * Appends the provided title to a base title stored in a data attribute.
 * Based on hacky workaround described in index.tsx and AdminLayout.tsx.
 *
 * @param title - The title to set for the document.
 */
export const useDocTitle = (title: string) => {
  useEffect(() => {
    const baseTitle = document.head.dataset.baseTitle || document.title;
    document.title = `${title} - ${baseTitle}`;
  }, [title]);
};
