const News = require('../models/News');
const { emitNewNews, emitNewsUpdate } = require('../lib/socket');

// Get all news (public and admin)
const getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, featured, status } = req.query;
    const isAdminRoute = req.path.includes('/admin/');

    const query = {};
    if (status) query.status = status;
    else if (!isAdminRoute) query.status = 'published'; // Default to published for public routes
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    let newsQuery = News.find(query);
    if (!isAdminRoute) {
      newsQuery = newsQuery.populate('author', 'name email');
    }
    const news = await newsQuery
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await News.countDocuments(query);

    res.json({
      success: true,
      news: news || [],
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNews: total
      }
    });
  } catch (error) {
    console.error('Get all news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message
    });
  }
};

// Get featured news
const getFeaturedNews = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const news = await News.getFeatured(limit);

    res.json({
      success: true,
      news
    });
  } catch (error) {
    console.error('Get featured news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured news',
      error: error.message
    });
  }
};

// Get latest news
const getLatestNews = async (req, res) => {
  try {
    const { limit = 10, category } = req.query;

    const news = await News.getLatest(limit, category);

    res.json({
      success: true,
      news
    });
  } catch (error) {
    console.error('Get latest news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest news',
      error: error.message
    });
  }
};

// Get single news by ID
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is a valid ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    const news = await News.findById(id)
      .populate('author', 'name email');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Increment view count
    await news.incrementViews();

    res.json({
      success: true,
      news
    });
  } catch (error) {
    console.error('Get news by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message
    });
  }
};

// Create news (admin only)
const createNews = async (req, res) => {
  try {
    const { title, content, excerpt, category, featured, images, videos, tags } = req.body;
    const author = req.user._id;

    const news = await News.create({
      title,
      content,
      excerpt,
      category,
      status: 'published', // Auto-publish news when created
      featured: featured || false,
      images: images || [],
      videos: videos || [],
      tags: tags || [],
      author
    });

    const populatedNews = await News.findById(news._id)
      .populate('author', 'name email');

    // Emit real-time update
    emitNewNews(populatedNews);

    res.status(201).json({
      success: true,
      message: 'News created successfully',
      news: populatedNews
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating news',
      error: error.message
    });
  }
};

// Update news (admin only)
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Update the news
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        news[key] = updates[key];
      }
    });

    await news.save();

    const updatedNews = await News.findById(id)
      .populate('author', 'name email');

    // Emit real-time update
    emitNewsUpdate(id, 'updated', updatedNews);

    res.json({
      success: true,
      message: 'News updated successfully',
      news: updatedNews
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating news',
      error: error.message
    });
  }
};

// Publish news (admin only)
const publishNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndUpdate(
      id,
      { status: 'published', publishedAt: new Date() },
      { new: true }
    ).populate('author', 'name email');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Emit real-time update
    emitNewsUpdate(id, 'published', news);

    res.json({
      success: true,
      message: 'News published successfully',
      news
    });
  } catch (error) {
    console.error('Publish news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error publishing news',
      error: error.message
    });
  }
};

// Archive news (admin only)
const archiveNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndUpdate(
      id,
      { status: 'archived' },
      { new: true }
    ).populate('author', 'name email');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Emit real-time update
    emitNewsUpdate(id, 'archived', news);

    res.json({
      success: true,
      message: 'News archived successfully',
      news
    });
  } catch (error) {
    console.error('Archive news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error archiving news',
      error: error.message
    });
  }
};

// Delete news (admin only)
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByIdAndDelete(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }

    // Emit real-time update
    emitNewsUpdate(id, 'deleted', news);

    res.json({
      success: true,
      message: 'News deleted successfully'
    });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting news',
      error: error.message
    });
  }
};

// Get news statistics (admin only)
const getNewsStats = async (req, res) => {
  try {
    const totalNews = await News.countDocuments();
    const publishedNews = await News.countDocuments({ status: 'published' });
    const draftNews = await News.countDocuments({ status: 'draft' });
    const featuredNews = await News.countDocuments({ featured: true, status: 'published' });

    const totalViews = await News.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, totalViews: { $sum: '$viewCount' } } }
    ]);

    const totalLikes = await News.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, totalLikes: { $sum: '$likeCount' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalNews,
        publishedNews,
        draftNews,
        featuredNews,
        totalViews: totalViews[0]?.totalViews || 0,
        totalLikes: totalLikes[0]?.totalLikes || 0
      }
    });
  } catch (error) {
    console.error('Get news stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllNews,
  getFeaturedNews,
  getLatestNews,
  getNewsById,
  createNews,
  updateNews,
  publishNews,
  archiveNews,
  deleteNews,
  getNewsStats
};