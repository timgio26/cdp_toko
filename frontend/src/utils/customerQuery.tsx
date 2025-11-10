import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllCustomer,
  CreateNewCustomer as CreateNewCustomerApi,
  GetCustomer,
  CreateNewAddress as CreateNewAddressApi,
  CreateNewService as CreateNewServiceApi
} from "./api";
import { z } from "zod";
import { toast } from "react-toastify";
import axios from "axios"; 

export const serviceSchema = z.object({
  id: z.string(),
  keluhan: z.string(),
  tindakan: z.string(),
  hasil: z.string(),
  serviceDate: z.string(),
});

const AddressSchema = z.object({
  id: z.string(),
  alamat: z.string(),
  kategori: z.string(),
  serviceList: z.array(serviceSchema).nullable(),
});
const CustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  createdAt: z.string(),
  addressList: z.array(AddressSchema).nullable(),
});

const AllCustomerListSchema = z.array(CustomerSchema);

type SignupDto = {
  username: string;
  name:string;
  password: string;
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
      console.log("error")
    },
    onSuccess:()=>{
      console.log("success")
    }
  })
  return {mutate,isError,isPending}
}

export function useGetAllCustomer() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["allCustomer"],
    queryFn: async()=>{
      const resp = await axios.get(`api/customers`)
      return resp.data
    },
    retry: false,
  });

  const parseResult = AllCustomerListSchema.safeParse(data);

  if (!parseResult.success)
    return { data: null, isLoading: null, isError: true };
  return { data: parseResult.data, isLoading, isError };
}

export function useCreateNewCustomer() {
  const queryClient = useQueryClient();
  const { mutate: createNewCustomer, isPending } = useMutation({
    mutationFn: CreateNewCustomerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCustomer"] });
      toast("Customer added",{type:"success"})
    },
    onError:()=>{
      toast("Failed add customer",{type:"error"})
    }
  });
  return { createNewCustomer, isPending };
}

export function GetSingleUser(id:string){
  
  const {data,isLoading,isError}=useQuery({
    queryKey:['singleCustomer'],
    queryFn:()=>GetCustomer(id),
    retry:false
  })
  const parseResult = CustomerSchema.safeParse(data)
  if (!parseResult.success)
    return { data: null, isLoading: null, isError: true };

  return {data:parseResult,isLoading,isError}
}

export function useCreateNewAddress(){
  const queryClient = useQueryClient()
  const {mutate:CreateNewAddress,isPending} = useMutation({
    mutationFn:CreateNewAddressApi,
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["singleCustomer"]})
    },
    onError:()=>{
      toast("Failed add address",{type:"error"})
    }
  })
  return {CreateNewAddress,isPending}
}

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