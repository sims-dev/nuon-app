import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Module({
    imports: [], // 👈 Import so ApiService works
    providers: [JwtAuthGuard],
    exports: [JwtAuthGuard]
})
export class GuardsModule {}
