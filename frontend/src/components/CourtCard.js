import React from 'react';
import '../App.css'; // Import file CSS chung

const CourtCard = ({ court, onBook, onViewDetails }) => {
  // Logic kiểm tra trạng thái (Hỗ trợ cả chữ thường và chữ hoa)
  const statusLower = court.status ? court.status.toLowerCase() : '';
  const isAvailable = statusLower === 'available' || statusLower === 'đang mở' || statusLower === 'open';

  return (
    <div 
      className="court-card-web" 
      onClick={() => onViewDetails(court.id)} 
      style={{ cursor: 'pointer' }}
    >
      
      {/* 1. Phần Hình Ảnh */}
      <div className="card-img-wrapper">
        <img 
          src={court.image || 'https://via.placeholder.com/300x200'} 
          alt={court.name} 
          className="card-img"
          onError={(e) => {e.target.src = 'https://via.placeholder.com/300x200?text=Sân+Cầu+Lông'}}
        />
        {/* Badge Trạng thái */}
        <div className={`badge-status ${isAvailable ? 'badge-open' : 'badge-maintenance'}`}>
          {isAvailable ? 'Đang mở' : 'Bảo trì'}
        </div>
      </div>

      {/* 2. Phần Nội dung */}
      <div className="card-body">
        {/* Tên sân */}
        <h3 className="card-name">{court.name}</h3>
        
        {/* Địa chỉ với icon MapPin SVG */}
        <div className="card-address">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{marginTop:'2px', flexShrink: 0}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{court.address || 'Khu vực TP.HCM'}</span>
        </div>

        {/* Footer: Giá & Nút bấm */}
        <div className="card-footer">
          <div className="price-tag">
            {court.price ? court.price.toLocaleString('vi-VN') : '0'}đ
            <span className="price-unit">/giờ</span>
          </div>
          
          <button 
            className="btn-book-web"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn việc click nút đặt thì nhảy vào trang chi tiết
              onBook();
            }}
          >
            Đặt Ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourtCard;