import { Request, Response, NextFunction } from 'express';

export default function AuthenticationHeader(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;
    if(!authorizationHeader) {
        console.log('Request made with no Authorization header');
    } else {
        console.log(authorizationHeader);
    }

    next();
}