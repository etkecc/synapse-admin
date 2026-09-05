import React, { ReactNode, useCallback } from "react";
import { SxProps, TableBody } from "@mui/material";
import {
  DatagridBody,
  DatagridClasses,
  DatagridConfigurable,
  DatagridRow,
  DateField,
  Identifier,
  ListContext,
  RaRecord,
  RecordContextProvider,
  useGetRecordRepresentation,
  useRecordContext,
  useResourceContext,
  useTranslate,
} from "react-admin";
import EmptyState from "./EmptyState";

type DatagridBodyProps = React.ComponentPropsWithRef<typeof DatagridBody>;
type DatagridRowProps = React.ComponentPropsWithRef<typeof DatagridRow>;
type DatagridConfigurableProps = React.ComponentProps<typeof DatagridConfigurable>;

/** Specifies the row's accessible label: either a field name or a function. */
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

type Translator = ReturnType<typeof useTranslate>;

// Converts snake_case/camelCase to Title Case; last-resort fallback when no i18n key exists for a field.
const humanizeSource = (source: string): string =>
  source
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

// Resolves a field's label: explicit label, then resource-scoped translation key, then humanized source name.
const resolveLabel = (label: unknown, source: string, resource: string | undefined, translate: Translator): string => {
  if (typeof label === "string") return translate(label, { _: label });
  if (resource) return translate(`resources.${resource}.fields.${source}`, { _: humanizeSource(source) });
  return humanizeSource(source);
};

// Converts a raw value to a display string for the title attribute; booleans use ra.boolean.true/false keys.
const formatCellValue = (value: unknown, translate: Translator): string => {
  if (value == null) return "-";
  if (typeof value === "boolean") {
    return translate(value ? "ra.boolean.true" : "ra.boolean.false", { _: value ? "Yes" : "No" });
  }
  if (typeof value === "string" || typeof value === "number") return String(value);
  return "-";
};

// Injects title="Label: Value" on children with a source prop; duck-types via props to dodge TS6133 on child.type.
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
    const rawValue = record[source];
    let value: string;
    if (child.type === DateField && (typeof rawValue === "number" || typeof rawValue === "string")) {
      try {
        value = new Date(rawValue as number | string).toLocaleString(
          props.locales as string | undefined,
          props.options as Intl.DateTimeFormatOptions | undefined
        );
      } catch {
        value = formatCellValue(rawValue, translate);
      }
    } else if (typeof props.reference === "string") {
      // Reads the first child's source on the outer record to skip an async fetch; falls back to the raw reference id.
      const childSource = (() => {
        const kids = React.Children.toArray(props.children as ReactNode);
        for (const kid of kids) {
          if (React.isValidElement(kid)) {
            const kidProps = kid.props as Record<string, unknown>;
            if (typeof kidProps.source === "string") return kidProps.source;
          }
        }
        return undefined;
      })();
      value =
        childSource != null && record[childSource] != null
          ? formatCellValue(record[childSource], translate)
          : formatCellValue(rawValue, translate);
    } else if (typeof props.render === "function") {
      try {
        const rendered = (props.render as (r: RaRecord) => unknown)(record);
        if (typeof rendered === "string") value = rendered;
        else if (typeof rendered === "number") value = String(rendered);
        else value = formatCellValue(rawValue, translate);
      } catch {
        value = formatCellValue(rawValue, translate);
      }
    } else {
      value = formatCellValue(rawValue, translate);
    }
    return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
      title: `${label}: ${value}`,
    });
  }) ?? children;

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
      // Guard: only handle events targeted at the row; without it, Space on a focused child triggers child and row.
      if (e.target !== e.currentTarget) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        (e.currentTarget as HTMLElement).click();
      }
    }, []);

    // rowClick may dynamically return false/void; unevaluated statically, so these rows still get tabIndex/focus ring.
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
              "aria-roledescription": "link",
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

const defaultData: RaRecord[] = [];
// cloneElement onto a module-level constant mirrors RA's own DatagridBody pattern; a major RA rewrite could break this.
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
    const listCtx = React.useContext(ListContext);
    const page = listCtx?.page ?? 1;
    const perPage = listCtx?.perPage ?? 10;
    const offset = (page - 1) * perPage;
    const translate = useTranslate();
    // resource may be undefined when DatagridConfigurable doesn't forward it; fall back to the parent List's context.
    const resolvedResource = useResourceContext({ resource });

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
                // aria-rowindex is 1-based and accounts for the header row, so the first data row on page 1 is 2.
                rowIndex: offset + rowIndex + 2,
                rowLabel,
                selectable: !isRowSelectable || isRowSelectable(record),
                selected: selectedIds?.includes(record.id),
                sx: rowSx?.(record, rowIndex),
                style: rowStyle?.(record, rowIndex),
              },
              injectCellTitles(children, record, resolvedResource, translate)
            )}
          </RecordContextProvider>
        ))}
      </TableBody>
    );
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(AccessibleBody as any).muiName = "TableBody"; // MUI Table requires this to accept the component as a valid child type
AccessibleBody.displayName = "AccessibleBody";

// Drop-in DatagridConfigurable replacement: keyboard nav, focus ring, aria-rowindex/label, cell title tooltips.
const Datagrid = ({ rowLabel, empty = <EmptyState />, sx, ...props }: DatagridProps) => (
  <DatagridConfigurable
    body={<AccessibleBody rowLabel={rowLabel} />}
    empty={empty}
    sx={[{ width: "100%" }, sx as SxProps].filter(Boolean) as SxProps}
    {...props}
  />
);

export default Datagrid;
