import NewsModel from './news.model.js';
import { Op } from "sequelize";
import moment from "moment";

export const createNews = async (req, res) => {
  try {
    const { author, date, category, title, article } = req.body;

    const uploadedImage = req.file ? req.file.location : null;

    const news = await NewsModel.create({
      author,
      date,
      category,
      title,
      articleContent: article,
      uploadedImage,
    });

    res.status(201).json({
      message: 'News created successfully',
      news,
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ error: error.message });
  }
};


export const listNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const oneMonthAgo = moment().subtract(1, "month").toDate();
    const today = moment().endOf("day").toDate();

    const newsList = await NewsModel.findAll({
      where: {
        category,
        date: {
          [Op.between]: [oneMonthAgo, today],
        },
      },
      order: [["date", "DESC"]],
    });

    res.status(200).json({
      message: `News for category: ${category} (Last 1 Month)`,
      news: newsList,
    });
  } catch (error) {
    console.error("❌ Error fetching news by category:", error);
    res.status(500).json({ error: error.message });
  }
};

export const editNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, title, author, date, article } = req.body;
    const image = req.file;

    const existingNews = await NewsModel.findByPk(id);
    if (!existingNews) {
      return res.status(404).json({ error: "News article not found." });
    }

    const updatedData = {
      category: category || existingNews.category,
      title: title || existingNews.title,
      author: author || existingNews.author,
      date: date || existingNews.date,
      article: article || existingNews.article,
    };

    if (image) {
      updatedData.imageUrl = image.location || `/uploads/${image.filename}`;
    }

    // Update record
    await existingNews.update(updatedData);

    res.status(200).json({
      message: "✅ News article updated successfully.",
      news: existingNews,
    });
  } catch (error) {
    console.error("❌ Error updating news:", error);
    res.status(500).json({ error: error.message });
  }
};

export const listNews = async (req, res) => {
  try {
    const oneMonthAgo = moment().subtract(1, "month").toDate();
    const today = moment().endOf("day").toDate();

    const newsList = await NewsModel.findAll({
      where: {
        date: {
          [Op.between]: [oneMonthAgo, today],
        },
      },
      order: [["date", "DESC"]],
    });

    res.status(200).json({
      message: `News for  Last 1 Month`,
      news: newsList,
    });
  } catch (error) {
    console.error("❌ Error fetching news by category:", error);
    res.status(500).json({ error: error.message });
  }
};




