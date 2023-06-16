package cn.noy.qutao.connection.rest;

import cn.noy.qutao.Product;
import cn.noy.qutao.QuTao;
import cn.noy.qutao.User;
import cn.noy.qutao.connection.Request;
import cn.noy.qutao.connection.Result;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
public class Controller {

    private static final String ATTR_TOKEN = "token";
    private final Map<String, User> byUsername = new HashMap<>();
    private Map<Integer, Product> byProductId;
    private static final String SALT = "ZJU_BLOCKCHAIN_PROJECT";

    private String getIP(HttpServletRequest request) {
        if (request == null) {
            return "unknown";
        }
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Forwarded-For");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return "0:0:0:0:0:0:0:1".equals(ip) ? "127.0.0.1" : ip;
    }

    private String getSecretKey(String username, HttpServletRequest servletRequest){
        String ip = getIP(servletRequest);
        return DigestUtils.md5DigestAsHex((username+SALT+ip).getBytes());
    }
    
    private User getUser(String username, HttpServletRequest servletRequest){
        if(username==null) return null;
        User user = byUsername.get(username);
        if(user==null) return null;
        byte[] bytes = (byte[]) servletRequest.getSession().getAttribute(ATTR_TOKEN);
        if(bytes==null) return null;
        String str = getSecretKey(username, servletRequest);
        if(str.equals(new String(bytes, StandardCharsets.UTF_8))){
            return user;
        }
        return null;
    }

    private Result<List<Product>> initProducts(){
        if(byProductId==null){
            Result<List<Product>> res = QuTao.getInstance().getBlockChain().getProducts();
            if(!res.success()) return res;
            List<Product> products = res.payload();
            if(products==null) return res;
            byProductId = new HashMap<>();
            for (Product product : products) {
                byProductId.put(product.getId(),product);
            }
            return Result.of(true,products);
        }
        return Result.of(false,"already init");
    }

    @PostMapping("/register")
    public Result<Integer> register(@RequestBody Request.Register request){
        if(byUsername.containsKey(request.username())) return Result.of(false,"user name already exist");
        return QuTao.getInstance().getBlockChain().createUser(request.username(),request.password(),0);
    }

    @PostMapping("/login")
    public Result<?> login(@RequestBody Request.Login request, HttpServletRequest servletRequest){
        User user = byUsername.get(request.username());
        String msg = null;
        if(user==null){
            var res = QuTao.getInstance().getBlockChain().getUser(request.username());
            if(res.success()) user = res.payload();
            else msg = res.message();
        }
        if(user==null) return Result.of(false,msg);
        if(Objects.equals(request.password(),user.getPassword())){
            byUsername.put(user.getName(), user);
            String key = getSecretKey(user.getName(), servletRequest);
            servletRequest.getSession().setMaxInactiveInterval(3600);
            servletRequest.getSession().setAttribute(ATTR_TOKEN,key.getBytes(StandardCharsets.UTF_8));
            return Result.of(true);
        }
        return Result.of(false,"wrong password");
    }

    @PostMapping("/changePassword")
    public Result<?> changePassword(@RequestBody Request.ChangePassword request, HttpServletRequest servletRequest){
        User user = getUser(request.username(), servletRequest);
        if(user==null) return Result.of(false,"not logged in");
        if(!Objects.equals(user.getPassword(), request.oldPassword())) return Result.of(false);
        user.setPassword(request.newPassword());
        var res = QuTao.getInstance().getBlockChain().updateUser(user,"10");
        if(!res.success()) user.setPassword(request.oldPassword());
        return res;
    }

    @PostMapping("/recharge")
    public Result<Integer> recharge(@RequestBody Request.Recharge request, HttpServletRequest servletRequest){
        User user = getUser(request.username(), servletRequest);
        if(user==null) return Result.of(false,"not logged in");
        int old = user.getBalance();
        user.setBalance(old +request.amount());
        var res = QuTao.getInstance().getBlockChain().updateUser(user,"01");
        if(!res.success()) user.setBalance(old);
        return Result.of(res.success(), user.getBalance(), res.message());
    }

    @PostMapping("/listProduct")
    public Result<List<Product>> listProduct(@RequestBody Request.ListProduct request){
        if(byProductId==null){
            Result<List<Product>> initResult = initProducts();
            if(!initResult.success()) return initResult;
        }
        List<Product> list = new LinkedList<>(byProductId.values());
        if(request.message()!=null && !request.message().isEmpty()){
            list.removeIf(product -> !product.getName().contains(request.message()) &&
                    !product.getDescription().contains(request.message()));
        }
        return Result.of(true,list);
    }

    @PostMapping("/listMyProduct")
    public Result<List<Product>> listMyProduct(@RequestBody Request.ListMyProduct request, HttpServletRequest servletRequest){
        if(byProductId==null){
            Result<List<Product>> initResult = initProducts();
            if(!initResult.success()) return initResult;
        }
        User user = getUser(request.username(), servletRequest);
        if(user==null) return Result.of(false,"not logged in");
        List<Product> list = new LinkedList<>(byProductId.values());
        list.removeIf(product -> !Objects.equals(product.getOwner(),user.getName()));
        return Result.of(true,list);
    }

    @PostMapping("/buyProduct")
    public Result<?> buyProduct(@RequestBody Request.Buy request, HttpServletRequest servletRequest){
        User user = getUser(request.username(), servletRequest);
        if(user==null) return Result.of(false,"not logged in");
        Result<?> result = QuTao.getInstance().getBlockChain().buyProduct(user.getName(), request.productId(), request.times());

        if(result.success()){
            Result<User> userResult = QuTao.getInstance().getBlockChain().getUser(request.username());
            if(userResult.success()) byUsername.put(userResult.payload().getName(),userResult.payload());
            else byUsername.remove(user.getName());

            if(byProductId!=null){
                Result<Product> productResult = QuTao.getInstance().getBlockChain().getProduct(request.productId());
                if(productResult.success()) byProductId.put(productResult.payload().getId(),productResult.payload());
                else byProductId = null;
            }
        }

        return result;
    }

    @PostMapping("/createProduct")
    public Result<Integer> createProduct(@RequestBody Request.CreateProduct request, HttpServletRequest servletRequest){
        User user = getUser(request.username(), servletRequest);
        if(user==null) return Result.of(false,"not logged in");
        var res = QuTao.getInstance().getBlockChain().createProduct(
                request.url(),
                request.price(),
                user.getName(),
                request.allowance(),
                request.name(),
                request.description());
        Integer id = res.payload();
        if(id!=null){
            if(byProductId!=null){
                Product product = QuTao.getInstance().getBlockChain().getProduct(id).payload();
                if(product!=null) byProductId.put(id,product);
            }
            return Result.of(true,id);
        }
        return res;
    }

    @PostMapping("/modifyProduct")
    public Result<?> modifyProduct(@RequestBody Request.ModifyProduct request, HttpServletRequest servletRequest){
        if(byProductId==null){
            Result<List<Product>> initResult = initProducts();
            if(!initResult.success()) return initResult;
        }
        User user = getUser(request.username(), servletRequest);
        if(user==null) return Result.of(false,"not logged in");
        Product product = byProductId.get(request.productId());
        if(product==null) return Result.of(false,"product not exist");
        if(!Objects.equals(product.getOwner(), user.getName())) return Result.of(false,"not the owner");
        return QuTao.getInstance().getBlockChain().updateProduct(request, product);
    }

}
