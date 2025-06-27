package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Book 书籍结构体
type Book struct {
	ID     string `json:"id" binding:"required"`
	Title  string `json:"title" binding:"required"`
	Author string `json:"author" binding:"required"`
	Stock  string `json:"stock" binding:"required"`
}

// Response 通用响应结构体
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

var books = make(map[string]Book)

// AddBook godoc
// @Summary 添加图书
// @Description 添加一本新图书
// @Tags 图书管理
// @Accept json
// @Produce json
// @Param book body Book true "图书信息"
// @Success 201 {object} Response "图书添加成功，Data为添加的图书信息"
// @Failure 400 {object} Response "参数错误或图书已存在"
// @Router /addbook [post]
func AddBook(c *gin.Context) {
	var book Book
	if err := c.ShouldBind(&book); err != nil {
		c.JSON(http.StatusBadRequest, Response{Code: 400, Message: "参数解析失败", Data: err.Error()})
		return
	}
	if _, exists := books[book.ID]; exists {
		c.JSON(http.StatusBadRequest, Response{Code: 400, Message: "图书已存在", Data: nil})
		return
	}
	books[book.ID] = book
	c.JSON(http.StatusCreated, Response{Code: 201, Message: "图书添加成功", Data: book})
}

// DeleteBook godoc
// @Summary 删除图书
// @Description 根据ID删除图书
// @Tags 图书管理
// @Accept json
// @Produce json
// @Param id path string true "图书ID"
// @Success 200 {object} Response "书籍删除成功"
// @Failure 404 {object} Response "书籍不存在"
// @Router /deletebook/{id} [delete]
func DeleteBook(c *gin.Context) {
	id := c.Param("id")
	if _, exists := books[id]; !exists {
		c.JSON(http.StatusNotFound, Response{Code: 404, Message: "书籍不存在"})
		return
	}
	delete(books, id)
	c.JSON(http.StatusOK, Response{Code: 200, Message: "书籍删除成功"})
}

// UpdateBook godoc
// @Summary 更新图书
// @Description 根据ID更新图书信息
// @Tags 图书管理
// @Accept json
// @Produce json
// @Param id path string true "图书ID"
// @Param book body Book true "图书信息"
// @Success 200 {object} Response "图书更新成功，Data为更新后的图书信息"
// @Failure 400 {object} Response "参数错误或ID不一致"
// @Failure 404 {object} Response "图书未找到"
// @Router /updatebook/{id} [put]
func UpdateBook(c *gin.Context) {
	id := c.Param("id")
	var book Book
	if err := c.ShouldBind(&book); err != nil {
		c.JSON(http.StatusBadRequest, Response{Code: 400, Message: "参数解析失败", Data: err.Error()})
		return
	}
	if id != book.ID {
		c.JSON(http.StatusBadRequest, Response{Code: 400, Message: "路径ID与请求体 ID不一致", Data: nil})
		return
	}
	if _, exists := books[book.ID]; !exists {
		c.JSON(http.StatusNotFound, Response{Code: 404, Message: "图书未找到", Data: nil})
		return
	}
	books[book.ID] = book
	c.JSON(http.StatusOK, Response{Code: 200, Message: "图书更新成功", Data: book})
}

// SearchAllBook godoc
// @Summary 查询所有图书
// @Description 获取所有图书信息
// @Tags 图书管理
// @Produce json
// @Success 200 {object} Response "书籍列表获取成功，Data为Book数组"
// @Router /searchbooks [get]
func SearchAllBook(c *gin.Context) {
	var results []Book
	for _, b := range books {
		results = append(results, b)
	}
	c.JSON(http.StatusOK, Response{Code: 200, Message: "书籍获取成功", Data: results})
}

// @title 图书管理API
// @version 1.0
// @description 用于演示gin+swag的图书管理接口
// @host localhost:8080
// @BasePath /
func main() {
	r := gin.Default()
	r.POST("/addbook", AddBook)
	r.DELETE("/deletebook/:id", DeleteBook)
	r.PUT("/updatebook/:id", UpdateBook)
	r.GET("/searchbooks", SearchAllBook)
	fmt.Println("服务启动于 http://localhost:8080")
	r.Run(":8080")
}
