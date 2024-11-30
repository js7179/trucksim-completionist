import { createSecretKey } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { JOSEError, JWTExpired } from 'jose/errors';

const jwtSecret = createSecretKey(process.env.JWT_SECRET, 'utf-8');

export default async function AuthenticationHeader(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;
    if(!authorizationHeader) {
        console.log('Request made with no Authorization header');
        return res.status(401).send('No authorization header');
    }

    const split = authorizationHeader.split(' ');
    if(split.length !== 2) {
        console.log('Request made with malformed Authorization header');
        return res.status(400).send("Expected Authorization header to be of form 'Bearer [jwt]'");
    }

    const jwt = split[1];

    try {
        const { payload } = await jwtVerify(jwt, jwtSecret);
        res.locals.uuid = payload.sub;
    } catch (err) {
        if(err instanceof JOSEError) {
            const joseErr = err as JOSEError;
            if(joseErr instanceof JWTExpired) {
                return res.status(401).send('JWT in Authorization header has expired');
            }
        } else {
            return res.status(500).send('Unexpected failure verifying JWT');
        }
    }
    next();
}