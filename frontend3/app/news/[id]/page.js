// first page"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; 
import axios from "axios";
import moment from "moment";

export default function NewsDetail() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const [news, setNews] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchNews = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BE_BASE_URL || "http://localhost:5010";
        const res = await axios.get(`${baseUrl}/api/news/${id}`);
        setNews(res.data.news[0]);
      } catch (error) {
        console.error("Error loading news:", error);
      }
    };

    fetchNews();
  }, [id]);

  if (!news) return <p>Loading...</p>;

  return (
    <div className="fixed top-0 left-0 w-full h-[100dvh] bg-white z-50 flex flex-col">

      {/* Close button */}
      <button
        onClick={() => router.push("/")} // ✅ Redirect to home page
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
            src={news.uploadedImage || "/placeholder.jpg"}
            alt={news.title}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "/placeholder.jpg")}
          />

          {/* Optional gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/30 to-transparent"></div>

          {/* Category label */}
          <div className="absolute bottom-10 left-8 md:left-16 text-white">
            {news.category && (
              <p className="mt-2 inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                {news.category}
              </p>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-10 lg:px-32 bg-white">
          <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg text-gray-800 pb-4">
            {news.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-6 text-gray-600 border-b border-gray-200 pb-4">
            {news.author && (
              <span>
                <strong>By</strong>{" "}
                <span className="text-blue-600 font-medium">{news.author}</span>
              </span>
            )}
            {news.date && (
              <>
                <span>•</span>
                <span>{moment(news.date).format("DD/MM/yyyy")}</span>
              </>
            )}
          </div>

          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            <p>{news.articleContent}</p>

            {news.extraImage && (
              <img
                src={news.extraImage}
                alt="Extra visual"
                className="rounded-xl shadow-lg my-8"
              />
            )}
          </div>

          <div className="mt-12 text-sm text-gray-500 border-t border-gray-200 pt-6">
            <p>Last updated: {moment(news.date).format("DD/MM/yyyy")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
