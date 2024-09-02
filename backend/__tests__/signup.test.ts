import bcrypt from 'bcrypt';
import { describe, expect, it, beforeEach, afterAll, beforeAll } from 'vitest';
import { app } from '@/app';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

describe('Signup API routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  // cleaning the database before starting a new test
  beforeEach(async () => {
    await prisma.$executeRaw`PRAGMA foreign_keys = OFF;`;
    await prisma.$executeRaw`DELETE FROM "Admin";`;
    await prisma.$executeRaw`PRAGMA foreign_keys = ON;`;
  });

  it('should successfully create new admin', async () => {
    const requestBody = {
      name: 'Refu',
      email: 'refu@teste.com',
      password: 'senhateste123',
    };

    const response = await request(app.server)
      .post('/api/signup')
      .send(requestBody);

    expect(response.status).toBe(201);

    // checking the response data
    expect(response.body).toHaveProperty('createdAdmin');
    expect(response.body.createdAdmin).toHaveProperty('id');
    expect(response.body.createdAdmin).toHaveProperty('name', requestBody.name);
    expect(response.body.createdAdmin).toHaveProperty(
      'email',
      requestBody.email
    );
  });

  it('should return an error for duplicate email', async () => {
    const existingAdmin = await prisma.admin.create({
      data: {
        name: 'Refu',
        email: 'refu@teste.com',
        password: await bcrypt.hash('senhateste123', 10),
      },
    });

    const requestBody = {
      name: 'Refu',
      email: existingAdmin.email,
      password: 'senhateste123',
    };

    const response = await request(app.server)
      .post('/api/signup')
      .send(requestBody);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty(
      'message',
      'This email address already exists.'
    );
  });

  it('should return an error for invalid data format', async () => {
    const requestBody = {
      name: 'Refu',
      email: 'refu@teste', // invalid email format
      password: 'senhateste123',
    };

    const response = await request(app.server)
      .post('/api/signup')
      .send(requestBody);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return an error for invalid password without number', async () => {
    const requestBody = {
      name: 'Refu',
      email: 'refu@teste.com',
      password: 'senhateste', // invalid password format (without number)
    };

    const response = await request(app.server)
      .post('/api/signup')
      .send(requestBody);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain(
      'Data sent is not in a valid format.'
    );
  });
});
