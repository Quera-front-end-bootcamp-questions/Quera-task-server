const User = require("../Models/User");
const Blog = require("../Models/Blog");
const Comment = require("../Models/Comment");

async function seedData() {
    const user =await new User({
      firstName: "John",
      lastName: "Doe",
      email: "johndoe@example.com",
      userName: "johndoe",
      password: "password",
    });
  
    const blog =await new Blog({
      title: "My First Blog",
      content: "Lorem ipsum dolor sit amet...",
      author: user._id,
    });
  
    const comment1 = await new Comment({
      content: "Great blog post!",
      author: user._id,
      blog: blog._id,
    });

    await user.save();
    await blog.save();
    await comment1.save();
  
  
}

export default seedData;
