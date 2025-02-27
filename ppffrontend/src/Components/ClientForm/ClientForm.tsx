import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import styles from "./ClientForm.module.css";
import { Client, ClientFormProps, ClientFormValues } from "../../types";
import { Button } from "../Button/Button";

const validationSchema = Yup.object().shape({
  clientName: Yup.string().required("Company Name is required"),
  address: Yup.string().required("Address is required"),
  status: Yup.number()
    .required("Status is required")
    .oneOf([0, 1, 2], "Status is required"),

  emailId: Yup.string().email("Invalid email").required("Email is required"),
  contactNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  numberOfEmployees: Yup.number()
    .integer("Number of employees should be a whole number")
    .min(1, "Number of employees should be at least 1")
    .required("Number of employees is required"),
  startDate: Yup.string().required("Start Date is required"),
  endDate: Yup.string()
    .nullable()
    .test(
      "is-after-startDate",
      "End Date should be later than Start Date",
      function (value) {
        const { startDate } = this.parent;
        return !value || !startDate || new Date(value) > new Date(startDate);
      }
    ),
});

const ClientForm: React.FC<ClientFormProps> = ({
  client,
  onClientSaved,
  isViewing,
  isEditing,
  isCreatingClient,
  handleCreate,
  handleUpdate,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    trigger,
  } = useForm<ClientFormValues>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      clientName: "",
      numberOfEmployees: 0,
      status: 1,
      emailId: "",
      address: "",
      contactNumber: "",
      startDate: "",
      endDate: null,
    },
  });

  useEffect(() => {
    if (client && client.id !== 0) {
      reset(client);
    } else {
      reset({
        clientName: "",
        numberOfEmployees: 0,
        status: 3,
        emailId: "",
        address: "",
        contactNumber: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [client, reset]);

  const onSubmit = async (data: ClientFormValues) => {
    const clientToSend: Client = {
      id: client?.id ?? 0,
      ...data,
    };

    if (isEditing && client?.id !== 0) {
      await handleUpdate(clientToSend);
    } else {
      await handleCreate(clientToSend);
    }
    onClientSaved();
  };

  return (
    <div className={styles.clientFormContainer}>
      <form className={styles.clientForm} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>
              Company Name<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              {...register("clientName")}
              placeholder="Company Name"
              disabled={isViewing}
              onBlur={() => trigger("clientName")}
            />
            <p className={styles.error}>{errors.clientName?.message}</p>
          </div>

          <div className={styles.formGroup}>
            <label>
              Address<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              {...register("address")}
              placeholder="123, Street Name, District"
              disabled={isViewing}
              onBlur={() => trigger("address")}
            />
            <p className={styles.error}>{errors.address?.message}</p>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>
              No. of Employees<span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              {...register("numberOfEmployees")}
              placeholder="0"
              disabled={isViewing}
              onBlur={() => trigger("numberOfEmployees")}
            />
            <p className={styles.error}>{errors.numberOfEmployees?.message}</p>
          </div>

          <div className={styles.formGroup}>
            <label>
              Email<span className={styles.required}>*</span>
            </label>
            <input
              type="email"
              {...register("emailId")}
              placeholder="company@example.com"
              disabled={isViewing}
              onBlur={() => trigger("emailId")}
            />
            <p className={styles.error}>{errors.emailId?.message}</p>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>
              Contact Number<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              {...register("contactNumber")}
              placeholder="9876543210"
              disabled={isViewing}
              onBlur={() => trigger("contactNumber")}
            />
            <p className={styles.error}>{errors.contactNumber?.message}</p>
          </div>

          <div className={styles.formGroup}>
            <label>
              Status<span className={styles.required}>*</span>
            </label>

            <select
              {...register("status")}
              defaultValue={undefined}
              disabled={isViewing}
              onBlur={() => trigger("status")}
            >
              <option value={3} disabled selected hidden>
                Select Status
              </option>
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
              <option value={2}>Delete</option>
            </select>
            <p className={styles.error}>{errors.status?.message}</p>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>
              Start Date<span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              {...register("startDate")}
              disabled={isViewing}
              onBlur={() => trigger("startDate")}
            />
            <p className={styles.error}>{errors.startDate?.message}</p>
          </div>

          <div className={styles.formGroup}>
            <label>End Date</label>
            <input
              type="date"
              {...register("endDate")}
              disabled={isViewing}
              onBlur={() => trigger("endDate")}
            />
            <p className={styles.error}>{errors.endDate?.message}</p>
          </div>
        </div>

        {!isViewing && (
          <Button
            variant="primary"
            type="submit"
            disabled={!isValid}
            className={`${styles.submitButton} ${
              !isValid ? styles.disabledButton : ""
            }`}
          >
            {isEditing ? "Update" : "Create"} Client
          </Button>
        )}
      </form>
    </div>
  );
};

export default ClientForm;
