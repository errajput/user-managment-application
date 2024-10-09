// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from '../components/UserTable';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
      console.error(err);
    }
  };

  const handleCreateUser = (newUser) => {
    setUsers([newUser, ...users]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateUser = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
  };

  const handleDeleteUser = (deletedUserId) => {
    const filteredUsers = users.filter((user) => user.id !== deletedUserId);
    setUsers(filteredUsers);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create User
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <UserTable
        users={users}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <UserForm
            onSubmit={handleCreateUser}
            onClose={() => setIsCreateModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Home;
