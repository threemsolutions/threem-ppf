import React, { useEffect, useMemo, useState } from "react";
import styles from "./ClientManagement.module.css";
import {
  createClient,
  deleteClient,
  fetchClientDetails,
  fetchClients,
  updateClient,
} from "../../api";
import { toast } from "react-toastify";
import { Client } from "../../types";
import { Button } from "../../Components/Button/Button";
import ClientForm from "../../Components/ClientForm/ClientForm";
import ClientTable from "../../Components/ClientTable/ClientTable";
import Spinner from "../../Components/Spinner/Spinner";
import Search from "../../Components/Search/Search";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  const pageSize = 10;

  const loadClients = async (page: number = 0, term: string = searchTerm) => {
    setLoading(true);
    try {
      const { items, totalCount } = await fetchClients(page, pageSize, term);
      const formattedData = items.map((client) => ({
        ...client,
        startDate: new Date(client.startDate).toISOString().split("T")[0],
        endDate: client.endDate
          ? new Date(client.endDate).toISOString().split("T")[0]
          : null,
        status: client.status,
      }));
      setClients(formattedData);
      setTotalCount(totalCount);
    } catch (error) {
      toast.error("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsEditing(false);
    setIsViewing(false);
    setIsCreatingClient(true);
    setIsFormVisible(true);
  };

  const handleCreate = async (newClient: Client): Promise<void> => {
    try {
      const response = await createClient({
        ...newClient,
        endDate: newClient.endDate || null,
      });
      if (response) {
        await loadClients();
        setClients((prevClients) => [...prevClients, response]);
        setSelectedClient(null);
        toast.success("Client created successfully!");
        setIsFormVisible(false);
        setIsCreatingClient(false);
      }
    } catch (error) {
      toast.error("Failed to create client.");
    }
  };

  const handleClientSaved = async (): Promise<void> => {
    setIsFormVisible(false);
  };

  const handleClientClick = async (clientId: number) => {
    try {
      setIsFormVisible(true);
      setIsViewing(true);
      setIsEditing(false);
      setIsCreatingClient(false);
      const clientDetails = await fetchClientDetails(clientId);
      if (clientDetails) {
        setSelectedClient({
          ...clientDetails,
          startDate: clientDetails.startDate
            ? new Date(clientDetails.startDate).toISOString().split("T")[0]
            : "",
          endDate: clientDetails.endDate
            ? new Date(clientDetails.endDate).toISOString().split("T")[0]
            : null,
          status: clientDetails.status,
        });
      }
    } catch (error) {
      console.error("Failed to load client details", error);
    }
  };

  const handleEdit = (client: Client) => {
    setIsEditing(true);
    setSelectedClient(client);
    setIsViewing(false);
    setIsFormVisible(true);
  };

  const handleUpdate = async (updatedClient: Client) => {
    try {
      const response = await updateClient(updatedClient.id, {
        ...updatedClient,
        endDate: updatedClient.endDate || null,
      });
      if (response) {
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.id === response.id
              ? { ...response, status: response.status }
              : client
          )
        );
        await loadClients();
        setIsEditing(false);
        setSelectedClient(null);
        toast.success("Client updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update client.");
    }
  };

  const handleDeleteClient = async (clientId: number, clientStatus: number) => {
    if (clientStatus !== 2) {
      toast.error(
        "You can't delete this client. Only clients with status 'delete' can be deleted."
      );
      return;
    }
    try {
      const response = await deleteClient(clientId);
      if (response) {
        await loadClients();
        setClients((prevClients) =>
          prevClients.filter((client) => client.id !== clientId)
        );
        toast.success("Client deleted successfully.");
      } else {
        toast.error("Failed to delete client.");
      }
    } catch (error) {
      toast.error("Failed to delete client.");
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0);
  };

  // Export functions work on the full dataset (ignoring pagination).
  const exportToExcel = async () => {
    try {
      const { items } = await fetchClients(0, 10000, searchTerm);
      const formattedData = items.map((client) => ({
        "Client Name": client.clientName,
        Address: client.address,
        "No. Of Employees": client.numberOfEmployees,
        Email: client.emailId,
        Contact: client.contactNumber,
        Status:
          client.status === 1
            ? "Active"
            : client.status === 2
            ? "Delete"
            : "Inactive",
        "Start Date": new Date(client.startDate).toISOString().split("T")[0],
        "End Date": client.endDate
          ? new Date(client.endDate).toISOString().split("T")[0]
          : "-",
      }));
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
      XLSX.writeFile(workbook, "ClientData.xlsx");
    } catch (error) {
      toast.error("Failed to export Excel");
    }
  };

  const exportToPDF = async () => {
    try {
      const { items } = await fetchClients(0, 10000, searchTerm);
      const formattedData = items.map((client) => ({
        ...client,
        startDate: new Date(client.startDate).toISOString().split("T")[0],
        endDate: client.endDate
          ? new Date(client.endDate).toISOString().split("T")[0]
          : "-",
      }));
      const doc = new jsPDF();
      doc.text("Client Data", 10, 10);
      const tableData = formattedData.map((client) => [
        client.clientName,
        client.address,
        client.numberOfEmployees,
        client.emailId,
        client.contactNumber,
        client.status === 1
          ? "Active"
          : client.status === 2
          ? "Delete"
          : "Inactive",
        client.startDate,
        client.endDate,
      ]);
      (doc as any).autoTable({
        head: [
          [
            "Client Name",
            "Address",
            "No. Of Employees",
            "Email",
            "Contact",
            "Status",
            "Start Date",
            "End Date",
          ],
        ],
        body: tableData,
        styles: {
          fontSize: 8,
          cellPadding: 1,
          overflow: "linebreak",
        },
        // Adjust columnStyles as needed to prevent overflow/wrapping:
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25 },
          3: { cellWidth: 35 },
          4: { cellWidth: 23 },
          5: { cellWidth: 12 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
        },
        margin: { top: 20 },
      });
      doc.save("ClientData.pdf");
    } catch (error) {
      toast.error("Failed to export PDF");
    }
  };

  return (
    <div className={styles.mainTableContainer}>
      <div className={styles.buttonContainer}>
        <Search
          value={searchTerm}
          onChange={setSearchTerm}
          onSearchSubmit={handleSearchChange}
          className={styles.searchBar}
          placeholder="Search based on Client Name and Email"
        />
        <h1 className={styles.heading}>Clients Registered</h1>
        <FaFilePdf
          size={35}
          className={styles.exportPDF}
          onClick={exportToPDF}
          title="Export to PDF"
        />
        <FaFileExcel
          size={35}
          title="Export to Excel"
          className={styles.exportExcel}
          onClick={exportToExcel}
        />
        <Button
          variant="primary"
          onClick={handleAddClient}
          className={styles.addbutton}
        >
          Add New Client
        </Button>
      </div>
      <div className={styles.table}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <ClientTable
              clients={clients}
              onEditClient={handleEdit}
              onHandleClientCreate={handleCreate}
              onHandleClientUpdate={handleUpdate}
              onDeleteClient={handleDeleteClient}
              onHandleClientClick={handleClientClick}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              totalCount={totalCount}
            />
          </>
        )}

        {(isEditing || isFormVisible || isCreatingClient || selectedClient) && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <Button
                variant="secondary"
                className={styles.closeButton}
                onClick={() => {
                  setIsFormVisible(false);
                  setIsEditing(false);
                  setIsCreatingClient(false);
                  setIsViewing(false);
                  setSelectedClient(null);
                }}
              >
                &times;
              </Button>
              <ClientForm
                client={selectedClient}
                isEditing={isEditing}
                isCreatingClient={isCreatingClient}
                isViewing={isViewing}
                handleCreate={handleCreate}
                handleUpdate={handleUpdate}
                onClientSaved={() => {
                  loadClients();
                  setIsCreatingClient(false);
                  setSelectedClient(null);
                  setIsViewing(false);
                  setIsFormVisible(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagement;
