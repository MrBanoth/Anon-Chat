import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { User, Lock, Save, CreditCard } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, isPremium, logout, uploadAvatar, updateProfile } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: 'user@example.com', // Placeholder since we don't store email
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  if (!isLoggedIn || !user) {
    navigate('/auth/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleAvatarClick = () => {
    if (!avatarUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const validateImageFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSizeMB = 5;
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please select a JPEG, PNG, GIF, or WEBP image.';
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size exceeds ${maxSizeMB}MB. Please select a smaller image.`;
    }
    return null;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateImageFile(file);
      if (validationError) {
        setAvatarUploadError(validationError);
        return;
      }
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarUploadError(null);
      setAvatarUploading(true);
      try {
        const url = await uploadAvatar(file);
        if (url) {
          await updateProfile({ avatarUrl: url });
          setAvatarPreview(null); // Clear preview after successful upload
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        setAvatarUploadError('Failed to upload avatar. Please try again.');
      } finally {
        setAvatarUploading(false);
      }
    }
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-12 text-white text-center">
            <Avatar
              name={user.name}
              color={user.avatarColor}
              size="lg"
              className="mx-auto mb-4 cursor-pointer"
              imageUrl={avatarPreview || user.avatarUrl}
              onClick={handleAvatarClick}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAvatarChange}
              disabled={avatarUploading}
            />
            {avatarUploading && <p className="text-sm text-yellow-400">Uploading avatar...</p>}
            {avatarUploadError && <p className="text-sm text-red-500">{avatarUploadError}</p>}

            <h2 className="text-2xl font-bold">{user.name}</h2>

            <div className="flex justify-center mt-2 space-x-2">
              {isPremium && (
                <Badge variant="accent" className="bg-white/20 text-white">
                  Premium
                </Badge>
              )}

              <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    leftIcon={<User size={18} />}
                  />

                  <Input
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    leftIcon={<User size={18} />}
                  />

                  <hr className="my-6" />

                  <h3 className="font-medium text-lg">Change Password</h3>

                  <Input
                    label="Current Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    leftIcon={<Lock size={18} />}
                  />

                  <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    leftIcon={<Lock size={18} />}
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    leftIcon={<Lock size={18} />}
                  />

                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="submit"
                      isLoading={isSaving}
                      leftIcon={<Save size={18} />}
                    >
                      Save Changes
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            ) : (
              <div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Account Information</h3>

                    <div className="mt-4 space-y-4">
                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">Name</span>
                        <span className="font-medium">{user.name}</span>
                      </div>

                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">Membership</span>
                        <span className="font-medium">
                          {isPremium ? (
                            <span className="text-accent-500">Premium</span>
                          ) : (
                            'Free'
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between pb-2 border-b border-gray-100">
                        <span className="text-gray-600">Join Date</span>
                        <span className="font-medium">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Button
                      onClick={() => setIsEditing(true)}
                      leftIcon={<User size={18} />}
                    >
                      Edit Profile
                    </Button>

                    {!isPremium && (
                      <Button
                        variant="outline"
                        onClick={() => navigate('/subscription')}
                        leftIcon={<CreditCard size={18} />}
                        className="ml-4"
                      >
                        Upgrade to Premium
                      </Button>
                    )}
                  </div>

                  <div className="pt-6 border-t border-gray-200 mt-6">
                    <Button
                      variant="outline"
                      onClick={logout}
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      Log Out
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
