import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
    constructor() {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.accessToken || request.headers.authorization?.split(' ')[1];

        // ✅ If no token → allow access (guest)
        if (!token) {
            request.user = null;
            return true;
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_SECRET!);
            request.user = decoded;
        } catch {
            // ✅ If token invalid → still allow, but treat as guest
            request.user = null;
        }

        return true;
    }
}
