import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./RoleForm.module.css";
import { Button } from "../Button/Button";
import { Role, RoleFormProps, RoleFormValues } from "../../types";

const validationSchema = Yup.object().shape({
  roleName: Yup.string().required("Role Name is required"),
  status: Yup.number()
    .oneOf([0, 1, 2], "Invalid status")
    .required("Status is required"),
});

const RoleForm: React.FC<RoleFormProps> = ({
  role,
  onRoleSaved,
  isViewing,
  isEditing,
  isCreatingRole,
  handleCreate,
  handleUpdate,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<RoleFormValues>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      roleName: "",
      status: 1,
    },
  });

  useEffect(() => {
    if (role && role.id !== 0) {
      reset(role);
    } else {
      reset({
        roleName: "",
        status: 3,
      });
    }
  }, [role, reset]);

  const onSubmit = async (data: RoleFormValues) => {
    const roleToSend: Role = {
      id: role?.id ?? 0,
      ...data,
    };

    if (isEditing && role?.id !== 0) {
      await handleUpdate(roleToSend);
    } else {
      await handleCreate(roleToSend);
    }
    onRoleSaved();
  };

  return (
    <div className={styles.roleFormContainer}>
      <form className={styles.roleForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGroup}>
          <label>
            Role Name<span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            {...register("roleName")}
            placeholder="Role Name"
            disabled={isViewing || (!isEditing && !isCreatingRole)} // Fixed condition
          />
          <p className={styles.error}>{errors.roleName?.message}</p>
        </div>

        <div className={styles.formGroup}>
          <label>
            Status<span className={styles.required}>*</span>
          </label>

          <select
            {...register("status")}
            disabled={isViewing || (!isEditing && !isCreatingRole)}
            defaultValue={role?.status ?? 3}
          >
            <option value={3} disabled hidden>
              Select Status
            </option>
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
            <option value={2}>Delete</option>
          </select>
          <p className={styles.error}>{errors.status?.message}</p>
        </div>

        {!isViewing && (
          <Button variant="primary" type="submit" disabled={!isValid}>
            {isEditing ? "Update" : "Create"} Role
          </Button>
        )}
      </form>
    </div>
  );
};

export default RoleForm;
