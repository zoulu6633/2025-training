package main

import (
	"backend/api"
	"backend/database"
	"fmt"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.InitGormDB()
	if database.DB != nil {
		fmt.Println("Database connection established successfully.")
		sqlDB, _ := database.DB.DB()
		defer sqlDB.Close() // 程序退出时自动关闭
	}
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // 前端地址
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	r.POST("/login", api.Login)
	r.POST("/register", api.Register)
	shop := r.Group("/shop")
	shop.Use(api.AuthMiddleware()) // 使用组内中间件进行JWT验证
	{
		shop.POST("/add", api.AddProduct)
		shop.DELETE("/delete/:id", api.DeleteProduct)
		shop.PUT("/update/:id", api.UpdateProduct)
		shop.GET("/search", api.SearchAllProduct)
		shop.GET("/myproducts", api.SearchMyProducts)
		shop.GET("/search/category/:c_id", api.SearchProductByCategory)
		shop.GET("/search/product/:id", api.GetProductDetail) // 根据ID查询商品
	}
	order := r.Group("/order")
	order.Use(api.AuthMiddleware()) // 使用组内中间件进行JWT验证
	{
		order.POST("/create", api.CreateOrder)
		order.GET("/", api.GetOrder)             // 获取个人订单
		order.GET("/seller", api.GetSellerOrder) // 获取卖家订单
		order.DELETE("/:id", api.DeleteOrder)
		order.PUT("/:id/status", api.UpdateOrderStatus) // 更新订单状态
	}
	user := r.Group("/user")
	user.Use(api.AuthMiddleware())
	{
		user.GET("/profile", api.GetProfile)
		user.PUT("/profile", api.UpdateProfile)
		user.POST("/address", api.AddAddress)
		user.DELETE("/address/:id", api.DeleteAddress)
		user.PUT("/password", api.UpdatePassword)
	}
	r.Static("/uploads", "./uploads")
	r.POST("/upload", api.UploadImage)
	r.Run(":8080")
}
