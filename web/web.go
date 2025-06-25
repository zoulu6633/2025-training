package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// 查询参数模式：通过 ?name=xxx 获取⽤户名称
func handler(w http.ResponseWriter, r *http.Request) {
	bookname := r.URL.Query().Get("title") // 获取 URL 查询参数中的 name 值
	fmt.Fprintf(w, "您正在查阅图书:《 %s》", bookname)
}

type Resp struct {
	Message string `json:"message"`
	User    string `json:"user"`
	Comment string `json:"comment"`
}

func submitHandler(w http.ResponseWriter, r *http.Request) {
	type Person struct {
		User    string `json:"user"`
		Comment string `json:"comment"`
	}
	var p Person
	//从请求体中解析json到结构体
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	// 设置响应头为 JSON
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	// 返回 JSON 响应
	json.NewEncoder(w).Encode(Resp{
		Message: "评论提交成功!",
		User:    p.User,
		Comment: p.Comment,
	})
}
func main() {
	http.HandleFunc("/book", handler)         // 注册路由处理函数
	http.HandleFunc("/submit", submitHandler) // 注册提交评论的处理函数
	fmt.Println("服务启动于 http://localhost:8080")
	http.ListenAndServe(":8080", nil) // 监听本地 8080 端⼝
}
