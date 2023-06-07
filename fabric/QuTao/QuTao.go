/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing a car
type SmartContract struct {
	contractapi.Contract
}

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
	Id          uint   `json:"id"`
	Url         string `json:"url"`
	Price       uint   `json:"price"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Owner       string `json:"owner"`
	Allowance   uint   `json:"allowance"`
}

// QueryResult structure used for handling result of query
type QueryUserResult struct {
	Key    string `json:"key"`
	Record *User  `json:"record"`
}
type QueryProductResult struct {
	Key    string   `json:"key"`
	Record *Product `json:"record"`
}

// InitLedger adds a base set of users to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	users := []User{
		{Id: 0, Name: "test1", Password: "test1", Balance: 233, Goodslist: ""},
		{Id: 1, Name: "test2", Password: "test2", Balance: 233, Goodslist: ""},
		{Id: 2, Name: "test3", Password: "test3", Balance: 233, Goodslist: ""},
	}
	for _, user := range users {
		userAsBytes, _ := json.Marshal(user)
		err := ctx.GetStub().PutState("USER"+user.Name, userAsBytes)

		if err != nil {
			return fmt.Errorf("Failed to put to world state. %s", err.Error())
		}
	}
	return nil
}

// CreateCar adds a new user to the world state with given details
func (s *SmartContract) CreateUser(ctx contractapi.TransactionContextInterface, id uint, name string, password string, balance uint) error {
	user := User{
		Id:        id,
		Name:      name,
		Password:  password,
		Balance:   balance,
		Goodslist: "",
	}
	//check uniqueness
	status_bts, err := ctx.GetStub().GetState("USER" + name)

	if err != nil {
		return fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if status_bts == nil {
		//create user
		userAsBytes, _ := json.Marshal(user)
		err := ctx.GetStub().PutState("USER"+name, userAsBytes)
		if err != nil {
			return fmt.Errorf("Failed to put to world state. %s", err.Error())
		}
		return nil

	} else {
		return fmt.Errorf("There is the same username : %s!", name)
	}
}

//QueryUser return the details of one user found by Name
func (s *SmartContract) QueryUser(ctx contractapi.TransactionContextInterface, name string) (*User, error) {
	userAsBytes, err := ctx.GetStub().GetState("USER" + name)

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if userAsBytes == nil {
		return nil, fmt.Errorf("user %s does not exist", name)
	}

	user := new(User)
	_ = json.Unmarshal(userAsBytes, user)

	return user, nil
}

// QueryAllUsers returns all users found in world state
func (s *SmartContract) QueryAllUsers(ctx contractapi.TransactionContextInterface) ([]QueryUserResult, error) {
	startKey := "USER"
	endKey := "USES"

	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryUserResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		user := new(User)
		_ = json.Unmarshal(queryResponse.Value, user)

		queryResult := QueryUserResult{Key: queryResponse.Key, Record: user}
		results = append(results, queryResult)
	}

	return results, nil
}

func (s *SmartContract) UpdateUser(ctx contractapi.TransactionContextInterface, name string, password string, balance uint, sel string) error {
	if len(sel) != 2 {
		return fmt.Errorf("select string length ERROR!")
	}

	userAsBytes, err := ctx.GetStub().GetState("USER" + name)

	if err != nil {
		return fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if userAsBytes == nil {
		return fmt.Errorf("user %s does not exist", name)
	}

	user := new(User)
	err = json.Unmarshal(userAsBytes, user)

	if err != nil {
		return fmt.Errorf("Marshal failure")
	}

	if sel[0] == '1' {
		user.Password = password
	}
	if sel[1] == '1' {
		user.Balance = balance
	}

	userAsBytes, err = json.Marshal(user)

	if err != nil {
		return err
	}

	ctx.GetStub().PutState("USER"+name, userAsBytes)

	return nil
}

func (s *SmartContract) UpdateProduct(ctx contractapi.TransactionContextInterface, id uint, url string, price uint, allowance uint, name string, description string, sel string) error {
	if len(sel) != 5 {
		return fmt.Errorf("select string length ERROR!")
	}

	productAsBytes, err := ctx.GetStub().GetState("PROD" + strconv.Itoa(int(id)))

	if err != nil {
		return fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if productAsBytes == nil {
		return fmt.Errorf("product %d does not exist", id)
	}

	product := new(Product)
	err = json.Unmarshal(productAsBytes, product)

	if err != nil {
		return fmt.Errorf("Marshal failure")
	}

	if sel[0] == '1' {
		product.Url = url
	}
	if sel[1] == '1' {
		product.Price = price
	}
	if sel[2] == '1' {
		product.Allowance = allowance
	}
	if sel[3] == '1' {
		product.Name = name
	}
	if sel[4] == '1' {
		product.Description = description
	}

	productAsBytes, err = json.Marshal(product)

	if err != nil {
		return err
	}

	ctx.GetStub().PutState("PROD"+strconv.Itoa(int(id)), productAsBytes)

	return nil
}

func (s *SmartContract) CreateProduct(ctx contractapi.TransactionContextInterface, id uint, url string, price uint, owner string, allowance uint, name string, description string) error {
	product := Product{
		Id:          id,
		Url:         url,
		Price:       price,
		Owner:       owner,
		Allowance:   allowance,
		Name:        name,
		Description: description,
	}

	userAsBytes, err := ctx.GetStub().GetState("USER" + owner)

	if err != nil {
		return fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if userAsBytes == nil {
		return fmt.Errorf("user %s does not exist", owner)
	} else {
		user := new(User)
		json.Unmarshal(userAsBytes, user)

		user.Goodslist += strconv.Itoa(int(id)) + " "

		//save user data
		userAsBytes, _ = json.Marshal(user)
		_ = ctx.GetStub().PutState("USER"+owner, userAsBytes)

		// there exists this user
		productAsBytes, err := json.Marshal(product)

		if err != nil {
			return fmt.Errorf("Marshal failure")
		}

		err = ctx.GetStub().PutState("PROD"+strconv.Itoa(int(id)), productAsBytes)

		if err != nil {
			return fmt.Errorf("Failed to write to world state. %s", err.Error())
		}

		return nil
	}
}

func (s *SmartContract) QueryProduct(ctx contractapi.TransactionContextInterface, id uint) (*Product, error) {
	productAsBytes, err := ctx.GetStub().GetState("PROD" + strconv.Itoa(int(id)))

	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if productAsBytes == nil {
		return nil, fmt.Errorf("product %d does not exist", id)
	}

	product := new(Product)
	err = json.Unmarshal(productAsBytes, product)

	if err != nil {
		return nil, fmt.Errorf("Marshal failure")
	}

	return product, nil
}

func (s *SmartContract) QueryAllProducts(ctx contractapi.TransactionContextInterface) ([]QueryProductResult, error) {
	startKey := "PROD"
	endKey := "PROE"

	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	results := []QueryProductResult{}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return nil, err
		}

		product := new(Product)
		_ = json.Unmarshal(queryResponse.Value, product)

		queryResult := QueryProductResult{Key: queryResponse.Key, Record: product}
		results = append(results, queryResult)
	}

	return results, nil
}

func (s *SmartContract) BuyProduct(ctx contractapi.TransactionContextInterface, buyer string, product_id uint, times uint) error {
	userAsBytes, err := ctx.GetStub().GetState("USER" + buyer)

	if err != nil {
		return fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if userAsBytes == nil {
		return fmt.Errorf("user %s does not exist", buyer)
	} else {
		user := new(User)
		err := json.Unmarshal(userAsBytes, user)

		if err != nil {
			return fmt.Errorf("Marshal failure")
		}

		productAsBytes, err := ctx.GetStub().GetState("PROD" + strconv.Itoa(int(product_id)))

		if err != nil {
			return fmt.Errorf("Failed to read from world state. %s", err.Error())
		}

		if productAsBytes == nil {
			return fmt.Errorf("product %d does not exist", product_id)
		}

		product := new(Product)
		err = json.Unmarshal(productAsBytes, product)

		if err != nil {
			return fmt.Errorf("Marshal failure")
		}

		if buyer == product.Owner {
			return fmt.Errorf("Buyer is not allowed to be the same as product's owner")
		}
		if times*product.Price <= user.Balance && times <= product.Allowance {
			//enough money

			//update data
			user.Balance -= times * product.Price
			product.Allowance -= times
			//1. buyer
			userAsBytes, _ = json.Marshal(user)
			ctx.GetStub().PutState("USER"+buyer, userAsBytes)
			//2. product
			productAsBytes, _ = json.Marshal(product)
			ctx.GetStub().PutState("PROD"+strconv.Itoa(int(product_id)), productAsBytes)
			//3. sellor
			userAsBytes, _ = ctx.GetStub().GetState("USER" + product.Owner)
			_ = json.Unmarshal(userAsBytes, user)
			user.Balance += times * product.Price
			userAsBytes, _ = json.Marshal(user)
			ctx.GetStub().PutState("USER"+product.Owner, userAsBytes)

			return nil

		} else {
			return fmt.Errorf("Not Enough Money or Not Enough Allowance")
		}

	}
}

func (s *SmartContract) ClearState(ctx contractapi.TransactionContextInterface) error {

	//clear all products

	startKey := "PROD"
	endKey := "PROE"

	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return err
	}
	defer resultsIterator.Close()

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return err
		}

		product := new(Product)
		_ = json.Unmarshal(queryResponse.Value, product)

		ctx.GetStub().DelState("PROD" + strconv.Itoa(int(product.Id)))
	}

	//clear all users
	startKey = "USER"
	endKey = "USES"

	resultsIterator, err = ctx.GetStub().GetStateByRange(startKey, endKey)

	if err != nil {
		return err
	}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()

		if err != nil {
			return err
		}

		user := new(User)
		_ = json.Unmarshal(queryResponse.Value, user)

		ctx.GetStub().DelState("USER" + user.Name)
	}
	return nil
}
func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create fabcar chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting fabcar chaincode: %s", err.Error())
	}
}
