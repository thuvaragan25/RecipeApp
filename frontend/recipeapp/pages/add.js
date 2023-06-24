import React from "react";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function HoAddme() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <main>
       <nav className={"w-[100%] flex flex-row justify-between items-center sticky bg-green-600"}> 
            <div href="flex">
                <Link href="/" className="align-top font-bold text-2xl px-1 md:px-16 text-slate-50">
                    <div className="flex flex-row gap-3 px-8">
                    RecipeApp
                    </div>
                </Link>
            </div>
            <ul className={"flex items-center justify-center p-5 md:p-10 font-bold pr-4 "}> 
            <div className={"gap-2 md:gap-10 flex flex-row pr-2 md:pr-5 text-slate-50"}>
                <li><button className="hover: text-slate-50 font-thin rounded hover:transform hover:-translate-y-1 hover: transition duration-300 "><Link href="/">Home</Link></button></li>
                {user && (
                  <li><button className="hover: text-slate-50 font-thin rounded hover:transform hover:-translate-y-1 hover: transition duration-300 "><Link href="/add">Add</Link></button></li>
                )}
                {!user && (
                  <li><Link href="/api/auth/login/"><button id="page1" className="bg-slate-50 pl-5 pr-5 px-4 py-1 translate-x-5 font-bold hover: text-black rounded hover:transform hover:-translate-y-1 hover: transition duration-300 "><span className={"text-sm"}>Login</span></button></Link></li>  
                )}
                {user && (
                  <li><Link href="/api/auth/logout/"><button id="page1" className="bg-slate-50 pl-5 pr-5 px-4 py-1 translate-x-5 font-bold hover: text-black rounded hover:transform hover:-translate-y-1 hover: transition duration-300 "><span className={"text-sm"}>Logout</span></button></Link></li>  
                )}
            </div>
            </ul>
      </nav>
      <div className={"min-h-screen bg-green-600 text-white flex items-center flex-col"}>
        <h1 className={"text-3xl font-bold"}>Add Product</h1>
        <div className="flex flex-wrap gap-3 p-5 text-black items-start">
            <div className={"p-5 max-w-1/4 gap-2 max-h-1/4 bg-white rounded flex flex-col justify-center items-center"}>
                Add Product
                <input type="text" id="productName" name="productName" className="rounded border-solid border-2 border-slate-300"></input>

                <button className="bg-green-800 text-white rounded p-.5 w-1/4 hover:transform hover:translate-y-1 transition duration-800" onClick={() => {
                    // Add data to firebase (user info, product info)
                }}>+</button>
            </div>
        </div>
      </div>
    </main>
  )
}
