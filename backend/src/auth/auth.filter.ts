import { ExceptionFilter, Catch, ArgumentsHost }  from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from 'supertokens-node/framework/express';
import { Error as SuperTokensError } from 'supertokens-node';

@Catch(SuperTokensError)
export class AuthFilter implements ExceptionFilter {
    handler: (err: any, req: Request, res: Response, next: NextFunction) => any;
    
    constructor() {
        this.handler = errorHandler();
    }
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const resp = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        this.handler(exception, req, resp, (err: any) => {
            resp.status(500).send('SuperTokens Internal Error');
        });
    }
}