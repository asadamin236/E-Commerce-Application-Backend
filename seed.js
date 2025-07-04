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
