import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateNewService as CreateNewServiceApi
} from "./api";
import { z } from "zod";
import { toast } from "react-toastify";
import axios from "axios"; 
import { useNavigate } from "react-router";

const serviceSchema = z.object({
  id: z.string(),
  complaint: z.string(),
  action_taken: z.string(),
  result: z.string(),
  service_date: z.string(),
});

const AddressSchema = z.object({
  id: z.string(),
  address: z.string(),
  kategori: z.string(),
  services: z.array(serviceSchema).nullable().optional(),
});
const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  addresses: z.array(AddressSchema).nullable(),
});

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

//Service
export function useCreateNewService(){
  // const queryClient = useQueryClient()
  const {mutate:CreateNewService,isPending} = useMutation({
    mutationFn:CreateNewServiceApi,
    // onSuccess() {
    //   queryClient.invalidateQueries({queryKey:["singleCustomer"]})
    // },
    onError:()=>{
      toast("Failed add service",{type:"error"})
    }
  })
  return {CreateNewService,isPending}
}