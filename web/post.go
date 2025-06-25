package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func main() {
	data := map[string]interface{}{
		"User":    "⼩李",
		"Comment": "这本书真棒！",
	}
	jsonData, _ := json.Marshal(data)
	//发送POST请求
	resp, err := http.Post("http://localhost:8080/submit",
		"application/json", bytes.NewReader(jsonData))
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	fmt.Println("响应内容", string(body))
}
