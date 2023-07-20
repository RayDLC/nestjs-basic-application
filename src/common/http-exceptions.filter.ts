import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    private readonly log = new Logger(AllExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const [rq, rs] = [ctx.getRequest(), ctx.getResponse()]

        const code = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const data = exception instanceof HttpException ? (exception.getResponse() as any)?.message ?? exception.getResponse() : exception.message ?? exception;

        if (code >= 500) this.log.error(`[${code}]: ${JSON.stringify(data)} | ${rq?.method} ${rq.url} | ${rq?.headers?.['x-real-ip'] ?? 'NoIP'}`);
        return rs.status(code).json({ code, time: new Date().toISOString(), path: `${rq.method} ${rq.url}`, data })
    }
}
