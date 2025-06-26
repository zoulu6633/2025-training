package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Book struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Author string `json:"author"`
	Stock  string `json:"stock"`
}

var books = make(map[string]Book)

func AddBook(c *gin.Context) {
	var book Book
	if err := c.ShouldBind(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, exists := books[book.ID]; exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Book already exists"})
		return
	}
	books[book.ID] = book
	c.JSON(http.StatusCreated, gin.H{"message": "Book added successfully"})
}

func DeleteBook(c *gin.Context) {
	var book Book
	if err := c.ShouldBind(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, exists := books[book.ID]; !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}
	delete(books, book.ID)
	c.JSON(http.StatusOK, gin.H{"message": "Book deleted successfully"})

}
func UpdateBook(c *gin.Context) {
	var book Book
	if err := c.ShouldBind(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if _, exists := books[book.ID]; !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}
	books[book.ID] = book
	c.JSON(http.StatusOK, gin.H{"message": "Book updated successfully"})
}
func SearchAllBook(c *gin.Context) {
	var results []Book
	for _, b := range books {
		results = append(results, b)
	}
	c.JSON(http.StatusOK, results)
}
func main() {
	r := gin.Default()
	r.POST("/addbook", AddBook)
	r.DELETE("/deletebook", DeleteBook)
	r.PUT("/updatebook", UpdateBook)
	r.GET("/searchbooks", SearchAllBook)
	fmt.Println("服务启动于 http://localhost:8080")
	r.Run(":8080")
}
