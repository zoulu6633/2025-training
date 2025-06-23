package main

import "fmt"

func main() {
	s := []int{1, 2, 3, 1, 2, 4, 5, 2, 3, 6, 7, 4, 5, 8, 9, 1, 4, 10}
	fmt.Println()
	s = Deduplicate(s)
	fmt.Print(s)
}

func Deduplicate(nums []int) []int {
	for i := 0; i < len(nums); i++ {
		for j := i + 1; j < len(nums); j++ {
			if nums[i] == nums[j] {
				nums = append(nums[:j], nums[j+1:]...)
				j--
			}
		}
	}
	return nums
}
