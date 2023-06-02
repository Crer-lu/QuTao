package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/channel"
	"github.com/hyperledger/fabric-sdk-go/pkg/core/config"
	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
)

// Number of total users
var UserNum uint

// Number of total products
var ProductNum uint

// User describes basic details of a user
type User struct {
	Id        uint   `json:"id"`
	Name      string `json:"name"`
	Password  string `json:"password"`
	Balance   uint   `json:"balance"`
	Goodslist string `json:"goodslist"`
}

// Product describes basic details of a product
type Product struct {
	Id        uint   `json:"id"`
	Url       string `json:"url"`
	Price     uint   `json:"price"`
	Owner     string `json:"owner"`
	Allowance uint   `json:"allowance"`
}

// buy product struct
type BuyProductRequest struct {
	Buyer      string `json:"Buyer"`
	Product_id uint   `json:"Product_id"`
	Times      uint   `json:"Times"`
}

var (
	SDK           *fabsdk.FabricSDK
	channelClient *channel.Client
	channelName   = "mychannel"
	chaincodeName = "QuTao"
	orgName       = "Org1"
	orgAdmin      = "Admin"
	org1Peer0     = "peer0.org1.example.com"
	org2Peer0     = "peer0.org2.example.com"
)

func ChannelExecute(funcName string, args [][]byte) (channel.Response, error) {
	var err error
	configPath := "./config.yaml"
	configProvider := config.FromFile(configPath)
	SDK, err = fabsdk.New(configProvider)
	if err != nil {
		log.Fatalf("Failed to create new SDK: %s", err)
	}
	ctx := SDK.ChannelContext(channelName, fabsdk.WithOrg(orgName), fabsdk.WithUser(orgAdmin))
	channelClient, err = channel.New(ctx)
	response, err := channelClient.Execute(channel.Request{
		ChaincodeID: chaincodeName,
		Fcn:         funcName,
		Args:        args,
	})
	if err != nil {
		return response, err
	}
	SDK.Close()
	return response, nil
}

func InitState() {
	_, err := ChannelExecute("ClearState", [][]byte{})

	if err != nil {
		log.Fatal(err)
	}

}

func RunGin() {
	InitState()
	r := gin.Default()

	r.GET("/QueryAllUsers", func(c *gin.Context) {
		var result channel.Response
		result, err := ChannelExecute("QueryAllUsers", [][]byte{})
		fmt.Println(result)
		if err != nil {
			//fmt.Printf("Failed to evaluate transaction: %s\n", err)
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    "400",
				"message": "Failure",
				"result":  string(err.Error()),
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"code":    "200",
				"message": "Success",
				"result":  string(result.Payload),
			})
		}
	})

	r.POST("/CreateUser", func(c *gin.Context) {
		var user User
		c.BindJSON(&user)
		var result channel.Response
		result, err := ChannelExecute("CreateUser", [][]byte{[]byte(strconv.Itoa(int(UserNum))), []byte(user.Name), []byte(user.Password), []byte(strconv.Itoa(int(user.Balance)))})
		fmt.Println(result)
		if err != nil {
			//fmt.Printf("Failed to evaluate transaction: %s\n", err)
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    "400",
				"message": "Failure",
				"result":  string(err.Error()),
			})
		} else {
			UserNum++
			c.JSON(http.StatusOK, gin.H{
				"code":    "200",
				"message": "Success",
				"result":  "{\"Id\":" + strconv.Itoa(int(UserNum-1)) + "}",
			})
		}
	})

	r.POST("/QueryUser", func(c *gin.Context) {
		var user User
		c.BindJSON(&user)
		var result channel.Response
		result, err := ChannelExecute("QueryUser", [][]byte{[]byte(user.Name)})
		fmt.Println(result)
		if err != nil {
			//fmt.Printf("Failed to evaluate transaction: %s\n", err)
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    "400",
				"message": "Failure",
				"result":  string(err.Error()),
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"code":    "200",
				"message": "Success",
				"result":  string(result.Payload),
			})
		}
	})

	r.GET("/QueryAllProducts", func(c *gin.Context) {
		var result channel.Response
		result, err := ChannelExecute("QueryAllProducts", [][]byte{})
		fmt.Println(result)
		if err != nil {
			//fmt.Printf("Failed to evaluate transaction: %s\n", err)
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    "400",
				"message": "Failure",
				"result":  string(err.Error()),
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"code":    "200",
				"message": "Success",
				"result":  string(result.Payload),
			})
		}
	})

	r.POST("/CreateProduct", func(c *gin.Context) {
		var product Product
		c.BindJSON(&product)
		var result channel.Response
		result, err := ChannelExecute("CreateProduct", [][]byte{[]byte(strconv.Itoa(int(ProductNum))), []byte(product.Url), []byte(strconv.Itoa(int(product.Price))), []byte(product.Owner), []byte(strconv.Itoa(int(product.Allowance)))})
		fmt.Println(result)
		if err != nil {
			//fmt.Printf("Failed to evaluate transaction: %s\n", err)
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    "400",
				"message": "Failure",
				"result":  string(err.Error()),
			})
		} else {
			ProductNum++
			c.JSON(http.StatusOK, gin.H{
				"code":    "200",
				"message": "Success",
				"result":  "{\"Id\":" + strconv.Itoa(int(ProductNum-1)) + "}",
			})
		}
	})

	r.POST("/QueryProduct", func(c *gin.Context) {
		var product Product
		c.BindJSON(&product)
		var result channel.Response
		result, err := ChannelExecute("QueryProduct", [][]byte{[]byte(strconv.Itoa(int(product.Id)))})
		fmt.Println(result)
		if err != nil {
			//fmt.Printf("Failed to evaluate transaction: %s\n", err)
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    "400",
				"message": "Failure",
				"result":  string(err.Error()),
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"code":    "200",
				"message": "Success",
				"result":  string(result.Payload),
			})
		}
	})

	r.POST("/BuyProduct", func(c *gin.Context) {
		req := BuyProductRequest{}
		c.BindJSON(&req)
		var result channel.Response
		result, err := ChannelExecute("BuyProduct", [][]byte{[]byte(req.Buyer), []byte(strconv.Itoa(int(req.Product_id))), []byte(strconv.Itoa(int(req.Times)))})
		fmt.Println(result)
		if err != nil {
			//fmt.Printf("Failed to evaluate transaction: %s\n", err)
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    "400",
				"message": "Failure",
				"result":  string(err.Error()),
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"code":    "200",
				"message": "Success",
				"result":  string(result.Payload),
			})
		}
	})

	r.Run(":9099")
}
func main() {
	RunGin()
}