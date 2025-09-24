const mongoose = require("mongoose");
const RecommendedProduct = require("./models/RecommendedProduct");
require("dotenv").config();

const data = [
  {
    "title": "Samsung Galaxy S22",
    "category": "Smartphones",
    "description": "Latest flagship Android phone with triple camera and AMOLED display.",
    "price": 799,
    "image": "https://imgs.search.brave.com/n2yucj2dBx-p6aLor-5PfQIHQBDHBeOKhFAKt94ncdo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzgxT0lnT3puSklM/LmpwZw"
  },
  {
    "title": "iPhone 15 Pro",
    "category": "Mobile Phones",
    "description": "Apple's latest mobile phone with titanium design and advanced camera system.",
    "price": 999,
    "image": "https://imgs.search.brave.com/iPhone15Pro.jpg"
  },
  {
    "title": "Google Pixel 8",
    "category": "Mobile Phones",
    "description": "Google's flagship mobile device with AI-powered photography and pure Android experience.",
    "price": 699,
    "image": "https://imgs.search.brave.com/GooglePixel8.jpg"
  },
  {
    "title": "OnePlus 12",
    "category": "Mobile Phones",
    "description": "High-performance mobile phone with fast charging and premium display.",
    "price": 799,
    "image": "https://imgs.search.brave.com/OnePlus12.jpg"
  },
  {
    "title": "Canon EOS R5",
    "category": "Cameras",
    "description": "Mirrorless professional camera with 8K video recording and image stabilization.",
    "price": 3499,
    "image": "https://imgs.search.brave.com/GhwiUBfaex227E3d3KyGQgOSFQh-DM3uxzO49uVr-3o/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy85/LzljL1RvcF92aWV3/X29mX3RoZV9DYW5v/bl9FT1NfUjUuanBn"
  },
  {
    "title": "Apple MacBook Pro M2",
    "category": "Laptops",
    "description": "Apple's powerful laptop with M2 chip and Liquid Retina display.",
    "price": 1999,
    "image": "https://imgs.search.brave.com/fm0x2tRQ9UJdYJnbK5-bhJcN3UD6Oqc0x2vQVkMZbwE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/YmZsZHIuY29tL1U0/NDdJSDM1L2FzL2py/cGJubXduYjY0ODd4/djk3cXN4NHBiLzEw/MDgwNjE1Mi04NDdf/XzE_YXV0bz13ZWJw/JmZvcm1hdD1qcGcm/d2lkdGg9MzUwJmhl/aWdodD0zNTAmZml0/PWJvdW5kcyZjYW52/YXM9MzUwLDM1MA"
  },
  {
    "title": "Sony WH-1000XM5",
    "category": "Headphones",
    "description": "Industry-leading noise cancellation with long battery life and premium sound.",
    "price": 399,
    "image": "https://imgs.search.brave.com/i1wLX0rAGbY3mHBwuDea9hTyjOPupW37B5Ch37v-5B8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZWNv/cmRpbmdub3cuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI1/LzAyL3Nvbnktd2gx/MDAwLXhtNS0zLmpw/Zw"
  },
  {
    "title": "Samsung 55-inch Smart TV",
    "category": "Television",
    "description": "4K UHD Smart LED TV with voice control and streaming apps.",
    "price": 599,
    "image": "https://imgs.search.brave.com/GpYqMnWmHvEgAyDQJYV2jvkop8gAvT8yCIAP9iw50Ps/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtbmEuc3NsLWlt/YWdlcy1hbWF6b24u/Y29tL2ltYWdlcy9J/LzYxZ3AwR2YtS0NM/LmpwZw"
  },
  {
    "title": "Nike Air Max 270",
    "category": "Shoes",
    "description": "Comfortable running shoes with Air Max cushioning and breathable mesh upper.",
    "price": 150,
    "image": "https://imgs.search.brave.com/NikeAirMax270.jpg"
  },
  {
    "title": "Adidas Ultraboost 22",
    "category": "Shoes",
    "description": "Premium running shoes with Boost midsole and Primeknit upper for ultimate comfort.",
    "price": 180,
    "image": "https://imgs.search.brave.com/AdidasUltraboost.jpg"
  },
  {
    "title": "Converse Chuck Taylor All Star",
    "category": "Shoes",
    "description": "Classic canvas sneakers with timeless design and versatile style.",
    "price": 65,
    "image": "https://imgs.search.brave.com/ConverseChuckTaylor.jpg"
  },
  {
    "title": "Dell XPS 13",
    "category": "Laptops",
    "description": "Ultra-portable laptop with InfinityEdge display and long battery life.",
    "price": 1299,
    "image": "https://imgs.search.brave.com/DellXPS13.jpg"
  },
  {
    "title": "Gaming Mechanical Keyboard",
    "category": "Accessories",
    "description": "RGB backlit mechanical keyboard with tactile switches for gaming and typing.",
    "price": 89,
    "image": "https://imgs.search.brave.com/GamingKeyboard.jpg"
  },
  {
    "title": "Wireless Bluetooth Earbuds",
    "category": "Headphones",
    "description": "True wireless earbuds with noise cancellation and long battery life.",
    "price": 129,
    "image": "https://imgs.search.brave.com/WirelessEarbuds.jpg"
  }
]

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB for seeding");

    await RecommendedProduct.deleteMany(); // Clear existing
    await RecommendedProduct.insertMany(data); // ✅ Now data is defined

    console.log("✅ Products seeded successfully");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  });
