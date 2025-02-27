import React, { useEffect, useState } from "react";
import RoleTable from "../../Components/RoleTable/RoleTable";
import {
  createRole,
  deleteRole,
  fetchRoleDetails,
  fetchRoles,
  updateRole,
} from "../../api";
import styles from "./RoleManagement.module.css";
import { toast } from "react-toastify";
import { Role } from "../../types";
import { Button } from "../../Components/Button/Button";
import RoleForm from "../../Components/RoleForm/RoleForm";

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const loadRoles = async () => {
    try {
      const data: Role[] = await fetchRoles();
      const formattedData = data.map((role) => ({
        ...role,
        status: role.status,
      }));
      setRoles(formattedData);
    } catch (error) {
      toast.error("Failed to fetch roles");
    }
  };
  useEffect(() => {
    loadRoles();
  }, []);

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsEditing(false);
    setIsViewing(false);
    setIsCreatingRole(true);
    setIsFormVisible(true);
  };
  const handleCreate = async (newRole: Role): Promise<void> => {
    setIsFormVisible(true);
    setIsEditing(false);
    try {
      const response = await createRole({
        ...newRole,
      });
      if (response) {
        await loadRoles();
        setRoles((newRoles) => [...newRoles, response]);
        setSelectedRole(null);
        toast.success("Role Created successfully");
        setIsFormVisible(false);
        setIsCreatingRole(false);
        setSelectedRole(null);
      }
    } catch (error) {
      toast.error("Failed to create role");
    }
  };
  const handleRoleClick = async (roleId: number) => {
    try {
      setIsFormVisible(true);
      setIsViewing(true);
      setIsEditing(false);
      setIsCreatingRole(false);
      const roleDetails = await fetchRoleDetails(roleId);
      if (roleDetails) {
        setSelectedRole({
          ...roleDetails,
          status: roleDetails.status,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch role details");
    }
  };
  const handleEdit = (role: Role) => {
    setIsEditing(true);
    setSelectedRole(role);
    setIsViewing(false);
    setIsFormVisible(true);
  };
  const handleUpdate = async (updatedRole: Role) => {
    try {
      const response = await updateRole(updatedRole.id, {
        ...updatedRole,
      });
      if (response) {
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.id === response.id
              ? { ...response, status: response.status }
              : role
          )
        );
        await loadRoles();
        setIsEditing(false);
        setSelectedRole(null);
        toast.success("Role updated successsfully!");
      }
    } catch (error) {
      toast.error("Failed to update Role");
    }
  };
  const handleDeleteRole = async (roleId: number, roleStatus: number) => {
    if (roleStatus != 2) {
      toast.error(
        "You can't delete this role. Only roles with status 'delete' can be deleted."
      );
      return;
    }
    try {
      const response = await deleteRole(roleId);
      if (response) {
        await loadRoles();
        setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleId));
        toast.success("Role deleted successfully");
      } else {
        toast.error("Failed to delete role");
      }
    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  return (
    <div className={styles.mainTableContainer}>
      <h1 className={styles.heading}> Roles Registered</h1>
      <div className={styles.table}>
        <RoleTable
          roles={roles}
          onEditRole={handleEdit}
          onHandleRoleCreate={handleCreate}
          onHandleRoleUpdate={handleUpdate}
          onDeleteRole={handleDeleteRole}
          onHandleRoleClick={handleRoleClick}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <Button
          variant="primary"
          onClick={handleAddRole}
          className={styles.addbutton}
        >
          Add New Role
        </Button>
        {isEditing || isFormVisible || isCreatingRole || selectedRole ? (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <Button
                variant="secondary"
                className={styles.closeButton}
                onClick={() => {
                  setIsFormVisible(false);
                  setIsEditing(false);
                  setIsCreatingRole(false);
                  setIsViewing(false);
                  setSelectedRole(null);
                }}
              >
                {" "}
                &times;
              </Button>
              <RoleForm
                role={selectedRole}
                isEditing={isEditing}
                isCreatingRole={isCreatingRole}
                isViewing={isViewing}
                handleCreate={handleCreate}
                handleUpdate={handleUpdate}
                onRoleSaved={() => {
                  loadRoles();
                  setIsCreatingRole(false);
                  setSelectedRole(null);
                  setIsViewing(false);
                  setIsFormVisible(false);
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default RoleManagement;
