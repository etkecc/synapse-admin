// SPDX-FileCopyrightText: 2026 Nikita Chernyi
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode, useCallback } from "react";
import { SxProps, TableBody } from "@mui/material";
import {
  DatagridBody,
  DatagridClasses,
  DatagridConfigurable,
  DatagridRow,
  Identifier,
  RaRecord,
  RecordContextProvider,
  useGetRecordRepresentation,
  useListContext,
  useRecordContext,
  useResourceContext,
  useTranslate,
} from "react-admin";
import EmptyState from "./EmptyState";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type DatagridBodyProps = React.ComponentPropsWithRef<typeof DatagridBody>;
type DatagridRowProps = React.ComponentPropsWithRef<typeof DatagridRow>;
type DatagridConfigurableProps = React.ComponentProps<typeof DatagridConfigurable>;

/** Specifies the row's accessible label — either a field name or a function. */
type RowLabel = ((record: RaRecord) => string) | string;

type AccessibleRowProps = DatagridRowProps & {
  rowIndex?: number;
  rowLabel?: RowLabel;
};

type AccessibleBodyProps = Omit<DatagridBodyProps, "row"> & {
  rowLabel?: RowLabel;
};

export type DatagridProps = DatagridConfigurableProps & {
  rowLabel?: RowLabel;
  empty?: ReactNode;
};

// ─────────────────────────────────────────────
// Cell title helpers
// ─────────────────────────────────────────────

type Translator = ReturnType<typeof useTranslate>;

/**
 * Resolves a field's label prop to a plain string.
 * Falls back to the resource-scoped translation key, then the bare source name.
 */
const resolveLabel = (label: unknown, source: string, resource: string | undefined, translate: Translator): string => {
  if (typeof label === "string") return translate(label, { _: label });
  if (resource) return translate(`resources.${resource}.fields.${source}`, { _: source });
  return source;
};

/**
 * Converts a raw record value to a human-readable string for the title attribute.
 * Booleans use react-admin's standard translation keys (ra.boolean.true/false).
 */
const formatCellValue = (value: unknown, translate: Translator): string => {
  if (value == null) return "—";
  if (typeof value === "boolean") {
    return translate(value ? "ra.boolean.true" : "ra.boolean.false", { _: value ? "Yes" : "No" });
  }
  if (typeof value === "string" || typeof value === "number") return String(value);
  return "—";
};

/**
 * Clones field children, injecting a `title="Column: Value"` onto each field
 * that has a `source` prop. Fields without source (buttons, FunctionField, etc.)
 * are passed through unchanged.
 *
 * RA's DatagridRow does NOT spread field props onto DatagridCell/TableCell, so
 * the title ends up on the field's own rendered element (e.g. a Typography span)
 * via sanitizeFieldRestProps. This provides hover tooltips on cell content rather
 * than on the <td> itself — still useful for column identification on hover.
 */
const injectCellTitles = (
  children: ReactNode,
  record: RaRecord,
  resource: string | undefined,
  translate: Translator
): ReactNode =>
  React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    const props = child.props as Record<string, unknown>;
    const source = props.source as string | undefined;
    if (!source) return child;
    const label = resolveLabel(props.label, source, resource, translate);
    const value = formatCellValue(record[source], translate);
    return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
      title: `${label}: ${value}`,
    });
  }) ?? children;

// ─────────────────────────────────────────────
// AccessibleRow
// ─────────────────────────────────────────────

const focusSx = {
  "&:focus-visible": {
    outline: "2px solid",
    outlineColor: "primary.main",
    outlineOffset: "-2px",
  },
} as const;

const AccessibleRow = React.forwardRef<HTMLTableRowElement, AccessibleRowProps>(
  ({ rowClick, rowIndex, rowLabel, sx: externalSx, ...props }, ref) => {
    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const getDefaultLabel = useGetRecordRepresentation(resource);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTableRowElement>) => {
      // Guard: only handle events targeted directly on the row, not bubbled from inner interactive elements
      // (checkboxes, buttons in cells). Without this, Space on a focused child triggers both the child and the row.
      if (e.target !== e.currentTarget) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        (e.currentTarget as HTMLElement).click();
      }
    }, []);

    // Note: rowClick can be a function that dynamically returns false/void (no-op).
    // We cannot evaluate that statically, so those rows still get tabIndex/focus ring.
    // RA's own click handler guards against navigating to undefined, so behaviour is safe.
    const isClickable = rowClick != null && rowClick !== false;

    const mergedSx: SxProps | undefined = isClickable
      ? ((externalSx != null ? [externalSx, focusSx] : focusSx) as SxProps)
      : (externalSx as SxProps | undefined);

    const ariaLabel =
      isClickable && record
        ? typeof rowLabel === "function"
          ? rowLabel(record)
          : typeof rowLabel === "string"
            ? String((record as Record<string, unknown>)[rowLabel] ?? record.id)
            : String(getDefaultLabel(record))
        : undefined;

    return (
      <DatagridRow
        ref={ref}
        rowClick={rowClick}
        sx={mergedSx}
        {...(isClickable
          ? {
              tabIndex: 0,
              onKeyDown: handleKeyDown,
              "aria-rowindex": rowIndex,
              "aria-label": ariaLabel,
            }
          : {})}
        {...props}
      />
    );
  }
);

AccessibleRow.displayName = "AccessibleRow";

// ─────────────────────────────────────────────
// AccessibleBody
// ─────────────────────────────────────────────

const defaultData: RaRecord[] = [];
// Note: cloneElement onto a module-level constant is the same pattern react-admin uses
// internally in DatagridBody. If RA's DatagridBody rendering model changes across major
// versions, AccessibleBody will need to be updated accordingly.
const defaultRow = <AccessibleRow />;

const AccessibleBody = React.forwardRef<HTMLTableSectionElement, AccessibleBodyProps>(
  (
    {
      children,
      className,
      data = defaultData,
      expand,
      hasBulkActions = false,
      hover,
      onToggleItem,
      resource,
      rowClick,
      rowSx,
      rowStyle,
      selectedIds,
      isRowSelectable,
      rowLabel,
      ...rest
    },
    ref
  ) => {
    const { page = 1, perPage = 10 } = useListContext();
    const offset = (page - 1) * perPage;
    const translate = useTranslate();

    return (
      <TableBody
        ref={ref}
        className={["datagrid-body", className, DatagridClasses.tbody].filter(Boolean).join(" ")}
        {...rest}
      >
        {data.map((record, rowIndex) => (
          <RecordContextProvider value={record} key={record.id ?? `row${rowIndex}`}>
            {React.cloneElement(
              defaultRow,
              {
                className: [
                  DatagridClasses.row,
                  rowIndex % 2 === 0 ? DatagridClasses.rowEven : DatagridClasses.rowOdd,
                ].join(" "),
                expand,
                hasBulkActions: hasBulkActions && !!selectedIds,
                hover,
                id: record.id ?? (`row${rowIndex}` as Identifier),
                onToggleItem,
                resource,
                rowClick,
                // aria-rowindex is 1-based and must account for the header row (index 1),
                // so the first data row on page 1 is index 2.
                rowIndex: offset + rowIndex + 2,
                rowLabel,
                selectable: !isRowSelectable || isRowSelectable(record),
                selected: selectedIds?.includes(record.id),
                sx: rowSx?.(record, rowIndex),
                style: rowStyle?.(record, rowIndex),
              },
              injectCellTitles(children, record, resource, translate)
            )}
          </RecordContextProvider>
        ))}
      </TableBody>
    );
  }
);

// MUI Table requires this to accept the component as a valid child type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(AccessibleBody as any).muiName = "TableBody";
AccessibleBody.displayName = "AccessibleBody";

// ─────────────────────────────────────────────
// Datagrid (public export)
// ─────────────────────────────────────────────

/**
 * Drop-in replacement for react-admin's DatagridConfigurable.
 * Adds keyboard navigation (Enter/Space), visible focus ring, aria-rowindex,
 * and aria-label to all clickable rows, and title="Column: Value" to all
 * data cells for screen reader context.
 * Defaults: empty=<EmptyState />, width 100%.
 */
const Datagrid = ({ rowLabel, empty = <EmptyState />, sx, ...props }: DatagridProps) => (
  <DatagridConfigurable
    body={<AccessibleBody rowLabel={rowLabel} />}
    empty={empty}
    sx={[{ width: "100%" }, sx as SxProps].filter(Boolean) as SxProps}
    {...props}
  />
);

export default Datagrid;
