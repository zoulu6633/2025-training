package main

import (
	"fmt"
	"sync"
)

func main() {
	letterCh := make(chan struct{})
	numberCh := make(chan struct{})
	var wg sync.WaitGroup
	wg.Add(2)

	go func() {
		defer wg.Done()
		for i := 'A'; i <= 'Z'; i++ {
			<-letterCh
			fmt.Printf("%c", i)
			numberCh <- struct{}{}
		}
	}()

	go func() {
		defer wg.Done()
		for i := 1; i <= 26; i++ {
			<-numberCh
			fmt.Printf("%d", i)
			if i < 26 {
				letterCh <- struct{}{}
			}
		}
	}()

	letterCh <- struct{}{}
	wg.Wait()

}
