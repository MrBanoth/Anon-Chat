import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { User, Star } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarColor?: string;
  isPremium: boolean;
  rating: number;
  joinedAt: string;
  // Add other profile fields as needed
}

export const OtherProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { isLoggedIn, isPremium } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Fetch user profile data by userId
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        // Replace with actual API call or store fetch
        // For example, using supabase or other backend
        // Here, simulate fetch with dummy data
        const fetchedProfile: UserProfile = {
          id: userId,
          name: 'John Doe',
          avatarUrl: '',
          avatarColor: '#4F46E5',
          isPremium: true,
          rating: 4.5,
          joinedAt: '2023-01-01T00:00:00Z',
        };
        setProfile(fetchedProfile);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!isLoggedIn) {
    return <Navigate to="/auth/login" />;
  }

  if (!isPremium) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>You must be a premium member to view other profiles.</p>
        </div>
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto p-8 text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-t-4 border-primary-500 h-12 w-12 mx-auto mb-4"></div>
          <p className="text-primary-700 dark:text-primary-300 font-semibold">Loading profile...</p>
        </div>
      </PageLayout>
    );
  }

  if (error || !profile) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto p-8 text-center text-red-500">
          <p>{error || 'Profile not found.'}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => window.history.back()}
          className="mb-4 text-primary-600 dark:text-primary-400 hover:underline font-semibold"
        >
          &larr; Back
        </button>
        <div className="text-center text-gray-900 dark:text-gray-100 p-6">
          <Avatar
            name={profile.name}
            color={profile.avatarColor}
            size="lg"
            className="mx-auto mb-4"
            imageUrl={profile.avatarUrl || ''}
          />
          <h2 className="text-2xl font-bold mb-2">Match</h2>
          {profile.isPremium && (
            <Badge variant="accent" className="mb-4">
              Premium Member
            </Badge>
          )}
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Star className="text-yellow-400" />
            <span className="text-lg font-semibold">{profile.rating.toFixed(1)}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Member since {new Date(profile.joinedAt).toLocaleDateString()}
          </p>
          {/* Rating UI */}
          <div className="flex justify-center space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`cursor-pointer ${
                  star <= Math.round(profile.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                }`}
                onClick={() => alert(`You rated ${star} stars!`)}
                size={28}
              />
            ))}
          </div>
          {/* Add more profile details and UI here */}
        </div>
      </div>
    </PageLayout>
  );
};
