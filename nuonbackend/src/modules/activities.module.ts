import { Module } from '@nestjs/common';
import { ActivitiesController } from '../controllers/activities.controller';

@Module({
    controllers: [ActivitiesController],
})
export class ActivitiesModule {}