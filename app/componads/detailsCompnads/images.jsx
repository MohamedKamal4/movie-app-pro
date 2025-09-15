'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

export default function Images({ images }) {
  return (
    <section className="container m-auto pt-30 flex-col gap-5 flex justify-center items-center">
      <div className="h-[20%]">
        <h2 className="text-3xl pb-30">Album</h2>
      </div>

      {images && images.length > 0 ? (
        <div className="w-full h-[400px] flex justify-center items-center">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="mySwiper"
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 }, // تابلت
              1024: { slidesPerView: 3, spaceBetween: 30 }, // لابتوب
              1440: { slidesPerView: 4, spaceBetween: 40 }, // شاشات كبيرة
            }}
          >
            {images.map((img, index) => (
              <SwiperSlide
                key={img.id || img.file_path || index}
                className="size-full rounded-xl shadow-md"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w1280${img.file_path})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }}
              />
            ))}
          </Swiper>
        </div>
      ) : (
        <h3 className="h-[400px] flex justify-center items-center text-white">
          No images found
        </h3>
      )}
    </section>
  );
}
