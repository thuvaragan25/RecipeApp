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
  const [ farmers, setFarmers ] = useState({});
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;


  return (
    <main>
       <nav className={"flex flex-row justify-between items-center sticky bg-green-600 p-5"}> 
       <div className={"flex flex-row"}>
          <Image className={"hover:-translate-y-1 transition"} src={"/logo.png"} height={50} width={100}></Image>
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
        <h1 className={"hover:-translate-y-1 transition text-center font-bold text-5xl"}>SustainableSavour</h1>
        <p className={"text-center p-3 text-2xl"}>Find local ingredients. Make nutritious meals. We'll help you along the way.</p>
        
        <UploadDropzone
            uploader={uploader}
            options={options}
            onUpdate={async (file) => {
                if (file.length !== 0) {
                  setRecipe(null);
                  let response = await fetch("https://2c3f-2607-fea8-b85-9700-f024-2793-2398-1a76.ngrok-free.app" + "/recommend", {
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
                  let f = {};
                  data.ingredients.forEach(async (ingredient) => {
                    let response = await fetch("/api/getUserFromProduct", {
                      method: "POST",
                      body: JSON.stringify({ data: { product: ingredient } }),
                      headers: {
                          Accept: "application/json, text/plain, */*",
                          "Content-Type": "application/json",
                      }
                    });
                    let responseJson = await response.json();
                    console.log("working...");
                    if(responseJson["users"].length != 0) {
                      f[ingredient] = [...responseJson["users"]];
                      setFarmers(f);
                    }
                   })
                }
            }}
            width="624px"
            height="300px"  
        />

        {recipe != null && (
          <div className="p-20 rounded-full">
            <div className={"p-5 flex-wrap text-center bg-white text-green-900 rounded"}>
              <p className={"font-bold text-xl p-5"}>{recipe.name}</p>
              <p>{recipe.description}</p>
              <div className={"p-2 flex flex-col text-left"}>
                <p className={"font-bold"}>Ingredients:</p>
                {recipe.ingredients_out.map((x, i) => 
                  <p key={i}>{x}</p>
                )}
              </div>
              <div className={"p-2 flex flex-col text-left"}>
                <p className={"font-bold"}>Steps:</p>
                {recipe.instructions.map((x, i) => 
                  <p key={i}>{x}<br/><br/></p>
                )}
              </div>
              {recipe.image != -1 || recipe.image == null && (
                <Image src={recipe.image} width={400} height={400}/>
              )}
              {
                Object.keys(farmers).map((key, index) => ( 
                  <p key={index}>Need {key}? Contact our farmer(s): {farmers[key].join(', ')}.</p> 
                ))
              }
            </div>
          </div>
        )}
      </div>

    </main>
  )
}
