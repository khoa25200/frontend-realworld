/* eslint-disable prettier/prettier */
import { Link } from 'react-router-dom';
import images from '../../assets/img';
import { useEffect, useState } from 'react';
import { deleteUser, getAllUser } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userAtom } from '../../atom';


/* eslint-disable prettier/prettier */
interface UserProps {
  username: string;
  email: string;
  bio?: string;
  image: string;
  refeshUsers: () => void;
}

const UserItem = ({ username, email, bio, image, refeshUsers }: UserProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userAtom);

  const [errMsg, setErrMsg] = useState('');
  const handleDeleteUser = async () => {
    try {
      await deleteUser(email);
      refeshUsers();
    } catch {
      setErrMsg("You can't delete yourself");
    }
  };
  const handleUpdateUser = async () => {
    try {
      navigate('/settings', { replace: true })
    } catch {
      // setErrMsg("You can't delete yourself");
    }
  };

  return <div className="article-preview">
    <div className="article-meta">
      <Link to={`/profile/${username}`}>
        <img src={image || images.defaultAvatar} />
      </Link>
      <div className="info">
        <Link to={`/profile/${username}`} className="author">
          <h5>{username}</h5>
          <p>{bio || ""}</p>
        </Link>
      </div>
      <div className="pull-xs-right btn-toolbar'">
        {
          (user.username === username) && (<button type="button" className='btn btn-outline-action btn-secondary btn-group crud' onClick={handleUpdateUser}>
            <i className="ion-compose" />
          </button>)
        }
        <button type="button" className='btn btn-outline-danger btn-danger btn-group crud' onClick={handleDeleteUser}>
          <i className="ion-trash-b" />
        </button>

      </div>
      {errMsg && <span className='error-messages delete-err'>{errMsg}</span>}
    </div>
  </div>
};
export default UserItem;
