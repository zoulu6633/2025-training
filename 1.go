package main

import "fmt"

type treenode struct {
	value int
	left  *treenode
	right *treenode
}

func main() {
	fmt.Println("Hello World")
	fmt.Print(prime(100))

	s := []int{1, 2, 3, 1, 2, 4, 5, 2, 3, 6, 7, 4, 5, 8, 9, 1, 4, 10}
	fmt.Println()
	s = Deduplicate(s)
	fmt.Print(s)

	fmt.Println()
	root := buildTree(s)
	Preorder(root)

	fmt.Println()
	nums1 := []int{1, 2, 3}
	nums2 := []int{2, 5, 6}
	merged := merge(nums1, len(nums1), nums2, len(nums2))
	fmt.Println(merged)
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

func buildTree(nums []int) *treenode {
	if len(nums) == 0 {
		return nil
	}
	root := &treenode{value: nums[0]}
	queue := []*treenode{root}
	i := 1
	for len(queue) > 0 && i < len(nums) {
		node := queue[0]
		queue = queue[1:]

		// 处理左子节点
		if i < len(nums) && nums[i] != -1 {
			node.left = &treenode{value: nums[i]}
			queue = append(queue, node.left)
		}
		i++

		// 处理右子节点
		if i < len(nums) && nums[i] != -1 {
			node.right = &treenode{value: nums[i]}
			queue = append(queue, node.right)
		}
		i++
	}

	return root
}

func Preorder(root *treenode) {
	if root == nil {
		return
	}
	fmt.Print(root.value, " ")
	Preorder(root.left)
	Preorder(root.right)
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
