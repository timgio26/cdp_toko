import { useLocation } from "react-router";
import { NewServiceModalFormGroup } from "../Components/NewServiceModalFormGroup";
import {z} from "zod"
import { ErrorBackToHome } from "../Components/ErrorBackToHome";
import { serviceSchema } from "../utils/customerQuery";

const ServicePageSchema = z.object({
  key: z.string(),
  pathname: z.string(),
  state: z.object({
    serviceList: z
      .array(serviceSchema)
      .nullable(),
    customer:z.string(),
    address:z.string()
  }),
});

export function Service(){
    const location = useLocation();
    const {data,success} = ServicePageSchema.safeParse(location)
    console.log(location)
    if (!success) return <ErrorBackToHome/>;
    return(
        <div>
            <h1 className="text-3xl font-bold">Service</h1>
            <span>{data.state.customer} - {data.state.address}</span>
            <div>
                {data.state.serviceList?.map((each)=>(
                    <div>
                        {each.serviceDate}
                        
                    </div>
                ))}
            </div>
            <NewServiceModalFormGroup/>
        </div>
    )
}