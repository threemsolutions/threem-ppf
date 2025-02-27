import React, { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
  FaFilePdf,
  FaFileExcel,
} from "react-icons/fa";
import styles from "./UserTable.module.css";
import { User, UserTableProps } from "../../types";
import { Button } from "../Button/Button";
import "jspdf-autotable";
import "react-confirm-alert/src/react-confirm-alert.css";
import { confirmAlert } from "react-confirm-alert";
import "./Confim.css";

const UserTable: React.FC<UserTableProps> = ({
  users,
  totalCount,
  roles,
  onEditUser,
  onDeleteUser,
  onHandleUserClick,
  currentPage,
  pageSize,
  onPageChange,
  hideDeleteButton,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const formatDateUTC = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };
  // Mapping statuses and roles.
  const statusMap: Record<number, string> = {
    1: "Active",
    0: "Inactive",
    2: "Delete",
  };

  const roleMap = useMemo(() => {
    const map: Record<string, string> = {};
    roles.forEach((role) => {
      map[role.id.toString()] = role.roleName;
    });
    return map;
  }, [roles]);

  const columns: ColumnDef<User>[] = [
    { accessorKey: "firstName", header: "First Name", enableSorting: true },
    { accessorKey: "lastName", header: "Last Name", enableSorting: true },
    { accessorKey: "gender", header: "Gender", enableSorting: true },
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
      accessorKey: "dob",
      header: "DOB",
      enableSorting: true,
      cell: ({ row }) => formatDateUTC(row.original.dob),
    },
    {
      accessorKey: "roleId",
      header: "Role Name",
      enableSorting: true,
      cell: ({ row }) => roleMap[row.original.roleId] || "Unknown",
    },
    {
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className={styles.actionButtons}>
          <Button
            className={styles.iconButton}
            variant="secondary"
            onClick={() => onEditUser(row.original)}
          >
            <FaPencilAlt size={16} />
          </Button>
          {!hideDeleteButton && (
            <Button
              className={styles.iconButton}
              variant="secondary"
              onClick={() =>
                confirmAlert({
                  title: "Confirm Delete",
                  message: "Are you sure you want to delete this user?",
                  buttons: [
                    {
                      label: "Yes",
                      onClick: () =>
                        onDeleteUser(row.original.id, row.original.status),
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
          )}
          <Button
            className={styles.iconButton}
            variant="secondary"
            onClick={() => onHandleUserClick(row.original.id)}
          >
            <FaEye size={16} color="black" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    manualPagination: true,
    pageCount: Math.ceil(totalCount / pageSize),
    initialState: { pagination: { pageSize, pageIndex: currentPage } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
        <Button
          variant="secondary"
          className={styles.pageButton}
          onClick={() => {
            if (currentPage > 0) onPageChange(currentPage - 1);
          }}
          disabled={currentPage === 0}
        >
          <FaChevronLeft size={16} />
        </Button>
        <span>
          Page {currentPage + 1} of {Math.ceil(totalCount / pageSize) || 1}
        </span>
        <Button
          variant="secondary"
          className={styles.pageButton}
          onClick={() => {
            if (currentPage < Math.ceil(totalCount / pageSize) - 1)
              onPageChange(currentPage + 1);
          }}
          disabled={currentPage >= Math.ceil(totalCount / pageSize) - 1}
        >
          <FaChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default UserTable;
