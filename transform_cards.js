const fs = require('fs');

const categories = {
  "1.jpg": "FANTASY",
  "2.jpg": "FANTASY",
  "3.jpg": "FANTASY",
  "4.jpg": "FICTION",
  "5.jpg": "FICTION",
  "6.jpg": "CLASSICS",
  "7.jpg": "SELF-HELP",
  "8.jpg": "PRODUCTIVITY",
  "9.jpg": "SELF-HELP",
  "10.jpg": "SELF-HELP",
  "11.jpg": "FINANCE",
  "12.jpg": "FINANCE",
  "13.jpg": "FINANCE",
  "14.jpg": "MYSTERY",
  "15.jpg": "THRILLER"
};

const reviewCounts = {
  "1.jpg": "1845",
  "2.jpg": "920",
  "3.jpg": "1105",
  "4.jpg": "2310",
  "5.jpg": "845",
  "6.jpg": "670",
  "7.jpg": "3420",
  "8.jpg": "1280",
  "9.jpg": "1540",
  "10.jpg": "2150",
  "11.jpg": "4890",
  "12.jpg": "3120",
  "13.jpg": "1980",
  "14.jpg": "1430",
  "15.jpg": "2760"
};

function updateCardsInHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf-8');

  // Match any book card structure (card or premium-book-card)
  const regex = /<div class="(?:card|premium-book-card)[^"]*">[\s\S]*?<img src="([^"]+)" alt="([^"]+)">[\s\S]*?<h3 class="(?:book-title|premium-book-title)"[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<span class="(?:price|premium-price)">([^<]+)<\/span>[\s\S]*?<\/div>\s*<\/div>/g;

  html = html.replace(regex, (match, imgSrc, imgAlt, titleRaw, price) => {
    const title = titleRaw.replace(/<[^>]+>/g, '').trim();
    const imgFilename = imgSrc.split('/').pop();
    const cat = categories[imgFilename] || "BOOKS";
    const reviews = reviewCounts[imgFilename] || "1250";

    return `<div class="card">
          <div class="img-container">
            <button class="wishlist-btn" onclick="toggleWishlist(this)" title="Add to Wishlist"><i class="far fa-heart"></i></button>
            <img src="${imgSrc}" alt="${imgAlt}">
          </div>
          <div class="card-content">
            <span class="card-category">${cat}</span>
            <h3 class="book-title" title="${title}">${title}</h3>
            <div class="rating-row">
              <span class="stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i></span>
              <span class="review-count">(${reviews})</span>
            </div>
            <div class="price-row">
              <span class="price">${price}</span>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(this)">Add to Cart</button>
          </div>
        </div>`;
  });

  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`Updated ${filePath}`);
}

['index.html', 'books.html', 'categories.html', 'newarrivals.html'].forEach(updateCardsInHtml);
