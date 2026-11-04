/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddUserForm from './AddUserForm';
import { createTestStore, renderWithProviders } from '../../test/render';
import { userAddFormControl } from '../../store/slices/formSlice';
import { toast } from 'react-toastify';

const mocks = vi.hoisted(() => ({
  addNewUser: vi.fn(),
  updateProfile: vi.fn(),
  uploadImage: vi.fn(),
}));

vi.mock('../../hooks/useUserCRUD', () => ({
  default: () => ({
    addNewUser: mocks.addNewUser,
    updateProfile: mocks.updateProfile,
  }),
}));
vi.mock('../../supabase/uploadImage', () => ({
  uploadImage: mocks.uploadImage,
}));
vi.mock('@apollo/client/react', () => ({
  useQuery: () => ({
    data: {
      fetchRoles: [
        { roleId: 'role-1', roleName: 'Instructor' },
        { roleId: 'role-2', roleName: 'Student' },
      ],
    },
  }),
}));
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

const mockedToast = vi.mocked(toast);

function renderAdd() {
  const store = createTestStore();
  const result = renderWithProviders(<AddUserForm />, { store });
  return result;
}

function renderEdit() {
  const store = createTestStore();
  store.dispatch(
    userAddFormControl({
      mode: 'edit',
      isUserAddFormOpen: true,
      selectedUser: {
        userName: 'janedoe',
        email: 'jane@test.com',
        collegeName: 'Test College',
      } as any,
    })
  );
  const result = renderWithProviders(<AddUserForm />, { store });
  return result;
}

async function fillAddFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Username/), 'newuser');
  await user.type(screen.getByLabelText(/Email/), 'new@test.com');
  await user.type(screen.getByLabelText(/College Name/), 'Test College');
  await user.click(screen.getByRole('combobox'));
  await user.click(await screen.findByRole('option', { name: 'Instructor' }));
}

describe('AddUserForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.addNewUser.mockResolvedValue({
      registerUser: {
        email: 'new@test.com',
        temp_password: 'temp1234',
      },
    });
    mocks.updateProfile.mockResolvedValue({
      message: 'jane details has been updated',
    });
    mocks.uploadImage.mockResolvedValue('https://cdn.test/avatar.png');
  });

  it('renders the add user form', () => {
    renderAdd();

    expect(screen.getByText('Add User')).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.queryByLabelText(/new password/i)).not.toBeInTheDocument();
  });

  it('validates required fields before submitting', async () => {
    const user = userEvent.setup();
    renderAdd();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(mocks.addNewUser).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/Username/)).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText(/Email/)).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('creates a user and stores the temporary password', async () => {
    const user = userEvent.setup();
    const { store } = renderAdd();

    await fillAddFields(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(mocks.addNewUser).toHaveBeenCalledWith({
        input: {
          collegeName: 'Test College',
          email: 'new@test.com',
          role: 'role-1',
          username: 'newuser',
        },
      })
    );
    expect(store.getState().form.users.createdUser.email).toBe('new@test.com');
    expect(store.getState().form.users.isUserAddFormOpen).toBe(false);
  });

  it('reports duplicate users with a friendly message', async () => {
    const user = userEvent.setup();
    mocks.addNewUser.mockRejectedValue(new Error('duplicate key value'));
    renderAdd();

    await fillAddFields(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(mockedToast.error).toHaveBeenCalledWith(
        'User with similar credentials exists. Please use a different value.'
      )
    );
  });

  it('reports string failures from user creation', async () => {
    const user = userEvent.setup();
    mocks.addNewUser.mockRejectedValue('boom');
    renderAdd();

    await fillAddFields(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(mockedToast.error).toHaveBeenCalledWith('boom'));
  });

  it('renders the edit user form', () => {
    renderEdit();

    expect(screen.getByText('Edit User')).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByText('Upload Profile Image')).toBeInTheDocument();
  });

  it('updates the profile', async () => {
    const user = userEvent.setup();
    const { store } = renderEdit();

    await user.type(screen.getByLabelText(/new password/i), 'newpass');
    await user.click(screen.getByRole('button', { name: 'Confirm Edit' }));

    await waitFor(() =>
      expect(mocks.updateProfile).toHaveBeenCalledWith({
        input: {
          collegeName: 'Test College',
          email: 'jane@test.com',
          password: 'newpass',
          username: 'janedoe',
          profile_image_path: null,
        },
      })
    );
    expect(mockedToast.success).toHaveBeenCalledWith(
      'jane details has been updated'
    );
    expect(store.getState().form.users.isUserAddFormOpen).toBe(false);
  });

  it('rejects a short password before updating', async () => {
    const user = userEvent.setup();
    renderEdit();

    await user.type(screen.getByLabelText(/new password/i), 'ab cd');
    await user.click(screen.getByRole('button', { name: 'Confirm Edit' }));

    expect(mocks.updateProfile).not.toHaveBeenCalled();
    expect(mockedToast.error).toHaveBeenCalledWith(
      'Password must be at least 4 characters and cannot contain spaces'
    );
  });

  it('rejects non-image uploads', () => {
    const { container } = renderEdit();
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(['notes'], 'notes.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockedToast.error).toHaveBeenCalledWith('Only Image files allowed');
  });

  it('uploads a profile image before updating', async () => {
    const user = userEvent.setup();
    const { container } = renderEdit();
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(['image'], 'avatar.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file] } });
    await user.type(screen.getByLabelText(/new password/i), 'newpass');
    await user.click(screen.getByRole('button', { name: 'Confirm Edit' }));

    await waitFor(() => expect(mocks.uploadImage).toHaveBeenCalledWith(file));
    expect(mocks.updateProfile).toHaveBeenCalledWith({
      input: expect.objectContaining({
        profile_image_path: 'https://cdn.test/avatar.png',
      }),
    });
  });
});
