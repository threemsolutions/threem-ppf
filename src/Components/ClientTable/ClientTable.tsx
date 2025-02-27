import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  FaPencilAlt,
  FaTrash,
  FaEye,
  FaChevronRight,
  FaChevronLeft,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";
import styles from "./ClientTable.module.css";
import { Client, ClientTableProps } from "../../types";
import { Button } from "../Button/Button";
import "react-confirm-alert/src/react-confirm-alert.css";
import { confirmAlert } from "react-confirm-alert";
import "./Confim.css";
import "jspdf-autotable";

const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  totalCount,
  onEditClient,
  onDeleteClient,
  onHandleClientClick,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const formatDateUTC = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };
  const statusMap: Record<number, string> = {
    1: "Active",
    0: "Inactive",
    2: "Delete",
  };

  const columns: ColumnDef<Client>[] = [
    { accessorKey: "clientName", header: "Client Name", enableSorting: true },
    // { accessorKey: "address", header: "Address", enableSorting: false },
    {
      accessorKey: "numberOfEmployees",
      header: "No. Of Employees",
      enableSorting: true,
    },
    { accessorKey: "emailId", header: "Email", enableSorting: false },
    { accessorKey: "contactNumber", header: "Contact", enableSorting: false },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            style={{
              color: status === 1 ? "green" : status === 2 ? "red" : "orange",
              fontWeight: "bold",
            }}
          >
            {statusMap[status] || "Unknown"}
          </span>
        );
      },
    },

    {
      accessorKey: "startDate",
      header: "Start Date",
      enableSorting: true,
      cell: ({ row }) => formatDateUTC(row.original.startDate),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      enableSorting: true,
      cell: ({ row }) =>
        row.original.endDate ? formatDateUTC(row.original.endDate) : "-",
    },
    {
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className={styles.actionButtons}>
          <Button
            className={styles.iconButton}
            variant={"secondary"}
            onClick={() => onEditClient(row.original)}
          >
            <FaPencilAlt size={16} />
          </Button>
          <Button
            className={styles.iconButton}
            variant="secondary"
            onClick={() =>
              confirmAlert({
                title: "Confirm Delete",
                message: "Are you sure you want to delete this client?",
                buttons: [
                  {
                    label: "Yes",
                    onClick: () =>
                      onDeleteClient(row.original.id, row.original.status),
                  },
                  {
                    label: "No",
                    onClick: () => {},
                  },
                ],
              })
            }
          >
            <FaTrash size={16} color="red" />
          </Button>
          <Button
            className={styles.iconButton}
            variant={"secondary"}
            onClick={() => onHandleClientClick(row.original.id)}
          >
            <FaEye size={16} color="Black" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: clients,
    columns,
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize, pageIndex: currentPage } },
    state: { sorting },
    onSortingChange: setSorting,
  });
  useEffect(() => {
    table.setPageIndex(currentPage);
  }, [currentPage, table]);
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted();
                const canSort = header.column.getCanSort();
                return (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: canSort ? "pointer" : "default" }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {canSort &&
                      (isSorted === "asc" ? (
                        <FaSortUp />
                      ) : isSorted === "desc" ? (
                        <FaSortDown />
                      ) : (
                        <FaSort />
                      ))}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        {/* Pagination Controls */}
        {/* <div className={styles.pagination}> */}
        <Button
          variant="secondary"
          className={styles.pageButton}
          onClick={() => {
            table.previousPage();
            onPageChange(table.getState().pagination.pageIndex - 1);
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <FaChevronLeft size={16} />
        </Button>

        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="secondary"
          className={styles.pageButton}
          onClick={() => {
            table.nextPage();
            onPageChange(table.getState().pagination.pageIndex + 1);
          }}
          disabled={!table.getCanNextPage()}
        >
          <FaChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ClientTable;
