import { Role } from '@prisma/client';

export const testUsers = {
  owner: {
    email: 'owner@midwestunderground.com',
    password: 'password123',
    name: 'Owner User',
    role: Role.OWNER,
  },
  super: {
    email: 'super@midwestunderground.com',
    password: 'password123',
    name: 'Super User',
    role: Role.SUPER,
  },
  crew: {
    email: 'crew@midwestunderground.com',
    password: 'password123',
    name: 'Crew User',
    role: Role.CREW,
  },
};

export const createUserPayload = {
  email: 'newuser@midwestunderground.com',
  password: 'password123',
  name: 'New Test User',
  role: Role.CREW,
};
