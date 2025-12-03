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
  const [categories, setCategories] = useState([]);
  const [newsData, setNewsData] = useState({});

  const baseUrl = process.env.NEXT_PUBLIC_BE_BASE_URL || "http://localhost:5010";

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/news/categories`);
      if (res.status === 200 && Array.isArray(res.data.categories)) {
        setCategories(res.data.categories);
        return res.data.categories;
      }
      return [];
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      return [];
    }
  };

  // Fetch news by category
  const fetchNewsByCategory = async (category) => {
    try {
      const res = await axios.get(`${baseUrl}/api/news/category/${category}`);
      if (res.status === 200 && Array.isArray(res.data.news)) {
        return res.data.news.filter(item => item.category?.toLowerCase() === category.toLowerCase());
      }
      return [];
    } catch (error) {
      console.error(`Error fetching ${category} news:`, error.message);
      return [];
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);

      // 1️⃣ Fetch categories
      const fetchedCategories = await fetchCategories();

      // 2️⃣ Fetch news for each category
      const results = await Promise.all(
        fetchedCategories.map(cat => fetchNewsByCategory(cat))
      );

      // 3️⃣ Map news into object
      const categoryData = {};
      fetchedCategories.forEach((cat, idx) => {
        categoryData[cat] = results[idx].map(item => ({
          ...item,
          url: `${window.location.origin}/news/${item.id}` // ✅ add url for sharing
        }));
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

  // Latest articles for carousel
  const allArticles = Object.values(newsData).flat();
  const carouselNews = allArticles
    .filter(article => article.uploadedImage)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

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
          {/* Carousel */}
          {carouselNews.length > 0 && (
            <NewsCarousel news={carouselNews} onArticleClick={handleArticleClick} />
          )}

          {/* News sections */}
          <div className="px-2 space-y-12">
            {categories.map(cat => {
              const validArticles = newsData[cat]
                ?.filter(article => article.uploadedImage)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

              return validArticles?.length > 0 ? (
                <NewsSection
                  key={cat}
                  id={cat.toLowerCase()}
                  title={cat}
                  data={validArticles}
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
