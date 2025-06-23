package main

import "fmt"

type treenode struct {
	value int
	left  *treenode
	right *treenode
}

func main() {
	s := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
	fmt.Println()
	root := buildTree(s)
	Preorder(root)
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
