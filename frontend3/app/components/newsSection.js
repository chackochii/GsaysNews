'use client';
import React from "react";

const NewsSection = ({ id, title, data, onArticleClick }) => {
  return (
    <section id={id} className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((article, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
            onClick={() => onArticleClick(article)}
          >
            {/* ✅ Show uploadedImage from backend or fallback placeholder */}
            <img
              src={article.uploadedImage || "/placeholder.jpg"}
              alt={article.title}
              className="w-full h-48 object-cover"
              onError={(e) => (e.target.src = "/placeholder.jpg")}
            />

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {article.title}
              </h3>
              
              {/* ✅ Show short article preview */}
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                {article.articleContent?.slice(0, 120) || "No content available..."}...
              </p>

              <div className="mt-3 text-xs text-gray-500">
                <p>By {article.author || "author"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;