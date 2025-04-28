'use client';

import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardHeader, CardBody, Input } from '@heroui/react';

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
    return <div className="text-center text-pm-white">Loading...</div>;
  }

  if (status !== 'authenticated' || session?.user?.role !== 'admin') {
    return (
      <div className="text-center">
        <p className="text-pm-white">Access denied. Admins only.</p>
        <Link href="/" className="hover:underline text-pm-red">
          Back to Home
        </Link>
      </div>
    );
  }

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    if (userForm.id) {
      updateUser.mutate({
        id: userForm.id,
        username: userForm.username,
        email: userForm.email,
        role: userForm.role === 'admin' ? 'admin' : 'user'
      });
    } else {
      createUser.mutate({
        username: userForm.username,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role === 'admin' ? 'admin' : 'user'
      });
    }
  };

  const editUser = (user: typeof users[0]) => {
    setUserForm({ id: user.id, username: user.username, email: user.email, password: '', role: user.role });
  };

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-anton mb-6 text-pm-white">User Management</h1>
        <Link href="/admin" className="inline-block mb-4 hover:underline font-roboto text-pm-white">
          Back to Admin Dashboard
        </Link>

        <Card className="p-6 rounded shadow-md mb-8 bg-pm-blue text-pm-white">
          <CardHeader className="border-b pb-2 mb-4">
            <h2 className="text-xl font-anton text-pm-white">{userForm.id ? 'Edit User' : 'Create New User'}</h2>
          </CardHeader>
          <CardBody>
            {userError && <p className="text-red-500 mb-4 font-roboto">{userError}</p>}
            <form onSubmit={handleUserSubmit} className="space-y-4 mb-6">
              <div>
                <label htmlFor="username" className="block font-roboto font-medium mb-1 text-pm-white">Username</label>
                <Input
                  id="username"
                  type="text"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  className="w-full bg-pm-cream text-pm-dark-blue"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-roboto font-medium mb-1 text-pm-white">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full bg-pm-cream text-pm-dark-blue"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block font-roboto font-medium mb-1 text-pm-white">Password {userForm.id && '(Leave blank to keep unchanged)'}</label>
                <Input
                  id="password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full bg-pm-cream text-pm-dark-blue"
                  required={!userForm.id}
                />
              </div>
              <div>
                <label htmlFor="role" className="block font-roboto font-medium mb-1 text-pm-white">Role</label>
                <select
                  id="role"
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="w-full p-2 border rounded bg-pm-cream text-pm-dark-blue"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Button type="submit" variant="solid" className="bg-blue-600 text-white hover:bg-blue-700 font-roboto font-medium w-full sm:w-auto">
                {userForm.id ? 'Update User' : 'Create User'}
              </Button>
              {userForm.id && (
                <Button
                  type="button"
                  variant="ghost"
                  className="ml-2 border-pm-navy text-pm-white hover:bg-pm-dark-blue font-roboto font-medium"
                  onClick={() => setUserForm({ id: '', username: '', email: '', password: '', role: 'user' })}
                >
                  Cancel Edit
                </Button>
              )}
            </form>
          </CardBody>
        </Card>

        <Card className="p-6 rounded shadow-md mb-8 bg-pm-blue text-pm-white">
          <CardHeader className="border-b pb-2 mb-4">
            <h2 className="text-xl font-anton text-pm-white">User List</h2>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              {users.length > 0 ? (
                <table className="min-w-full border-collapse border border-pm-navy">
                  <thead>
                    <tr className="bg-pm-dark-blue text-pm-white">
                      <th className="font-roboto p-3 text-left border-b border-pm-navy text-pm-white">ID</th>
                      <th className="font-roboto p-3 text-left border-b border-pm-navy text-pm-white">Username</th>
                      <th className="font-roboto p-3 text-left border-b border-pm-navy text-pm-white">Email</th>
                      <th className="font-roboto p-3 text-left border-b border-pm-navy text-pm-white">Role</th>
                      <th className="font-roboto p-3 text-left border-b border-pm-navy text-pm-white">Created</th>
                      <th className="font-roboto p-3 text-left border-b border-pm-navy text-pm-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user: any) => (
                      <tr key={user.id} className="border-b border-pm-navy hover:bg-pm-navy">
                        <td className="font-roboto p-3 border-b border-pm-navy text-pm-white">{user.id}</td>
                        <td className="font-roboto p-3 border-b border-pm-navy text-pm-white">{user.username}</td>
                        <td className="font-roboto p-3 border-b border-pm-navy text-pm-white">{user.email}</td>
                        <td className="font-roboto p-3 border-b border-pm-navy text-pm-white">{user.role}</td>
                        <td className="font-roboto p-3 border-b border-pm-navy text-pm-white">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="font-roboto p-3 border-b border-pm-navy text-pm-white">
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              className="border-pm-navy text-pm-white hover:bg-pm-dark-blue font-roboto font-medium"
                              onClick={() => editUser(user)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="solid"
                              className="bg-red-600 text-white hover:bg-red-700 font-roboto font-medium"
                              onClick={() => deleteUser.mutate({ userId: user.id })}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-pm-cream">No users found.</p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
