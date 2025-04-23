import * as jose from 'jose';
import { vi } from 'vitest';
import httpMocks from 'node-mocks-http';
import { JOSEError, JWSInvalid, JWTClaimValidationFailed, JWTExpired } from 'jose/errors';
import buildAuthMiddleware from '../../src/middleware/auth';

const TEST_UUID: string = '12345678-1234-1234-1234-1234567890ab';
const VALID_AUTH_HEADER: string = 'Bearer doesnt.matter.itsmocked';

// The secret or ISS does not matter since we are overriding the jose functions
// to return what we want
const MIDDLEWARE_FUNC = await buildAuthMiddleware('foo', 'bar');

vi.mock('jose');

describe("Auth middleware", () => {
    afterEach(() => vi.clearAllMocks());
    
    it("Good auth header", async () => {
        vi.mocked(jose.jwtVerify).mockResolvedValue({ 
            payload: await Promise.resolve({ sub: TEST_UUID }),
            protectedHeader: { alg: "test" },
            key: {type: "test" }
        });
        const request = httpMocks.createRequest({
            headers: { authorization: VALID_AUTH_HEADER }
        });
        const response = httpMocks.createResponse();
        const nextMock = vi.fn();

        await MIDDLEWARE_FUNC(request, response, nextMock);

        expect(nextMock).toHaveBeenCalled();
        expect(response.locals.uuid).toBe(TEST_UUID);
    });

    it("Missing auth header", async () => {
        const request = httpMocks.createRequest();
        const response = httpMocks.createResponse();
        const nextMock = vi.fn();

        await MIDDLEWARE_FUNC(request, response, nextMock);

        expect(nextMock).not.toHaveBeenCalled();
        expect(response.statusCode).toBe(401);
    });

    it("Malformed auth header", async () => {
        const request = httpMocks.createRequest({
            headers: {
                authorization: 'Bearer broken auth header'
            }
        });
        const response = httpMocks.createResponse();
        const nextMock = vi.fn();

        await MIDDLEWARE_FUNC(request, response, nextMock);

        expect(nextMock).not.toHaveBeenCalled();
        expect(response.statusCode).toBe(400);
    });

    it("Expired JWT in header", async () => {
        vi.mocked(jose.jwtVerify).mockImplementation(async () => {
            throw new JWTExpired('', {}); // internal values don't matter
        });
        const request = httpMocks.createRequest({
            headers: {
                authorization: VALID_AUTH_HEADER
            }
        });
        const response = httpMocks.createResponse();
        const nextMock = vi.fn();

        await MIDDLEWARE_FUNC(request, response, nextMock);

        expect(nextMock).not.toHaveBeenCalled();
        expect(response.statusCode).toBe(401);
    });

    it("Invalid JWT in header", async () => {
        vi.mocked(jose.jwtVerify).mockImplementation(async () => {
            throw new JWSInvalid();
        });
        const request = httpMocks.createRequest({
            headers: {
                authorization: VALID_AUTH_HEADER
            }
        });
        const response = httpMocks.createResponse();
        const nextMock = vi.fn();

        await MIDDLEWARE_FUNC(request, response, nextMock);

        expect(nextMock).not.toHaveBeenCalled();
        expect(response.statusCode).toBe(400);
    });

    it("Invalid claims in JWT", async () => {
        vi.mocked(jose.jwtVerify).mockImplementation(async () => {
            throw new JWTClaimValidationFailed('', {});
        });
        const request = httpMocks.createRequest({
            headers: {
                authorization: VALID_AUTH_HEADER
            }
        });
        const response = httpMocks.createResponse();
        const nextMock = vi.fn();

        await MIDDLEWARE_FUNC(request, response, nextMock);

        expect(nextMock).not.toHaveBeenCalled();
        expect(response.statusCode).toBe(401);
    });

    it("500 on JOSE general failure", async () => {
        vi.mocked(jose.jwtVerify).mockImplementation(async () => {
            throw new JOSEError('', {});
        });
        const request = httpMocks.createRequest({
            headers: {
                authorization: VALID_AUTH_HEADER
            }
        });
        const response = httpMocks.createResponse();
        const nextMock = vi.fn();

        await MIDDLEWARE_FUNC(request, response, nextMock);

        expect(nextMock).not.toHaveBeenCalled();
        expect(response.statusCode).toBe(500);
    });
});