// src/components/UserTable.js
import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import UserForm from './UserForm';
import { Link } from 'react-router-dom';

const UserTable = ({ users, onUpdateUser, onDeleteUser }) => {
  const [editUser, setEditUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [error, setError] = useState('');

  const handleEdit = (user) => {
    setEditUser(user);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
        onDeleteUser(id);
      } catch (err) {
        setError('Failed to delete user.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr
              key={user.id}
              className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            >
              <td className="py-2 px-4 border-b">
                <Link to={`/user/${user.id}`} className="text-blue-500 hover:underline">
                  {user.name}
                </Link>
              </td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.phone}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Modal */}
      {editUser && (
        <Modal onClose={() => setEditUser(null)}>
          <UserForm
            user={editUser}
            onSubmit={onUpdateUser}
            onClose={() => setEditUser(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default UserTable;
