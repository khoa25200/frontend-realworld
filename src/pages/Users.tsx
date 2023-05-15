import { Route, Routes } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { getAllUser, deleteUser } from '../api/user';
import { UserProps } from '../types';
import UserItem from '../components/userItem';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { usersAtom } from '../atom';

const Users = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserProps[]>([]);

  const [userList, setUserList] = useRecoilState(usersAtom);
  const [num, setNum] = useState<number>(userList.length);

  const refeshUsers = () => {
    setNum(userList.length - 1);
  };

  useEffect(() => {
    const initUsers = async () => {
      try {
        const users = await getAllUser();
        setUsers(users);
        setUserList(users);
      } catch {
        navigate('/', { replace: true });
      }
    };
    initUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [num]);
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Users — DangKhoa</title>
        </Helmet>
      </HelmetProvider>

      <div className="profile-page">
        <div className="container">
          <h2 className="text-lg-center font-weight-bold main-text">
            CRUD Users
          </h2>
          <div className="row">
            {users?.map((user: UserProps, index) => {
              return (
                <div key={index} className="col-xs-12 col-md-10 offset-md-1">
                  <UserItem
                    username={user.username}
                    email={user.email}
                    bio={user.bio}
                    image={user.image}
                    refeshUsers={refeshUsers}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
