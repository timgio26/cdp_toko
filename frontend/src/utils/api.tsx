import axios from "axios";


export function get_today_date(){
    const today = new Date();
    return today.toISOString().split("T")[0]
}




type NewServiceDto = {
  addressId: string;
  keluhan: string;
  tindakan: string;
  hasil: string;
};

export async function CreateNewService(data:NewServiceDto){
    const resp = await axios.post(`api/services`,data)
    return resp.data
}
