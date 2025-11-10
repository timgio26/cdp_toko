import errorImg from "../assets/8030430_3828535.svg"
import { Link } from "react-router"

export function ErrorBackToHome(){
    return(
              <div className="flex flex-col h-full justify-center items-center">
        <div className="w-full md:w-1/3">
          <img src={errorImg} alt="" />
        </div>
          <Link to={"/"}>
            <div className="bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4 rounded-full cursor-pointer">to Home</div>
          </Link>
      </div>
    )
}