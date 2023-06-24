import React, { useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";

import { Uploader } from "uploader"; 
import { UploadDropzone } from "react-uploader";

const uploader = Uploader({
  apiKey: "free"
});

const options = { 
  maxFileCount: 1,
  mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
  editor: { images: { crop: false } },
  styles: { colors: { 
    primary: "#047857"
  } }
};

export default function Home() {
  const [ recipe, setRecipe ] = useState(null);
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
        <h1 className={"text-center font-bold text-5xl"}>Recipe App</h1>
        <p className={"text-center p-3 text-2xl"}>Sustainable Eating Made Easier</p>
        
        <UploadDropzone
            uploader={uploader}
            options={options}
            onUpdate={async (file) => {
                if (file.length !== 0) {
                  setRecipe(null);
                  let response = await fetch("https://9d24-2607-fea8-b85-9700-75d3-8061-2a41-fab.ngrok-free.app" + "/recommend", {
                    method: "POST",
                    body: JSON.stringify({ link : file[0].fileUrl.replace("raw", "thumbnail") }),
                    headers: {
                        // Accept: "application/json, text/plain, */*",
                        // mode: "no-cors",
                        "Content-Type": "application/json",
                    },
                  });
                  let data = await response.json();
                  setRecipe(data);
                  console.log(data);
                }
            }}
            width="624px"
            height="300px"  
        />
        {recipe != null && (
          <>
            <div className={"p-5 flex-wrap text-center"}>
              <p className={"font-bold text-xl p-5"}>{recipe.name}</p>
              <p>{recipe.description}</p>
              <div className={"p-2 flex flex-col text-left"}>
                <p className={"font-bold"}>Ingredients:</p>
                {recipe.ingredients.map((x, i) => 
                  <p key={i}>{x}</p>
                )}
              </div>
              <div className={"p-2 flex flex-col text-left"}>
                <p className={"font-bold"}>Steps:</p>
                {recipe.instructions.map((x, i) => 
                  <p key={i}>{x}</p>
                )}
              </div>
              {recipe.image != -1 && (
                <Image src={recipe.image} width={400} height={400}/>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
