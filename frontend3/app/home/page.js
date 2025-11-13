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
  const [loading, setLoading] = useState(true); // 🔹 Add loader state

  const [newsData, setNewsData] = useState({
    news: [],
    fashion: [],
    gadgets: [],
    lifestyle: [],
    trendingnews: [],
  });
  const baseUrl = process.env.BE_BASE_URL || 'http://localhost:5010';

  const fetchCategory = async (category, keyName) => {
    try {
      const response = await axios.get(`${baseUrl}/api/news/category/${category}`);
      if (response.status === 200 && Array.isArray(response.data.news)) {
        setNewsData((prev) => ({
          ...prev,
          [keyName]: response.data.news.filter(
            (item) => item.category?.toLowerCase() === category.toLowerCase()
          ),
        }));
      }
    } catch (error) {
      console.error(`❌ Error fetching ${category} news:`, error.message);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchCategory("News", "news"),
        fetchCategory("Fashion", "fashion"),
        fetchCategory("Gadgets", "gadgets"),
        fetchCategory("Lifestyle", "lifestyle"),
        fetchCategory("TrendingNews", "trendingnews"),
      ]);
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

  const sortedNews = [...newsData.news].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // 🔹 Custom Loader (GSAYS Style)
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
        <Loader /> // 🔹 Show loader while API calls are in progress
      ) : (
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
          {/* 🔹 Carousel for Latest News */}
          {sortedNews.length > 0 && (
            <NewsCarousel news={sortedNews.slice(0, 5)} onArticleClick={handleArticleClick} />
          )}

          {/* 🔹 News Sections */}
          <div className="px-2 space-y-12">
            {newsData.news.length > 0 && (
              <NewsSection
                id="news"
                title="News"
                data={newsData.news}
                onArticleClick={handleArticleClick}
              />
            )}

            {newsData.fashion.length > 0 && (
              <NewsSection
                id="fashion"
                title="Fashion"
                data={newsData.fashion}
                onArticleClick={handleArticleClick}
              />
            )}

            {newsData.gadgets.length > 0 && (
              <NewsSection
                id="gadgets"
                title="Gadgets"
                data={newsData.gadgets}
                onArticleClick={handleArticleClick}
              />
            )}

            {newsData.lifestyle.length > 0 && (
              <NewsSection
                id="lifestyle"
                title="Lifestyle"
                data={newsData.lifestyle}
                onArticleClick={handleArticleClick}
              />
            )}

            {newsData.trendingnews.length > 0 && (
              <NewsSection
                id="trendingnews"
                title="Trending News"
                data={newsData.trendingnews}
                onArticleClick={handleArticleClick}
              />
            )}
          </div>
        </div>
      )}

      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      <Footer />
    </div>
  );
};

export default Home;
