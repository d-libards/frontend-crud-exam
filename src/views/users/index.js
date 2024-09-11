import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Pagination,
  PaginationItem,
  PaginationLink,
  Alert,
} from "reactstrap";

import EditUserModal from "./component/EditUserModal";
import DeleteConfirmationModal from "./component/DeleteConfirmationModal"; // Import the new DeleteConfirmationModal

const defaultAvatarUrl = "https://via.placeholder.com/50"; // Temporary avatar for new users

function Index() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); //  confirm deletion
  const [userIdToDelete, setUserIdToDelete] = useState(null); // user to delete
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [validationError, setValidationError] = useState(""); // validation error

  const fetchUsers = async (page) => {
    try {
      const response = await fetch(
        `https://reqres.in/api/users?page=${page}&per_page=10`
      );
      const data = await response.json();
      setUsers(data.data);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { first_name, last_name, email } = formData;
    if (!first_name || !last_name || !email) {
      return false;
    }
    return true;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) {
      setValidationError("All fields are required!");
      return;
    }

    setValidationError("");

    if (editUser) {
      // Edit User Mode
      try {
        const response = await fetch(
          `https://reqres.in/api/users/${editUser.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          const updatedUser = {
            ...editUser,
            ...formData,
          };

          setUsers(
            users.map((user) => (user.id === editUser.id ? updatedUser : user))
          );
          setModalOpen(false);
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    } else {
      try {
        const response = await fetch(`https://reqres.in/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newUser = await response.json();

          newUser.avatar = newUser.avatar || defaultAvatarUrl;

          // Add the new user to the state
          setUsers([...users, newUser]);
          setModalOpen(false);
        }
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(
        `https://reqres.in/api/users/${userIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userIdToDelete));
        setDeleteModalOpen(false); // Close the modal after deleting
        setUserIdToDelete(null); // Reset the userIdToDelete state
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openDeleteModal = (userId) => {
    setUserIdToDelete(userId); // Set the user ID to delete
    setDeleteModalOpen(true); // Open the delete confirmation modal
  };

  return (
    <Container>
      <div className="mt-3 text-right">
        <Button color="primary" onClick={() => setModalOpen(true)}>
          + Add User
        </Button>
      </div>

      {validationError && (
        <Alert color="danger" className="mt-3">
          {validationError}
        </Alert>
      )}

      <Table className="mt-3" bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Profile</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <th scope="row">{user.id}</th>
                <td className="text-center">
                  <img
                    src={user.avatar || defaultAvatarUrl}
                    alt={`${user.first_name} ${user.last_name}`}
                    width="50"
                    height="50"
                    className="rounded-circle d-block mx-auto"
                  />
                </td>
                <td>{user.email}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>
                  <Button color="warning" onClick={() => openEditModal(user)}>
                    Edit
                  </Button>{" "}
                  <Button
                    color="danger"
                    onClick={() => openDeleteModal(user.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <Pagination className="mt-3">
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            previous
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </PaginationItem>

        {[...Array(totalPages)].map((_, index) => (
          <PaginationItem key={index + 1} active={currentPage === index + 1}>
            <PaginationLink onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            next
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </PaginationItem>
      </Pagination>

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(!modalOpen)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        toggle={() => setDeleteModalOpen(!deleteModalOpen)}
        onConfirm={handleDeleteUser}
      />
    </Container>
  );
}

export default Index;
