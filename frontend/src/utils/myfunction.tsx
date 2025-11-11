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




