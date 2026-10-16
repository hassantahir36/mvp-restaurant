require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");

const menuItems = [
  { name: "Crispy Dynamite Prawns",   description: "Golden prawns tossed in a creamy, gently spiced dynamite sauce.",            price: 1290, category: "Starters",  available: true,  isSpecial: true  },
  { name: "Chicken Tikka Bites",      description: "Chargrilled chicken bites with mint chutney and pickled onions.",             price: 790,  category: "Starters",  available: true,  isSpecial: false },
  { name: "Loaded Masala Fries",      description: "Crisp fries, masala seasoning, cheese sauce, and jalapeños.",                price: 590,  category: "Starters",  available: true,  isSpecial: false },
  { name: "Smoked Tomato Soup",       description: "Slow-roasted tomato soup finished with basil cream and croutons.",           price: 490,  category: "Starters",  available: false, isSpecial: false },
  { name: "Lahori Chicken Karahi",    description: "Hand-cut chicken cooked in tomato, ginger, green chilli, and spices.",       price: 1690, category: "Mains",     available: true,  isSpecial: true  },
  { name: "Mughlai Beef Biryani",     description: "Aromatic basmati rice layered with tender beef and saffron.",                price: 1190, category: "Mains",     available: true,  isSpecial: false },
  { name: "Grilled Herb Chicken",     description: "Herb-marinated chicken breast with vegetables and pepper sauce.",            price: 1490, category: "Mains",     available: true,  isSpecial: false },
  { name: "Creamy Mushroom Pasta",    description: "Fettuccine, sautéed mushrooms, parmesan, and roasted garlic cream.",         price: 1290, category: "Mains",     available: true,  isSpecial: false },
  { name: "Classic Smash Burger",     description: "Double beef patty, cheddar, house sauce, and caramelized onions.",           price: 1390, category: "Mains",     available: true,  isSpecial: true  },
  { name: "Paneer Handi",             description: "Cottage cheese simmered in a rich tomato and cashew gravy.",                 price: 1190, category: "Mains",     available: false, isSpecial: false },
  { name: "Molten Chocolate Cake",    description: "Warm chocolate cake with a flowing centre and vanilla ice cream.",           price: 690,  category: "Desserts",  available: true,  isSpecial: true  },
  { name: "Lotus Cheesecake",         description: "Silky baked cheesecake with caramel biscuit spread and crunch.",             price: 650,  category: "Desserts",  available: true,  isSpecial: false },
  { name: "Shahi Tukray",             description: "Traditional saffron milk bread pudding with pistachio.",                     price: 550,  category: "Desserts",  available: true,  isSpecial: false },
  { name: "Fresh Orange Juice",       description: "Freshly squeezed oranges served cold with no added flavouring.",            price: 420,  category: "Drinks",    available: true,  isSpecial: true  },
  { name: "Mango Juice",              description: "Rich seasonal mango blended into a smooth, chilled drink.",                  price: 450,  category: "Drinks",    available: true,  isSpecial: false },
  { name: "Mint Lemonade",            description: "Fresh mint, lemon, crushed ice, and a bright sparkling finish.",            price: 390,  category: "Drinks",    available: true,  isSpecial: false },
  { name: "Cappuccino",               description: "Fresh espresso with steamed milk and a soft layer of microfoam.",            price: 460,  category: "Drinks",    available: true,  isSpecial: false },
  { name: "Karak Chai",               description: "Strong creamy tea brewed with cardamom and aromatic spices.",               price: 290,  category: "Drinks",    available: true,  isSpecial: false },
  { name: "Classic Soft Drink",       description: "Ice-cold sparkling cola served over ice with a lemon slice.",               price: 250,  category: "Drinks",    available: true,  isSpecial: false },
  { name: "Mineral Water",            description: "Chilled mineral water served with a clean lemon twist.",                    price: 180,  category: "Drinks",    available: true,  isSpecial: false },
];

async function seedMenu() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Remove old items first (clean seed)
    const deleted = await MenuItem.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing menu items`);

    // Insert all 20 items
    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`🌱 Seeded ${inserted.length} menu items into MongoDB:`);

    inserted.forEach((item, i) => {
      console.log(`   ${String(i + 1).padStart(2, "0")}. ${item.name} — Rs. ${item.price} [${item.category}]`);
    });

    console.log("\n✅ Menu seeding complete! All 20 items are now in the database.");
  } catch (error) {
    console.error("❌ Seed error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedMenu();
