package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	resp, err := http.Get("http://localhost:8080/book?title=三体") //发送get请求到本地服务端
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()          //延迟关闭响应体，避免内存泄漏
	body, _ := io.ReadAll(resp.Body) //读取响应体并存⼊body
	fmt.Println("响应内容", string(body))
}
