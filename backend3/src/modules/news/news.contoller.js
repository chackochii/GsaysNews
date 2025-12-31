import NewsModel from './news.model.js';
import { Op } from "sequelize";
import moment from "moment";

export const createNews = async (req, res) => {
  try {
    const { author, date, category, title, article } = req.body;

    let imageKey = null;
    let imageUrl = null;

    if (req.file) {
      imageKey = req.file.key;
      imageUrl = getPublicImageUrl(imageKey);
    }

    const news = await NewsModel.create({
      author,
      date,
      category,
      title,
      articleContent: article,
      imageKey,        // store key
      uploadedImage: imageUrl, // public URL
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
    const { author, date, category, title, article } = req.body;

    const news = await NewsModel.findById(id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    // Update basic fields
    news.author = author ?? news.author;
    news.date = date ?? news.date;
    news.category = category ?? news.category;
    news.title = title ?? news.title;
    news.articleContent = article ?? news.articleContent;

    // If new image uploaded, replace image
    if (req.file) {
      const imageKey = req.file.key;
      const imageUrl = getPublicImageUrl(imageKey);

      // Optional: delete old image from Spaces here
      // (recommended but not mandatory)

      news.imageKey = imageKey;
      news.uploadedImage = imageUrl;
    }

    await news.save();

    res.status(200).json({
      message: 'News updated successfully',
      news,
    });
  } catch (error) {
    console.error('Error editing news:', error);
    res.status(500).json({ error: error.message });
  }
};



export const listNews = async (req, res) => {
try {
const oneMonthAgo = moment().subtract(1, "month").toDate();
const today = moment().endOf("day").toDate();

const newsList = await NewsModel.findAll({
where: {
createdAt: {
[Op.between]: [oneMonthAgo, today],
},
},
order: [["createdAt", "DESC"]], // latest first
});

res.status(200).json({
message: "News for Last 1 Month",
news: newsList,
});
} catch (error) {
console.error("❌ Error fetching news:", error);
res.status(500).json({ error: error.message });
}
};




export const addCategory = async (req, res) => {
try {
const { category } = req.body;

if (!category || category.trim() === '') {
return res.status(400).json({ error: 'Category name is required.' });
}

const existingCategory = await NewsModel.findOne({
where: { category: { [Op.iLike]: category.trim() } },
});

if (existingCategory) {
return res.status(400).json({ error: 'Category already exists.' });
}

// We can insert an empty record just to store this category
// (no article content needed — just store category reference)
await NewsModel.create({
category: category.trim(),
title: 'Category Placeholder',
author: 'system',
articleContent: 'Category entry placeholder',
});

res.status(201).json({
message: '✅ Category added successfully.',
category: category.trim(),
});
} catch (error) {
console.error('❌ Error adding category:', error);
res.status(500).json({ error: error.message });
}
};

// ✅ Get all unique categories from existing News records
export const getCategories = async (req, res) => {
try {
const categories = await NewsModel.findAll({
attributes: [
[NewsModel.sequelize.fn('DISTINCT', NewsModel.sequelize.col('category')), 'category'],
],
raw: true,
});

const categoryList = categories.map((c) => c.category);

res.status(200).json({
message: '✅ Categories fetched successfully.',
categories: categoryList,
});
} catch (error) {
console.error('❌ Error fetching categories:', error);
res.status(500).json({ error: error.message });
}
};

export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const existingNews = await NewsModel.findByPk(id);
    if (!existingNews) {
      return res.status(404).json({ error: "News article not found." });
    }

    await existingNews.destroy();

    res.status(200).json({
      message: "✅ News article deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Error deleting news:", error);
    res.status(500).json({ error: error.message });
  }
};



export const listOneNews = async (req, res) => {
  try {
    const oneMonthAgo = moment().subtract(1, "month").toDate();
    const today = moment().endOf("day").toDate();

    const newsList = await NewsModel.findAll({
      where: {
        id: req.params.id,
        createdAt: {
          [Op.between]: [oneMonthAgo, today],
        },
      },
      order: [["createdAt", "DESC"]], // latest first
    });

    res.status(200).json({
      message: "News for Last 1 Month",
      news: newsList,
    });
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    res.status(500).json({ error: error.message });
  }
};

const getPublicImageUrl = (key) => {
  return `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_REGION}.cdn.digitaloceanspaces.com/${key}`;
};

