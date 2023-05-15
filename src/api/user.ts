import { GET, POST, PUT, DELETE } from './config';
import { AuthProps, UserProps } from '../types';

export const registerUser = (body: AuthProps) => POST('/users', body);

export const loginUser = (body: AuthProps) => POST('/login', body);

export const putUser = (body: UserProps) => PUT('/user', body);

export const getUser = () => GET('/user');

export const getAllUser = () => GET('/users');

export const deleteUser = (email: string) => DELETE(`/users/${email}`);
