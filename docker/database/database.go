package database

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitGormDB() {
	dsn := "root:123456@tcp(mysql:3306)/book?parseTime=True&loc=Local&charset=utf8mb4"
	//后⾯的参数是设置编码集和处理time.Time
	gormDB, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	DB = gormDB
}
