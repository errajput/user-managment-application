// src/pages/UserDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${id}`
      );
      setUser(response.data);
    } catch (err) {
      setError('Failed to fetch user details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading user details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>No user found.</div>;

  return (
    <div>
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Home
      </Link>
      <h1 className="text-2xl font-bold mb-4">{user.name}'s Details</h1>
      <div className="bg-white shadow-md rounded p-6">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Website:</strong> <a href={`http://${user.website}`} className="text-blue-500 hover:underline">{user.website}</a></p>
        <p><strong>Address:</strong> {user.address.street}, {user.address.city}</p>
        <p><strong>Company:</strong> {user.company.name}</p>
      </div>
    </div>
  );
};

export default UserDetail;
