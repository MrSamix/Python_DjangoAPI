import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useGetUserInfoMutation } from '../../services/apiAuth';
import { type AuthItemModel } from '../../types/auth/AuthItemModel';
import { Spin, Alert, Card } from 'antd';

interface DecodedToken {
  user_id: number;
}

function ProfilePage() {
  const [userInfo, setUserInfo] = useState<AuthItemModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [getUserInfo, { isLoading }] = useGetUserInfoMutation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('Token not found. Please log in again.');
          return;
        }

        const decoded: DecodedToken = jwtDecode(token);
        console.log(decoded);
        const userId = decoded.user_id;

        const data = await getUserInfo(userId).unwrap();
        setUserInfo(data);
      } catch (err) {
        setError('Failed to fetch user information.');
        console.error(err);
      }
    };

    fetchUserInfo();
  }, [getUserInfo]);

  if (isLoading) {
    return <Spin tip="Loading user information..." />;
  }

  if (error) {
    return <Alert title="Error" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '20px' }}>
      {userInfo ? (
        <Card title="User Profile" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <p><strong>Username:</strong> {userInfo.username}</p>
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>First Name:</strong> {userInfo.first_name}</p>
          <p><strong>Last Name:</strong> {userInfo.last_name}</p>
          <p><strong>Phone:</strong> {userInfo.phone}</p>
        </Card>
      ) : (
        <Alert title="No user information available." type="info" showIcon />
      )}
    </div>
  );
}

export default ProfilePage;