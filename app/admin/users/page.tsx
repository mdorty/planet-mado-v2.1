'use client';

import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const { data: session, status } = useSession();

  // State for user form
  const [userForm, setUserForm] = useState({ id: '', username: '', email: '', password: '', role: 'user' });
  const [userError, setUserError] = useState('');

  // Fetch users
  const { data: users = [], refetch: refetchUsers } = trpc.admin.getUsers.useQuery(undefined, {
    enabled: status === 'authenticated' && session?.user?.role === 'admin',
  });

  // Mutations
  const createUser = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      refetchUsers();
      setUserForm({ id: '', username: '', email: '', password: '', role: 'user' });
      setUserError('');
    },
    onError: (err) => setUserError(err.message),
  });

  const updateUser = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      refetchUsers();
      setUserForm({ id: '', username: '', email: '', password: '', role: 'user' });
      setUserError('');
    },
    onError: (err) => setUserError(err.message),
  });

  const deleteUser = trpc.admin.deleteUser.useMutation({
    onSuccess: () => refetchUsers(),
    onError: (err) => setUserError(err.message),
  });

  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  if (status !== 'authenticated' || session?.user?.role !== 'admin') {
    return (
      <div className="text-center">
        <p>Access denied. Admins only.</p>
        <Link href="/" className="text-dbz-orange hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    if (userForm.id) {
      updateUser.mutate(userForm);
    } else {
      createUser.mutate(userForm);
    }
  };

  const editUser = (user: typeof users[0]) => {
    setUserForm({ id: user.id, username: user.username, email: user.email, password: '', role: user.role });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl text-dbz-orange mb-6">User Management</h1>
        <Link href="/admin" className="inline-block mb-4 text-dbz-orange hover:underline">
          Back to Admin Dashboard
        </Link>

        {/* Users Section */}
        <div className="bg-white p-6 rounded shadow-md mb-8">
          <h2 className="text-xl mb-4">Manage Users</h2>
          {userError && <p className="text-red-500 mb-4">{userError}</p>}
          <form onSubmit={handleUserSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm">Username</label>
              <input
                type="text"
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm">Email</label>
              <input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {!userForm.id && (
              <div>
                <label className="block text-sm">Password</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm">Role</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="bg-dbz-orange text-white p-2 rounded hover:opacity-90 transition-opacity">
              {userForm.id ? 'Update User' : 'Create User'}
            </button>
            {userForm.id && (
              <button
                type="button"
                onClick={() => setUserForm({ id: '', username: '', email: '', password: '', role: 'user' })}
                className="ml-2 bg-gray-300 text-black p-2 rounded hover:opacity-90 transition-opacity"
              >
                Cancel Edit
              </button>
            )}
          </form>

          <h3 className="text-lg mt-6 mb-2">Current Users</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((user) => (
              <div key={user.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p>{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email} - {user.role}</p>
                </div>
                <div>
                  <button
                    onClick={() => editUser(user)}
                    className="bg-blue-500 text-white p-1 rounded hover:opacity-90 transition-opacity mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser.mutate({ id: user.id })}
                    className="bg-red-500 text-white p-1 rounded hover:opacity-90 transition-opacity"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
