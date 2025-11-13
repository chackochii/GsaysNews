'use client';
import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NewsCarousel = ({ news, onArticleClick }) => {
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 3000,

responsive: [
  {
    breakpoint: 2000,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: false,
    },
  },
  {
    breakpoint: 768,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
    },
  },
  {
    breakpoint: 480,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
    },
  },
],

};



  return (
    <div className="relative mb-10">
      <Slider {...settings}>
        {news.map((article, index) => (
          <div
            key={index}
            className="px-2"
            onClick={() => onArticleClick(article)}
          >
            <div className="relative cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
              <div className="w-full h-[300px] sm:h-[250px] relative">
                <img
                  src={article.uploadedImage || "/placeholder.jpg"}
                  alt={article.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                <h2 className="text-white text-lg font-semibold">
                  {article.title}
                </h2>
                <p className="text-gray-300 text-sm mt-1">{article.category}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* ✅ Proper dot styling */}
      <style jsx global>{`
        .slick-dots {
          bottom: -30px;
          text-align: center;
        }
        .slick-dots li {
          margin: 0 4px;
        }
        .slick-dots li button:before {
          color: #000 !important;
          font-size: 10px;
          opacity: 0.5;
        }
        .slick-dots li.slick-active button:before {
          opacity: 1;
          color: #000 !important;
        }

        /* Fix for Safari width issues */
        .slick-slide > div {
          display: flex !important;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default NewsCarousel;
