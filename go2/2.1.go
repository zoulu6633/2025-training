package main

import (
	"fmt"
	"sync"
	"time"
)

var (
	count = 0
	mu    sync.Mutex
)

func add() {
	for i := 0; i < 100; i++ {
		mu.Lock()
		count++
		mu.Unlock()
	}
}

func main() {
	for i := 0; i < 50; i++ {
		go add()
	}
	time.Sleep(time.Second)
	fmt.Println("Final count:", count)
}
