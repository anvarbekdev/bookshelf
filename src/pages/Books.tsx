"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Container,
  Box,
  Snackbar,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import CryptoJS from "crypto-js";
import AddBookModal from "../components/AddBookModal";
import {  Book, BooksResponse } from "../types/book";
import { useNavigate } from "react-router-dom";
import { fetchBooks } from "../services/api";

const apiUrl = import.meta.env.VITE_API_URL;
const KEY = import.meta.env.VITE_KEY;
const SECRET = import.meta.env.VITE_SECRET;

export default function BooksPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BooksResponse>([]);
  const [filteredBooks, setFilteredBooks] = useState<BooksResponse>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const userDataString = localStorage.getItem("userData");
  const getUser = userDataString ? JSON.parse(userDataString) : null;
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBooks();
        setBooks(data.data);
        setFilteredBooks(data.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchData();
    if (getUser === null) {
      navigate("/signup");
    }
  }, []);

  useEffect(() => {
    const results = books.filter((item) => {
      const { title, author, isbn } = item.book;
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        title.toLowerCase().includes(lowerSearchTerm) ||
        author.toLowerCase().includes(lowerSearchTerm) ||
        isbn.toLowerCase().includes(lowerSearchTerm)
      );
    });
    setFilteredBooks(results);
  }, [searchTerm, books]);

  const handleEditBook = async (book: Book) => {
    const body = JSON.stringify({
      book: {
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        published: book.published,
        pages: book.pages,
      },
      status: 3,
    });
    try {
      const method = "PATCH";
      const url = `/books/${book.id}`;
      const stringToSign = `${method}${url}${body}${SECRET}`;
      const sign = CryptoJS.MD5(stringToSign).toString();

      const response = await fetch(`${apiUrl}/books/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Key: KEY,
          Sign: sign,
        },
        body,
      });

      const data = await response.json();
      console.log(data);
      if (data.isOk) {
        setSnackbar({ open: true, message: "Book Updated successfully!" });
        setBooks(
          books.map((item: any) =>
            item.book.id === data.data.book.id
              ? { book: data.data.book, status: data.data.status }
              : item
          )
        );
        setEditingBook(null);
      }
    } catch (error) {
      console.error("Error editing book:", error);
    }
  };

  const handleDeleteBook = async (id: number) => {
    const method = "DELETE";
    const url = `/books/${id}`;
    const stringToSign = `${method}${url}${SECRET}`;
    const sign = CryptoJS.MD5(stringToSign).toString();

    try {
      const response = await fetch(`${apiUrl}/books/${id}`, {
        method: "DELETE",
        headers: {
          Key: KEY,
          Sign: sign,
        },
      });
      if (response.ok) {
        setSnackbar({ open: true, message: "Book deleted successfully!" });
        setBooks(books.filter((item) => item.book.id !== id));
      } else {
        setSnackbar({ open: true, message: "Failed to delete the book" });
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("userData");
    navigate("/signup");
  };

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {!isNaN(books as any) ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <CircularProgress size={50} />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <AddBookModal />
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: "300px" }}
              />
              <Button variant="contained" color="error" onClick={handleSignOut}>
                Sign Out
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>ISBN</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Published</TableCell>
                    <TableCell>Pages</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBooks.map((item) => (
                    <TableRow key={item.book.id}>
                      <TableCell>{item.book.id}</TableCell>
                      <TableCell>{item.book.isbn}</TableCell>
                      <TableCell>{item.book.title}</TableCell>
                      <TableCell>{item.book.author}</TableCell>
                      <TableCell>{item.book.published}</TableCell>
                      <TableCell>{item.book.pages}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => setEditingBook(item.book)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteBook(item.book.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Dialog open={!!editingBook} onClose={() => setEditingBook(null)}>
              <DialogTitle>Edit Book</DialogTitle>
              <DialogContent>
                {editingBook && (
                  <>
                    <TextField
                      margin="dense"
                      label="ISBN"
                      type="text"
                      fullWidth
                      value={editingBook.isbn}
                      onChange={(e) =>
                        setEditingBook({ ...editingBook, isbn: e.target.value })
                      }
                    />
                    <TextField
                      margin="dense"
                      label="Title"
                      type="text"
                      fullWidth
                      value={editingBook.title}
                      onChange={(e) =>
                        setEditingBook({
                          ...editingBook,
                          title: e.target.value,
                        })
                      }
                    />
                    <TextField
                      margin="dense"
                      label="Author"
                      type="text"
                      fullWidth
                      value={editingBook.author}
                      onChange={(e) =>
                        setEditingBook({
                          ...editingBook,
                          author: e.target.value,
                        })
                      }
                    />
                    <TextField
                      margin="dense"
                      label="Published"
                      type="number"
                      fullWidth
                      value={editingBook.published}
                      onChange={(e) =>
                        setEditingBook({
                          ...editingBook,
                          published: parseInt(e.target.value),
                        })
                      }
                    />
                    <TextField
                      margin="dense"
                      label="Pages"
                      type="number"
                      fullWidth
                      value={editingBook.pages}
                      onChange={(e) =>
                        setEditingBook({
                          ...editingBook,
                          pages: parseInt(e.target.value),
                        })
                      }
                    />
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditingBook(null)}>Cancel</Button>
                <Button
                  onClick={() => editingBook && handleEditBook(editingBook)}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>

            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              message={snackbar.message}
            />
          </>
        )}
      </Box>
    </Container>
  );
}
