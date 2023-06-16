package cn.noy.qutao;

import cn.noy.qutao.connection.BlockChainConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

@Component
@Order(value = 1)
public class QuTao implements CommandLineRunner {
    private static QuTao instance;
    private final Logger logger;
    private BlockChainConnection blockChain;

    public QuTao(){
        this.logger = LoggerFactory.getLogger(QuTao.class);
    }

    public static QuTao getInstance() {
        return instance;
    }

    public BlockChainConnection getBlockChain() {
        return blockChain;
    }

    public Logger getLogger() {
        return logger;
    }

    public void run(String... args) {
        String address = args[0];
        instance = this;
        blockChain = new BlockChainConnection(address,9099);
        instance.logger.info("即将连接到"+address+":9099");
        Scanner scanner = new Scanner(System.in);
        new Thread(() -> {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            LOOP:
            while(true){
                System.out.print("QuTao> ");
                String[] s = scanner.nextLine().split(" ");
                String cmd = s[0];
                Map<String,String> pars = new HashMap<>();
                for (String s1 : s) {
                    if(!s1.startsWith("-")) continue;
                    int index = s1.indexOf("=");
                    if(index>=0) pars.put(s1.substring(1,index),s1.substring(index+1));
                }
                try{
                    switch (cmd){
                        case "create-user"->{
                            var res = instance.blockChain.createUser(
                                    pars.get("username"),
                                    pars.get("password"),
                                    Integer.parseInt(pars.get("balance")));
                            instance.logger.info(res.toString());
                        }
                        case "query-user"->{
                            var res = instance.blockChain.getUser(pars.get("username"));
                            instance.logger.info(res.toString());
                        }
                        case "query-all-users"->{
                            var res = instance.blockChain.getUsers();
                            instance.logger.info(res.toString());
                        }
                        case "create-product"->{
                            var res = instance.blockChain.createProduct(
                                    pars.get("url"),
                                    Integer.parseInt(pars.get("price")),
                                    pars.get("owner"),
                                    Integer.parseInt(pars.get("allowance")),
                                    pars.get("name"),
                                    pars.get("description")
                            );
                            instance.logger.info(res.toString());
                        }
                        case "query-product"->{
                            var res = instance.blockChain.getProduct(Integer.parseInt(pars.get("id")));
                            instance.logger.info(res.toString());
                        }
                        case "query-all-products"->{
                            var res = instance.blockChain.getProducts();
                            instance.logger.info(res.toString());
                        }
                        case "buy","buy-product"->{
                            var res = instance.blockChain.buyProduct(
                                    pars.get("buyer"),
                                    Integer.parseInt(pars.get("id")),
                                    Integer.parseInt(pars.getOrDefault("times","1"))
                            );
                            instance.logger.info(res.toString());
                        }
                        case "quit"->{
                            instance.logger.info("再见！");
                            System.exit(0);
                            break LOOP;
                        }
                        default -> instance.logger.info("无法识别的命令:"+cmd);
                    }
                } catch (NumberFormatException e){
                    instance.logger.error("请输入正确的参数");
                }
            }
        }).start();
    }
}
