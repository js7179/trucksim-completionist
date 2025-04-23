import { createSecretKey } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { JOSEError, JWSInvalid, JWSSignatureVerificationFailed, JWTClaimValidationFailed, JWTExpired } from 'jose/errors';

export default async function buildAuthMiddleware(jwtSecret: string, jwtISS: string) {
    const jwtSecretKey = createSecretKey(jwtSecret, 'utf-8');

    return async function authorizationHeaderMiddleware(req: Request, res: Response, next: NextFunction) {
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader) {
            return res.status(401).json({error: { message: 'No authorization header'}});
        }

        const split = authorizationHeader.split(' ');
        if(split.length !== 2) {
            return res.status(400).json({ error: { message: "Expected Authorization header to be of form 'Bearer [jwt]" } });
        }

        const jwt = split[1];

        try {
            const { payload } = await jwtVerify(jwt, jwtSecretKey, {
                issuer: jwtISS,
                audience: 'authenticated'
            });
            res.locals.uuid = payload.sub;
        } catch (err) {
            if(err instanceof JOSEError) {
                const joseErr = err as JOSEError;
                if(joseErr instanceof JWTExpired) {
                    return res.status(401).json({ error: { message: 'JWT in Authorization header has expired' } });
                } else if (joseErr instanceof JWSInvalid || joseErr instanceof JWSSignatureVerificationFailed) {
                    return res.status(400).json({ error: { message: 'Invalid JWT in Authorization header' } });
                } else if(joseErr instanceof JWTClaimValidationFailed) {
                    return res.status(401).json({ error: { message: 'JWT issuer or audience does not match what was expected' } });
                } else {
                    return res.status(500).json({ error: { message: 'Unknown error verifying JWT' } });
                }
            } else {
                return res.status(500).json({ error: { message: 'Unexpected failure verifying JWT' } });
            }
        }
        next();
    };
}