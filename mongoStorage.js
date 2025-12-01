const MenuItem = require("./models/menuItem.model");
const User = require("./models/user.model");

class MongoStorage {
  // USER METHODS  
  async getUser(id) {
    return await User.findById(id);
  }

  async getUserByUsername(username) {
    return await User.findOne({ username });
  }

  async createUser(insertUser) {
    const user = new User(insertUser);
    return await user.save();
  }

  // MENU ITEM METHODS  
  async getAllMenuItems() {
    return await MenuItem.find();
  }

  async getMenuItemById(id) {
    return await MenuItem.findById(id);
  }

  async getMenuItemsByCategory(category) {
    return await MenuItem.find({ categories: category });
  }

  async createMenuItem(insertItem) {
    const menuItem = new MenuItem(insertItem);
    return await menuItem.save();
  }

  async updateMenuItem(id, insertItem) {
    return await MenuItem.findByIdAndUpdate(id, insertItem, { new: true });
  }

  async deleteMenuItem(id) {
    const result = await MenuItem.findByIdAndDelete(id);
    return !!result; // returns true if deleted, false otherwise
  }
}

const storage = new MongoStorage();

module.exports = { storage, MongoStorage };
