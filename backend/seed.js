const mongoose = require("mongoose");
const Product = require("./server/Models/Product");
const Company = require("./server/Models/Company");
require("dotenv").config();

const productData = [
  {
    company: "Astral",
    product_name: "Astral CPVC Pipe",
    image: "https://5.imimg.com/data5/GLADMIN/Default/2022/6/KL/ST/WW/91623/astral-cpvc-pipe-125x125.jpg",
    description: "A durable and versatile CPVC pipe from Astral, perfect for various plumbing applications.",
    star_rating: 4.5,
    price: 26,
    stock: 100
  },
  {
    company: "Astral",
    product_name: "Astral PVC Pipes",
    image: "https://5.imimg.com/data5/OG/PV/ED/GLADMIN-64442/astral-agriculture-pvc-pipes-125x125.jpg",
    description: "High-quality PVC pipes by Astral, designed for agricultural use.",
    star_rating: 4,
    price: 20,
    stock: 100
  },
  {
    company: "Finolex",
    product_name: "Finolex CPVC Pipe",
    image: "https://5.imimg.com/data5/XE/LV/AR/GLADMIN-64442/finolex-cpvc-pipe-125x125.jpg",
    description: "Finolex CPVC pipe known for its excellent performance and longevity.",
    star_rating: 4.7,
    price: 29,
    stock: 100
  },
  {
    company: "Supreme",
    product_name: "Supreme CPVC Pipes",
    image: "https://5.imimg.com/data5/GLADMIN/Default/2022/6/SQ/VF/VH/91623/supreme-cpvc-pipe-125x125.jpg",
    description: "Supreme CPVC pipes are known for their superior quality and reliability.",
    star_rating: 4.6,
    price: 28,
    stock: 100
  }
];

const companyData = [
  { name: "Astral", _id: new mongoose.Types.ObjectId() },
  { name: "Finolex", _id: new mongoose.Types.ObjectId() },
  { name: "Supreme", _id: new mongoose.Types.ObjectId() }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    await Product.deleteMany({});
    await Company.deleteMany({});
    console.log("Cleared existing data.");

    await Product.insertMany(productData);
    await Company.insertMany(companyData);
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
}

seed();
