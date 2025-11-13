'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ArticleModal from "../components/articleModal";
import NewsCarousel from "../components/newsCarousel";
import NewsSection from "../components/newsSection";

const Home = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); // ✅ store all categories
  const [newsData, setNewsData] = useState({}); // ✅ dynamic category storage

  const baseUrl = process.env.NEXT_PUBLIC_BE_BASE_URL || "http://localhost:5010";

  // ✅ Fetch all categories first
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/news/categories`);
      if (response.status === 200 && Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
        return response.data.categories;
      }
      return [];
    } catch (error) {
      console.error("❌ Error fetching categories:", error.message);
      return [];
    }
  };

  // ✅ Fetch all news for each category
  const fetchNewsByCategory = async (category) => {
    try {
      const response = await axios.get(`${baseUrl}/api/news/category/${category}`);
      if (response.status === 200 && Array.isArray(response.data.news)) {
        return response.data.news.filter(
          (item) => item.category?.toLowerCase() === category.toLowerCase()
        );
      }
      return [];
    } catch (error) {
      console.error(`❌ Error fetching ${category} news:`, error.message);
      return [];
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);

      // 1️⃣ Fetch all categories dynamically
      const fetchedCategories = await fetchCategories();

      // 2️⃣ Fetch all news for each category in parallel
      const results = await Promise.all(
        fetchedCategories.map((cat) => fetchNewsByCategory(cat))
      );

      // 3️⃣ Store results in an object like { News: [...], Fashion: [...] }
      const categoryData = {};
      fetchedCategories.forEach((cat, idx) => {
        categoryData[cat] = results[idx];
      });

      setNewsData(categoryData);
      setLoading(false);
    };

    loadAll();
  }, []);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  // ✅ Find latest 5 articles across all categories for carousel
  const allArticles = Object.values(newsData).flat();
  const sortedNews = [...allArticles].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const carouselNews = sortedNews.filter(
  (article) => article.uploadedImage && article.uploadedImage.trim() !== ""
);

  // 🔹 Loader Component
  const Loader = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent"></div>
      <h2 className="mt-4 text-xl font-semibold text-gray-700">Gsays Loading...</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
          {/* 🔹 Carousel for Latest News */}
          {carouselNews.length > 0 && (
            <NewsCarousel news={carouselNews.slice(0, 5)} onArticleClick={handleArticleClick} />
          )}

          {/* 🔹 Dynamic News Sections */}
          <div className="px-2 space-y-12">
            {categories.map((cat) => {
  const validArticles = newsData[cat]?.filter(
    (article) => article.uploadedImage && article.uploadedImage.trim() !== ""
  );

return validArticles?.length > 0 ? (
    <NewsSection
      key={cat}
      id={cat.toLowerCase()}
      title={cat}
      data={validArticles} // ✅ only articles with uploadedImage
      onArticleClick={handleArticleClick}
    />
  ) : null;
})}
          </div>
        </div>
      )}

      <ArticleModal article={selectedArticle} isOpen={isModalOpen} onClose={handleCloseModal} />
      <Footer />
    </div>
  );
};

export default Home;