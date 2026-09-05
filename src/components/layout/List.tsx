import { cloneElement, isValidElement } from "react";
import { List as RaList, ListProps } from "react-admin";

import EmptyState from "./EmptyState";

// RA's List renders actions or empty, never both; this clones actions into empty so buttons stay visible with no data.
const List = ({ actions, empty = <EmptyState />, ...rest }: ListProps) => {
  const emptyWithActions = isValidElement(empty)
    ? cloneElement(empty as React.ReactElement<{ actions?: React.ReactNode }>, { actions })
    : empty;
  return <RaList {...rest} actions={actions} empty={emptyWithActions} />;
};

export default List;
