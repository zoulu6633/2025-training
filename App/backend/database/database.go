package database

import (
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type User struct {
	UserID    int       `gorm:"primaryKey" json:"user_id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Age       int       `json:"age"`
	Password  string    `json:"password"`
	Addresses []Address `json:"addresses" gorm:"foreignKey:UserID;references:UserID"`
}

type Products struct {
	ProductID   string         `gorm:"primaryKey;size:64" json:"product_id"`
	Name        string         `json:"name"`
	Price       int            `json:"price"`
	SellerID    int            `json:"seller_id"`
	Seller      User           `json:"seller" gorm:"foreignKey:SellerID;references:UserID"`
	Stock       int            `json:"stock"`
	CategoryID  string         `gorm:"size:64;index" json:"c_id"`
	Category    Category       `json:"category" gorm:"foreignKey:CategoryID;references:CID"`
	ImageURL    string         `json:"image_url"`
	Images      []ProductImage `json:"images" gorm:"foreignKey:ProductID;references:ProductID"`
	Description string         `json:"description"`
}

type ProductUpdateReq struct {
	ProductID string `json:"product_id"`
	Name      string `json:"name"`
	Price     int    `json:"price"`
	Stock     int    `json:"stock"`
	CID       string `json:"c_id"`
	ImageURL  string `json:"image_url"`
}

type Category struct {
	CID   string `gorm:"primaryKey" json:"c_id"`        // 主键
	CName string `json:"c_name" gorm:"unique;not null"` // 唯一名称
}

type Order struct {
	OrderID    string    `gorm:"primaryKey" json:"order_id"`
	UserID     int       `json:"user_id"`
	User       User      `json:"user" gorm:"foreignKey:UserID;references:UserID"` // 关联User
	ProductID  string    `json:"product_id"`
	Product    Products  `json:"product" gorm:"foreignKey:ProductID;references:ProductID"` // 关联Products
	Quantity   int       `json:"quantity"`
	TotalPrice float64   `json:"total_price"`
	AddressID  uint      `json:"address_id"`
	Address    string    `json:"address"`
	Phone      string    `json:"phone"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"created_at"`
}

type ProductImage struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	ProductID string `gorm:"size:64;index" json:"product_id"`
	URL       string `json:"url"`
}

type Address struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	UserID    int    `json:"user_id"`
	Receiver  string `json:"receiver"`
	Phone     string `json:"phone"`
	Address   string `json:"address"`
	IsDefault bool   `json:"is_default"`
}

// Response 通用响应结构体
type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

var DB *gorm.DB

func InitGormDB() {
	dsn := "root:123456@tcp(localhost:3306)/shop?parseTime=True&loc=Local&charset=utf8mb4"
	gormDB, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	DB = gormDB
	DB.AutoMigrate(&User{}) // 自动建表
	DB.AutoMigrate(&Category{})
	DB.AutoMigrate(&ProductImage{})
	DB.AutoMigrate(&Address{})
	DB.AutoMigrate(&Products{})
	DB.AutoMigrate(&Order{})

}
