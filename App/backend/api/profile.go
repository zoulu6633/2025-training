package api

import (
	"backend/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

// 获取个人信息（含地址）
func GetProfile(c *gin.Context) {
	uidAny, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, database.Response{Code: 401, Message: "未登录"})
		return
	}
	uid, ok := uidAny.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "用户ID类型错误"})
		return
	}
	var user database.User
	if err := database.DB.Preload("Addresses").Where("user_id = ?", uid).First(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "获取用户信息失败", Data: err.Error()})
		return
	}
	user.Password = "" // 不返回密码
	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "获取成功", Data: user})
}

// 更新个人信息
type UpdateProfileReq struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Age   int    `json:"age"`
}

func UpdateProfile(c *gin.Context) {
	uidAny, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, database.Response{Code: 401, Message: "未登录"})
		return
	}
	uid, ok := uidAny.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "用户ID类型错误"})
		return
	}
	var req UpdateProfileReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, database.Response{Code: 400, Message: "参数错误", Data: err.Error()})
		return
	}
	if err := database.DB.Model(&database.User{}).Where("user_id = ?", uid).Updates(map[string]interface{}{
		"name":  req.Name,
		"email": req.Email,
		"age":   req.Age,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "更新失败", Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "更新成功"})
}

// 添加地址
type AddAddressReq struct {
	Receiver  string `json:"receiver"`
	Phone     string `json:"phone"`
	Address   string `json:"address"`
	IsDefault bool   `json:"is_default"`
}

func AddAddress(c *gin.Context) {
	uidAny, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, database.Response{Code: 401, Message: "未登录"})
		return
	}
	uid, ok := uidAny.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "用户ID类型错误"})
		return
	}
	var req AddAddressReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, database.Response{Code: 400, Message: "参数错误", Data: err.Error()})
		return
	}
	addr := database.Address{
		UserID:    uid,
		Receiver:  req.Receiver,
		Phone:     req.Phone,
		Address:   req.Address,
		IsDefault: req.IsDefault,
	}
	if err := database.DB.Create(&addr).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "添加地址失败", Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "添加成功", Data: addr})
}

func DeleteAddress(c *gin.Context) {
	uidAny, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, database.Response{Code: 401, Message: "未登录"})
		return
	}
	uid, ok := uidAny.(int)
	if !ok {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "用户ID类型错误"})
		return
	}
	id := c.Param("id")
	// 只允许删除自己的地址
	if err := database.DB.Where("id = ? AND user_id = ?", id, uid).Delete(&database.Address{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, database.Response{Code: 500, Message: "删除失败", Data: err.Error()})
		return
	}
	c.JSON(http.StatusOK, database.Response{Code: 200, Message: "删除成功"})
}

type UpdatePasswordReq struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

func UpdatePassword(c *gin.Context) {
	uidAny, exists := c.Get("user_id")
	if !exists {
		c.JSON(401, database.Response{Code: 401, Message: "未登录"})
		return
	}
	uid, ok := uidAny.(int)
	if !ok {
		c.JSON(500, database.Response{Code: 500, Message: "用户ID类型错误"})
		return
	}
	var req UpdatePasswordReq
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, database.Response{Code: 400, Message: "参数错误", Data: err.Error()})
		return
	}
	var user database.User
	if err := database.DB.First(&user, "user_id = ?", uid).Error; err != nil {
		c.JSON(500, database.Response{Code: 500, Message: "用户不存在"})
		return
	}
	if user.Password != req.OldPassword {
		c.JSON(400, database.Response{Code: 400, Message: "原密码错误"})
		return
	}
	if err := database.DB.Model(&user).Update("password", req.NewPassword).Error; err != nil {
		c.JSON(500, database.Response{Code: 500, Message: "修改失败", Data: err.Error()})
		return
	}
	c.JSON(200, database.Response{Code: 200, Message: "修改成功"})
}
