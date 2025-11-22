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
articleContent: article || existingNews.articleContent,
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
