import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { CatalogService } from '../services/catalog.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('catalog')
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) {}

    @Get()
    async getCatalog(@Req() req: any): Promise<any> {
        const res = await this.catalogService.getCatalog();
        // Return plain array for mobile frontend compatibility
        return Array.isArray((res as any).items) ? (res as any).items : (res as any).items || [];
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createCatalogItem(@Body() body: { type: string; title: string; description: string; duration?: number; price?: number }, @Req() req: any): Promise<any> {
        const userId = BigInt(req.user.id);
        return this.catalogService.createCatalogItem(body, userId);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateCatalogItem(@Param('id') id: string, @Body() catalogData: any): Promise<any> {
        return this.catalogService.updateCatalogItem(BigInt(id), catalogData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteCatalogItem(@Param('id') id: string): Promise<any> {
        return this.catalogService.deleteCatalogItem(BigInt(id));
    }
}