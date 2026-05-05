# Multiple Images for Admin Panel Products

## Plan Steps:
- [ ] Step 1: Update server/models/Product.js - Ensure `images: [String]` exists (already does).
- [ ] Step 2: Update server/routes/products.js - Add multer.array('images', 5) for multiple file upload to uploads/, update create/put to handle array.
- [ ] Step 3: Update src/pages/AdminPanel.tsx - Change form state `images: string[]`, multiple file input, preview grid with delete, drag thumbnails, URL inputs fallback.
- [ ] Step 4: Update frontend display (Product page, Shop, Home) to show gallery/carousel from product.images array.
- [ ] Step 5: Backend server restart (kill dev servers, restart).
- [ ] Step 6: Test: Add product with 3 images, verify /uploads/, display in shop/home/product.

Current: Starting Step 1.
