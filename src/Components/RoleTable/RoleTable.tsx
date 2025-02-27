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
} from "react-icons/fa";
import styles from "./RoleTable.module.css";
import { Role, RoleTableProps } from "../../types";
import { Button } from "../Button/Button";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RoleTable: React.FC<RoleTableProps> = ({
  roles,
  onEditRole,
  onDeleteRole,
  onHandleRoleClick,
  currentPage,
  onPageChange,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const statusMap: Record<number, string> = {
    1: "Active",
    0: "Inactive",
    2: "Delete",
    3: "Unknown",
  };
  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "roleName",
      header: "Role Name",
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status ?? 3;
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
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className={styles.actionButtons}>
          <Button
            className={styles.iconButton}
            variant={"secondary"}
            onClick={() => onEditRole(row.original)}
          >
            <FaPencilAlt size={16} />
          </Button>
          <Button
            className={styles.iconButton}
            variant={"secondary"}
            onClick={() =>
              onDeleteRole(row.original.id, row.original.status ?? 0)
            }
          >
            <FaTrash size={16} color="red" />
          </Button>
          <Button
            className={styles.iconButton}
            variant={"secondary"}
            onClick={() => onHandleRoleClick(row.original.id)}
          >
            <FaEye size={16} color="Black" />
          </Button>
        </div>
      ),
    },
  ];
  const exportToExcel = () => {
    const formattedData = roles.map((role) => ({
      "Role ID": role.id,
      "Role Name": role.roleName,
      Status:
        role.status === 1
          ? "Active"
          : role.status === 2
          ? "Delete"
          : "Inactive",
    }));
  };
  const doc = new jsPDF();
  (doc as any).autoTable({
    head: [["Column 1", "Coloumn 2", "Column 3"]],
    body: [["Row 1", "Data 1", "Data 2"]],
  });
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(" Role Data", 10, 10);
    const tableData = roles.map((role) => [
      role.id,
      role.roleName,
      role.status === 1 ? "Active" : role.status === 2 ? "Delete" : "Inactive",
    ]);
    (doc as any).autoTable({
      head: [[" Role Id", "Role Name", "Status"]],
      body: tableData,
    });
    doc.save("RoleData.pdf");
  };
  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 5, pageIndex: currentPage } },
    state: { sorting },
    onSortingChange: setSorting,
  });
  useEffect(() => {
    table.setPageIndex(currentPage);
  }, [currentPage, roles]);
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
          className={styles.exportExcel}
          onClick={exportToExcel}
        >
          {" "}
          Export to Excel
        </Button>
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
        <Button
          variant="secondary"
          className={styles.exportPDF}
          onClick={exportToPDF}
        >
          Export to PDF
        </Button>
      </div>
    </div>
  );
};
export default RoleTable;
