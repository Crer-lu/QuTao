package cn.noy.qutao;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class User {
    private final int id;
    private String name;
    private String password;
    private int balance;
    private String goodslist;
    private List<Integer> goods;

    public User(int id, String name, String password, int balance) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.balance = balance;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getBalance() {
        return balance;
    }

    public void setBalance(int balance) {
        this.balance = balance;
    }

    public void setGoodsList(List<Integer> goodsList) {
        this.goods = goodsList;
    }

    public List<Integer> getGoodsList() {
        if(goods==null){
            goods = new ArrayList<>();
            if(goodslist!=null && !goodslist.isEmpty()){
                for (String s : goodslist.split(" ")) {
                    goods.add(Integer.parseInt(s));
                }
            }
        }
        return goods;
    }

    public void addGoods(Product... goods){
        for (Product good : goods) {
            this.goods.add(good.getId());
        }
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + name + '\'' +
                ", password='" + password + '\'' +
                ", balance=" + balance +
                ", goods=" + goods +
                '}';
    }
}
