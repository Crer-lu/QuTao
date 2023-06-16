package cn.noy.qutao.connection;

import org.springframework.lang.Nullable;

public class Request {
    public record Register(String username, String password){}
    public record Login(String username, String password){}
    public record ChangePassword(String username, String oldPassword, String newPassword){}
    public record Recharge(String username, int amount){}
    public record Buy(String username, int productId, int times){}
    public record CreateProduct(String username, String url, int price, int allowance, String name, String description){}
    public record ModifyProduct(String username, int productId, @Nullable String url, @Nullable Integer price,
                                @Nullable Integer allowance, @Nullable String name, @Nullable String description){}
    public record ListProduct(String message){}
    public record ListMyProduct(String username){}
}
