package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
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

type Claims struct {
	UserId int `json:"user_id"`
	jwt.StandardClaims
}

var books = make(map[string]Book)

const SecretKey = "666666"

func GenerateToken(id int) (string, error) {
	claims := Claims{
		UserId: id, // 使用传入的用户 ID
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().AddDate(0, 1, 0).Unix(), // 过期时间设置为 1 个月 后
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(SecretKey)) // 替换为你的密钥
}

// AuthMiddleware 创建一个中间件来验证 JWT 并检查用户角色：
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(401, gin.H{"message": "未认证"})
			c.Abort()
			return
		}
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(SecretKey), nil // 替换为你的密钥
		})
		if err != nil {
			c.JSON(401, gin.H{"message": "Invalid token", "error": err.Error()})
			c.Abort()
			return
		}
		if !token.Valid {
			c.JSON(401, gin.H{"message": "Invalid or expired token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(401, gin.H{"message": "未认证"})
			c.Abort()
			return
		}
		// 获取 user_id 并转换为 int 类型
		userId, ok := claims["user_id"].(float64)
		if !ok {
			c.JSON(401, gin.H{"message": "无法获取id"})
			c.Abort()
			return
		}
		// 打印出用户ID，或存储在上下文中
		fmt.Println(userId)
		c.Set("user_id", int(userId)) // 将用户ID存入上下文中，方便后续使用
		c.Next()
	}
}

func Login(c *gin.Context) {
	// 模拟登录逻辑，实际应用中应验证用户名和密码
	var loginData struct {
		UserId int `json:"user_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "参数错误", "error": err.Error()})
		return
	}

	token, err := GenerateToken(loginData.UserId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "生成token失败", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}

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
	r.POST("/login", Login)
	book := r.Group("/book")
	book.Use(AuthMiddleware()) // 使用组内中间件进行JWT验证
	{
		book.POST("/add", AddBook)
		book.DELETE("/delete/:id", DeleteBook)
		book.PUT("/update/:id", UpdateBook)
		book.GET("/search", SearchAllBook)
	}
	fmt.Println("服务启动于 http://localhost:8080")
	r.Run(":8080")
}
