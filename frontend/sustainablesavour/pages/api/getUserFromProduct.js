//
import firebase_app from "../../config";
import { getFirestore, getDocs, query, where, collection } from "firebase/firestore";

const db = getFirestore(firebase_app);

export default async function handler(req, res) {
    let { data } = req.body;
    console.log(data);
    let users = [];

    let found = (await getDocs(query(collection(db, "products"), where("product", "array-contains", data.product))))

    found.forEach((doc) => {
        users.push(doc.id);
    }) 
   
    res.status(200).json({ users: users });

}
