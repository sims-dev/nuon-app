import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from '../services/news.service';
import { CourseService } from '../services/course.service';
import { EventService } from '../services/event.service';
import { WorkshopService } from '../services/workshop.service';
import { AssessmentService } from '../services/assessment.service';

@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly newsService: NewsService,
        private readonly courseService: CourseService,
        private readonly eventService: EventService,
        private readonly workshopService: WorkshopService,
        private readonly assessmentService: AssessmentService,
    ) {}

    @Get('news')
    async getDashboardNews(@Query('limit') limit: string = '10'): Promise<any> {
        try {
            const news = await this.newsService.getLatestNews(parseInt(limit, 10));
            return {
                success: true,
                news: news.news || []
            };
        } catch (error) {
            return {
                success: false,
                news: []
            };
        }
    }

    @Get('news/featured')
    async getDashboardFeaturedNews(@Query('limit') limit: string = '5'): Promise<any> {
        try {
            const news = await this.newsService.getFeaturedNews(parseInt(limit, 10));
            return {
                success: true,
                news: news.news || []
            };
        } catch (error) {
            return {
                success: false,
                news: []
            };
        }
    }

    @Get('courses')
    async getDashboardCourses(@Query('limit') limit: string = '10'): Promise<any> {
        try {
            const courses = await this.courseService.getAllCourses();
            return {
                success: true,
                courses: courses || []
            };
        } catch (error) {
            return {
                success: false,
                courses: []
            };
        }
    }

    @Get('events')
    async getDashboardEvents(@Query('limit') limit: string = '10'): Promise<any> {
        try {
            const events = await this.eventService.getAllEvents();
            return {
                success: true,
                events: events || []
            };
        } catch (error) {
            return {
                success: false,
                events: []
            };
        }
    }

    @Get('workshops')
    async getDashboardWorkshops(@Query('limit') limit: string = '10'): Promise<any> {
        try {
            const workshops = await this.workshopService.getAllWorkshops();
            return {
                success: true,
                workshops: workshops || []
            };
        } catch (error) {
            return {
                success: false,
                workshops: []
            };
        }
    }

    @Get('assessments')
    async getDashboardAssessments(@Query('limit') limit: string = '10'): Promise<any> {
        try {
            const assessments = await this.assessmentService.getAssessments({});
            return {
                success: true,
                assessments: assessments || []
            };
        } catch (error) {
            return {
                success: false,
                assessments: []
            };
        }
    }
}