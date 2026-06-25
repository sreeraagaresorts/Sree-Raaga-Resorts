const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const fs = require("fs");
const path = require("path");
const Dish = require("./models/Dish");

dotenv.config();

// Custom DNS to prevent ECONNREFUSED
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (err) {}

const imageMap = {
  paratha: "photo-1565299624946-b28f40a0ae38",
  dosa: "photo-1668236543090-82eba5ee5976",
  idly: "photo-1589301760014-d929f3979dbc",
  vada: "photo-1589301760014-d929f3979dbc",
  poori: "photo-1589301760014-d929f3979dbc",
  pongal: "photo-1505576399279-565b52d4ac71",
  uppama: "photo-1505576399279-565b52d4ac71",
  fruits: "photo-1519996521430-02b798c1d881",
  dal: "photo-1546833999-b9f581a1996d",
  aloo: "photo-1589301760014-d929f3979dbc",
  paneer: "photo-1631452180519-c014fe946bc7",
  mutton: "photo-1606491956689-2ea866880c84",
  egg: "photo-1512058564366-18510be2db19",
  chicken: "photo-1603894584373-5ac82b2ae398",
  biryani: "photo-1633945274405-b6c8069047b0",
  pulao: "photo-1596797038530-2c107229654b",
  rice: "photo-1541832676-9b763b0239ab",
  noodles: "photo-1585032226651-759b368d7246",
  fish: "photo-1519708227418-c8fd9a32b7a2",
  mushroom: "photo-1512621776951-a57141f2eefd",
  veg: "photo-1512621776951-a57141f2eefd"
};

// Default image if no keyword matches
const defaultImageId = "photo-1567306226416-28f0efdc88ce";

const getUnsplashUrl = (imageId) => {
  return `https://images.unsplash.com/${imageId}?q=80&w=600&auto=format&fit=crop`;
};

const downloadImage = async (url, destPath) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.promises.writeFile(destPath, buffer);
};

const run = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sree_raaga_resort";
  console.log("Connecting to DB...");
  await mongoose.connect(uri);
  console.log("Connected.");

  const dishes = await Dish.find({});
  console.log(`Found ${dishes.length} dishes.`);

  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  for (const dish of dishes) {
    const nameLower = dish.name.toLowerCase();
    let imageId = null;

    // Determine the closest image based on keywords
    for (const [keyword, id] of Object.entries(imageMap)) {
      if (nameLower.includes(keyword)) {
        imageId = id;
        break;
      }
    }

    if (!imageId) {
      // Try by category keywords
      const catLower = dish.category.toLowerCase();
      if (catLower.includes("breakfast")) imageId = imageMap.uppama;
      else if (catLower.includes("biryani")) imageId = imageMap.biryani;
      else if (catLower.includes("rice")) imageId = imageMap.rice;
      else if (catLower.includes("starter")) imageId = "photo-1606787366850-de6330128bfc";
      else imageId = defaultImageId;
    }

    const filename = `dish_${dish.id}.jpg`;
    const destPath = path.join(uploadsDir, filename);
    const unsplashUrl = getUnsplashUrl(imageId);

    console.log(`Downloading image for "${dish.name}" (id: ${dish.id}) -> ${filename}`);
    try {
      await downloadImage(unsplashUrl, destPath);
      dish.image = filename;
      await dish.save();
      console.log(`Updated dish "${dish.name}" with image ${filename}`);
    } catch (err) {
      console.error(`Failed to download image for ${dish.name}:`, err.message);
    }
  }

  console.log("Done seeding images!");
  mongoose.connection.close();
};

run().catch(err => {
  console.error("Execution failed:", err);
  mongoose.connection.close();
});
