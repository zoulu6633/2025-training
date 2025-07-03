# 使用官方 Go 镜像
FROM golang:1.24-alpine

# 设置工作目录
WORKDIR /app

# 复制 go.mod 和 go.sum（利用缓存层）
COPY go.mod go.sum ./
RUN go mod download

# 复制全部代码
COPY . .

# 构建应用
RUN go build -o main .

# 暴露端口（与 Gin 服务端口一致）
EXPOSE 8080

# 启动应用
CMD ["./main"]