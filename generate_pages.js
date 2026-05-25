const fs = require('fs');

const template = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{TITLE}} - BookHive</title>
  <link rel="stylesheet" href="style.css?v=3">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>

  <header>
    <nav class="navbar">
      <div class="logo"><a href="index.html" style="color: inherit; text-decoration: none;"><i class="fas fa-book-open" style="color: #fca311;"></i> BookHive</a></div>

      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="books.html" class="{{BOOKS_ACTIVE}}">Books</a></li>
        <li><a href="categories.html">Categories <i class="fas fa-chevron-down" style="font-size: 10px;"></i></a></li>
        <li><a href="newarrivals.html" class="{{NEW_ACTIVE}}">New Arrivals</a></li>
        <li><a href="offers.html" class="{{OFFERS_ACTIVE}}">Offers</a></li>
        <li><a href="about.html" class="{{ABOUT_ACTIVE}}">About Us</a></li>
      </ul>

      <div class="nav-actions">
        <div class="search-box">
          <input type="text" placeholder="Search books...">
          <button class="search-btn"><i class="fas fa-search"></i></button>
        </div>
        <a href="#" class="cart">
          <i class="fas fa-shopping-cart"></i>
          <span class="cart-badge">0</span>
        </a>
        <a href="#" class="login-btn">Login</a>
      </div>
    </nav>
  </header>

  <main style="min-height: 50vh; display: flex; align-items: center; justify-content: center; flex-direction: column;">
    <h1 style="color: #111; font-size: 36px; margin-bottom: 20px;">{{TITLE}}</h1>
    <p style="color: #777;">This page is currently under construction.</p>
  </main>

  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <h3><i class="fas fa-book-open" style="color: #fca311;"></i> BookHive</h3>
        <p>Your ultimate destination for discovering the next great read. Explore thousands of books across all genres.</p>
        <div class="social-links">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-linkedin-in"></i></a>
        </div>
      </div>
      <div class="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="categories.html">Categories</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-contact">
        <h4>Contact Us</h4>
        <p><i class="fas fa-map-marker-alt"></i> 123 Book Street, Reading City</p>
        <p><i class="fas fa-phone"></i> +91 9876543210</p>
        <p><i class="fas fa-envelope"></i> hello@bookhive.com</p>
      </div>
      <div class="footer-newsletter">
        <h4>Newsletter</h4>
        <p>Subscribe to get updates on new arrivals and special offers.</p>
        <div class="newsletter-form">
          <input type="email" placeholder="Enter your email">
          <button type="button">Subscribe</button>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 BookHive. All Rights Reserved.</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

const pages = [
  { file: 'books.html', title: 'Books', activeVar: 'BOOKS_ACTIVE' },
  { file: 'newarrivals.html', title: 'New Arrivals', activeVar: 'NEW_ACTIVE' },
  { file: 'offers.html', title: 'Offers', activeVar: 'OFFERS_ACTIVE' },
  { file: 'about.html', title: 'About Us', activeVar: 'ABOUT_ACTIVE' },
  { file: 'contact.html', title: 'Contact', activeVar: 'CONTACT_ACTIVE' }
];

pages.forEach(p => {
  let content = template.replace(/{{TITLE}}/g, p.title);
  
  // Set the active class
  pages.forEach(other => {
    if (other.activeVar === p.activeVar) {
      content = content.replace(`{{${other.activeVar}}}`, 'active');
    } else {
      content = content.replace(`{{${other.activeVar}}}`, '');
    }
  });

  fs.writeFileSync(p.file, content, 'utf-8');
});

console.log('Created 6 placeholder HTML files.');
