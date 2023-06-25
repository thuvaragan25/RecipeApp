import firebase_app from "../../config";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const db = getFirestore(firebase_app);

function convert(obj) {
    return Object.keys(obj).map(key => ({
        product: obj[key],
    }));
}


export default async function handler(req, res) {

    const { data } = req.body;

    let products = [data.product];
    let docRef = await getDoc(doc(db, "products", data.email));
    if(docRef != undefined) {
        let existing = convert(docRef.data())[0];
        for(let i = 0; i < existing['product'].length; i++) {
            products.push(existing['product'][i]);
        }
    }

    try {
        await setDoc(doc(db, "products", data.email), { product: products }, {
            merge: false,
        });
    } catch (e) {
        console.log(e);
    }
  
    res.status(200);

}
