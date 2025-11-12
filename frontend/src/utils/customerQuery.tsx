import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "react-toastify";
import axios from "axios"; 
import { useNavigate } from "react-router";

const ServiceSchema = z.object({
  id: z.string(),
  complaint: z.string(),
  action_taken: z.string(),
  result: z.string(),
  service_date: z.string(),
});
export type IService = z.infer<typeof ServiceSchema>;

const AddressSchema = z.object({
  id: z.string(),
  address: z.string(),
  kategori: z.string(),
  phone:z.string().nullable(),
  services: z.array(ServiceSchema).nullable().optional(),
});

export type IAddress = z.infer<typeof AddressSchema>

const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  joined_date:z.string(),
  addresses: z.array(AddressSchema).nullable().optional(),
});

export type ICustomer = z.infer<typeof CustomerSchema>

const SigninSchema = z.object({
  access_token : z.string()
})

const AllCustomerListSchema = z.array(CustomerSchema);

type SignupDto = {
  username: string;
  name:string;
  password: string;
};

type SigninDto = {
  username: string;
  password: string;
};

type NewCustomerDto = {
    name:string;
    phone:string|undefined;
    email:string|undefined;
    joined_date:string;
}

type NewAddressDto = {
    address:string;
    phone:string|undefined;
    kategori:string;
    customer_id:string;
}

type NewServiceDto = {
  address_id: string;
  service_date: string;
  complaint: string;
  action_taken: string;
  result: string;
};

type EditServiceDto = {
  id: string;
  service_date: string;
  complaint: string;
  action_taken: string;
  result: string;
};

export function useSignUp(){
  const {mutate,isError,isPending} = useMutation({
    mutationFn:async(data:SignupDto)=>{
      const resp = await axios.post('api/signup',data)
      if(resp.status!=201){
        throw new Error("signup error")
      }
    },
    onError:()=>{
      toast.error("Can't signup try again later")
    },
    onSuccess:()=>{
      toast.success("Signup success! Please Login")
    }

  })
  return {mutate,isError,isPending}
}

export function useSignIn(){
  const navigate = useNavigate()
  const {mutate,isError,isPending} = useMutation({
    mutationFn:async(data:SigninDto)=>{
      const resp = await axios.post('api/signin',data)
      if(resp.status!=200){
        throw new Error("Signin error")
      }
      const parsed = SigninSchema.safeParse(resp.data)
      if(!parsed.success){
        throw new Error("signup error")
      }
      return parsed.data
    },
    onError:()=>{
      toast.error("Can't Login. Try again later")
    },
    onSuccess:(fromMutation)=>{
      toast.success("Login Success")
      sessionStorage.setItem('token',fromMutation.access_token)
      navigate("/")
    }
  })
  return {mutate,isError,isPending}
}

//Customer

export function useGetAllCustomer() {
  const token = sessionStorage.getItem("token");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allCustomer"],
    queryFn: async()=>{
      const resp = await axios.get(`api/customers`,{headers:{Authorization:`Bearer ${token}`}})
      return resp.data
    },
    retry: false,
  });

  const parseResult = AllCustomerListSchema.safeParse(data);
  // console.log(parseResult)
  return {
    data: parseResult.success ? parseResult.data : null,
    isLoading,
    isError: isError || !parseResult.success,
  };
}

export function useCreateNewCustomer() {
  const token = sessionStorage.getItem("token");
  const queryClient = useQueryClient();
  const { mutate: createNewCustomer, isPending } = useMutation({
    mutationFn: async(data:NewCustomerDto)=>{
      const resp = await axios.post(`api/customers`,data,{headers:{Authorization:`Bearer ${token}`}})
      if(resp.status!=201){
        throw new Error("Cant add new customer")
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCustomer"] });
      toast.success("Customer added")
    },
    onError:()=>{
      toast.error("Can't add customer. Try again later")
    }
  });
  return { createNewCustomer, isPending };
}

export function useDeleteCustomer(){
  const token = sessionStorage.getItem("token");
  const queryClient = useQueryClient();
  const {mutate,isError,isPending} =useMutation({
    mutationFn:async(id:string)=>{
      await axios.delete(`api/customers/${id}`,{headers:{Authorization:`Bearer ${token}`}})
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ["allCustomer"] });
      toast.success("Customer added")
    },
    onError:()=>{
      toast.error("Can't delete user. Try again later")
    }
  })
  return {mutate,isError,isPending}
}

export function useGetSingleCustomer(id:string){
  const token = sessionStorage.getItem("token");
  const {data,isLoading,isError}=useQuery({
    queryKey:['singleCustomer',id],
    queryFn:async()=>{
      const resp = await axios.get(`api/customers/${id}`,{headers:{Authorization:`Bearer ${token}`}})
      return resp.data
    },
    retry:false
  })
  const parseResult = CustomerSchema.safeParse(data)
  return {
    data: parseResult.success ? parseResult.data : null,
    isLoading,
    isError: isError || !parseResult.success,
  };
}


export function useEditCustomer(){
  const queryClient = useQueryClient();
  const {mutate,isPending} = useMutation({
    mutationFn:async(data:ICustomer)=>{
      const token = sessionStorage.getItem("token");
      const resp = await axios.put(`api/customers/${data.id}`,data,{headers:{Authorization:`Bearer ${token}`}})
      if(resp.status!=200) throw new Error("Can't edit Customer")
    },
    onError:(e)=>{
      toast.error(e.message)
    },
    onSuccess:()=>{
      toast.success("Customer updated")
      queryClient.invalidateQueries({ queryKey: ["allCustomer"] });
    }
  })
  return {mutate,isPending}
}

//Address
export function useCreateNewAddress(){
  const queryClient = useQueryClient()
  const token = sessionStorage.getItem("token");
  const {mutate:CreateNewAddress,isPending} = useMutation({
    mutationFn:async(data:NewAddressDto)=>{
      const resp = await axios.post(`api/addresses`,data,{headers:{Authorization:`Bearer ${token}`}})
      return resp.data
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["singleCustomer"]})
    },
    onError:()=>{
      toast("Failed add address",{type:"error"})
    }
  })
  return {CreateNewAddress,isPending}
}

export function useGetAddress(id:string){
  const token = sessionStorage.getItem("token");
  const {data,isLoading,isError}=useQuery({
    queryKey:['Address',id],
    queryFn:async()=>{
      const resp = await axios.get(`api/addresses/${id}`,{headers:{Authorization:`Bearer ${token}`}})
      return resp.data
    },
    retry:false
  })
  const parseResult = AddressSchema.safeParse(data)
  return {
    data: parseResult.success ? parseResult.data : null,
    isLoading,
    isError: isError || !parseResult.success,
  };
}

export function useEditAddress(){
  const queryClient = useQueryClient()
  const {mutate,isPending} = useMutation({
    mutationFn:async(data:IAddress)=>{
      const token = sessionStorage.getItem("token");
      const resp = await axios.put(`api/addresses/${data.id}`,data,{headers:{Authorization:`Bearer ${token}`}})
      if (resp.status!=200)throw new Error("Can't update address, try again later")
    },
    onError:(e)=>{
      toast.error(e.message)
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["singleCustomer"]})
      toast.success("Address updated")
    }
  })
  return {mutate,isPending}
}

export function useDeleteAddress(){
  const queryClient = useQueryClient()
  const {mutate,isPending} = useMutation({
    mutationFn:async(id:string)=>{
      const token = sessionStorage.getItem("token");
      const resp = await axios.delete(`api/addresses/${id}`,{headers:{Authorization:`Bearer ${token}`}})
      if (resp.status!=204) throw new Error("Can't delete address, try again later")
    },
  onError:(e)=>{
    toast.error(e.message)
  },
  onSuccess:()=>{
    toast.success("Address deleted")
    queryClient.invalidateQueries({queryKey:["singleCustomer"]})
  }
  })
  return {mutate,isPending}
}

//Service
export function useCreateNewService(){
  const queryClient = useQueryClient()
  const token = sessionStorage.getItem("token");
  const {mutate:CreateNewService,isPending} = useMutation({
    mutationFn:async(data:NewServiceDto)=>{
          const resp = await axios.post(`api/services`,data,{headers:{Authorization:`Bearer ${token}`}})
          if (resp.status!=201) throw new Error("cant add service")
    },
    onError:()=>{
      toast.error("Can't add service. Try again later")
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ["Address"] });
      toast.success("Service added")
    }
  })
  return {CreateNewService,isPending}
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  const {mutate,isError,isPending} = useMutation({
    // mutationKey: [id],
    mutationFn: async (id: string) => {
      const token = sessionStorage.getItem("token");
      const resp = await axios.delete(`api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.status != 204)
        throw new Error("Can't delete service, try again later.");
    },
    onError:(e)=>{
      toast.error(e.message)
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ["Address"] });
      toast.success("Service deleted")
    }
  });
  return {mutate,isError,isPending}
}

export function useEditService(){
  const queryClient = useQueryClient()
  const {mutate,isPending} = useMutation({
    mutationFn:async(data:EditServiceDto)=>{
      const token = sessionStorage.getItem("token");
      const resp = await axios.put(`api/services/${data.id}`,data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if(resp.status!=200){
        throw new Error("Can't update service, try again later.")
      }
    },
    onError:(e)=>{
      toast.error(e.message)
    },
    onSuccess:()=>{
      toast.success("Service updated")
      queryClient.invalidateQueries({ queryKey: ["Address"] });
    }
  })
  return {mutate,isPending}
}