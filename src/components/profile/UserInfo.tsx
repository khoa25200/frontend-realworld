import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import images from '../../assets/img';

import Loading from '../common/Loading';

import { useRecoilState } from 'recoil';
import { isLoggedInAtom, userAtom } from '../../atom';

import { getProfile } from '../../api/profile';
import FollowButton from '../common/FollowButton';
import { postFollow, deleteFollow } from '../../api/profile';

// TODO: userInfo refresh issue when 'My/Favorited Articles' button clicked
const UserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    image: '',
    username: '',
    bio: '',
    following: false,
  });
  const { image, username, bio, following } = userInfo;
  const [loading, setLoading] = useState(true);
  // const user = useRecoilValue(userAtom);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);
  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    const initUserInfo = async () => {
      setLoading(true);
      try {
        const data = await getProfile(userId!);
        const { image, username, bio, following } = data.profile;
        setUserInfo({
          image: image,
          username: username,
          bio: bio,
          following: following,
        });
      } catch {
        navigate('/', { replace: true });
      }
      setLoading(false);
    };

    initUserInfo();
  }, [userId, navigate]);

  const onLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsLoggedIn(false);
    setUser({ email: '', username: '', bio: '', image: '' });
    navigate('/', { replace: true });
  };

  const follow = async () => {
    try {
      await postFollow(userId!);
      setUserInfo({
        ...userInfo,
        following: true,
      });
    } catch {}
  };

  const unfollow = async () => {
    try {
      await deleteFollow(userId!);
      setUserInfo({
        ...userInfo,
        following: false,
      });
    } catch {}
  };

  return (
    <>
      <div className="user-info">
        {loading ? (
          <Loading height={20} />
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img
                  src={image || images.defaultAvatar}
                  className="user-img"
                  alt="profile"
                />
                <h4>{username}</h4>
                <p>{bio}</p>
                {user.username === userId ? (
                  <>
                    <button
                      onClick={onLogout}
                      className="btn btn-sm btn-outline-primary logout-btn"
                    >
                      <i className="ion-log-out"></i> Log out
                    </button>
                    <Link to="/settings">
                      <button className="btn btn-sm btn-outline-secondary action-btn">
                        <i className="ion-gear-a"></i> Edit Profile
                      </button>
                    </Link>
                  </>
                ) : (
                  <FollowButton
                    following={following}
                    username={userId!}
                    follow={follow}
                    unfollow={unfollow}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserInfo;
