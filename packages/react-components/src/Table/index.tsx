import styled from 'styled-components'
import {usePagination, useSortBy, useTable, TableOptions} from 'react-table'
import TablePagination from './TablePagination'
import TableSorter from './TableSorter'

const TableWrapper = styled.div`
  overflow-x: auto;
`

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100px;
  font-size: 14px;
  color: #878787;
`

const Styles = styled.div`
  table {
    border-spacing: 0;
    border: none;
    width: 100%;
    font-family: Lato;
    font-style: normal;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th {
      font-weight: bold;
      font-size: 12px;
      line-height: 14px;
      color: #202020;
      border-bottom: 1px solid #dddddd;
      padding: 0.8rem;
      text-align: left;
    }

    td {
      margin: 0;
      padding: 0.8rem;
      font-size: 12px;
      white-space: nowrap;

      :last-child {
        border-right: 0;
      }
    }
  }
`

export type TableProps<D extends Record<string, unknown>> = TableOptions<D> & {
  isLoading?: boolean
}

const Table = <D extends Record<string, unknown>>(
  props: TableProps<D>
): JSX.Element => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: {pageIndex},
    pageCount,
  } = useTable(
    {
      initialState: {pageIndex: 0, ...props.initialState},
      ...props,
    },

    useSortBy,
    usePagination
  )

  return (
    <Styles>
      <TableWrapper>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <TableSorter
                      canSort={column.canSort}
                      isSorted={column.isSorted}
                      isSortedDesc={column.isSortedDesc}
                    >
                      {' '}
                      {column.render('Header')}
                    </TableSorter>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {Boolean(props.data.length) && (
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>
        {props.isLoading ? (
          <Placeholder>Loading…</Placeholder>
        ) : props.data.length ? null : (
          <Placeholder>No Data</Placeholder>
        )}
      </TableWrapper>

      {pageCount > 1 && (
        <TablePagination
          pageIndex={pageIndex}
          previousPage={previousPage}
          pageOptions={pageOptions}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          nextPage={nextPage}
        />
      )}
    </Styles>
  )
}

export default Table