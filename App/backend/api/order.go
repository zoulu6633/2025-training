package api

import (
	"backend/database"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateOrder(c *gin.Context) {
	var req struct {
		ProductID string `json:"product_id"`
		Quantity  int    `json:"quantity"`
		AddressID uint   `json:"address_id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, database.Response{Code: 400, Message: "请求参数错误", Data: err.Error()})
		return
	}

	// 获取当前用户ID
	userID, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, database.Response{Code: 401, Message: "未登录", Data: nil})
		return
	}

	// 查询商品
	var product database.Products
	if err := database.DB.Where("product_id = ?", req.ProductID).First(&product).Error; err != nil {
		c.JSON(http.StatusBadRequest, database.Response{Code: 400, Message: "商品不存在", Data: nil})
		return
	}

	// 检查库存
	if product.Stock < req.Quantity {
		c.JSON(http.StatusBadRequest, database.Response{Code: 400, Message: "库存不足", Data: nil})
		return
	}

	// 查询地址
	var addr database.Address
	if err := database.DB.Where("id = ? AND user_id = ?", req.AddressID, userID).First(&addr).Error; err != nil {
		c.JSON(http.StatusBadRequest, database.Response{Code: 400, Message: "收货地址不存在", Data: nil})
		return
	}

	// 创建订单
	order := database.Order{
		OrderID:    fmt.Sprintf("%d_%d", time.Now().UnixNano(), userID.(int)), // 或 uuid.New().String()
		UserID:     userID.(int),
		ProductID:  req.ProductID,
		Quantity:   req.Quantity,
		TotalPrice: float64(product.Price) * float64(req.Quantity),
		AddressID:  addr.ID,      // 存储地址ID
		Address:    addr.Address, // 存储详细地址
		Phone:      addr.Phone,   // 存储电话
		Status:     "待处理",
		CreatedAt:  time.Now(),
	}

	if err := database.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "订单创建失败", Data: err.Error()})
		return
	}

	// 库存减去数量
	if err := database.DB.Model(&product).Update("stock", product.Stock-req.Quantity).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "库存更新失败", Data: err.Error()})
		return
	}

	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "订单创建成功", Data: order})
}
func GetOrder(c *gin.Context) {
	userID, ok := c.Get("user_id")
	if !ok {
		c.JSON(401, gin.H{"code": 401, "message": "未登录"})
		return
	}
	var order []database.Order
	if err := database.DB.
		Preload("User").
		Preload("Product").
		Preload("Product.Seller").
		Preload("Product.Category").
		Where("user_id = ?", userID).Find(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, database.Response{Code: 404, Message: fmt.Sprintf("未找到订单，用户ID: %v (类型: %T)\n", userID, userID), Data: nil})
		return
	}
	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "订单获取成功", Data: order})
}

func GetSellerOrder(c *gin.Context) {
	userID, ok := c.Get("user_id")
	if !ok {
		c.JSON(401, gin.H{"code": 401, "message": "未登录"})
		return
	}
	var order []database.Order
	if err := database.DB.
		Preload("User").
		Preload("Product").
		Preload("Product.Seller").
		Preload("Product.Category").
		Joins("JOIN products ON orders.product_id = products.product_id").
		Where("products.seller_id = ?", userID).Find(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, database.Response{Code: 404, Message: fmt.Sprintf("未找到订单，用户ID: %v (类型: %T)\n", userID, userID), Data: nil})
		return
	}
	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "订单获取成功", Data: order})
}

func DeleteOrder(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Where("order_id = ?", id).Delete(&database.Order{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "订单删除失败", Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "订单删除成功", Data: nil})
}

func UpdateOrderStatus(c *gin.Context) {
	var req struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, database.Response{Code: 400, Message: "请求参数错误", Data: err.Error()})
		return
	}

	orderID := c.Param("id")
	if err := database.DB.Model(&database.Order{}).Where("order_id = ?", orderID).Update("status", req.Status).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "订单状态更新失败", Data: err.Error()})
		return
	}

	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "订单状态更新成功", Data: nil})
}
