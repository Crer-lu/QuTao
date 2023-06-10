// 全局共享数据示例
import { DEFAULT_NAME } from '@/constants';
import { useEffect, useState } from 'react';

const useUser = () => {
  const [name, setName] = useState<string>("");
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setName(username);
    }
  }, []);
  useEffect(() => {
    console.log("name change", name);
  }, [name]);
  return {
    name,
    setName,
  };
};

export default useUser;
