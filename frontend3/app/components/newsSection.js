'use client';
import React from "react";
import { Share2 } from "lucide-react";

const NewsSection = ({ id, title, data, onArticleClick }) => {
  
  // 🔗 Share function
  const shareToWhatsApp = (e, article) => {
    e.stopPropagation(); // prevent opening modal

    const text = `📰 ${article.title}\n\nRead more here: ${article.url || window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <section id={id} className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((article, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition relative"
            onClick={() => onArticleClick(article)}
          >

            {/* IMAGE */}
            <div className="relative">
              <img
                src={article.uploadedImage || "/placeholder.jpg"}
                alt={article.title}
                className="w-full h-48 object-cover"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />

              {/* 🔥 WHATSAPP SHARE BUTTON */}
              <button
                onClick={(e) => shareToWhatsApp(e, article)}
                className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full shadow hover:bg-green-600 transition"
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {article.title}
              </h3>

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
