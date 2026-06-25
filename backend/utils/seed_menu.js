const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const Dish = require("../models/Dish");
const { Counter } = require("../models/Counter");

dotenv.config();

const connectDB = async () => {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (dnsErr) {
    console.warn("Could not set custom DNS servers, using default OS resolver:", dnsErr.message);
  }

  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sree_raaga_resort";
  console.log("Connecting to:", uri);
  await mongoose.connect(uri);
  console.log("Connected to DB");
};

const seedData = [
  // BREAKFAST
  { name: "Aloo Paratha", price: 135, category: "Breakfast", isVegetarian: true, description: "Delicious flatbread stuffed with spiced potato mixture." },
  { name: "Gobi Paratha", price: 135, category: "Breakfast", isVegetarian: true, description: "Flatbread stuffed with spiced grated cauliflower." },
  { name: "Uppama", price: 90, category: "Breakfast", isVegetarian: true, description: "Thick porridge made from dry-roasted semolina." },
  { name: "Paneer Paratha", price: 155, category: "Breakfast", isVegetarian: true, description: "Flatbread stuffed with spiced crumbled paneer." },
  { name: "Mix Veg Paratha", price: 155, category: "Breakfast", isVegetarian: true, description: "Flatbread stuffed with mixed seasonal vegetables." },
  { name: "Idly 2 pcs", price: 65, category: "Breakfast", isVegetarian: true, description: "Soft, steamed savory rice cakes served with sambar and chutney." },
  { name: "Vada 1 Pcs", price: 35, category: "Breakfast", isVegetarian: true, description: "Crispy, deep-fried savory lentil doughnut." },
  { name: "Poori Bhaaji", price: 110, category: "Breakfast", isVegetarian: true, description: "Fluffy deep-fried flatbreads served with spiced potato curry." },
  { name: "Masala Dosa", price: 110, category: "Breakfast", isVegetarian: true, description: "Thin, crispy crepe filled with spiced potato mash." },
  { name: "Plain Dosa", price: 90, category: "Breakfast", isVegetarian: true, description: "Thin, crispy fermented rice-and-lentil crepe." },
  { name: "Pongal", price: 90, category: "Breakfast", isVegetarian: true, description: "Classic South Indian rice and lentil dish seasoned with cumin and pepper." },
  { name: "Fresh Cut Fruits", price: 135, category: "Breakfast", isVegetarian: true, description: "Assorted seasonal fresh cut fruits." },

  // MAIN COURSE - VEGETARIAN
  { name: "Dal Fry", price: 160, category: "Main Course", isVegetarian: true, description: "Yellow lentils cooked with onions, tomatoes, and Indian spices." },
  { name: "Dal Tadka", price: 200, category: "Main Course", isVegetarian: true, description: "Yellow lentils tempered with ghee, garlic, and red chillies." },
  { name: "Dal Palak", price: 170, category: "Main Course", isVegetarian: true, description: "Healthy lentils cooked with fresh spinach and spices." },
  { name: "Aloo Jeera", price: 200, category: "Main Course", isVegetarian: true, description: "Stir-fried potatoes seasoned with cumin seeds." },
  { name: "Aloo Gobi Masala / Dry", price: 200, category: "Main Course", isVegetarian: true, description: "Potatoes and cauliflower florets cooked in a spiced onion-tomato gravy." },
  { name: "Kadai Veg", price: 220, category: "Main Course", isVegetarian: true, description: "Mixed seasonal vegetables cooked in a spicy kadai masala." },
  { name: "Veg Curry", price: 180, category: "Main Course", isVegetarian: true, description: "Fresh garden vegetables cooked in a mild aromatic curry." },
  { name: "Veg Kolhapuri", price: 200, category: "Main Course", isVegetarian: true, description: "Spicy mixed vegetable dish from Kolhapur cuisine." },
  { name: "Veg Hyderabadi", price: 200, category: "Main Course", isVegetarian: true, description: "Rich, creamy mixed vegetables cooked in Hyderabadi spinach-based green gravy." },
  { name: "Green Peas Masala", price: 180, category: "Main Course", isVegetarian: true, description: "Fresh green peas simmered in a rich tomato-onion gravy." },
  { name: "Mushroom Masala", price: 210, category: "Main Course", isVegetarian: true, description: "Button mushrooms cooked in a semi-dry spiced gravy." },
  { name: "Kadai Mushroom", price: 210, category: "Main Course", isVegetarian: true, description: "Fresh mushrooms cooked with bell peppers in a Kadai gravy." },
  { name: "Paneer Butter Masala", price: 330, category: "Main Course", isVegetarian: true, description: "Cottage cheese cubes simmered in a rich, buttery tomato gravy." },
  { name: "Kadai Paneer", price: 330, category: "Main Course", isVegetarian: true, description: "Paneer cubes tossed with bell peppers in a spicy kadai masala." },
  { name: "Palak Paneer", price: 330, category: "Main Course", isVegetarian: true, description: "Cottage cheese cubes in a creamy and smooth fresh spinach puree." },
  { name: "Paneer Lababdar", price: 330, category: "Main Course", isVegetarian: true, description: "Paneer cubes in a rich, creamy, and mildly sweet tomato-onion gravy." },
  { name: "Paneer Methi Masala", price: 330, category: "Main Course", isVegetarian: true, description: "Paneer cooked with fresh fenugreek leaves in a creamy aromatic sauce." },

  // MAIN COURSE - NON-VEGETARIAN
  { name: "Mutton Rogan Josh", price: 400, category: "Main Course", isVegetarian: false, description: "Aromatic mutton dish cooked with Kashmiri red chillies and yogurt." },
  { name: "Mutton Kadai", price: 390, category: "Main Course", isVegetarian: false, description: "Mutton cooked with bell peppers in a spicy kadai masala." },
  { name: "Egg Curry", price: 170, category: "Main Course", isVegetarian: false, description: "Boiled eggs simmered in a spiced onion-tomato gravy." },
  { name: "Egg Masala", price: 170, category: "Main Course", isVegetarian: false, description: "Eggs cooked in a thick spicy onion-tomato gravy." },
  { name: "Egg Keema Masala", price: 200, category: "Main Course", isVegetarian: false, description: "Scrambled eggs cooked with minced spices and green peas." },
  { name: "Chicken Lababdar", price: 290, category: "Main Course", isVegetarian: false, description: "Boneless chicken pieces cooked in a rich, creamy tomato gravy." },
  { name: "Kadai Murg", price: 310, category: "Main Course", isVegetarian: false, description: "Chicken pieces tossed with bell peppers and freshly ground kadai spices." },
  { name: "Chicken Kolhapuri", price: 310, category: "Main Course", isVegetarian: false, description: "Fiery chicken curry cooked with Kolhapuri ground spices." },
  { name: "Hyderabadi Chicken", price: 280, category: "Main Course", isVegetarian: false, description: "Chicken cooked in a rich mint, coriander, and yogurt based gravy." },
  { name: "Malnad Chicken", price: 310, category: "Main Course", isVegetarian: false, description: "Traditional chicken curry cooked Malnad style with fresh green herbs." },
  { name: "Palak Chicken", price: 280, category: "Main Course", isVegetarian: false, description: "Chicken pieces simmered in a spiced fresh spinach puree." },
  { name: "Chicken Rara", price: 310, category: "Main Course", isVegetarian: false, description: "Chicken pieces cooked with minced chicken in a rich spicy gravy." },
  { name: "Chicken Chettinad", price: 310, category: "Main Course", isVegetarian: false, description: "Classic South Indian chicken curry cooked with roasted coconut and spices." },
  { name: "Chicken Butter Masala", price: 290, category: "Main Course", isVegetarian: false, description: "Tender chicken tikka simmered in a rich tomato, butter, and cream gravy." },
  { name: "Murg Methi Masala", price: 290, category: "Main Course", isVegetarian: false, description: "Chicken cooked with fresh fenugreek leaves in a creamy aromatic sauce." },

  // BIRYANI
  { name: "Chicken Biryani", price: 250, category: "Biryani", isVegetarian: false, description: "Aromatic basmati rice layered with spiced chicken and herbs." },
  { name: "Mutton Biryani", price: 370, category: "Biryani", isVegetarian: false, description: "Rich basmati rice slow-cooked with tender spiced mutton and saffron." },
  { name: "Egg Biryani", price: 200, category: "Biryani", isVegetarian: false, description: "Basmati rice cooked with boiled eggs and aromatic spices." },

  // RICE & NOODLES
  { name: "Veg Pulao", price: 200, category: "Rice & Noodles", isVegetarian: true, description: "Fragrant rice cooked with mixed vegetables and whole spices." },
  { name: "Peas Pulao", price: 220, category: "Rice & Noodles", isVegetarian: true, description: "Mildly spiced basmati rice tossed with fresh green peas." },
  { name: "Plain Rice", price: 110, category: "Rice & Noodles", isVegetarian: true, description: "Steamed premium basmati rice." },
  { name: "Curd Rice", price: 120, category: "Rice & Noodles", isVegetarian: true, description: "Soft-cooked rice mixed with yogurt, mustard seeds, and curry leaves." },
  { name: "Veg Noodles", price: 200, category: "Rice & Noodles", isVegetarian: true, description: "Stir-fried noodles with crisp vegetables and soy sauce." },
  { name: "Veg Schezwan Noodles", price: 220, category: "Rice & Noodles", isVegetarian: true, description: "Spicy stir-fried noodles in fiery Schezwan sauce." },
  { name: "Chicken Fried Rice", price: 290, category: "Rice & Noodles", isVegetarian: false, description: "Stir-fried rice with eggs, shredded chicken, and fresh greens." },
  { name: "Chicken Schezwan Rice", price: 320, category: "Rice & Noodles", isVegetarian: false, description: "Spicy fried rice tossed with chicken in house Schezwan sauce." },
  { name: "Egg Fried Rice", price: 280, category: "Rice & Noodles", isVegetarian: false, description: "Stir-fried basmati rice with scrambled eggs and vegetables." },
  { name: "Egg Schezwan Rice", price: 350, category: "Rice & Noodles", isVegetarian: false, description: "Spicy fried rice tossed with scrambled eggs in Schezwan sauce." },
  { name: "Veg Fried Rice", price: 200, category: "Rice & Noodles", isVegetarian: true, description: "Stir-fried rice with finely chopped seasonal vegetables." },
  { name: "Veg Schezwan Rice", price: 220, category: "Rice & Noodles", isVegetarian: true, description: "Spicy stir-fried rice with vegetables in Schezwan sauce." },
  { name: "Mushroom Fried Rice", price: 200, category: "Rice & Noodles", isVegetarian: true, description: "Fried rice tossed with button mushrooms and green onions." },
  { name: "Chilli Garlic Rice", price: 200, category: "Rice & Noodles", isVegetarian: true, description: "Flavored fried rice tossed with garlic and red chillies." },
  { name: "Jeera Rice", price: 200, category: "Rice & Noodles", isVegetarian: true, description: "Basmati rice tempered with cumin seeds and fresh coriander." },

  // STARTERS
  { name: "Chicken Manchurian", price: 290, category: "Starters", isVegetarian: false, description: "Crispy chicken balls tossed in sweet, sour, and hot Manchurian sauce." },
  { name: "Pepper Chicken", price: 290, category: "Starters", isVegetarian: false, description: "Dry chicken starters tossed with fresh crushed black pepper and onions." },
  { name: "Chicken Sukka", price: 290, category: "Starters", isVegetarian: false, description: "Dry Mangalorean chicken dish cooked with fresh grated coconut and dry spices." },
  { name: "Chicken Chettinad (Dry)", price: 290, category: "Starters", isVegetarian: false, description: "Dry chicken roasted with authentic Chettinad spices." },
  { name: "Chicken Lollipop (6 pcs)", price: 290, category: "Starters", isVegetarian: false, description: "Crispy and spicy chicken drummettes, served with hot garlic sauce." },
  { name: "Drums of Heaven", price: 310, category: "Starters", isVegetarian: false, description: "Chicken lollipops tossed in a sweet and spicy Schezwan sauce." },
  { name: "Schezwan Chicken", price: 310, category: "Starters", isVegetarian: false, description: "Spicy chicken pieces tossed in fiery Schezwan sauce." },
  { name: "Garlic Chicken", price: 280, category: "Starters", isVegetarian: false, description: "Chicken tossed in rich butter garlic sauce with mild herbs." },
  { name: "Ginger Chicken", price: 280, category: "Starters", isVegetarian: false, description: "Stir-fried chicken seasoned with fresh ginger juliennes and spring onions." },
  { name: "Chicken Ghee Roast", price: 310, category: "Starters", isVegetarian: false, description: "Kundapura style chicken cooked in rich ghee with spicy red masala." },
  { name: "Fish Tawa Fry", price: 310, category: "Starters", isVegetarian: false, description: "Fresh fish slices marinated and shallow fried on a tawa." },
  { name: "Fish Rawa Fry", price: 320, category: "Starters", isVegetarian: false, description: "Semolina-crusted crispy fried fish slices." },
  { name: "Fish Kebab", price: 330, category: "Starters", isVegetarian: false, description: "Deep-fried marinated fish chunks." },
  { name: "Chilli Fish", price: 310, category: "Starters", isVegetarian: false, description: "Crispy fish chunks tossed with bell peppers and green chillies." },
  { name: "Mutton Pepper Dry", price: 360, category: "Starters", isVegetarian: false, description: "Tender mutton pieces tossed with crushed black pepper and curry leaves." },
  { name: "Mutton Sukka", price: 370, category: "Starters", isVegetarian: false, description: "Dry mutton cooked with roasted grated coconut and spices." },
  { name: "Mutton Ghee Roast", price: 400, category: "Starters", isVegetarian: false, description: "Tender mutton chunks slow-roasted in pure ghee and spicy Mangalorean masala." }
];

const seed = async () => {
  await connectDB();
  
  // Clear dishes
  console.log("Clearing existing dishes...");
  await Dish.deleteMany({});
  
  // Reset Counter for dishId
  console.log("Resetting dish ID counter...");
  await Counter.findOneAndUpdate(
    { _id: "dishId" },
    { seq: 0 },
    { upsert: true }
  );

  console.log("Inserting new dishes...");
  for (const item of seedData) {
    const dish = new Dish(item);
    await dish.save();
    console.log(`Saved dish: ${dish.name} (id: ${dish.id})`);
  }
  
  console.log("Seeding completed successfully!");
  mongoose.connection.close();
};

seed().catch(err => {
  console.error("Seeding failed:", err);
  mongoose.connection.close();
});
