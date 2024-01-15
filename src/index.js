// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cron = require('node-cron');

// Retrieve MongoDB URI from environment variable
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Bookstore';


// Connect to MongoDB
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Define Book schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  isbn: String,
  genre: String,
  quantity: Number,
  price: Number,
  publishedDate: Date,
});

// Create Book model
const Book = mongoose.model('Book', bookSchema);

// Create Express app
const app = express();
app.use(express.json());

// API endpoint to retrieve all books
app.get('/api/books', async (req, res) => {
    try {
      const books = await Book.find();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// API endpoint to add a book
app.post('/api/books', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json({ message: 'Book added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to delete a book by ID
app.delete('/api/books/:bookId', async (req, res) => {
  const { bookId } = req.params;
  try {
    await Book.findByIdAndDelete(bookId);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// PATCH endpoint to update the quantity of a specific book when a delivery happens
app.patch('/api/books/deliver/:bookId', async (req, res) => {
    const { bookId } = req.params;
    const { quantity } = req.body;
    
    // Find the book by ID
    const book = await Book.findOne({ _id: bookId });
    console.log(book)
    // Update the quantity if the book is found
    if (book) {
      book.quantity += quantity;
      await book.save();
      res.json({ message: 'Book quantity updated successfully', book });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });

// PATCH endpoint to update the quantity of a specific book when a purchase happens
app.patch('/api/books/sell/:bookId', async (req, res) => {
    const { bookId } = req.params;
    const { quantity } = req.body;
  
    // Find the book by ID
    const book = await Book.findOne({ _id: bookId });
  
    // Update the quantity if the book is found
    if (book) {
      book.quantity -= quantity;
      await book.save();
      res.json({ message: 'Book quantity updated successfully', book });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });



// Function to check book quantity and send notification if needed
const checkBookQuantity = async (book) => {
    const notifierEndpoint = 'http://service-notifier/api/notify';
  
    // Replace 10 with the specific quantity threshold
    if (book.quantity <= 10) {
      try {
        // Send notification to notifier service
        await axios.post(notifierEndpoint, {
          title: book.title,
          quantityLeft: book.quantity,
          notificationMessage: 'Running out of stock. Please reorder!',
        });
        console.log(`Notification sent for book: ${book.title}`);
      } catch (error) {
        console.error('Error sending notification:', error.message);
      }
    }
  };
  
  // Schedule periodic job to check book quantities
  cron.schedule('* * * * *', async () => {
    try {
      const books = await Book.find();
      books.forEach(checkBookQuantity);
    } catch (error) {
      console.error('Error retrieving books:', error.message);
    }
  });

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});