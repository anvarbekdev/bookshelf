"use client";

import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import CryptoJS from "crypto-js";

interface BookData {
  isbn: string;
}

const apiUrl = import.meta.env.VITE_API_URL;
const KEY = import.meta.env.VITE_KEY;
const SECRET = import.meta.env.VITE_SECRET;

export default function AddBookModal() {
  const [open, setOpen] = useState(false);
  const [bookData, setBookData] = useState<BookData>({
    isbn: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });


  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]:
        name === "published" || name === "pages" ? parseInt(value) : value,
    }));
  };

  const resetForm = () => {
    setBookData({
      isbn: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = "POST";
    const url = "/books";
    const body = JSON.stringify(bookData);

    const signstr = `${method}${url}${body}${SECRET}`;
    const sign = CryptoJS.MD5(signstr).toString();
    try {
      const response = await fetch(`${apiUrl}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Key: KEY,
          Sign: sign,
        },
        body: JSON.stringify(bookData),
      });

      const result = await response.json();
      if (result.isOk) {
        console.log("Create book result:", result);
        setSnackbar({ open: true, message: "Book added successfully!" });
        handleClose();
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating book:", error);
      setSnackbar({
        open: true,
        message: "Error adding book. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Book
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a New Book</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="ISBN"
              name="isbn"
              fullWidth
              value={bookData.isbn}
              onChange={handleChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Adding..." : "Add Book"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </>
  );
}
