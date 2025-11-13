import axios from 'axios';
import { toast } from 'react-toastify';

export function get_today_date(){
    const today = new Date();
    return today.toISOString().split("T")[0]
}

export function formatBeautifulDate(dateStr:string) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}


export const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      sessionStorage.clear()
      toast.error("Session expired please login")

      // Global 401 handler
      window.location.href = '/authentication';
    }
    return Promise.reject(error);
  }
);








