package cn.noy.qutao.connection;

public record Result<R>(boolean success, R payload, String message) {
    public static <R> Result<R> of(boolean success, R payload, String message){
        return new Result<>(success, payload, message);
    }
    public static <R> Result<R> of(boolean success, R payload){
        return of(success, payload, null);
    }
    public static <R> Result<R> of(boolean success, String message){
        return of(success, null, message);
    }
    public static <R> Result<R> of(boolean success){
        return of(success,null, null);
    }

    @Override
    public String toString() {
        return "Result{" +
                "success=" + success +
                ", payload=" + payload +
                ", message='" + message + '\'' +
                '}';
    }
}