import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LessonForm from './LessonForm';
import { createTestStore, renderWithProviders } from '../../test/render';
import { lessonFormControl } from '../../store/slices/formSlice';
import { toast } from 'react-toastify';

const mocks = vi.hoisted(() => ({
  addNewLesson: vi.fn(),
  updateLesson: vi.fn(),
  uploadVideo: vi.fn(),
}));

vi.mock('../../hooks/useLessonsCRUD', () => ({
  default: () => ({
    addNewLesson: mocks.addNewLesson,
    updateLesson: mocks.updateLesson,
  }),
}));
vi.mock('../../supabase/uploadVideo', () => ({
  uploadVideo: mocks.uploadVideo,
}));
vi.mock('react-toastify', () => ({
  toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return { ...actual, useParams: () => ({ id: 'course-1' }) };
});

const mockedToast = vi.mocked(toast);

function renderAdd() {
  const store = createTestStore();
  const result = renderWithProviders(<LessonForm />, { store });
  return result;
}

function renderEdit() {
  const store = createTestStore();
  store.dispatch(
    lessonFormControl({
      mode: 'edit',
      isLessonFormOpen: true,
      selectedLesson: {
        courseId: 'course-1',
        lessonId: 'lesson-1',
        lessonName: 'Old Lesson',
        description: 'An old lesson description',
        videoLink: 'https://cdn.test/old.mp4',
      },
    })
  );
  const result = renderWithProviders(<LessonForm />, { store });
  return result;
}

describe('LessonForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.addNewLesson.mockResolvedValue('Lesson created successfully');
    mocks.updateLesson.mockResolvedValue({
      message: 'Lesson updated successfully',
    });
    mocks.uploadVideo.mockResolvedValue('https://cdn.test/video.mp4');
  });

  it('renders the add lesson form', () => {
    renderAdd();

    expect(screen.getByText('Add A Lesson')).toBeInTheDocument();
    expect(screen.getByLabelText(/Lesson Name/)).toBeInTheDocument();
    expect(screen.getByText('Upload Lesson Video')).toBeInTheDocument();
  });

  it('validates the lesson before submitting', async () => {
    const user = userEvent.setup();
    renderAdd();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(mocks.addNewLesson).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/Lesson Name/)).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText(/Description/)).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('creates a lesson for the route course', async () => {
    const user = userEvent.setup();
    const { store } = renderAdd();

    await user.type(screen.getByLabelText(/Lesson Name/), 'Lesson One');
    await user.type(
      screen.getByLabelText(/Description/),
      'A description with enough characters'
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(mocks.addNewLesson).toHaveBeenCalledWith({
        input: {
          lessonName: 'Lesson One',
          courseId: 'course-1',
          description: 'A description with enough characters',
          videoLink: null,
        },
      })
    );
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Lesson created successfully'
    );
    expect(store.getState().form.lessons.isLessonFormOpen).toBe(false);
  });

  it('reports lesson creation failures', async () => {
    const user = userEvent.setup();
    mocks.addNewLesson.mockRejectedValue('boom');
    renderAdd();

    await user.type(screen.getByLabelText(/Lesson Name/), 'Lesson One');
    await user.type(
      screen.getByLabelText(/Description/),
      'A description with enough characters'
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(mockedToast.error).toHaveBeenCalledWith('boom'));
  });

  it('renders the edit form with the existing video', () => {
    renderEdit();

    expect(screen.getByText('Edit Lesson')).toBeInTheDocument();
    expect(screen.getByText('old.mp4')).toBeInTheDocument();
  });

  it('updates an existing lesson', async () => {
    const user = userEvent.setup();
    renderEdit();

    await user.clear(screen.getByLabelText(/Lesson Name/));
    await user.type(screen.getByLabelText(/Lesson Name/), 'Updated Lesson');
    await user.click(screen.getByRole('button', { name: 'Confirm Edit' }));

    await waitFor(() =>
      expect(mocks.updateLesson).toHaveBeenCalledWith({
        input: {
          lessonId: 'lesson-1',
          courseId: 'course-1',
          lessonName: 'Updated Lesson',
          description: 'An old lesson description',
          videoLink: 'https://cdn.test/old.mp4',
        },
      })
    );
    expect(mockedToast.success).toHaveBeenCalledWith(
      'Lesson updated successfully'
    );
  });

  it('rejects non-mp4 videos', () => {
    const { container } = renderAdd();
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(['notes'], 'notes.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockedToast.error).toHaveBeenCalledWith(
      'Upload files of type mp4 only'
    );
  });

  it('uploads a video before creating the lesson', async () => {
    const user = userEvent.setup();
    const { container } = renderAdd();
    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(['video'], 'lesson.mp4', { type: 'video/mp4' });

    fireEvent.change(input, { target: { files: [file] } });
    await user.type(screen.getByLabelText(/Lesson Name/), 'Lesson One');
    await user.type(
      screen.getByLabelText(/Description/),
      'A description with enough characters'
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(mocks.uploadVideo).toHaveBeenCalledWith(file));
    expect(mocks.addNewLesson).toHaveBeenCalledWith({
      input: expect.objectContaining({
        videoLink: 'https://cdn.test/video.mp4',
      }),
    });
  });
});
