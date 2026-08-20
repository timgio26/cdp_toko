import axios from 'axios';
import { toast } from 'react-toastify';

export function getAuthHeaders() {
  const token = sessionStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

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


export const formatRupiah = (amount: string | number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
};

export const formatDate = (date: string) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
};


export async function downloadData(url:string,filename:string) {
  try {
        const response = await axios.get(url, {
      headers: getAuthHeaders(),
      responseType: "blob",
    });

    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = `${filename} ${get_today_date()}.xlsx`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(downloadUrl);

    toast.success("file downloaded")
  } catch (error) {
    toast.error("cant download file")
  }

  }







