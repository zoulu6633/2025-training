package api

import (
	"backend/database"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	UserId int `json:"user_id"`
	jwt.StandardClaims
}

// 加密密码
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// 验证密码
func CheckPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

const SecretKey = "123456"

func GenerateToken(id int) (string, error) {
	claims := Claims{
		UserId: id, // 使用传入的用户 ID
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().AddDate(0, 1, 0).Unix(), // 过期时间设置为 1 个月 后
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(SecretKey))
}

// AuthMiddleware 创建一个中间件来验证 JWT 并检查用户角色：
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(401, database.Response{Code: 401, Message: "未认证"})
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
			c.JSON(401, database.Response{Code: 401, Message: "Invalid token", Data: err.Error()})
			c.Abort()
			return
		}
		if !token.Valid {
			c.JSON(401, database.Response{Code: 401, Message: "Invalid or expired token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(401, database.Response{Code: 401, Message: "未认证"})
			c.Abort()
			return
		}
		// 获取 user_id 并转换为 int 类型
		userId, ok := claims["user_id"].(float64)
		if !ok {
			c.JSON(401, database.Response{Code: 401, Message: "无法获取id"})
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
	var loginData struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, database.Response{Code: 400, Message: "参数错误", Data: err.Error()})
		return
	}

	var user database.User
	if err := database.DB.Where("name = ?", loginData.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, database.Response{Code: 401, Message: "用户名或密码错误"})
		return
	}

	if !CheckPassword(loginData.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, database.Response{Code: 401, Message: "用户名或密码错误"})
		return
	}

	token, err := GenerateToken(user.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "生成token失败", Data: err.Error()})
		return
	}

	c.JSON(http.StatusOK, database.Response{Code: 200, Data: token})
}

func Register(c *gin.Context) {
	user := database.User{}
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, database.Response{Code: 400, Message: "无效的注册数据"})
		return
	}

	// 加密密码
	hashedPassword, err := HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "无法处理密码"})
		return
	}

	// 创建用户
	user.Password = hashedPassword

	// 检查用户名是否已存在
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusConflict, database.Response{Code: 409, Message: "用户名已存在"})
		return
	}

	c.JSON(http.StatusCreated, database.Response{Code: 200, Message: "注册成功", Data: user.Name})
}
