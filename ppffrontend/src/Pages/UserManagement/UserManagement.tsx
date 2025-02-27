import React, { useEffect, useMemo, useState } from "react";
import styles from "./UserManagement.module.css";
import {
  deleteUser,
  fetchRoles,
  fetchUserDetails,
  fetchUsers,
  updateUser,
} from "../../api";
import { toast } from "react-toastify";
import { Button } from "../../Components/Button/Button";
import { User } from "../../types";
import UserForm from "../../Components/UserForm/UserForm";
import UserTable from "../../Components/UserTable/UserTable";
import Spinner from "../../Components/Spinner/Spinner";
import Search from "../../Components/Search/Search";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [roles, setRoles] = useState<{ id: number; roleName: string }[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const pageSize = 10;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isViewing, setIsViewing] = useState<boolean>(false);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch logged-in user details
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const loggedInUserIdStr = localStorage.getItem("userId");
        const loggedInUserId = loggedInUserIdStr
          ? Number(loggedInUserIdStr)
          : null;
        if (!loggedInUserId) {
          toast.error("No logged-in user found");
          return;
        }
        const userDetail = await fetchUserDetails(loggedInUserId);
        setLoggedInUser(userDetail);
      } catch (error) {
        toast.error("Failed to fetch logged-in user details");
      }
    };
    fetchLoggedInUser();
  }, []);

  // Fetch roles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await fetchRoles();
        setRoles(data);
      } catch (error) {
        toast.error("Error fetching roles");
      }
    };
    loadRoles();
  }, []);

  // Load paginated users based on currentPage and search term
  const loadUsers = async (page: number = 0, term: string = searchTerm) => {
    setLoading(true);
    try {
      const { items, totalCount } = await fetchUsers(page, pageSize, term);
      const formattedData = items.map((user) => ({
        ...user,
        dob: new Date(user.dob).toISOString().split("T")[0],
      }));
      if (loggedInUser && Number(loggedInUser.roleId) === 3) {
        const selfUser = formattedData.filter(
          (user) => user.id === loggedInUser.id
        );
        setUsers(selfUser.length > 0 ? selfUser : [loggedInUser]);
        setTotalCount(selfUser.length);
      } else {
        setUsers(formattedData);
        setTotalCount(totalCount);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Reload users when loggedInUser, currentPage, or searchTerm changes
  useEffect(() => {
    if (loggedInUser) {
      loadUsers(currentPage, searchTerm);
    }
  }, [loggedInUser, currentPage, searchTerm]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    setIsViewing(false);
    setIsFormVisible(true);
  };

  const handleUpdate = async (updatedUser: User) => {
    try {
      await updateUser(updatedUser.id, updatedUser);
      toast.success("User updated successfully");
      await loadUsers();
      await fetchUserDetails(updatedUser.id);
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: number, userStatus: number) => {
    if (userStatus !== 2) {
      toast.error("You can only delete users with status 'delete'");
      return;
    }
    try {
      await deleteUser(userId);
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleUserClick = async (userId: number) => {
    try {
      setIsEditing(false);
      setIsViewing(true);
      setIsFormVisible(true);
      const userDetails = await fetchUserDetails(userId);
      if (userDetails) {
        setSelectedUser(userDetails);
      }
    } catch (error) {
      toast.error("Failed to fetch user details");
    }
  };
  const roleMap = useMemo(() => {
    const map: Record<string, string> = {};
    roles.forEach((role) => {
      map[role.id.toString()] = role.roleName;
    });
    return map;
  }, [roles]);

  const exportToPDF = async () => {
    try {
      // Fetch all matching records; adjust API if needed
      const { items } = await fetchUsers(0, 10000, searchTerm);
      const formattedData = items.map((user) => ({
        ...user,
        dob: new Date(user.dob).toISOString().split("T")[0],
      }));
      const doc = new jsPDF();
      doc.text("User Data", 10, 10);
      const tableData = formattedData.map((user) => [
        user.firstName,
        user.lastName,
        user.gender,
        user.emailId,
        user.contactNumber,
        user.status === 1
          ? "Active"
          : user.status === 2
          ? "Delete"
          : "Inactive",
        roleMap[user.roleId] || "Unknown",
        new Date(user.dob).toLocaleDateString(),
        user.password,
      ]);
      (doc as any).autoTable({
        head: [
          [
            "First Name",
            "Last Name",
            "Gender",
            "Email",
            "Contact",
            "Status",
            "Role Name",
            "DOB",
          ],
        ],
        body: tableData,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: "linebreak",
        },
        columnStyles: {
          0: { cellWidth: 20 }, // First name column
          1: { cellWidth: 20 }, // Last name column
          2: { cellWidth: 15 }, // Gender
          3: { cellWidth: 40 }, // Email
          4: { cellWidth: 25 }, // Contact
          5: { cellWidth: 15 }, // Status
          6: { cellWidth: 20 }, // Role Name
          7: { cellWidth: 25 }, // DOB
        },
        margin: { top: 20 },
      });

      doc.save("UserData.pdf");
    } catch (error) {
      toast.error("Failed to export PDF");
    }
  };

  const exportToExcel = async () => {
    try {
      const { items } = await fetchUsers(0, 10000, searchTerm);
      const formattedData = items.map((user) => ({
        "First Name": user.firstName,
        "Last Name": user.lastName,
        Gender: user.gender,
        Email: user.emailId,
        Contact: user.contactNumber,
        Status:
          user.status === 1
            ? "Active"
            : user.status === 2
            ? "Delete"
            : "Inactive",
        "Role Name": roleMap[user.roleId] || "Unknown",
        DOB: new Date(user.dob).toLocaleDateString(),
      }));
    } catch (error) {
      toast.error("Failed to export Excel");
    }
  };
  // Handle search submission: update searchTerm and reset current page
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(0);
  };

  const isSelfUser =
    loggedInUser && Number(loggedInUser.roleId) === 3 ? true : false;

  return (
    <div className={styles.mainTableContainer}>
      <div className={styles.buttonContainer}>
        {!isSelfUser && (
          <>
            <Search
              value={searchTerm}
              onChange={setSearchTerm}
              onSearchSubmit={handleSearchChange}
              className={styles.searchBar}
              placeholder="Search By First name, Last name, Email, Gender and Role"
            />

            <h1 className={styles.heading}>Users Registered</h1>
          </>
        )}
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
      </div>
      <div className={styles.table}>
        {loading ? (
          <Spinner />
        ) : (
          loggedInUser && (
            <UserTable
              users={users}
              totalCount={totalCount}
              roles={roles}
              onEditUser={handleEdit}
              onDeleteUser={handleDeleteUser}
              onHandleUserUpdate={handleUpdate}
              onHandleUserClick={handleUserClick}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              hideDeleteButton={isSelfUser}
            />
          )
        )}

        {selectedUser && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <Button
                variant="secondary"
                className={styles.closeButton}
                onClick={() => {
                  setIsFormVisible(false);
                  setIsEditing(false);
                  setIsViewing(false);
                  setSelectedUser(null);
                }}
              >
                &times;
              </Button>
              <UserForm
                user={selectedUser}
                isEditing={isEditing}
                isViewing={isViewing}
                onUserSaved={async () => {
                  loadUsers(currentPage);
                  setSelectedUser(null);
                  setIsViewing(false);
                  setIsFormVisible(false);
                }}
                handleUpdate={handleUpdate}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
