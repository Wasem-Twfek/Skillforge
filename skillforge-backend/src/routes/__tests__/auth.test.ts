/// <reference types="jest" />

// Regression coverage for the JWT gate enforced by
// `src/middleware/auth.ts` (Bearer-scheme enforcement, Phase 5).
// Uses a safe test secret via the existing test setup; no token values
// are printed or committed.

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../../middleware/auth';
import { config } from '../../config/config';
import prisma from '../../lib/prisma';

jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

const mockedFindUnique = prisma.user.findUnique as jest.Mock;

const mockReq = (authorization?: string) => {
  const req = { headers: {} } as Request;
  if (authorization !== undefined) {
    req.headers.authorization = authorization;
  }
  return req;
};

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

describe('authenticate middleware', () => {
  const userRow = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    picture: null,
    bio: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedFindUnique.mockResolvedValue(userRow);
  });

  it('rejects a missing token with 401', async () => {
    const req = mockReq();
    const res = mockRes();
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects the wrong authentication scheme with 401', async () => {
    const token = jwt.sign({ id: userRow.id }, config.JWT_SECRET, { expiresIn: '1h' });
    const req = mockReq(`Token ${token}`);
    const res = mockRes();
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects a malformed token with 401', async () => {
    const req = mockReq('Bearer not-a-jwt');
    const res = mockRes();
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects a token with an invalid signature with 401', async () => {
    const badToken = jwt.sign({ id: userRow.id }, 'wrong-secret', { expiresIn: '1h' });
    const req = mockReq(`Bearer ${badToken}`);
    const res = mockRes();
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects an expired token with 401', async () => {
    const expired = jwt.sign({ id: userRow.id }, config.JWT_SECRET, { expiresIn: '-10s' });
    const req = mockReq(`Bearer ${expired}`);
    const res = mockRes();
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects a valid token when the user no longer exists with 401', async () => {
    mockedFindUnique.mockResolvedValue(null);
    const token = jwt.sign({ id: 'missing-user' }, config.JWT_SECRET, { expiresIn: '1h' });
    const req = mockReq(`Bearer ${token}`);
    const res = mockRes();
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches the user and calls next for a valid token', async () => {
    const token = jwt.sign({ id: userRow.id }, config.JWT_SECRET, { expiresIn: '1h' });
    const req = mockReq(`Bearer ${token}`);
    const res = mockRes();
    const next = jest.fn();

    await authenticate(req, res, next);

    expect(mockedFindUnique).toHaveBeenCalledWith({
      where: { id: userRow.id },
      select: expect.objectContaining({ id: true, email: true }),
    });
    expect(req.user).toMatchObject({ id: userRow.id, email: userRow.email });
    expect(next).toHaveBeenCalled();
  });
});
