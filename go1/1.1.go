package main

import "fmt"

func main() {
	fmt.Print(prime(100))
}

func prime(n int) []int {
	primes := []int{}
	for i := 2; i <= n; i++ {
		isPrime := true
		for j := 2; j*j <= i; j++ {
			if i%j == 0 {
				isPrime = false
				break
			}
		}
		if isPrime {
			primes = append(primes, i)
		}
	}
	return primes
}
