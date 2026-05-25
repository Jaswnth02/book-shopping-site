const fs = require('fs');

function updateHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Match the card exactly as it currently is
  const cardRegex = /<div class="card">\s*<div class="img-container">\s*<img src="([^"]+)" alt="([^"]+)">\s*<\/div>\s*<div class="card-content">\s*<h3 class="book-title">([^<]+)<\/h3>\s*<p class="author">([^<]+)<\/p>\s*<div class="price-rating">\s*<span class="price">([^<]+)<\/span>\s*<span class="rating">([\s\S]*?)([\d\.]+)<\/span>\s*<\/div>\s*<button class="add-to-cart-btn" onclick="addToCart\(\)">Add to Cart<\/button>\s*<\/div>\s*<\/div>/g;

  // Let's add some random badges to make it look like the design
  const badges = [
    { text: "Bestseller", color: "#fca311", icon: "fas fa-star" },
    { text: "Popular", color: "#2ed573", icon: "fas fa-fire" },
    { text: "New Arrival", color: "#9b59b6", icon: "fas fa-sparkles" },
    { text: "Trending", color: "#ff4757", icon: "fas fa-chart-line" }
  ];

  let i = 0;

  content = content.replace(cardRegex, (match, imgSrc, imgAlt, title, author, price, starsHtmlRaw, ratingNum) => {
    const badge = badges[i % badges.length];
    i++;

    const newPriceVal = price.replace(/[^0-9]/g, '');
    
    // Create new stars HTML (cleaner)
    const ratingFloat = parseFloat(ratingNum);
    let starsHtml = '';
    for (let j = 1; j <= 5; j++) {
      if (ratingFloat >= j) {
        starsHtml += '<i class="fas fa-star"></i>';
      } else if (ratingFloat >= j - 0.5) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
      } else {
        starsHtml += '<i class="far fa-star"></i>';
      }
    }

    return `<div class="premium-book-card">
          <div class="card-badge" style="color: ${badge.color}; background: ${badge.color}20;"><i class="${badge.icon}"></i> ${badge.text}</div>
          <button class="heart-btn"><i class="far fa-heart"></i></button>
          
          <div class="premium-img-container">
            <img src="${imgSrc}" alt="${imgAlt}">
          </div>
          
          <div class="premium-card-content">
            <h3 class="premium-book-title">${title}</h3>
            <p class="premium-author">${author}</p>
            
            <div class="premium-price-rating">
              <span class="premium-price">₹${newPriceVal}</span>
              <span class="premium-rating">${starsHtml} <span class="rating-num">${ratingFloat.toFixed(1)}</span></span>
            </div>
            
            <button class="premium-add-btn" onclick="addToCart()">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
        </div>`;
  });

  // Optional: Also match the new arrivals specifically
  const newArrivalRegex = /<div class="card coming-soon-card">[\s\S]*?<img src="([^"]+)" alt="([^"]+)">[\s\S]*?<h3 class="book-title"[^>]*>([^<]+)<\/h3>\s*<p class="author"[^>]*>([^<]+)<\/p>\s*<div class="price-rating">\s*<span class="price">([^<]+)<\/span>\s*<span class="rating"[^>]*>([^<]+)<\/span>\s*<\/div>\s*<button class="add-to-cart-btn pre-order-btn"[^>]*>([^<]+)<\/button>\s*<\/div>\s*<\/div>/g;

  content = content.replace(newArrivalRegex, (match, imgSrc, imgAlt, title, author, price, ratingText, btnText) => {
    const newPriceVal = price.replace(/[^0-9]/g, '');

    return `<div class="premium-book-card">
          <div class="card-badge" style="color: #9b59b6; background: #9b59b620;"><i class="fas fa-clock"></i> Coming Soon</div>
          <button class="heart-btn"><i class="far fa-heart"></i></button>
          
          <div class="premium-img-container">
            <img src="${imgSrc}" alt="${imgAlt}">
          </div>
          
          <div class="premium-card-content">
            <h3 class="premium-book-title">${title}</h3>
            <p class="premium-author">${author}</p>
            
            <div class="premium-price-rating">
              <span class="premium-price">₹${newPriceVal}</span>
              <span class="premium-rating" style="color: #a0a5b1;"><i class="fas fa-calendar-alt"></i> <span class="rating-num" style="font-size: 11px;">${ratingText.trim()}</span></span>
            </div>
            
            <button class="premium-add-btn" onclick="alert('Added to pre-order list!')" style="border-color: #9b59b6; color: #9b59b6;">
              <i class="fas fa-bolt"></i> ${btnText}
            </button>
          </div>
        </div>`;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
}

updateHtml('index.html');
updateHtml('books.html');
updateHtml('categories.html');
updateHtml('newarrivals.html');
console.log('Done updating HTML files');
