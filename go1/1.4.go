package main

import "fmt"

func main() {
	fmt.Println()
	nums1 := []int{1, 2, 3}
	nums2 := []int{2, 5, 6}
	merged := merge(nums1, len(nums1), nums2, len(nums2))
	fmt.Println(merged)
}

func merge(nums1 []int, m int, nums2 []int, n int) []int {
	result := []int{}
	i, j := 0, 0
	for i < m && j < n {
		if nums1[i] <= nums2[j] {
			result = append(result, nums1[i])
			i++
		} else {
			result = append(result, nums2[j])
			j++
		}
	}
	// 追加剩余元素
	result = append(result, nums1[i:m]...)
	result = append(result, nums2[j:n]...)
	return result
}
