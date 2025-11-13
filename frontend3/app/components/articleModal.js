'use client';
import React from "react";
import moment from "moment";

const ArticleModal = ({ article, isOpen, onClose }) => {
  if (!isOpen || !article) return null;

  return (
  <div className="fixed top-0 left-0 w-full h-[100dvh] bg-white z-50 flex flex-col">

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-gray-100 transition-all"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>


  <div className="flex-1 overflow-y-auto">

      {/* Top Image (Hero Section) */}
      <div className="relative w-full h-[70vh] md:h-[80vh] bg-gray-200">
       <img
              src={article.uploadedImage || "/placeholder.jpg"}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "/placeholder.jpg")}
            />
          
        {/* Optional gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 to-transparent"></div>

        {/* Article title overlay (optional aesthetic) */}
        <div className="absolute bottom-10 left-8 md:left-16 text-white">
         
          {article.category && (
            <p className="mt-2 inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              {article.category}
            </p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 md:p-10 lg:px-32 bg-white">
        <div>
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg text-gray-800 pb-4">
            {article.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6 text-gray-600 border-b border-gray-200 pb-4">
          {article.author && (
            <span>
              <strong>By</strong>{" "}
              <span className="text-blue-600 font-medium">
                {article.author}
              </span>
            </span>
          )}
          {article.date && (
            <>
              <span>•</span>
              <span>{moment(article.date).format("DD/MM/yyyy")}</span>
            </>
          )}
        </div>
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
          <p>{article.articleContent}</p>

          {/* Optional secondary image */}
          {article.extraImage && (
            <img
              src={article.extraImage}
              alt="Extra visual"
              className="rounded-xl shadow-lg my-8"
            />
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-sm text-gray-500 border-t border-gray-200 pt-6">
          <p>Last updated: {moment(article.date).format("DD/MM/yyyy")}</p>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ArticleModal;