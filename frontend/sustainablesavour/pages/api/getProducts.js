import firebase_app from "../../config";
import { getFirestore, doc, getDoc, getDocs, query, where, collection } from "firebase/firestore";

const db = getFirestore(firebase_app);

function convert(obj) {
    return Object.keys(obj).map(key => ({
        product: obj[key],
    }));
}


export default async function handler(req, res) {

    let { data } = req.body;
    let products = [];
    let docRef = await getDoc(doc(db, "products", data.email));
    if(docRef != undefined && docRef != null) {
        let existing = convert(docRef.data())[0];
        for(let i = 0; i < existing['product'].length; i++) {
            products.push(existing['product'][i]);
        }
    }

    res.status(200).json({ products: products });

}
