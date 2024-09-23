import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import pkg from 'pg';
import dotenv from 'dotenv'; 

dotenv.config(); 

const { Client } = pkg;
const isProduction = process.env.NODE_ENV === 'production';


const app = express();
const port = process.env.PORT || 3000; 

const db = new Client({

  connectionString: process.env.DATABASE_URL, 
  ssl: isProduction ? { rejectUnauthorized: false } : false  
});

db.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', options); // Format: "14 August 2018"
};

app.use((req, res, next) => {
  res.locals.formatDate = formatDate;
  next();
});

app.set('view engine', 'ejs');

app.set('views', './views');

app.get('/', async (req, res) => {
  try {
    const sortBy = req.query.sortBy; 
    let result;

    const baseQuery = "SELECT books.id, title, isbn, cover_url, feedback, date_of_read, rating FROM books JOIN book_reviews ON books.id = book_id";

    if (sortBy === 'date') {
        result = await db.query(`${baseQuery} ORDER BY date_of_read DESC;`);
    } else if (sortBy === 'rating') {
        result = await db.query(`${baseQuery} ORDER BY rating DESC;`);
    } else if (sortBy === 'title') {
        result = await db.query(`${baseQuery} ORDER BY title ASC;`);
    } else {
        result = await db.query(`${baseQuery};`); 
    }

    const books = result.rows; 
    res.render('index', { books });
} catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).send('An error occurred while fetching books');
}

});

app.post("/addBook", async (req, res) => {
  if (req.body.add === "Add Book") {
 res.render("new.ejs");
} else {
 res.redirect("/");
}
});

app.post('/save-book', async (req, res) => {
  const { title, isbn } = req.body;
  const { feedback, rating, date } = req.body;
  if (!isbn) {
    return res.status(400).send('ISBN is required');
  }

  try {
    const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
    const response = await axios.get(coverUrl);

    if (response.status === 200) {
      const queryText = 'INSERT INTO books (title, isbn, cover_url) VALUES ($1, $2, $3) RETURNING id';
      const values = [title, isbn, coverUrl];

      const review_data = 'INSERT INTO book_reviews (book_id, feedback, date_of_read, rating) VALUES ($1, $2, $3, $4)';

      try {
          const result = await db.query(queryText, values);
          const bookId = result.rows[0].id;  
          const values2 = [bookId, feedback, date, rating];

          await db.query(review_data, values2);

          res.redirect("/");
      } catch (err) {
          console.error('Error executing queries:', err);
          res.status(500).send('Server Error');
      }}
      else {
        res.status(404).send('Cover not found for the given ISBN');
      }
    } 
    catch (error) {
      res.status(500).send(`
          <script>
              alert('Sorry, we couldn’t fetch the book cover at this time. Please try again later.');
              window.location.href = '/'; // Redirect to homepage after alert
          </script>
      `);
  }
});

app.post("/edit", async(req, res) => {
  const item=req.body.updatedItemTitle;
  const id=req.body.updatedItemId;
  try{
  await db.query("UPDATE book_reviews SET feedback=($1) WHERE id=$2;",[item,id] ); 
  res.redirect("/");
  }
  catch(err) {
    console.log(err);
  }
  });


app.post("/delete", async (req, res) => {
  const id = parseInt(req.body.deleteItemId, 10); 
  
  if (isNaN(id)) {
    return res.redirect("/"); 
  }

  try {
    await db.query("DELETE FROM books WHERE id=$1", [id]);
    res.redirect("/"); 
  } catch (err) {
    console.log("Error deleting book:", err);
    res.status(500).send("Error deleting book"); 
  }

});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
