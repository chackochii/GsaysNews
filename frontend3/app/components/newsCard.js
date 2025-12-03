import React from "react";
import { Share2 } from "lucide-react";

const NewsCard = ({ item, onClick }) => {

  const shareToWhatsApp = (e) => {
    e.stopPropagation(); // prevent modal open

    const text = `📰 ${item.title}\n\nRead more here: ${item.url}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer relative"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden">
        <img
          src={item.uploadedImage}
          alt={item.title}
          className="w-full h-48 sm:h-52 lg:h-48 xl:h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* SHARE BUTTON */}
        <button
          onClick={shareToWhatsApp}
          className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full shadow hover:bg-green-600 transition"
        >
          <Share2 size={16} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 lg:p-5">
        <span className="text-xs sm:text-sm uppercase font-semibold text-blue-600 tracking-wider">
          {item.category}
        </span>

        <h3 className="text-base sm:text-lg lg:text-base xl:text-lg font-semibold mt-2 mb-2 text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>

        <p className="text-xs sm:text-sm text-gray-500 mt-auto">
          <span className="font-medium">{item.author}</span> • {item.date}
        </p>
      </div>
    </div>
  );
};

export default NewsCard;
