import React from 'react';
import { cx } from './cx';

export type Column<T> = {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
};

export function DataTable<T>({ columns, rows, cardTitle, className }: { columns: Column<T>[]; rows: T[]; cardTitle?: (row: T) => React.ReactNode; className?: string }) {
  return (
    <div className={cx('data-table-wrap', className)}>
      <div className="data-table hide-mobile">
        <div className="data-table__head">
          {columns.map((column) => <div key={column.key} className="data-table__cell data-table__cell--head">{column.header}</div>)}
        </div>
        <div className="data-table__body">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="data-table__row">
              {columns.map((column) => <div key={column.key} className="data-table__cell">{column.cell(row)}</div>)}
            </div>
          ))}
        </div>
      </div>
      <div className="hide-desktop stack">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="data-card">
            {cardTitle ? <div className="data-card__title">{cardTitle(row)}</div> : null}
            {columns.map((column) => (
              <div key={column.key} className="data-card__row">
                <span className="data-card__label">{column.header}</span>
                <span className="data-card__value">{column.cell(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DataTable;
