import { Request, Response } from 'express';

/*
  {
    "authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }
*/

export interface User {
  name: string;
  sub: string;
  iat: number;
}

export interface Context {
  req: Request;
  res: Response;
  user?: User;
}