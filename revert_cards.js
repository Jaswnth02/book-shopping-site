const fs = require('fs');

function updateHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Regex to match the new card structure
  const cardRegex = /<div class="card">[\s\S]*?<div class="img-container">\s*<img src="([^"]+)" alt="([^"]+)">\s*<\/div>\s*<div class="card-content">\s*<h3 class="book-title">([^<]+)<\/h3>\s*<p class="author">by([^<]+)<\/p>\s*<div class="pricing">\s*<span class="old-price">[^<]+<\/span>\s*<span class="new-price">Rs\. ([^<]+)<\/span>\s*<\/div>\s*<p class="format">Paperback<\/p>\s*<\/div>\s*<div class="card-footer">[\s\S]*?<div class="rating-stars">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;

  content = content.replace(cardRegex, (match, imgSrc, imgAlt, title, author, price, starsStr) => {
    
    // Parse rating from stars html
    let rating = 0;
    const fullStars = (starsStr.match(/fa-star"/g) || []).length;
    const halfStars = (starsStr.match(/fa-star-half-alt"/g) || []).length;
    rating = fullStars + (halfStars * 0.5);
    
    return `<div class="card">
          <div class="img-container">
            <img src="${imgSrc}" alt="${imgAlt}">
          </div>
          <div class="card-content">
            <h3 class="book-title">${title}</h3>
            <p class="author">${author.trim()}</p>
            <div class="price-rating">
              <span class="price">₹${price.trim()}</span>
              <span class="rating"><i class="fas fa-star"></i> ${rating.toFixed(1)}</span>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart()">Add to Cart</button>
          </div>
        </div>`;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
}

updateHtml('index.html');
updateHtml('categories.html');
console.log('Done reverting HTML files');
