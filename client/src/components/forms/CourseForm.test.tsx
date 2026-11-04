/* eslint-disable */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseForm from './CourseForm';
import { createTestStore, renderWithProviders } from '../../test/render';
import { addCourseFormControl } from '../../store/slices/formSlice';
import { testCourse } from '../../test/fixtures';
import { toast } from 'react-toastify';

const mocks = vi.hoisted(() => ({
  addNewCourse: vi.fn(),
  updateCourse: vi.fn(),
  uploadImage: vi.fn(),
}));

vi.mock('../../hooks/useCoursesCRUD', () => ({
  default: () => ({
    addNewCourse: mocks.addNewCourse,
    updateCourse: mocks.updateCourse,
  }),
}));
vi.mock('../../supabase/uploadImage', () => ({
  uploadImage: mocks.uploadImage,
}));
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

const mockedToast = vi.mocked(toast);

function renderAdd() {
  const store = createTestStore();
  const result = renderWithProviders(<CourseForm />, { store });
  return result;
}

function renderEdit() {
  const store = createTestStore();
  store.dispatch(
    addCourseFormControl({
      mode: 'edit',
      isAddCourseFormOpen: true,
      selectedcourse: testCourse as any,
    })
  );
  const result = renderWithProviders(<CourseForm />, { store });
  return result;
}

describe('CourseForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.addNewCourse.mockResolvedValue({
      message: 'Course created successfully',
    });
    mocks.updateCourse.mockResolvedValue({
      message: 'Course edited successfully',
    });
    mocks.uploadImage.mockResolvedValue('https://cdn.test/thumb.png');
  });

  it('renders the add course form', () => {
    renderAdd();

    expect(screen.getByText('Add Course')).toBeInTheDocument();
    expect(screen.getByLabelText(/Course Name/)).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByText('Upload Course Thumbnail')).toBeInTheDocument();
  });

  it('validates the course before submitting', async () => {
    const user = userEvent.setup();
    renderAdd();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(mocks.addNewCourse).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/Course Name/)).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText(/Description/)).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('creates a course', async () => {
    const user = userEvent.setup();
    const { store } = renderAdd();

    await user.type(screen.getByLabelText(/Course Name/), 'New Course');
    await user.type(
      screen.getByLabelText(/Description/),
      'A valid course description'
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(mocks.addNewCourse).toHaveBeenCalledWith({
        input: {
          courseName: 'New Course',
          description: 'A valid course description',
          thumbnail_image_path: null,
        },
      })
    );
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Course created successfully'
    );
    expect(store.getState().form.courses.isAddCourseFormOpen).toBe(false);
  });

  it('reports course creation failures', async () => {
    const user = userEvent.setup();
    mocks.addNewCourse.mockRejectedValue('boom');
    renderAdd();

    await user.type(screen.getByLabelText(/Course Name/), 'New Course');
    await user.type(
      screen.getByLabelText(/Description/),
      'A valid course description'
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(mockedToast.error).toHaveBeenCalledWith('boom'));
  });

  it('renders the edit form with the existing thumbnail', () => {
    renderEdit();

    expect(screen.getByText('Edit Course')).toBeInTheDocument();
    expect(screen.getByText('thumb.png')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('archives an edited course', async () => {
    const user = userEvent.setup();
    const { store } = renderEdit();

    await user.click(screen.getByRole('combobox'));
    await user.click(await screen.findByRole('option', { name: 'Archive' }));
    await user.click(screen.getByRole('button', { name: 'Confirm Edit' }));

    await waitFor(() =>
      expect(mocks.updateCourse).toHaveBeenCalledWith({
        input: {
          courseId: 'course-1',
          courseName: 'Test Course',
          description: 'A course used in tests',
          thumbnail_image_path: '/thumb.png',
          isActive: false,
        },
      })
    );
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Course edited successfully'
    );
    expect(store.getState().form.courses.isAddCourseFormOpen).toBe(false);
  });

  it('rejects non-image thumbnails', () => {
    const { container } = renderAdd();
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(['notes'], 'notes.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockedToast.error).toHaveBeenCalledWith('Only Image files allowed');
  });

  it('uploads a thumbnail before creating the course', async () => {
    const user = userEvent.setup();
    const { container } = renderAdd();
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(['image'], 'thumb.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file] } });
    await user.type(screen.getByLabelText(/Course Name/), 'New Course');
    await user.type(
      screen.getByLabelText(/Description/),
      'A valid course description'
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(mocks.uploadImage).toHaveBeenCalledWith(file));
    expect(mocks.addNewCourse).toHaveBeenCalledWith({
      input: expect.objectContaining({
        thumbnail_image_path: 'https://cdn.test/thumb.png',
      }),
    });
  });
});
