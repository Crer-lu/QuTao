package cn.noy.qutao.connection;

import cn.noy.qutao.Product;
import cn.noy.qutao.QuTao;
import cn.noy.qutao.User;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.LinkedList;
import java.util.List;

public class BlockChainConnection {
    private final String address;
    private final int port;

    public BlockChainConnection(String address, int port) {
        this.address = address;
        this.port = port;
    }

    public String getAddress() {
        return address;
    }

    private HttpPost createPost(String cmd){
        HttpPost post = new HttpPost("http://"+address+":"+port+"/"+cmd);

        RequestConfig config = RequestConfig.custom()
                .setConnectTimeout(10000)
                .setConnectionRequestTimeout(5000)
                .setSocketTimeout(10000)
                .build();
        post.setConfig(config);

        post.setHeader("Content-Type", "application/json;charset=utf-8");
        post.setHeader("Accept", "application/json;charset=utf-8");
        return post;
    }

    private HttpGet createGet(String cmd){
        HttpGet get = new HttpGet("http://"+address+":"+port+"/"+cmd);

        RequestConfig config = RequestConfig.custom()
                .setConnectTimeout(10000)
                .setConnectionRequestTimeout(5000)
                .setSocketTimeout(10000)
                .build();
        get.setConfig(config);

        get.setHeader("Content-Type", "application/json;charset=utf-8");
        get.setHeader("Accept", "application/json;charset=utf-8");
        return get;
    }

    private QueryResult handleResponse(CloseableHttpResponse response) throws IOException {
        String callback = EntityUtils.toString(response.getEntity(), "UTF-8");

        QuTao.getInstance().getLogger().debug(response.getStatusLine().toString());
        QuTao.getInstance().getLogger().info(callback);

        return QueryResult.fromJson(callback);
    }

    private <T> Result<T> createFailureResult(QueryResult result){
        String s = result.result == null ? "unknown error" : result.result;
        int index = s.lastIndexOf("Description:");
        if(index>=0) s = s.substring(index+"Description:".length());
        return Result.of(false,s);
    }

    public Result<Integer> createUser(String name, String password, double initialBalance){
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = createPost("CreateUser");

            JsonObject json = new JsonObject();
            json.addProperty("name", name);
            json.addProperty("password", password);
            json.addProperty("balance", initialBalance);

            QuTao.getInstance().getLogger().debug("createUser: "+ json);
            post.setEntity(new StringEntity(json.toString(), StandardCharsets.UTF_8));

            QueryResult result = handleResponse(client.execute(post));
            if(result.isSuccess()){
                return Result.of(true,result.getResult(CreateResult.class).id);
            }
            return createFailureResult(result);
        }catch (IOException e) {
            e.printStackTrace();
            return Result.of(false,"internal error");
        }
    }

    public Result<User> getUser(String name){
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = createPost("QueryUser");

            JsonObject json = new JsonObject();
            json.addProperty("name", name);

            QuTao.getInstance().getLogger().debug("getUser: "+ json);
            post.setEntity(new StringEntity(json.toString(), StandardCharsets.UTF_8));

            QueryResult result = handleResponse(client.execute(post));
            if(result.isSuccess())
                return Result.of(true,result.getResult(User.class));
            else
                return createFailureResult(result);
        }catch (IOException e) {
            e.printStackTrace();
            return Result.of(false,"internal error");
        }
    }

    public Result<List<User>> getUsers(){
        List<User> users = new LinkedList<>();
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpGet httpGet = createGet("QueryAllUsers");

            QueryResult result = handleResponse(client.execute(httpGet));
            if(result.isSuccess()){
                QueryAllUsersResult[] allUsersResults = result.getResult(QueryAllUsersResult[].class);
                for (QueryAllUsersResult it : allUsersResults) {
                    users.add(it.record());
                }
                return Result.of(true,users);
            }
            return createFailureResult(result);
        }catch (IOException e) {
            e.printStackTrace();
            return Result.of(false,"internal error");
        }
    }

    public Result<?> updateUser(User user, String select){
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = createPost("UpdateUser");

            JsonObject json = new JsonObject();
            json.addProperty("name", user.getName());
            json.addProperty("password", user.getPassword());
            json.addProperty("balance", user.getBalance());
            json.addProperty("select", select);

            QuTao.getInstance().getLogger().debug("updateUser: " + json);
            post.setEntity(new StringEntity(json.toString(), StandardCharsets.UTF_8));
            QueryResult result = handleResponse(client.execute(post));
            if(result.isSuccess()) return Result.of(true);
            return createFailureResult(result);
        } catch (IOException e) {
            e.printStackTrace();
            return Result.of(false,"internal error");
        }
    }

    public Result<Integer> createProduct(String url, int price, String owner, int allowance, String name, String description){
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = createPost("CreateProduct");

            JsonObject json = new JsonObject();
            json.addProperty("url", url);
            json.addProperty("price", price);
            json.addProperty("owner", owner);
            json.addProperty("allowance", allowance);
            json.addProperty("name", name);
            json.addProperty("description", description);

            QuTao.getInstance().getLogger().debug("createProduct: " + json);
            post.setEntity(new StringEntity(json.toString(), StandardCharsets.UTF_8));

            QueryResult result = handleResponse(client.execute(post));
            if(result.isSuccess()){
                return Result.of(true,result.getResult(CreateResult.class).id);
            }
            return createFailureResult(result);
        } catch (IOException e) {
            e.printStackTrace();
            return Result.of(false,"internal error");
        }
    }

    public Result<Product> getProduct(int id){
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = createPost("QueryProduct");

            JsonObject json = new JsonObject();
            json.addProperty("id", id);

            post.setEntity(new StringEntity(json.toString(), StandardCharsets.UTF_8));

            QueryResult result = handleResponse(client.execute(post));
            if(result.isSuccess())
                return Result.of(true,result.getResult(Product.class));
            else
                return createFailureResult(result);
        }catch (IOException e) {
            e.printStackTrace();
            return Result.of(false,"internal error");
        }
    }

    public Result<List<Product>> getProducts(){
        List<Product> products = new LinkedList<>();
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpGet httpGet = createGet("QueryAllProducts");

            QueryResult result = handleResponse(client.execute(httpGet));
            if(result.isSuccess()){
                QueryAllProductsResult[] allUsersResults = result.getResult(QueryAllProductsResult[].class);
                for (QueryAllProductsResult it : allUsersResults) {
                    products.add(it.record());
                }
            }
            else return createFailureResult(result);

        }catch (IOException e) {
            e.printStackTrace();
            return Result.of(false,"internal error");
        }
        return Result.of(true,products);
    }

    public Result<?> buyProduct(String buyer, int productId, int times){
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = createPost("BuyProduct");

            JsonObject json = new JsonObject();
            json.addProperty("buyer", buyer);
            json.addProperty("product_id",productId);
            json.addProperty("times",times);

            post.setEntity(new StringEntity(json.toString(), StandardCharsets.UTF_8));
            QueryResult result = handleResponse(client.execute(post));
            if(result.isSuccess()) return Result.of(true);
            return createFailureResult(result);
        }catch (IOException e) {
            e.printStackTrace();
            return Result.of(false,"internal error");
        }
    }

    public Result<?> updateProduct(Request.ModifyProduct request , Product product) {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = createPost("UpdateProduct");

            JsonObject json = new JsonObject();
            json.addProperty("id", request.productId());
            if(request.url()!=null) json.addProperty("url",request.url());
            if(request.price()!=null) json.addProperty("price",request.price());
            if(request.allowance()!=null) json.addProperty("allowance",request.allowance());
            if(request.name()!=null) json.addProperty("name",request.name());
            if(request.description()!=null) json.addProperty("description",request.description());
            String sb = (request.url() == null ? "0" : "1") +
                    (request.price() == null ? "0" : "1") +
                    (request.allowance() == null ? "0" : "1") +
                    (request.name() == null ? "0" : "1") +
                    (request.description() == null ? "0" : "1");
            json.addProperty("select", sb);

            post.setEntity(new StringEntity(json.toString(), StandardCharsets.UTF_8));

            QueryResult result = handleResponse(client.execute(post));
            if(result.isSuccess()){
                if(request.url()!=null) product.setUrl(request.url());
                if(request.price()!=null) product.setPrice(request.price());
                if(request.allowance()!=null) product.setAllowance(request.allowance());
                if(request.name()!=null) product.setName(request.name());
                if(request.description()!=null) product.setDescription(request.description());
            }
            if(result.isSuccess()) return Result.of(true);
            return createFailureResult(result);
        }catch (IOException e) {
            e.printStackTrace();
            return Result.of(false,"internal error");
        }
    }


    public record QueryResult(int code, String message, String result){
        private static final Gson gson = new Gson();
        public static QueryResult fromJson(String json){
            return gson.fromJson(json,QueryResult.class);
        }

        public <T> T getResult(Class<T> clazz){
            String json = result.replaceAll("\\\\","");
            return gson.fromJson(json,clazz);
        }

        public boolean isSuccess(){
            return "Success".equalsIgnoreCase(message);
        }

    }

    public record QueryAllUsersResult(String key, User record){}

    public record QueryAllProductsResult(String key, Product record){}

    public record CreateResult(int id){}
}
