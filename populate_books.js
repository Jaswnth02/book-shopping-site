const fs = require('fs');

const categoriesContent = fs.readFileSync('categories.html', 'utf-8');

// Match all <div class="card"> blocks
const cardRegex = /<div class="card">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g; 
// Wait, the card ends with `</div>\n        </div>`, let's just find everything from `<div class="card">` until the next `</div>` that matches its level.
// Alternatively, we can just split by `<div class="card">` and reconstruct.

const cards = [];
let match;
// A better way: Extract the entire <div class="swipeable-books"> block contents
const swipeBlocksRegex = /<div class="swipeable-books">([\s\S]*?)<\/div>\s*<\/section>/g;

let allBooksHtml = '';
while ((match = swipeBlocksRegex.exec(categoriesContent)) !== null) {
  allBooksHtml += match[1].trim() + '\n';
}

const booksHtmlContent = fs.readFileSync('books.html', 'utf-8');

// Replace the main block in books.html
const newMainBlock = `  <main class="all-books-page" style="padding: 60px 40px;">
    <h1 style="color: #111; font-size: 32px; margin-bottom: 30px; text-align: center; font-family: 'Playfair Display', serif;">All Books</h1>
    <div class="books" style="margin-bottom: 60px;">
      ${allBooksHtml.trim()}
    </div>
  </main>`;

const updatedBooksHtml = booksHtmlContent.replace(/<main[\s\S]*?<\/main>/, newMainBlock);

fs.writeFileSync('books.html', updatedBooksHtml, 'utf-8');
console.log('Books.html updated with all books!');
