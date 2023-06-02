#!/bin/bash
## 1. 重启test-work网络
cd ~/Hyperledger/fabric/scripts/fabric-samples/test-network
./network.sh down
./network.sh up createChannel

## 将peer命令所在的bin文件夹添加到环境变量中
export PATH=${PWD}/../bin:$PATH
## 设置FABRIC_CFG_PATH路径，指向core.yaml文件
export FABRIC_CFG_PATH=$PWD/../config/

## 2. 链码打包
peer lifecycle chaincode package QuTao.tar.gz --path ../chaincode/QuTao --lang golang --label QuTao

## 3. 链码安装

# 声明身份为org1
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
# 为它安装QuTao链码
peer lifecycle chaincode install QuTao.tar.gz

# 声明身份为org2
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=localhost:9051
# 为它安装QuTao链码
peer lifecycle chaincode install QuTao.tar.gz

## 4. 链码批准
# 查询链码包ID
IDstr=`peer lifecycle chaincode queryinstalled`
## truncation
IDstr1=${IDstr#*ID: }
IDstr2=${IDstr1%,*}
echo $IDstr2

#接上继续在一个终端内执行指令

export CC_PACKAGE_ID=$IDstr2

# 由于现在是org2的身份，就先为它批准
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name QuTao --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --waitForEvent

# 然后切换到org1
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

# 为org1批准
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name QuTao --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --waitForEvent

# 检查是否已经都批准成功
peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name QuTao --version 1.0 --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --output json

## 5. 链码提交
peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name QuTao --version 1.0 --sequence 1 --tls --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --peerAddresses localhost:7051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses localhost:9051 --tlsRootCertFiles ${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt

# 验证是否成功
peer lifecycle chaincode querycommitted --channelID mychannel --name QuTao --cafile ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


