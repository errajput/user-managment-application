// src/components/UserForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserForm = ({ user, onSubmit, onClose }) => {
  const isEditMode = Boolean(user);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    address: {
      street: '',
      city: '',
    },
    company: '',
    website: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        username: user.username || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
        },
        company: user.company?.name || '',
        website: user.website || '',
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        username: `USER-${Math.random().toString(36).substring(2, 5)}`,
      }));
    }
  }, [isEditMode, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Name: Required, minimum 3 characters
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
    }

    // Email: Required, valid format
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = 'Invalid email address.';
    }

    // Phone: Required, valid phone number
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (
      !/^\+?(\d.*){3,}$/.test(formData.phone)
    ) {
      newErrors.phone = 'Invalid phone number.';
    }

    // Username: Required, minimum 3 characters, non-editable
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters.';
    }

    // Address: Street and City required
    if (!formData.address.street.trim()) {
      newErrors.street = 'Street is required.';
    }
    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required.';
    }

    // Company Name: Optional, if provided at least 3 characters
    if (formData.company && formData.company.trim().length < 3) {
      newErrors.company = 'Company name must be at least 3 characters.';
    }

    // Website: Optional, if provided must be a valid URL
    if (formData.website && !isValidURL(formData.website)) {
      newErrors.website = 'Invalid URL.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      username: formData.username,
      address: {
        street: formData.address.street,
        city: formData.address.city,
      },
      company: {
        name: formData.company,
      },
      website: formData.website,
    };

    try {
      if (isEditMode) {
        const response = await axios.put(
          `https://jsonplaceholder.typicode.com/users/${user.id}`,
          payload
        );
        onSubmit(response.data);
      } else {
        const response = await axios.post(
          'https://jsonplaceholder.typicode.com/users',
          payload
        );
        // JSONPlaceholder returns the created object with an id
        onSubmit(response.data);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Failed to submit the form. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-500 mb-4">
        {isEditMode ? 'Edit User' : 'Create User'}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-500">Name<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } p-2 rounded`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-500" >Email<span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } p-2 rounded`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-500 ">Phone<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full border ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            } p-2 rounded`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-500">Username<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="username"
            value={formData.username}
            readOnly
            className="w-full border text-gray-500 border-gray-300 p-2 rounded bg-gray-100 cursor-not-allowed"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Address: Street */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-500">Street<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            className={`w-full border ${
              errors.street ? 'border-red-500' : 'border-gray-300'
            } p-2 rounded`}
          />
          {errors.street && (
            <p className="text-red-500 text-sm mt-1">{errors.street}</p>
          )}
        </div>

        {/* Address: City */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-500">City<span className="text-red-500">*</span></label>
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            className={`w-full border ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            } p-2 rounded`}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        {/* Company Name */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-500">Company Name</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`w-full border ${
              errors.company ? 'border-red-500' : 'border-gray-300'
            } p-2 rounded`}
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">{errors.company}</p>
          )}
        </div>

        {/* Website */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-500">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className={`w-full border ${
              errors.website ? 'border-red-500' : 'border-gray-300'
            } p-2 rounded`}
          />
          {errors.website && (
            <p className="text-red-500 text-sm mt-1">{errors.website}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
