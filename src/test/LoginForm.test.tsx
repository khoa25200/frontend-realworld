import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import LoginForm from './LoginForm';

describe('<LoginForm />', () => {
  it('has email and password field and sign in button', () => {
    render(<LoginForm />);
    screen.getByPlaceholderText('Email');
    screen.getAllByPlaceholderText('Password');
    screen.getByRole('button');
  });

  it('changes input', () => {
    render(<LoginForm />);
    const email = screen.getByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');
    userEvent.type(email, 'khoa25200@gmail.com');
    userEvent.type(password, '10102001');
    expect(email).toHaveAttribute('value', 'khoa25200@gmail.com');
    expect(password).toHaveAttribute('value', '10102001');
  });

  it('disables and enables input fields and sign in button', () => {
    render(<LoginForm />);
    const email = screen.getByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');
    let button = screen.getByRole('button');
    userEvent.type(email, 'khoa25200@gmail.com');
    userEvent.type(password, '10102001');
    userEvent.click(button);
    expect(email).toBeDisabled();
    expect(password).toBeDisabled();
    expect(button).toBeDisabled();
  });
});
