/* eslint-disable */

import { sendWelcomeEmail } from './mail.service.js';
import nodemailer from 'nodemailer';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(() => ({
      sendMail: jest.fn(),
    })),
  },
}));

const mockedNodemailer = jest.mocked(nodemailer);
const transporter = mockedNodemailer.createTransport.mock.results[0]
  ?.value as any;
const sendMail = transporter.sendMail as jest.Mock;

describe('mail service', () => {
  beforeEach(() => {
    sendMail.mockReset();
    sendMail.mockResolvedValue(undefined as never);
  });

  it('creates the transporter with SMTP settings', () => {
    expect(mockedNodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        port: expect.any(Number),
        secure: true,
        auth: expect.objectContaining({
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        }),
      })
    );
  });

  it('sends the welcome email with the temporary password', async () => {
    await sendWelcomeEmail('new@test.com', 'newuser', 'temp1234');

    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'new@test.com',
        subject: 'Your Account Details',
        text: expect.stringContaining('temp1234'),
      })
    );
  });

  it('propagates transport failures', async () => {
    sendMail.mockRejectedValue(new Error('smtp down') as never);

    await expect(
      sendWelcomeEmail('new@test.com', 'newuser', 'temp1234')
    ).rejects.toThrow('smtp down');
  });
});
