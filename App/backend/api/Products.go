package api

import (
	"backend/database"
	"net/http"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

type AddProductReq struct {
	ProductID   string   `json:"product_id"`
	Name        string   `json:"name"`
	Price       int      `json:"price"`
	Stock       int      `json:"stock"`
	CID         string   `json:"c_id"`
	ImageURL    string   `json:"image_url"`
	Images      []string `json:"images"`
	Description string   `json:"description"`
}

func AddProduct(c *gin.Context) {
	var req AddProductReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, database.Response{Code: 400, Message: "请求参数错误", Data: err.Error()})
		return
	}

	uidAny, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, database.Response{Code: 401, Message: "未登录", Data: nil})
		return
	}
	uid, ok := uidAny.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "用户ID类型错误", Data: nil})
		return
	}

	// 检查商品是否已存在
	var existsProduct database.Products
	if err := database.DB.Where("product_id = ?", req.ProductID).First(&existsProduct).Error; err == nil {
		c.JSON(http.StatusBadRequest, database.Response{Code: 400, Message: "商品已存在", Data: nil})
		return
	}

	// 保存商品主信息
	product := database.Products{
		ProductID:   req.ProductID,
		Name:        req.Name,
		Price:       req.Price,
		Stock:       req.Stock,
		CID:         req.CID,
		ImageURL:    req.ImageURL,
		SellerID:    uid,
		Description: req.Description,
	}
	if err := database.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "商品添加失败", Data: err.Error()})
		return
	}

	// 保存多图
	for _, url := range req.Images {
		img := database.ProductImage{
			ProductID: req.ProductID,
			URL:       url,
		}
		if err := database.DB.Create(&img).Error; err != nil {
			// 打印具体错误
			c.JSON(http.StatusInternalServerError, database.Response{
				Code:    500,
				Message: "图片保存失败",
				Data:    err.Error(),
			})
			return
		}
	}

	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "商品添加成功", Data: product})
}

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var newproduct database.ProductUpdateReq
	if err := c.ShouldBind(&newproduct); err != nil {
		c.JSON(http.StatusBadRequest, database.Response{Code: 400, Message: "参数解析失败", Data: err.Error()})
		return
	}
	if id != newproduct.ProductID {
		c.JSON(http.StatusBadRequest, database.Response{Code: 400, Message: "路径ID与请求体 ID不一致", Data: nil})
		return
	}
	if err := database.DB.Model(&database.Products{}).Where("product_id = ?", id).Updates(newproduct).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "商品更新失败", Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "商品更新成功", Data: newproduct})
}

func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	_, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, database.Response{Code: 401, Message: "未登录", Data: nil})
		return
	}
	var product database.Products
	if err := database.DB.Where("product_id = ?", id).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, database.Response{Code: 404, Message: "商品不存在"})
		return
	}
	if err := database.DB.Where("product_id = ?", id).Delete(&database.Products{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "商品删除失败", Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "商品删除成功", Data: nil})
}

func SearchAllProduct(c *gin.Context) {
	var results []database.Products
	if err := database.DB.Preload("Seller").Preload("Category").Find(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "商品获取失败", Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "商品获取成功", Data: results})
}

func SearchMyProducts(c *gin.Context) {
	uidAny, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, database.Response{Code: 401, Message: "未登录", Data: nil})
		return
	}
	uid, ok := uidAny.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "用户ID类型错误", Data: nil})
		return
	}
	var products []database.Products
	if err := database.DB.Where("seller_id = ?", uid).Preload("Category").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "查询失败", Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "查询成功", Data: products})
}

func SearchProductByCategory(c *gin.Context) {
	cid := c.Param("c_id")
	keyword := c.Query("keyword")
	var products []database.Products
	db := database.DB.Where("c_id = ?", cid)
	if keyword != "" {
		db = db.Where("name LIKE ?", "%"+keyword+"%")
	}
	if err := db.Preload("Category").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "查询商品失败", Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "查询成功", Data: products})
}

func UploadImage(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "未选择文件"})
		return
	}
	filename := time.Now().Format("20060102150405") + filepath.Ext(file.Filename)
	dst := "./uploads/" + filename
	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "保存失败"})
		return
	}
	// 假设静态资源映射 /uploads
	c.JSON(http.StatusOK, gin.H{"url": "/uploads/" + filename})
}

func GetProductDetail(c *gin.Context) {
	id := c.Param("id")
	var product database.Products
	// 预加载图片和分类、卖家等信息
	err := database.DB.
		Preload("Images").
		Preload("Category").
		Preload("Seller").
		Where("product_id = ?", id).
		First(&product).Error
	if err != nil {
		c.JSON(http.StatusNotFound, database.Response{Code: 404, Message: "商品不存在"})
		return
	}
	c.JSON(http.StatusOK, database.Response{
		Code:    200,
		Message: "商品获取成功",
		Data:    product,
	})
}
